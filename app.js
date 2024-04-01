const express = require("express");
const cors = require("cors");
const path = require("path");

const shift = require("./routes/shiftRoute");
const kehadiran = require("./routes/kehadiranRoute");

const app = express();
const port = 5000;

app.get("/", (req, res) => {
  res.send("Web API untuk absensi");
});

app.use(cors());
app.use(express.json());

const uploadsPath = path.join(__dirname, "uploads");
app.use("/uploads", express.static(uploadsPath));

app.use("/shift", shift);
app.use("/kehadiran", kehadiran);
// app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

module.exports = app;
