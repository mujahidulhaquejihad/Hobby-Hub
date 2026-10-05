<p align="center">
  <img src="docs/logo.png" alt="UniBook logo" width="96" />
</p>

<h1 align="center">HobbyHub (UniBook)</h1>

<p align="center">
  A full-stack social media app for sharing hobbies and passions: posts with images, comments, likes, follows, real-time chat and notifications, plus an admin dashboard.
</p>

<p align="center">
  <img alt="React" src="https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white" />
  <img alt="Redux" src="https://img.shields.io/badge/Redux-5-764ABC?logo=redux&logoColor=white" />
  <img alt="Node.js" src="https://img.shields.io/badge/Node.js-Express_4-339933?logo=node.js&logoColor=white" />
  <img alt="MongoDB" src="https://img.shields.io/badge/MongoDB-Mongoose_5-47A248?logo=mongodb&logoColor=white" />
  <img alt="PostgreSQL" src="https://img.shields.io/badge/PostgreSQL-optional-4169E1?logo=postgresql&logoColor=white" />
  <img alt="Socket.io" src="https://img.shields.io/badge/Socket.io-4-010101?logo=socket.io&logoColor=white" />
</p>

---

## Screenshots

| Login | Register |
| :---: | :---: |
| ![Login page](docs/screenshots/login.png) | ![Register page](docs/screenshots/register.png) |

<!-- Add more screenshots to docs/screenshots/ and reference them here, e.g.:
| Home feed | Profile |
| :---: | :---: |
| ![Home](docs/screenshots/home.png) | ![Profile](docs/screenshots/profile.png) |
-->

---

## Features

- **Authentication**: sign up, sign in, change password. Passwords are hashed with bcrypt; sessions use JWT access tokens plus a refresh token stored in a cookie.
- **Posts**: create, edit and delete posts with text and multiple images or videos; like, save and report posts.
- **Comments**: comment on posts, reply to and tag users, like comments.
- **Social graph**: follow or unfollow users, see followers and following, get suggested users, search users.
- **Discover**: browse posts from people you don't follow yet.
- **Real-time messaging**: one-to-one chat with media, powered by Socket.io.
- **Real-time notifications**: likes, comments, follows and new posts, with read/unread state and a sound alert.
- **Profiles**: avatar, bio (story), website, mobile, address, gender; saved-posts tab.
- **Share**: share posts to other platforms via `react-share`.
- **Admin dashboard**: separate admin login; totals for users, posts, comments, likes and spam posts with charts; review and delete reported (spam) posts; register new admins.
- **Image uploads**: stored on the server in `uploads/` by default, or uploaded straight to Cloudinary if configured (see [UPLOAD_SETUP.md](UPLOAD_SETUP.md)).

---

## Tech stack

| Layer | Technology |
| --- | --- |
| Frontend | React 19, Redux + redux-thunk, React Router 7, Material UI 4, axios, socket.io-client, emoji-mart, react-vis |
| Backend | Node.js, Express 4, Socket.io 4, Multer, JSON Web Tokens, bcrypt, cookie-parser, CORS |
| Database | MongoDB with Mongoose (default), PostgreSQL with `pg` (optional, for auth/feed/follows) |
| Media | Local disk (`uploads/`) or Cloudinary |

---

## Project structure

```
Hobby-Hub-Social_media/
├── client/                 # React app (Create React App)
│   └── src/
│       ├── components/     # UI components (home, profile, message, adminDashboard, ...)
│       ├── pages/          # Routed pages (home, discover, profile/[id], post/[id], message, ...)
│       ├── redux/          # Actions and reducers
│       ├── customRouter/   # Dynamic page renderer + private route
│       ├── SocketClient.js # Socket.io client listeners
│       └── utils/          # fetchData, imageUpload, validation
├── controllers/            # Route handlers (Mongo and *Pg variants)
├── database/               # PostgreSQL pool, queries and schema.sql
├── middleware/             # auth (JWT) and authAdmin
├── models/                 # Mongoose models
├── routes/                 # Express routers mounted under /api
├── docs/                   # README images
├── server.js               # Express + Socket.io entry point
└── socketServer.js         # Socket.io event handlers
```

---

## Database

The backend supports two databases:

- **MongoDB (default).** Every feature works on MongoDB. Set `MONGODB_URI` in `.env`.
- **PostgreSQL (optional).** If `DATABASE_URL` is set, **auth, user profiles, follows and the feed** switch to PostgreSQL. Everything else (comments, likes, messages, notifications, admin) still uses MongoDB, so keep `MONGODB_URI` set as well.

### MongoDB collections

Defined in [`models/`](models). All collections have automatic `createdAt` and `updatedAt` timestamps.

