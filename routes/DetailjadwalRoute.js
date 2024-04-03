const express = require("express");
const connection = require("../config/database");

const router = express.Router();

// Ambil semua data
router.post("/", function (req, res, next) {
  const { idJadwal } = req.body;

  const stringQuery =
    "SELECT detail_jadwal.id AS detail_jadwal_id, detail_jadwal.isHadir, detail_jadwal.isTelat, detail_jadwal.isPulangCepat, detail_jadwal.tanggal, detail_jadwal.nominal AS nominal_hadir, jadwal_kehadiran.id AS jadwal_kehadiran_id, jadwal_kehadiran.bulan, shift.id_shift, shift.nama_shift, shift.jam_masuk, shift.jam_pulang AS jam_pulang, shift.nominal, pegawai.nama FROM detail_jadwal JOIN jadwal_kehadiran ON detail_jadwal.id_jadwal = jadwal_kehadiran.id JOIN shift ON detail_jadwal.id_shift = shift.id_shift JOIN barcode ON jadwal_kehadiran.barcode = barcode.barcode JOIN pegawai ON pegawai.id = barcode.id WHERE jadwal_kehadiran.id = '" +
    idJadwal +
    "'";

  connection.query(stringQuery, (error, result) => {
    if (error) {
      console.log("Error executing query", error);
      return;
    }
    console.log("Query result jadwal Detail:", result);
    console.log(stringQuery);
    res.json(result);
  });
});

// ambil data berdasarkan id
router.post("/add/", function (req, res, next) {
  const { idShift, idJadwal, tanggal } = req.body;

  const addQuery =
    "insert into detail_jadwal (id_jadwal, id_shift, tanggal,isHadir, isTelat,isPulangCepat,nominal, createdAt, updatedAt) values ('" +
    idJadwal +
    "','" +
    idShift +
    "','" +
    tanggal +
    "','0','0','0','0',CURDATE(), CURDATE())";

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
  const { idJadwal, idShift, tanggal, idDetail } = req.body;

  const addQuery =
    "UPDATE detail_jadwal SET id_jadwal = '" +
    idJadwal +
    "', id_shift = '" +
    idShift +
    "', tanggal = '" +
    tanggal +
    "', isHadir = '0',isTelat='0', isPulangCepat='0', nominal='0', createdAt=CURDATE() where id ='" +
    idDetail +
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
router.delete("/delete/:idDetail", function (req, res, next) {
  const { idDetail } = req.params;

  const deleteQuery = "DELETE FROM detail_jadwal WHERE id = " + idDetail;

  connection.query(deleteQuery, [idDetail], (error, result) => {
    if (error) {
      console.error("Error executing query:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
    console.log("Data deleted successfully");
    res.json({ message: "Data deleted successfully" });
  });
});

module.exports = router;
