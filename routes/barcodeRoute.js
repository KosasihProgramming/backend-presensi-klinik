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

// mencari nama dokter
router.get("/dokter/:id_kehadiran", function (req, res) {
  const { id_kehadiran } = req.params;
  const query = `
    SELECT pegawai.nama, kehadiran.jam_masuk
    FROM kehadiran
    JOIN barcode ON kehadiran.barcode = barcode.barcode
    JOIN pegawai ON barcode.id = pegawai.id
    WHERE kehadiran.id_kehadiran = ?;
  `;

  connection.query(query, [id_kehadiran], (error, result) => {
    if (error) {
      console.log("Error executing query", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
    console.log("Query result:", result);
    res.json(result);
  });
});

module.exports = router;
