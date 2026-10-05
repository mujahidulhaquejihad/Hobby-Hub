/**
 * Sprint 2: Follow graph over PostgreSQL.
 * POST /follow/:id, DELETE /follow/:id
 */
const followQueries = require('../database/queries/follows');
const authQueries = require('../database/queries/auth');
const { mapUserRow } = require('../database/db');

const userCtrlPg = {
  follow: async (req, res) => {
    try {
      const followerId = req.user.id || req.user._id;
      const followingId = req.params.id;
      if (followerId === followingId) {
        return res.status(400).json({ msg: 'You cannot follow yourself.' });
      }
      await followQueries.follow(followerId, followingId);
      res.json({ msg: 'Following.' });
    } catch (err) {
      if (err.code === '23503') {
        return res.status(404).json({ msg: 'User not found.' });
      }
      return res.status(500).json({ msg: err.message });
    }
  },

  unfollow: async (req, res) => {
    try {
      const followerId = req.user.id || req.user._id;
      const followingId = req.params.id;
      await followQueries.unfollow(followerId, followingId);
      res.json({ msg: 'Unfollowed.' });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },

  getUser: async (req, res) => {
    try {
      const userRow = await authQueries.findUserById(req.params.id);
      if (!userRow) return res.status(404).json({ msg: 'User not found.' });
      const user = mapUserRow(userRow);
      const isFollowing = await followQueries.isFollowing(req.user.id || req.user._id, req.params.id);
      res.json({ ...user, isFollowing });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
};

module.exports = userCtrlPg;
