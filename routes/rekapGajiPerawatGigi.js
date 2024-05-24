const express = require("express");
const connection = require("../config/database");

const router = express.Router();

const queryDelete = (bulan, tahun) => {
  const query = `DELETE FROM rekap_gaji_perawat_gigi WHERE bulan='${bulan}' AND tahun='${tahun}'`;
  return query;
};

const querySelect = (bulan, tahun) => {
  const query = `SELECT * FROM rekap_gaji_perawat_gigi WHERE bulan='${bulan}' AND tahun='${tahun}'`;
  return query;
};

router.get("/", function (req, res, next) {
  const stringQuery = ``;
});

// ambil data berdasarkan bulan dan tahun
router.post("/cek/data", function (req, res, next) {
  const { bulan, tahun } = req.body;

  const selectData = querySelect(bulan, tahun);

  connection.query(selectData, (error, result) => {
    if (error) {
      console.log("Error executing query: ", error);
      return;
    }
    console.log("query select: ", selectData);
    res.json(result);
  });
});

// insert data total gaji periode
router.post("/add/data", function (req, res, next) {
  const data = req.body;

  // Jika tidak ada data yang diterima, kirimkan respons dengan status 400
  if (!data || !Array.isArray(data) || data.length === 0) {
    return res.status(400).json({ error: "Data tidak valid atau tidak ada" });
  }

  // Query untuk melakukan insert data
  const insertQuery = `INSERT INTO rekap_gaji_perawat_gigi (bulan, tahun, barcode, nama_perawat, total_data_nominal, total_nominal, total_insentif, total_denda_telat, total_data_gaji_akhir) VALUES ?`;

  // Array 2D untuk menampung nilai yang akan di-insert
  const values = data.map((item) => [
    item.bulan,
    item.tahun,
    item.barcode,
    item.nama_perawat,
    item.total_data_nominal,
    item.total_nominal,
    item.total_insentif,
    item.total_denda_telat,
    item.total_data_gaji_akhir,
  ]);

  // Eksekusi query insert dengan menggunakan array 2D sebagai nilai
  connection.query(insertQuery, [values], (error, result) => {
    if (error) {
      console.error("Error executing query:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
    console.log("New records created:", result.affectedRows);
    res
      .status(201)
      .json({ message: `${result.affectedRows} data berhasil ditambahkan` });
  });
});

// Hapus Semua data parameter bulan, tahun
router.post("/delete/data", function (req, res, next) {
  const { bulan, tahun } = req.body;

  const query = queryDelete(bulan, tahun);

  // Eksekusi query
  connection.query(query, (error, results) => {
    if (error) {
      console.error("Error saat menghapus data:", error);
      return res.status(500).json({ error: "Gagal menghapus data" }); // Tambahkan return di sini
    } else {
      console.log(query);
      console.log("Data berhasil dihapus");
      res.json({ message: query });
    }
  });
});

module.exports = router;
