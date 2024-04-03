const express = require("express");
const connection = require("../config/database");

const router = express.Router();

// Ambil semua data
router.post("/data/", function (req, res, next) {
  const { tahun } = req.body;

  const stringQuery =
    "SELECT pegawai.nama, pegawai.id as id_pegawai, barcode.barcode, jadwal_kehadiran.id, jadwal_kehadiran.uid,jadwal_kehadiran.bulan, jadwal_kehadiran.tahun, jadwal_kehadiran.tanggal_awal, jadwal_kehadiran.tanggal_akhir, jadwal_kehadiran.jumlah_kehadiran, jadwal_kehadiran.jumlah_shift FROM pegawai INNER JOIN barcode ON pegawai.id = barcode.id INNER JOIN jadwal_kehadiran ON barcode.barcode = jadwal_kehadiran.barcode WHERE jadwal_kehadiran.tahun like '%" +
    tahun +
    "%'";

  connection.query(stringQuery, (error, result) => {
    if (error) {
      console.log("Error executing query", error);
      return;
    }
    console.log("Query result jadwal:", result);
    console.log(stringQuery);
    res.json(result);
  });
});

router.post("/data/detail/", function (req, res, next) {
  const { idJadwal } = req.body;
  console.log("id", idJadwal);
  const stringQuery =
    "SELECT pegawai.nama, pegawai.id as id_pegawai, barcode.barcode, jadwal_kehadiran.id, jadwal_kehadiran.uid,jadwal_kehadiran.bulan, jadwal_kehadiran.tahun, jadwal_kehadiran.tanggal_awal, jadwal_kehadiran.tanggal_akhir, jadwal_kehadiran.jumlah_kehadiran, jadwal_kehadiran.jumlah_shift FROM pegawai INNER JOIN barcode ON pegawai.id = barcode.id INNER JOIN jadwal_kehadiran ON barcode.barcode = jadwal_kehadiran.barcode WHERE jadwal_kehadiran.uid = '" +
    idJadwal +
    "'";

  connection.query(stringQuery, (error, result) => {
    if (error) {
      console.log("Error executing query", error);
      return;
    }
    console.log("Query result jadwal:", result);
    console.log(stringQuery);
    res.json(result);
  });
});

// ambil data berdasarkan id
router.post("/add/", function (req, res, next) {
  const { tanggalAwal, tanggalAkhir, bulan, tahun, barcode } = req.body;

  const addQuery =
    "insert into jadwal_kehadiran (uid,tanggal_awal, tanggal_akhir, bulan,tahun, jumlah_kehadiran,jumlah_shift, barcode, createdAt,updatedAt) values (UUID(),'" +
    tanggalAwal +
    "','" +
    tanggalAkhir +
    "','" +
    bulan +
    "','" +
    tahun +
    "','0','0','" +
    barcode +
    "',CURDATE(),CURDATE())";

  connection.query(addQuery, (error, result) => {
    if (error) {
      console.log("Error executing query", error);
      return;
    }
    console.log("Query result:", result);
    res.json(result);
  });
});

router.post("/edit/", function (req, res, next) {
  const {
    tanggalAwal,
    tanggalAkhir,

    bulan,
    tahun,

    barcode,
    idJadwal,
  } = req.body;

  const addQuery =
    "UPDATE jadwal_kehadiran SET tanggal_awal = '" +
    tanggalAwal +
    "', tanggal_akhir = '" +
    tanggalAkhir +
    "', bulan = '" +
    bulan +
    "', tahun = '" +
    tahun +
    "', jumlah_kehadiran = '0', jumlah_shift = '0', createdAt = CURDATE() WHERE barcode = '" +
    barcode +
    "' and id = '" +
    idJadwal +
    "'";

  connection.query(addQuery, (error, result) => {
    if (error) {
      console.log("Error executing query", error);
      return;
    }
    console.log("Query result:", result);
    res.json(result);
    console.log(addQuery);
  });
});

// hapus data
router.delete("/delete/:idJadwal", function (req, res, next) {
  const { idJadwal } = req.params;

  const deleteQuery = "DELETE FROM jadwal_kehadiran WHERE id = " + idJadwal;

  connection.query(deleteQuery, [idJadwal], (error, result) => {
    if (error) {
      console.error("Error executing query:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
    console.log("Data deleted successfully");
    res.json({ message: "Data deleted successfully" });
  });
});

module.exports = router;
