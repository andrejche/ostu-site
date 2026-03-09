const express = require("express");
const path = require("path");
const fs = require("fs");

const router = express.Router();

const DATA_PATH = path.join(__dirname, "..", "data", "onlineSubjects.json");

function loadData() {
  const raw = fs.readFileSync(DATA_PATH, "utf-8");
  return JSON.parse(raw);
}

router.get("/online", (req, res) => {
  const { track, year } = req.query;
  const y = String(Number(year));

  if (!track || !y || y === "NaN") {
    return res.status(400).json({ error: "Missing track/year" });
  }

  const data = loadData();
  const subjects = data?.[track]?.[y] ?? [];

  res.json({ subjects });
});

module.exports = router;