const { query, mapUserRow } = require('../db');

async function createUser({ username, email, passwordHash, fullname = '', bio = '', avatarUrl }) {
  const q = `
    INSERT INTO users (username, email, password_hash, fullname, bio, avatar_url)
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING *
  `;
  const res = await query(q, [
    username,
    email.toLowerCase(),
    passwordHash,
    fullname || username,
    bio || '',
    avatarUrl || null,
  ]);
  return res.rows[0];
}

async function findUserByEmail(email, role = 'user') {
  const q = `SELECT * FROM users WHERE email = $1 AND role = $2`;
  const res = await query(q, [email.toLowerCase(), role]);
  return res.rows[0] || null;
}

async function findUserById(id) {
  const q = `SELECT * FROM users WHERE id = $1`;
  const res = await query(q, [id]);
  return res.rows[0] || null;
}

async function findUserByUsername(username) {
  const q = `SELECT id FROM users WHERE username = $1`;
  const res = await query(q, [username]);
  return res.rows[0] || null;
}

async function findUserByIdWithFollowCounts(id) {
  const q = `
    SELECT u.*,
      (SELECT COUNT(*) FROM follows WHERE follower_id = u.id) AS followers_count,
      (SELECT COUNT(*) FROM follows WHERE following_id = u.id) AS following_count
    FROM users u
    WHERE u.id = $1
  `;
  const res = await query(q, [id]);
  const row = res.rows[0];
  if (!row) return null;
  const user = mapUserRow(row);
  if (user) {
    user.followers = Array.from({ length: parseInt(row.followers_count, 10) || 0 }, (_, i) => ({}));
    user.following = Array.from({ length: parseInt(row.following_count, 10) || 0 }, (_, i) => ({}));
  }
  return user;
}

module.exports = {
  createUser,
  findUserByEmail,
  findUserById,
  findUserByUsername,
  findUserByIdWithFollowCounts,
};