```mermaid
erDiagram
    USER ||--o{ POST : writes
    USER ||--o{ COMMENT : writes
    POST ||--o{ COMMENT : has
    USER }o--o{ USER : follows
    USER }o--o{ POST : "likes / saves / reports"
    USER }o--o{ CONVERSATION : participates
    CONVERSATION ||--o{ MESSAGE : contains
    USER ||--o{ NOTIFY : triggers

    USER {
        ObjectId _id
        string fullname "required, max 25"
        string username "required, unique, max 25"
        string email "required, unique"
        string password "bcrypt hash"
        string avatar "default placeholder URL"
        string role "user | admin"
        string gender
        string mobile
        string address
        string story "max 200"
        string website
        ObjectId[] followers "ref user"
        ObjectId[] following "ref user"
        ObjectId[] saved "ref post"
    }
    POST {
        ObjectId _id
        string content
        array images "required"
        ObjectId user "ref user"
        ObjectId[] likes "ref user"
        ObjectId[] comments "ref comment"
        ObjectId[] reports "ref user"
    }
    COMMENT {
        ObjectId _id
        string content "required"
        object tag "tagged user"
        ObjectId reply "parent comment"
        ObjectId[] likes "ref user"
        ObjectId user "ref user"
        ObjectId postId
        ObjectId postUserId
    }
    CONVERSATION {
        ObjectId _id
        ObjectId[] recipients "ref user"
        string text "last message"
        array media
    }
    MESSAGE {
        ObjectId _id
        ObjectId conversation "ref conversation"
        ObjectId sender "ref user"
        ObjectId recipient "ref user"
        string text
        array media
    }
    NOTIFY {
        ObjectId _id
        ObjectId id "source post/comment/user"
        ObjectId user "ref user, who triggered it"
        ObjectId[] recipients
        string url
        string text
        string content
        string image
        boolean isRead "default false"
    }
```

| Collection | Purpose |
| --- | --- |
| `users` | Accounts, profile details, followers/following and saved posts |
| `posts` | Posts with images, likes, comment references and spam reports |
| `comments` | Comments and replies, with tags and likes |
| `conversations` | One per chat thread; stores participants and the latest message |
| `messages` | Individual chat messages |
| `notifies` | Notifications delivered in real time and stored for the notification list |

### PostgreSQL schema (optional)

Defined in [`database/schema.sql`](database/schema.sql). Primary keys are UUIDs generated by `gen_random_uuid()` (built in on PostgreSQL 13+).

```mermaid
erDiagram
    users ||--o{ posts : "user_id"
    users ||--o{ follows : "follower_id"
    users ||--o{ follows : "following_id"
    users ||--o{ post_likes : "user_id"
    posts ||--o{ post_likes : "post_id"
    users ||--o{ comments : "user_id"
    posts ||--o{ comments : "post_id"
    comments ||--o{ comments : "parent_id"

    users {
        UUID id PK
        VARCHAR username UK "50"
        VARCHAR email UK "255"
        VARCHAR password_hash
        TEXT bio
        VARCHAR avatar_url
        VARCHAR fullname
        VARCHAR role "default user"
        TIMESTAMPTZ created_at
        TIMESTAMPTZ updated_at
    }
    posts {
        UUID id PK
        UUID user_id FK
        TEXT content
        VARCHAR type "text | image"
        VARCHAR media_url
        TIMESTAMPTZ created_at
        TIMESTAMPTZ updated_at
    }
    follows {
        UUID follower_id PK,FK
        UUID following_id PK,FK
        TIMESTAMPTZ created_at
    }
    post_likes {
        UUID post_id PK,FK
        UUID user_id PK,FK
        TIMESTAMPTZ created_at
    }
    comments {
        UUID id PK
        UUID post_id FK
        UUID user_id FK
        UUID parent_id FK "nested replies"
        TEXT content
        TIMESTAMPTZ created_at
    }
```

Notes:

- All foreign keys use `ON DELETE CASCADE`, so deleting a user or post removes its dependent rows.
- `follows` has a composite primary key and a `no_self_follow` check constraint.
- Indexes: `users(email)`, `users(username)`, `posts(user_id)`, `posts(created_at DESC)`, `follows(follower_id)`, `follows(following_id)`, `post_likes(post_id)`, `comments(post_id)`, `comments(parent_id)`.

To create the tables:

```bash
psql "$DATABASE_URL" -f database/schema.sql
```

---

## Getting started

### Prerequisites

