# HobbyHub – Sprint Model Implementation

This app is being updated to follow a **microblog/photo hybrid** architecture across six sprints.

---

## Sprint 1: The Foundation (System Design & Auth) ✅

- **Database**: PostgreSQL schema in `database/schema.sql`.
  - **users**: id (UUID), username, email (indexed), bio, avatar_url, password_hash, fullname, role, created_at, updated_at.
  - **posts**: id, user_id, content, type (text|image), media_url, created_at.
  - **follows**: (follower_id, following_id) composite primary key.
  - **post_likes**, **comments** tables for later sprints.
- **Server**: Node.js/Express with CORS and JSON middleware (existing).
- **Auth**:
  - bcrypt for password hashing.
  - JWT access + refresh tokens; cookie for refresh.
  - **Sign Up** `POST /api/register`, **Login** `POST /api/login`, **Token Refresh** `POST /api/refresh_token`.
- **How to use PostgreSQL**: Set `DATABASE_URL` in `.env` (e.g. `postgresql://user:pass@localhost:5432/hobbyhub`), run `schema.sql`, then restart the server. Auth will use PostgreSQL; if unset, existing MongoDB auth is used.

---

## Sprint 2: The Core API (Microblog Logic)

- **POST /posts**: Create text or image post (content, type, optional media_url).
- **GET /posts/feed**: Global feed – chronological, limit 20 (cursor-based in Sprint 6).
- **POST /follow/:id**: Create follow relationship.
- **DELETE /follow/:id**: Remove follow.
- **Personalized feed**: Feed shows only posts from users the current user follows (JOIN posts with follows).

---

## Sprint 3: Media Handling

- AWS S3 (or GCS) bucket; pre-signed URLs so frontend uploads directly.
- Image pipeline (e.g. Sharp): thumbnail 200×200, compressed 1080px width, original stored.

---

## Sprint 4: Frontend

- Tab navigator: Home (Feed), Search, Create (+), Notifications, Profile.
- Post Card: text block + responsive image when media_url present.
- Rich text input with character limit (e.g. 280).
- State: React Query or SWR for caching.

---

## Sprint 5: Real-Time & Engagement

- **POST /like**, **POST /comment** (nested/thread).
- Socket.io: real-time like count updates.
- FCM for push (new followers, mentions).

---

## Sprint 6: Optimization & Launch

- Cursor-based pagination for feed.
- Image lazy loading.
- Rate limiting, input sanitization (XSS).
- Deploy: backend (Docker → ECS/DO), frontend (Vercel/TestFlight).

---

## Golden Rule

**Content density**: Text posts compact (3–4 visible); photos expansive.
