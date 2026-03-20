const express = require("express");
const path    = require("path");
const fs      = require("fs");
const crypto  = require("crypto");

const router    = express.Router();
const DATA_PATH = path.join(__dirname, "..", "data", "news.json");

// ─── Helpers ──────────────────────────────────────────────────────────────────

function load() {
  if (!fs.existsSync(DATA_PATH)) fs.writeFileSync(DATA_PATH, "[]");
  return JSON.parse(fs.readFileSync(DATA_PATH, "utf-8"));
}

function save(data) {
  fs.writeFileSync(DATA_PATH, JSON.stringify(data, null, 2));
}

function adminOnly(req, res, next) {
  const key = req.headers["x-admin-key"];
  if (!process.env.NEWS_ADMIN_KEY || key !== process.env.NEWS_ADMIN_KEY) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  next();
}

// ─── GET all published articles (newest first) ────────────────────────────────

router.get("/", (req, res) => {
  const all = load();
  const published = all
    .filter((a) => a.published)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  res.json(published);
});

// ─── GET single article by id ─────────────────────────────────────────────────

router.get("/:id", (req, res) => {
  const all     = load();
  const article = all.find((a) => a._id === req.params.id);
  if (!article) return res.status(404).json({ error: "Not found" });
  res.json(article);
});

// ─── POST create new article (admin only) ─────────────────────────────────────

router.post("/", adminOnly, (req, res) => {
  const { title, excerpt, body, image, category, published } = req.body;
  if (!title || !body) return res.status(400).json({ error: "Title and body are required" });

  const article = {
    _id:       crypto.randomUUID(),
    title,
    excerpt:   excerpt  || "",
    body,
    image:     image    || "",
    category:  category || "",
    published: published !== false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const all = load();
  all.push(article);
  save(all);

  res.status(201).json(article);
});

// ─── PUT update article (admin only) ─────────────────────────────────────────

router.put("/:id", adminOnly, (req, res) => {
  const all = load();
  const idx = all.findIndex((a) => a._id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: "Not found" });

  all[idx] = {
    ...all[idx],
    ...req.body,
    _id:       all[idx]._id,
    createdAt: all[idx].createdAt,
    updatedAt: new Date().toISOString(),
  };

  save(all);
  res.json(all[idx]);
});

// ─── DELETE article (admin only) ─────────────────────────────────────────────

router.delete("/:id", adminOnly, (req, res) => {
  const all     = load();
  const filtered = all.filter((a) => a._id !== req.params.id);
  if (filtered.length === all.length) return res.status(404).json({ error: "Not found" });
  save(filtered);
  res.json({ success: true });
});

module.exports = router;