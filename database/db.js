/**
 * PostgreSQL connection pool for Sprint 1+ architecture.
 * Set DATABASE_URL in .env (e.g. postgresql://user:pass@localhost:5432/hobbyhub)
 */
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
});

pool.on('error', (err) => console.error('Unexpected DB error', err));

async function query(text, params) {
  const start = Date.now();
  const res = await pool.query(text, params);
  const ms = Date.now() - start;
  if (process.env.NODE_ENV === 'development' && ms > 100) {
    console.log('Query time', { text: text.substring(0, 60), ms });
  }
  return res;
}

function mapUserRow(row) {
  if (!row) return null;
  return {
    _id: row.id,
    id: row.id,
    username: row.username,
    email: row.email,
    fullname: row.fullname || row.username,
    avatar: row.avatar_url,
    avatar_url: row.avatar_url,
    bio: row.bio,
    role: row.role,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    followers: row.followers || [],
    following: row.following || [],
  };
}

module.exports = { pool, query, mapUserRow };
