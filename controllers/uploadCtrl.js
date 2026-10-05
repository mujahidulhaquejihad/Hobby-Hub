const path = require("path");
const fs = require("fs");

const UPLOAD_DIR = path.join(__dirname, "..", "uploads");
const MAX_SIZE = 5 * 1024 * 1024; // 5 MB
const ALLOWED_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/gif",
  "video/mp4",
  "video/webm",
];

function ensureUploadDir() {
  if (!fs.existsSync(UPLOAD_DIR)) {
    fs.mkdirSync(UPLOAD_DIR, { recursive: true });
  }
}

function uniqueFilename(originalName) {
  const ext = path.extname(originalName) || ".bin";
  const base = Date.now().toString(36) + "-" + Math.random().toString(36).slice(2, 8);
  return base + ext;
}

exports.uploadImage = async (req, res) => {
  try {
    ensureUploadDir();
    if (!req.file) {
      return res.status(400).json({ msg: "No file uploaded." });
    }

    const { mimetype, size, filename } = req.file;
    if (size > MAX_SIZE) {
      fs.unlinkSync(req.file.path).catch(() => {});
      return res.status(400).json({ msg: "File must be less than 5 MB." });
    }
    if (!ALLOWED_TYPES.includes(mimetype)) {
      fs.unlinkSync(req.file.path).catch(() => {});
      return res.status(400).json({ msg: "Use JPEG, PNG, WebP, GIF, or MP4." });
    }

    const baseUrl = `${req.protocol}://${req.get("host")}`;
    const url = `${baseUrl}/uploads/${filename}`;
    res.json({ public_id: filename, url });
  } catch (err) {
    res.status(500).json({ msg: err.message || "Upload failed." });
  }
};

exports.multerConfig = (() => {
  ensureUploadDir();
  const multer = require("multer");
  const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, UPLOAD_DIR),
    filename: (req, file, cb) => cb(null, uniqueFilename(file.originalname)),
  });
  return multer({
    storage,
    limits: { fileSize: MAX_SIZE },
  }).single("file");
})();
