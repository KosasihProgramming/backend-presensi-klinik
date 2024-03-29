const express = require("express");
const cors = require("cors");

/*
 *
 * tempat routing
 *
 */

const app = express();
const port = 5000;

app.get("/", (req, res) => {
  res.send("Web API untuk absensi");
});

app.use(cors());
app.use(express.json());

/*
 *
 * Tempat untuk endpoint
 *
 */

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

module.exports = app;
