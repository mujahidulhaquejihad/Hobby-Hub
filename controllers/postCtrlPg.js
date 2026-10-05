/**
 * Sprint 2: Post engine over PostgreSQL.
 * POST /posts, GET /posts/feed (global or personalized).
 */
const postQueries = require('../database/queries/posts');

const postCtrlPg = {
  createPost: async (req, res) => {
    try {
      const userId = req.user.id || req.user._id;
      const { content, type = 'text', media_url, images } = req.body;
      const mediaUrl = media_url || (Array.isArray(images) && images[0]) || null;
      const postType = mediaUrl ? 'image' : (type || 'text');

      const row = await postQueries.createPost({
        userId,
        content: content || '',
        type: postType,
        mediaUrl,
      });

      const post = postQueries.mapPostRow({
        ...row,
        user_id: row.user_id,
        username: req.user.username,
        fullname: req.user.fullname,
        avatar_url: req.user.avatar_url || req.user.avatar,
      });

      res.json({
        msg: 'Post created successfully.',
        newPost: { ...post, user: req.user },
      });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },

  /**
   * GET /posts/feed?limit=20&cursor=uuid&personalized=true
   * personalized=true (default when auth): only from users the current user follows.
   * personalized=false: global chronological feed.
   */
  getFeed: async (req, res) => {
    try {
      const limit = Math.min(parseInt(req.query.limit, 10) || 20, 50);
      const cursor = req.query.cursor || null;
      const personalized = req.query.personalized !== 'false';
      const userId = req.user?.id || req.user?._id;

      const rows = personalized && userId
        ? await postQueries.getPersonalizedFeed(userId, limit, cursor)
        : await postQueries.getGlobalFeed(limit, cursor);

      const posts = rows.map((r) =>
        postQueries.mapPostRow({
          ...r,
          user_id: r.user_id,
        })
      );

      res.json({ msg: 'Success', result: posts.length, posts });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
};

module.exports = postCtrlPg;
