const express = require("express");
const connection = require("../config/database");

const router = express.Router();

router.get("/:barcode", function (req, res, next) {
  const { barcode } = req.params;
  const stringQuery = `SELECT * FROM barcode WHERE barcode = ${barcode}`;

  connection.query(stringQuery, (error, result) => {
    if (error) {
      console.log("Error executing query", error);
      return;
    }
    console.log("Query result:", result);
    res.json(result);
  });
});

module.exports = router;
