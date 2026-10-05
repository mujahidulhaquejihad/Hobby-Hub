const { query } = require('../db');

async function follow(followerId, followingId) {
  const q = `
    INSERT INTO follows (follower_id, following_id)
    VALUES ($1, $2)
    ON CONFLICT (follower_id, following_id) DO NOTHING
    RETURNING *
  `;
  const res = await query(q, [followerId, followingId]);
  return res.rows[0];
}

async function unfollow(followerId, followingId) {
  const q = `DELETE FROM follows WHERE follower_id = $1 AND following_id = $2 RETURNING *`;
  const res = await query(q, [followerId, followingId]);
  return res.rowCount > 0;
}

async function isFollowing(followerId, followingId) {
  const res = await query(
    'SELECT 1 FROM follows WHERE follower_id = $1 AND following_id = $2',
    [followerId, followingId]
  );
  return res.rows.length > 0;
}

async function getFollowingIds(userId) {
  const res = await query('SELECT following_id FROM follows WHERE follower_id = $1', [userId]);
  return res.rows.map((r) => r.following_id);
}

module.exports = { follow, unfollow, isFollowing, getFollowingIds };
