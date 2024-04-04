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
router.get("/", function (req, res) {
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

// Ambil semua data kehadiran hari ini
router.get("/now", function (req, res, next) {
  const stringQuery =
    "SELECT kehadiran.id_kehadiran, pegawai.nama, kehadiran.barcode, kehadiran.id_shift, shift.nama_shift, kehadiran.jam_masuk, kehadiran.foto_masuk FROM kehadiran JOIN barcode ON kehadiran.barcode = barcode.barcode JOIN pegawai ON barcode.id = pegawai.id JOIN shift ON kehadiran.id_shift = shift.id_shift WHERE kehadiran.foto_keluar IS NULL AND DATE(kehadiran.jam_masuk) = CURDATE()";

  // const query = "SELECT * FROM kehadiran WHERE ";

  connection.query(stringQuery, (error, result) => {
    if (error) {
      console.log("Error executing query", error);
      return;
    }
    console.log("Query result:", result);
    res.json(result);
  });
});

// Ambil data kepulangan hari ini
router.get("/pulang/now", function (req, res, next) {
  // const stringQuery =
  //   "SELECT pegawai.nama, kehadiran.barcode, kehadiran.id_shift, shift.nama_shift, kehadiran.jam_masuk, kehadiran.jam_keluar, kehadiran.foto_masuk, kehadiran.foto_keluar FROM kehadiran JOIN barcode ON kehadiran.barcode = barcode.barcode JOIN pegawai ON barcode.id = pegawai.id WHERE kehadiran.foto_keluar IS NOT NULL AND DATE(kehadiran.jam_masuk) = CURDATE()";

  const stringQuery =
    "SELECT pegawai.nama, kehadiran.barcode, kehadiran.id_shift, shift.nama_shift, kehadiran.jam_masuk, kehadiran.jam_keluar, kehadiran.foto_masuk, kehadiran.foto_keluar FROM kehadiran JOIN barcode ON kehadiran.barcode = barcode.barcode JOIN pegawai ON barcode.id = pegawai.id JOIN shift ON kehadiran.id_shift = shift.id_shift -- Tambahkan operasi JOIN pada tabel shift WHERE kehadiran.foto_keluar IS NOT NULL AND DATE(kehadiran.jam_masuk) = CURDATE()";

  const query = "SELECT * FROM kehadiran WHERE ";

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

  const showQuery = `SELECT kehadiran.*, shift.nama_shift, shift.jam_masuk AS jam_masuk_shift, shift.jam_pulang AS jam_keluar_shift
  FROM kehadiran
  JOIN shift ON kehadiran.id_shift = shift.id_shift
  WHERE kehadiran.id_kehadiran = ${id_kehadiran}`;

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
      let isTelat = 0;
      if (telat > 0) {
        isTelat = 1;
      } else {
        isTelat = 0;
      }
      const updateQuery = `UPDATE detail_jadwal SET isHadir=1,isTelat=${isTelat} WHERE id = ${id_detail_jadwal}`;

      connection.query(updateQuery, (error, result) => {
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
});

// Absen pulang
router.patch("/:id_kehadiran", function (req, res, next) {
  const { id_kehadiran } = req.params;
  const { foto_keluar, jam_masuk, durasi, lembur } = req.body;

  const base64Data = foto_keluar.replace(/^data:image\/\w+;base64,/, "");
  const buffer = Buffer.from(base64Data, "base64");

  const fileName = Date.now() + ".jpg"; // Atur nama file sesuai kebutuhan
  const filePath = path.join("uploads", fileName);

  fs.writeFile(filePath, buffer, (err) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Gagal menyimpan foto" });
    }

    const dateTimeString = "2024-04-04T01:00:00.000Z";
    const date = new Date(dateTimeString);

    const year = date.getFullYear();
    const month = ("0" + (date.getMonth() + 1)).slice(-2);
    const day = ("0" + date.getDate()).slice(-2);
    const hours = ("0" + date.getHours()).slice(-2);
    const minutes = ("0" + date.getMinutes()).slice(-2);
    const seconds = ("0" + date.getSeconds()).slice(-2);

    const jamMasukBaru = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;

    const updateQuery = `UPDATE kehadiran SET foto_keluar = '${fileName}', jam_masuk = '${jamMasukBaru}', jam_keluar = NOW(), durasi = TIMESTAMPDIFF(MINUTE, '${jamMasukBaru}', NOW()), lembur = 0 WHERE id_kehadiran = '${id_kehadiran}';`;

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
