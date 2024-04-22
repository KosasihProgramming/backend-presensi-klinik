const express = require("express");
const connection = require("../config/database");

const router = express.Router();

const queryDelete = (bulan, tahun) => {
  const query = `DELETE FROM rekap_gaji_dokter where bulan='${bulan}' and tahun='${tahun}'`;
  return query;
};

const querySelect = (bulan, tahun) => {
  const query = `SELECT * FROM rekap_gaji_dokter where bulan='${bulan}' AND tahun='${tahun}' AND jbtn != 'drg'`;
  return query;
};

const querySelectPengganti = (bulan, tahun) => {
  const query = `SELECT * FROM rekap_gaji_dokter where bulan='${bulan}' AND tahun='${tahun}' AND nama_dokter_penggn IS NOT NULL`;
  return query;
};

const querySelectGigi = (bulan, tahun) => {
  const query = `SELECT * FROM rekap_gaji_dokter where bulan='${bulan}' AND tahun='${tahun}' AND jbtn='drg' AND jbtn = 'drg'`;
  return query;
};

// Ambil semua data
router.get("/", function (req, res, next) {
  const stringQuery = "SELECT * FROM rekap_gaji_dokter";

  connection.query(stringQuery, (error, result) => {
    if (error) {
      console.log("Error executing query", error);
      return;
    }
    console.log("Query result:", result);
    res.json(result);
  });
});

// Ambul data berdasarkan bulan dan tahun
router.post("/cek/data", function (req, res, next) {
  const { bulan, tahun } = req.body;

  const selectData = querySelect(bulan, tahun);

  connection.query(selectData, (error, result) => {
    if (error) {
      console.log("Error executing query", error);
      return;
    }
    console.log(selectData, "queryselect");
    res.json(result);
  });
});

// Ambil data dokter pengganti
router.post("/cek/pengganti", function (req, res, next) {
  const { bulan, tahun } = req.body;

  const selectData = querySelectPengganti(bulan, tahun);

  connection.query(selectData, (error, result) => {
    if (error) {
      console.log("Error executing query", error);
      return;
    }
    console.log(selectData, "queryselect");
    res.json(result);
  });
});

// Ambil data dokter gigi
router.post("/cek/gigi", function (req, res, next) {
  const { bulan, tahun } = req.body;

  const selectData = querySelectGigi(bulan, tahun);

  connection.query(selectData, (error, result) => {
    if (error) {
      console.log("Error executing query", error);
      return;
    }
    console.log(selectData, "queryselect");
    res.json(result);
  });
});

// Insett data
router.post("/add/data", function (req, res, next) {
  const data = req.body;

  // Jika tidak ada data yang diterima, kirimkan respons dengan status 400
  if (!data || !Array.isArray(data) || data.length === 0) {
    return res.status(400).json({ error: "Data tidak valid atau tidak ada" });
  }

  // Query untuk melakukan insert data
  const insertQuery = `INSERT INTO rekap_gaji_dokter (bulan, tahun, barcode, nama_dokter, jbtn, nama_dokter_pengganti, shift_dokter_pengganti, total_data_insentif, total_insentif, total_data_nominal, total_nominal, total_garansi_fee, total_denda_telat, pajak, total_gaji_periode, gaji_akhir) VALUES ?`;

  // Array 2D untuk menampung nilai yang akan di-insert
  const values = data.map((item) => [
    item.bulan,
    item.tahun,
    item.barcode,
    item.nama_dokter,
    item.jbtn,
    item.nama_dokter_pengganti === "" ? null : item.nama_dokter_pengganti,
    item.shift_dokter_pengganti,
    // === "" ? null : item.shift_dokter_pengganti,
    item.total_data_insentif,
    item.total_insentif,
    item.total_data_nominal,
    item.total_nominal,
    item.total_garansi_fee,
    item.total_denda_telat,
    item.pajak,
    item.total_gaji_periode,
    item.gaji_akhir,
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

// [
//   {
//     barcode: "222",
//     bulan: "April",
//     denda_telat: 0,
//     garansi_fee: 100000,
//     id: 11,
//     insentif: 0,
//     kekurangan_garansi_fee: 100000,
//     nama_dokter: "dr. Qotrunnada",
//     nama_dokter_pengganti: "dr. Kochan",
//     nama_shift: "Shift Siang",
//     nominal_shift: 50000,
//     tahun: "2024",
//     tanggal: "2024-04-17",
//     total_gaji: 100000,
//   },
//   {
//     barcode: "222",
//     bulan: "April",
//     denda_telat: 20000,
//     garansi_fee: 100000,
//     id: 12,
//     insentif: 0,
//     kekurangan_garansi_fee: 100000,
//     nama_dokter: "dr. Qotrunnada",
//     nama_dokter_pengganti: "dr. Ria",
//     nama_shift: "Shift Sore",
//     nominal_shift: 50000,
//     tahun: "2024",
//     tanggal: "2024-04-17",
//     total_gaji: 80000,
//   },
//   {
//     barcode: "100",
//     bulan: "April",
//     denda_telat: 20000,
//     garansi_fee: 100000,
//     id: 13,
//     insentif: 0,
//     kekurangan_garansi_fee: 100000,
//     nama_dokter: "dr. Aisyah",
//     nama_dokter_pengganti: "",
//     nama_shift: "Shift Siang",
//     nominal_shift: 50000,
//     tahun: "2024",
//     tanggal: "2024-04-17",
//     total_gaji: 80000,
//   },
//   {
//     barcode: "100",
//     bulan: "April",
//     denda_telat: 20000,
//     garansi_fee: 100000,
//     id: 14,
//     insentif: 0,
//     kekurangan_garansi_fee: 100000,
//     nama_dokter: "dr. Aisyah",
//     nama_dokter_pengganti: "",
//     nama_shift: "Shift Siang",
//     nominal_shift: 50000,
//     tahun: "2024",
//     tanggal: "2024-04-17",
//     total_gaji: 80000,
//   },
// ];

// [
//   {
//     barcode: "100",
//     bulan: "April",
//     gaji_akhir: 159000,
//     nama_dokter: "dr. Aisyah",
//     nama_dokter_pengganti: "",
//     shift_dokter_pengganti: 0,
//     pajak: 4000,
//     tahun: 2024,
//     total_data_insentif: 0,
//     total_data_nominal: 2,
//     total_denda_telat: 40000,
//     total_gaji_periode: 160000,
//     total_garansi_fee: 200000,
//     total_insentif: 0,
//     total_nominal: 100000,
//   },
//   {
//     barcode: "222",
//     bulan: "April",
//     gaji_akhir: 78000,
//     nama_dokter: "dr. Qotrunnada",
//     nama_dokter_pengganti: "dr. Chandra, dr. Ria",
//     shift_dokter_pengganti: 2,
//     pajak: 2000,
//     tahun: 2024,
//     total_data_insentif: 0,
//     total_data_nominal: 2,
//     total_denda_telat: 20000,
//     total_gaji_periode: 180000,
//     total_garansi_fee: 200000,
//     total_insentif: 0,
//     total_nominal: 100000,
//   },
// ];
