const express = require("express");
const connection = require("../../config/database");

const router = express.Router();

// Ambil semua data
router.get("/", function (req, res, next) {
  const stringQuery = `SELECT k.*, p.nama, p.jbtn, p.jk, dj.tanggal, dj.isTelat, dj.isPulangCepat, dj.nominal
  FROM kehadiran k
  JOIN barcode b ON k.barcode = b.barcode
  JOIN pegawai p ON b.id = p.id
  JOIN detail_jadwal dj ON k.id_detail_jadwal = dj.id
  WHERE p.jbtn = 'dr'
  AND k.foto_keluar IS NOT NULL;
`;

  connection.query(stringQuery, (error, result) => {
    if (error) {
      console.log("Error executing query", error);
      return;
    }
    console.log("Sukses ");
    res.json(result);
  });
});

// ambil data berdasarkan id
router.get("/:id_shift", function (req, res, next) {
  const { id_shift } = req.params;

  const showQuery = `SELECT * FROM shift WHERE id_shift = ` + id_shift;

  connection.query(showQuery, (error, result) => {
    if (error) {
      console.log("Error executing query", error);
      return;
    }
    console.log("Query result:", result);
    res.json(result);
  });
});

module.exports = router;
