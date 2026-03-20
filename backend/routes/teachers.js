const express = require("express");
const path    = require("path");
const fs      = require("fs");
const router  = express.Router();

const DATA_PATH = path.join(__dirname, "..", "data", "teachers.json");
const load = () => JSON.parse(fs.readFileSync(DATA_PATH, "utf-8"));
const save = (d) => fs.writeFileSync(DATA_PATH, JSON.stringify(d, null, 2));

function adminOnly(req, res, next) {
  if (req.headers["x-admin-key"] !== process.env.NEWS_ADMIN_KEY)
    return res.status(401).json({ error: "Unauthorized" });
  next();
}

// GET all
router.get("/teachers", (req, res) => res.json(load()));

// POST add
router.post("/teachers", adminOnly, (req, res) => {
  const teachers = load();
  teachers.push(req.body);
  save(teachers);
  res.status(201).json(req.body);
});

// PUT update by index
router.put("/teachers/:idx", adminOnly, (req, res) => {
  const teachers = load();
  const idx = parseInt(req.params.idx);
  teachers[idx] = req.body;
  save(teachers);
  res.json(req.body);
});

// DELETE by index
router.delete("/teachers/:idx", adminOnly, (req, res) => {
  const teachers = load();
  const idx = parseInt(req.params.idx);
  teachers.splice(idx, 1);
  save(teachers);
  res.json({ success: true });
});

module.exports = router;