- [Node.js](https://nodejs.org/) 18 or newer
- A MongoDB database: either [MongoDB Community Server](https://www.mongodb.com/try/download/community) running locally or a free [MongoDB Atlas](https://www.mongodb.com/atlas) cluster
- (Optional) PostgreSQL 13+

### 1. Clone and install

```bash
git clone https://github.com/<your-username>/Hobby-Hub-Social_media.git
cd Hobby-Hub-Social_media

npm install            # backend
cd client && npm install && cd ..   # frontend
```

### 2. Configure environment variables

Copy `.env.example` to `.env` in the project root and fill in the values:

```env
# Server
PORT=8080

# MongoDB
MONGODB_URI=mongodb://localhost:27017/hobbyhub

# PostgreSQL (optional; enables Postgres for auth, profiles, follows and feed)
# DATABASE_URL=postgresql://user:password@localhost:5432/hobbyhub

# JWT secrets: use long random strings
ACCESS_TOKEN_SECRET=your-access-token-secret
REFRESH_TOKEN_SECRET=your-refresh-token-secret
```

For Cloudinary uploads (optional), create `client/.env`:

```env
REACT_APP_CLOUDINARY_CLOUD_NAME=your_cloud_name
REACT_APP_CLOUDINARY_UPLOAD_PRESET=UniBook
```

> `.env` is listed in `.gitignore`. Never commit real secrets or database passwords.

### 3. Run in development

Open two terminals:

```bash
# Terminal 1: backend on http://localhost:8080
npx nodemon server.js     # or: npm run dev (if nodemon is installed globally)
```

```bash
# Terminal 2: frontend on http://localhost:3000
cd client
npm start
```

The React dev server forwards `/api` requests to `http://localhost:8080` (the `proxy` setting in `client/package.json`).

Then open [http://localhost:3000](http://localhost:3000), create an account and start posting.

---

## API reference

All routes are prefixed with `/api`. Routes marked 🔒 need an `Authorization` header containing the access token; 🛡️ routes also require the `admin` role.

<details>
<summary><b>Auth</b></summary>

| Method | Route | Description |
| --- | --- | --- |
| POST | `/register` | Create a user account |
| POST | `/register_admin` | Create an admin account |
| POST | `/login` | Log in and receive an access token (refresh token set as cookie) |
| POST | `/admin/login` | Admin login |
| POST | `/logout` | Clear the refresh token cookie |
| POST | `/refresh_token` | Get a new access token |
| POST | `/changePassword` 🔒 | Change the current user's password |

</details>

<details>
<summary><b>Users</b></summary>

| Method | Route | Description |
| --- | --- | --- |
| GET | `/search?username=` 🔒 | Search users |
| GET | `/user/:id` 🔒 | Get a user profile |
| PATCH | `/user` 🔒 | Update the current user's profile |
| PATCH | `/user/:id/follow` 🔒 | Follow a user |
| PATCH | `/user/:id/unfollow` 🔒 | Unfollow a user |
| POST / DELETE | `/follow/:id` 🔒 | Follow / unfollow (PostgreSQL mode only) |
| GET | `/suggestionsUser` 🔒 | Suggested users to follow |

</details>

<details>
<summary><b>Posts</b></summary>

| Method | Route | Description |
| --- | --- | --- |
| POST | `/posts` 🔒 | Create a post |
| GET | `/posts` or `/posts/feed` 🔒 | Feed of the current user and the people they follow |
| GET / PATCH / DELETE | `/post/:id` 🔒 | Get, edit or delete a post |
| PATCH | `/post/:id/like` · `/post/:id/unlike` 🔒 | Like / unlike |
| PATCH | `/post/:id/report` 🔒 | Report a post as spam |
| GET | `/post_discover` 🔒 | Discover posts |
| GET | `/user_posts/:id` 🔒 | Posts by a user |
| PATCH | `/savePost/:id` · `/unSavePost/:id` 🔒 | Save / unsave a post |
| GET | `/getSavePosts` 🔒 | Saved posts |

</details>

<details>
<summary><b>Comments</b></summary>

| Method | Route | Description |
| --- | --- | --- |
| POST | `/comment` 🔒 | Add a comment or reply |
| PATCH | `/comment/:id` 🔒 | Edit a comment |
| PATCH | `/comment/:id/like` · `/comment/:id/unlike` 🔒 | Like / unlike a comment |
| DELETE | `/comment/:id` 🔒 | Delete a comment |

</details>

<details>
<summary><b>Messages, notifications and uploads</b></summary>

| Method | Route | Description |
| --- | --- | --- |
| POST | `/message` 🔒 | Send a message |
| GET | `/conversations` 🔒 | List conversations |
| GET | `/message/:id` 🔒 | Messages with a user |
| POST | `/notify` 🔒 | Create a notification |
| GET | `/notifies` 🔒 | List notifications |
| PATCH | `/isReadNotify/:id` 🔒 | Mark a notification as read |
| DELETE | `/notify/:id` 🔒 | Remove a notification |
| DELETE | `/deleteAllNotify` 🔒 | Clear all notifications |
| POST | `/upload` 🔒 | Upload an image or video (multipart, max 5 MB) |

</details>

<details>
<summary><b>Admin</b></summary>

| Method | Route | Description |
| --- | --- | --- |
| GET | `/get_total_users` 🛡️ | Total users |
| GET | `/get_total_posts` 🛡️ | Total posts |
| GET | `/get_total_comments` 🛡️ | Total comments |
| GET | `/get_total_likes` 🛡️ | Total likes |
| GET | `/get_total_spam_posts` 🛡️ | Total reported posts |
| GET | `/get_spam_posts` 🛡️ | List reported posts |
| DELETE | `/delete_spam_posts/:id` 🛡️ | Delete a reported post |

</details>

---

## Roadmap

Planned work (S3 media pipeline, cursor pagination, rate limiting, push notifications and more) is tracked in [SPRINT_ROADMAP.md](SPRINT_ROADMAP.md).

---

## License

ISC
