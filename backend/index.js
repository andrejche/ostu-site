require("dotenv").config();

const express = require("express");
const cors    = require("cors");
const path    = require("path");
const routes  = require("./routes");

const app = express();

app.use(cors());
app.use(express.json());

// Serve uploaded images statically
app.use("/uploads", express.static(path.join(__dirname, "public", "uploads")));

app.use(routes);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});