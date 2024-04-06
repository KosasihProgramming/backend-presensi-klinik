const express = require("express");
const connection = require("../config/database");

const router = express.Router();

router.get("/", function (req, res, next) {
  const stringQuery = "SELECT nama_instansi FROM setting";
  connection.query(stringQuery, (error, results, fields) => {
    if (error) {
      console.error("Error executing query:", error);
      return;
    }
    res.json(results);
  });
});

module.exports = router;
