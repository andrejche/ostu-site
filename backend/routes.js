const express = require("express");
const router = express.Router();

// import specific route files
const onlineRoutes = require("./routes/online");

// attach routes
router.use("/api", onlineRoutes);

module.exports = router;