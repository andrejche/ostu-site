const express  = require("express");
const multer   = require("multer");
const path     = require("path");
const fs       = require("fs");
const router   = express.Router();

// Save uploads to /public/uploads/
const uploadDir = path.join(__dirname, "..", "public", "uploads");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename:    (req, file, cb) => {
    const ext  = path.extname(file.originalname);
    const name = Date.now() + "-" + Math.random().toString(36).slice(2) + ext;
    cb(null, name);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
  fileFilter: (req, file, cb) => {
    const allowed = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    cb(null, allowed.includes(file.mimetype));
  },
});

// Admin only
function adminOnly(req, res, next) {
  if (req.headers["x-admin-key"] !== process.env.NEWS_ADMIN_KEY)
    return res.status(401).json({ error: "Unauthorized" });
  next();
}

router.post("/upload", adminOnly, upload.single("image"), (req, res) => {
  if (!req.file) return res.status(400).json({ error: "No file uploaded" });
  const url = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;
  res.json({ url });
});

module.exports = router;