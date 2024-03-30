const express = require("express");
const connection = require("../config/database");

const router = express.Router();

// Ambil semua data kehadiran
router.get("/", function (req, res, next) {
  const stringQuery = "SELECT * FROM kehadiran";

  connection.query(stringQuery, (error, result) => {
    if (error) {
      console.log("Error executing query", error);
      return;
    }
    console.log("Query result:", result);
    res.json(result);
  });
});

// isi data kehadiran (absen datang)
router.post("/", function (req, res, next) {
  const {
    barcode,
    id_jadwal,
    id_detail_jadwal,
    id_shift,
    foto_masuk,
    foto_keluar,
    jam_masuk,
    jam_keluar,
    durasi,
    telat,
    denda_telat,
    is_pindah_klinik,
    lembur,
  } = req.body;

  const insertQuery = `INSERT INTO kehadiran (barcode,
    id_jadwal,
    id_detail_jadwal,
    id_shift,
    foto_masuk,
    foto_keluar,
    jam_masuk,
    jam_keluar,
    durasi,
    telat,
    denda_telat,
    is_pindah_klinik,
    lembur) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

  connection.query(
    insertQuery,
    [
      barcode,
      id_jadwal,
      id_detail_jadwal,
      id_shift,
      foto_masuk,
      foto_keluar,
      jam_masuk,
      jam_keluar,
      durasi,
      telat,
      denda_telat,
      is_pindah_klinik,
      lembur,
    ],
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

// Absen pulang
router.patch("/:id_kehadiran", function (req, res, next) {
  const { id_kehadiran } = req.params;
  const {
    barcode,
    id_jadwal,
    id_detail_jadwal,
    id_shift,
    foto_masuk,
    foto_keluar,
    jam_masuk,
    jam_keluar,
    durasi,
    telat,
    denda_telat,
    is_pindah_klinik,
    lembur,
  } = req.body;

  const updateQuery = `UPDATE kehadiran SET 
    barcode = ?,
    id_jadwal = ?,
    id_detail_jadwal = ?,
    id_shift = ?,
    foto_masuk = ?,
    foto_keluar = ?,
    jam_masuk = ?,
    jam_keluar = ?,
    durasi = ?,
    telat = ?,
    denda_telat = ?,
    is_pindah_klinik = ?,
    lembur = ?
    WHERE id_kehadiran = ${id_kehadiran}`;

  connection.query(
    updateQuery,
    [
      barcode,
      id_jadwal,
      id_detail_jadwal,
      id_shift,
      foto_masuk,
      foto_keluar,
      jam_masuk,
      jam_keluar,
      durasi,
      telat,
      denda_telat,
      is_pindah_klinik,
      lembur,
    ],
    (error, result) => {
      if (error) {
        console.error("Error executing query:", error);
        res.status(500).json({ error: "Internal Server Error" });
        return;
      }
      console.log("Record updated successfully:", result);
      res.status(200).json({ message: "Data berhasil diperbarui" });
    }
  );
});

// Hapus data
router.delete("/:id_kehadiran", function (req, res, next) {
  const { id_kehadiran } = req.params;

  const deleteQuery =
    "DELETE FROM kehadiran WHERE id_kehadiran = " + id_kehadiran;

  connection.query(deleteQuery, [id_kehadiran], (error, result) => {
    if (error) {
      console.error("Error executing query:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
    console.log("Data deleted successfully");
    res.json({ message: "Data deleted successfully" });
  });
});

module.exports = router;
