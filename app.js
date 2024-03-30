const express = require("express");
const cors = require("cors");

const shift = require("./routes/shiftRoute");

const app = express();
const port = 5000;

app.get("/", (req, res) => {
  res.send("Web API untuk absensi");
});

app.use(cors());
app.use(express.json());

app.use("/shift", shift);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

module.exports = app;
