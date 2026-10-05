# Image upload (profile picture & post images)

You have **two options**. By default the app uses **your own server** (no Cloudinary needed).

---

## Option 1: Server upload (default, no signup)

Images are stored on your backend in the `uploads/` folder.

- **No setup** – works as soon as the backend is running.
- Backend must be reachable at the URL in the client (e.g. `http://localhost:8080`).
- Files are saved under the project’s `uploads/` directory (created automatically).
- **Limits:** 5 MB per file; formats JPEG, PNG, WebP, GIF, MP4.

If uploads fail, check that:

1. The backend is running (e.g. `node server.js`).
2. The client’s API URL is correct (e.g. `REACT_APP_API_URL=http://localhost:8080/api` in the client `.env` if needed).
3. You are logged in (upload requires auth).

---

## Option 2: Cloudinary (optional)

To use Cloudinary instead of server storage:

1. Create an account at [cloudinary.com](https://cloudinary.com).
2. In **Settings → Upload**, add an **unsigned** upload preset (e.g. name: `UniBook`).
3. In the **client** folder, create or edit `.env`:

   ```env
   REACT_APP_CLOUDINARY_CLOUD_NAME=your_cloud_name
   REACT_APP_CLOUDINARY_UPLOAD_PRESET=UniBook
   ```

4. Restart the React dev server.

When these env vars are set, the client uploads directly to Cloudinary instead of your server.
