const express = require("express");
const router  = express.Router();

const onlineRoutes  = require("./routes/online");
const newsRoutes    = require("./routes/news");
const chatRoutes    = require("./routes/chat");
const teacherRoutes = require("./routes/teachers");
const uploadRoutes = require("./routes/upload");

router.use("/api",      onlineRoutes);
router.use("/api/news", newsRoutes);
router.use("/api",      chatRoutes);
router.use("/api",      teacherRoutes);
router.use("/api", uploadRoutes);

module.exports = router;