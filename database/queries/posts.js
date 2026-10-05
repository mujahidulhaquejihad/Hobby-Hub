const { query } = require('../db');

async function createPost({ userId, content, type = 'text', mediaUrl = null }) {
  const q = `
    INSERT INTO posts (user_id, content, type, media_url)
    VALUES ($1, $2, $3, $4)
    RETURNING *
  `;
  const res = await query(q, [userId, content || '', type, mediaUrl]);
  return res.rows[0];
}

async function getPostById(postId) {
  const q = `
    SELECT p.*, u.username, u.fullname, u.avatar_url
    FROM posts p
    JOIN users u ON p.user_id = u.id
    WHERE p.id = $1
  `;
  const res = await query(q, [postId]);
  return res.rows[0] || null;
}

/**
 * Global feed: chronological, limit 20.
 * SELECT * FROM posts ORDER BY created_at DESC LIMIT 20
 */
async function getGlobalFeed(limit = 20, cursor = null) {
  let q = `
    SELECT p.*, u.id AS user_id, u.username, u.fullname, u.avatar_url
    FROM posts p
    JOIN users u ON p.user_id = u.id
  `;
  const params = [];
  if (cursor) {
    params.push(cursor);
    q += ` WHERE p.created_at < (SELECT created_at FROM posts WHERE id = $1)`;
  }
  params.push(limit);
  q += ` ORDER BY p.created_at DESC LIMIT $${params.length}`;
  const res = await query(q, params);
  return res.rows;
}

/**
 * Personalized feed: posts from users the current user follows + own posts.
 */
async function getPersonalizedFeed(userId, limit = 20, cursor = null) {
  let q = `
    SELECT p.*, u.id AS user_id, u.username, u.fullname, u.avatar_url
    FROM posts p
    JOIN users u ON p.user_id = u.id
    WHERE p.user_id = $1
       OR EXISTS (SELECT 1 FROM follows f WHERE f.follower_id = $1 AND f.following_id = p.user_id)
  `;
  const params = [userId];
  if (cursor) {
    params.push(cursor);
    q += ` AND p.created_at < (SELECT created_at FROM posts WHERE id = $2)`;
  }
  params.push(limit);
  q += ` ORDER BY p.created_at DESC LIMIT $${params.length}`;
  const res = await query(q, params);
  return res.rows;
}

function mapPostRow(row) {
  if (!row) return null;
  return {
    _id: row.id,
    id: row.id,
    content: row.content,
    type: row.type,
    media_url: row.media_url,
    images: row.media_url ? [row.media_url] : [],
    user: {
      _id: row.user_id,
      id: row.user_id,
      username: row.username,
      fullname: row.fullname,
      avatar: row.avatar_url,
      avatar_url: row.avatar_url,
    },
    createdAt: row.created_at,
    created_at: row.created_at,
    likes: [],
    comments: [],
  };
}

async function getPostsByUserId(userId, limit = 20, cursor = null) {
  let q = `
    SELECT p.*, u.id AS user_id, u.username, u.fullname, u.avatar_url
    FROM posts p
    JOIN users u ON p.user_id = u.id
    WHERE p.user_id = $1
  `;
  const params = [userId];
  if (cursor) {
    params.push(cursor);
    q += ` AND p.created_at < (SELECT created_at FROM posts WHERE id = $2)`;
  }
  params.push(limit);
  q += ` ORDER BY p.created_at DESC LIMIT $${params.length}`;
  const res = await query(q, params);
  return res.rows;
}

module.exports = {
  createPost,
  getPostById,
  getGlobalFeed,
  getPersonalizedFeed,
  getPostsByUserId,
  mapPostRow,
};
