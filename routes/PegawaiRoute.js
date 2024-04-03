const express = require("express");
const connection = require("../config/database");

const router = express.Router();

// Ambil semua data
router.get("/data/", function (req, res, next) {
  const stringQuery = "SELECT * FROM pegawai";

  connection.query(stringQuery, (error, result) => {
    if (error) {
      console.log("Error executing query", error);
      return;
    }
    console.log("Query result:", result);
    res.json(result);
  });
});

// ambil data berdasarkan id
router.post("/add/", function (req, res, next) {
  const { tanggalAwal, tanggalAkhir, bulan, tahun, barcode } = req.body;

  const addQuery =
    "insert into jadwal_kehadiran (tanggal_awal, tanggal_akhir, bulan,tahun, jumlahKehadiran,jumlah_shift, barcode, createdAt) values ('" +
    tanggalAwal +
    "','" +
    tanggalAkhir +
    "','" +
    bulan +
    "','" +
    tahun +
    "','0','0','" +
    barcode +
    "',CURDATE())";

  connection.query(addQuery, (error, result) => {
    if (error) {
      console.log("Error executing query", error);
      return;
    }
    console.log("Query result:", result);
    res.json(result);
  });
});

// Insett data
router.post("/", function (req, res, next) {
  const { nama_shift, jam_masuk, jam_pulang, nominal } = req.body;

  const insertQuery = `INSERT INTO shift (nama_shift, jam_masuk, jam_pulang, nominal) 
    VALUES (?, ?, ?, ?)`;

  connection.query(
    insertQuery,
    [nama_shift, jam_masuk, jam_pulang, nominal],
    (error, result) => {
      if (error) {
        console.error("Error executing query:", error);
        res.status(500).json({ error: "Internal Server Error" });
        return;
      }
      console.log("New record created:", result);
      res.status(201).json({ message: "Data berhasil ditambahkan" });
    }
  );
});

// Update data
router.patch("/:id_shift", function (req, res, next) {
  const { id_shift } = req.params;
  const { nama_shift, jam_masuk, jam_pulang, nominal } = req.body;

  const updateQuery =
    "UPDATE shift SET nama_shift='" +
    nama_shift +
    "', jam_masuk='" +
    jam_masuk +
    "', jam_pulang='" +
    jam_pulang +
    "', nominal='" +
    nominal +
    "' WHERE id_shift=" +
    id_shift;

  connection.query(
    updateQuery,
    [nama_shift, jam_masuk, jam_pulang, nominal],
    (error, result) => {
      if (error) {
        console.error("Error executing query:", error);
        return res.status(500).json({ error: "Internal server error" });
      }
      console.log("Data updated successfully");
      res.json({ message: "Data updated successfully" });
    }
  );
});

// hapus data
router.delete("/:id_shift", function (req, res, next) {
  const { id_shift } = req.params;

  const deleteQuery = "DELETE FROM shift WHERE id_shift = " + id_shift;

  connection.query(deleteQuery, [id_shift], (error, result) => {
    if (error) {
      console.error("Error executing query:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
    console.log("Data deleted successfully");
    res.json({ message: "Data deleted successfully" });
  });
});

module.exports = router;
