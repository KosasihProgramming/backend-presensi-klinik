const express = require("express");
const connection = require("../config/database");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const router = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // Direktori penyimpanan file
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname); // Penamaan file
  },
});

const upload = multer({ storage: storage });

// Ambil semua data kehadiran
router.get("/", function (req, res, next) {
  const stringQuery = "SELECT * FROM kehadiran WHERE foto_keluar IS NULL";

  connection.query(stringQuery, (error, result) => {
    if (error) {
      console.log("Error executing query", error);
      return;
    }
    console.log("Query result:", result);
    res.json(result);
  });
});

// Ambil data berdasarkan id
router.get("/:id_kehadiran", function (req, res) {
  const { id_kehadiran } = req.params;

  const showQuery =
    `SELECT * FROM kehadiran WHERE id_kehadiran = ` + id_kehadiran;

  connection.query(showQuery, (error, result) => {
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

  const base64Data = foto_masuk.replace(/^data:image\/\w+;base64,/, "");
  const buffer = Buffer.from(base64Data, "base64");

  const fileName = Date.now() + ".jpg"; // Atur nama file sesuai kebutuhan
  const filePath = path.join("uploads", fileName);

  fs.writeFile(filePath, buffer, (err) => {
    if (err) {
      console.error(err);
      res.status(500).json({ message: "Gagal menyimpan foto" });
    }
    const insertQuery =
      "INSERT INTO kehadiran (barcode, id_jadwal, id_detail_jadwal, id_shift, foto_masuk, jam_masuk, telat, denda_telat, is_pindah_klinik) VALUES ('" +
      barcode +
      "','" +
      id_jadwal +
      "','" +
      id_detail_jadwal +
      "','" +
      id_shift +
      "','" +
      fileName +
      "', NOW(),'" +
      telat +
      "','" +
      denda_telat +
      "','" +
      is_pindah_klinik +
      "')";

    connection.query(insertQuery, (error, result) => {
      if (error) {
        console.error("Error executing query:", error);
        res.status(500).json({ error: "Internal Server Error" });
        return;
      }
      console.log("New record created:", result);
      res.status(201).json({ message: "Data berhasil ditambahkan" });
    });
  });
});

// router.get("/:jam_pulang", function())

// Absen pulang
router.patch("/:id_kehadiran", function (req, res, next) {
  const { id_kehadiran } = req.params;
  const { id_jadwal, id_detail_jadwal, id_shift, foto_keluar, durasi, lembur } =
    req.body;

  const base64Data = foto_keluar.replace(/^data:image\/\w+;base64,/, "");
  const buffer = Buffer.from(base64Data, "base64");

  const fileName = Date.now() + ".jpg"; // Atur nama file sesuai kebutuhan
  const filePath = path.join("uploads", fileName);

  fs.writeFile(filePath, buffer, (err) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Gagal menyimpan foto" });
    }

    const updateQuery = `UPDATE kehadiran SET 
      id_jadwal = ${id_jadwal},
      id_detail_jadwal = ${id_detail_jadwal},
      id_shift = ${id_shift},
      foto_keluar = '${fileName}',
      jam_keluar = NOW(),
      durasi = TIMESTAMPDIFF(HOUR, jam_masuk, NOW()),
      lembur = 1
      WHERE id_kehadiran = '${id_kehadiran}'`;

    connection.query(updateQuery, (error, result) => {
      if (error) {
        console.error("Error executing query:", error);
        return res.status(500).json({ error: "Internal Server Error" });
      }
      console.log("Record updated successfully:", result);
      res.status(200).json({ message: "Data berhasil diperbarui" });
    });
  });
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
