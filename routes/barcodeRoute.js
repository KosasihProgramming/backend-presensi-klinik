const express = require("express");
const connection = require("../config/database");

const router = express.Router();

// Mencari semua barcode
router.get("/", function (req, res) {
  const stringQuery = "SELECT * FROM barcode";

  connection.query(stringQuery, (error, result) => {
    if (error) {
      console.log("Error executing query", error);
      return;
    }
    console.log("OK");
    res.json(result);
  });
});

router.get("/:barcode", function (req, res, next) {
  const { barcode } = req.params;
  const stringQuery = `SELECT * FROM barcode WHERE barcode = ${barcode}`;

  connection.query(stringQuery, (error, result) => {
    if (error) {
      console.log("Error executing query", error);
      return;
    }
    console.log("OK");
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
    console.log("OK:");
    res.json(result);
  });
});

router.get("/jadwal/:barcode", function (req, res) {
  const { barcode } = req.params;
  const query = `SELECT detail_jadwal.*, shift.nama_shift, shift.jam_masuk, shift.jam_pulang, pegawai.nama
  FROM detail_jadwal
  JOIN shift ON detail_jadwal.id_shift = shift.id_shift
  JOIN jadwal_kehadiran ON detail_jadwal.id_jadwal = jadwal_kehadiran.id
  JOIN barcode ON jadwal_kehadiran.barcode = barcode.barcode
  JOIN pegawai ON barcode.id = pegawai.id
  WHERE barcode.barcode = ${barcode}
  AND detail_jadwal.tanggal = CURDATE() AND detail_jadwal.isHadir = 0;`;

  connection.query(query, [barcode], (error, result) => {
    if (error) {
      console.log("Error executing query", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
    const queryBarcode = `SELECT pegawai.nama, barcode.barcode
    FROM pegawai
    JOIN barcode ON pegawai.id = barcode.id
    WHERE barcode.barcode = ${barcode};`;

    connection.query(queryBarcode, [barcode], (error, resultBarcode) => {
      if (error) {
        console.log("Error executing query", error);
        return res.status(500).json({ error: "Internal Server Error" });
      }
      res.json({ jadwal: result, barcode: resultBarcode });
    });
  });
});

module.exports = router;
