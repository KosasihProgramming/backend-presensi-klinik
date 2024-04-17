const express = require("express");
const cors = require("cors");
const path = require("path");
// const queryLimit = require("express-query-limit");

const app = express();
const port = 5000;

const shift = require("./routes/shiftRoute");
const jadwal = require("./routes/JadwalRoute");
const detail_jadwal = require("./routes/DetailjadwalRoute");
const barcode = require("./routes/barcodeRoute");
const kehadiran = require("./routes/kehadiranRoute");
const pegawai = require("./routes/PegawaiRoute");
const klinik = require("./routes/klinikRouter");
const insentif = require("./routes/rekapInsentifRoute");
const totalGaji = require("./routes/rekapGajiDokterRoute");

app.get("/", (req, res) => {
  res.send("Web API untuk absensi");
});

app.use(cors());
app.use(express.json());

const uploadsPath = path.join(__dirname, "uploads");
app.use("/uploads", express.static(uploadsPath));

app.use("/shift", shift);
app.use("/jadwal", jadwal);
app.use("/detail-jadwal", detail_jadwal);
app.use("/barcode", barcode);
app.use("/kehadiran", kehadiran);
app.use("/pegawai", pegawai);
app.use("/klinik", klinik);
app.use("/insentif", insentif);
app.use("/total-gaji", totalGaji);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

module.exports = app;

// [
//   ["dr. Qotrunnada", "Insentif", 0, "Rp 0"],
//   ["dr. Qotrunnada", "Nominal Sift", 1, "Rp 50.000"],
//   [("dr. Qotrunnada", "Kekurangan Garansi Fee", "", "Rp 50.000")],
//   [("dr. Qotrunnada", "Total Gaji", "", "Rp 100.000")],
//   [("dr. Hilyatul Nadia", "Insentif", 0, "Rp 0")],
//   [("dr. Hilyatul Nadia", "Nominal Sift", 2, "Rp 100.000")],
//   [("dr. Hilyatul Nadia", "Kekurangan Garansi Fee", "", "Rp 100.000")],
//   [("dr. Hilyatul Nadia", "Total Gaji", "", "Rp 185.000")],
// ];

// [
//   {
//     nama_dokter: "dr. Qotrunnada",
//     variabel: "Insentif",
//     jumlah: 0,
//     total: 0,
//   },
//   {
//     nama_dokter: "dr. Qotrunnada",
//     variabel: "Nominal Sift",
//     jumlah: 1,
//     total: 50000,
//   },
//   {
//     nama_dokter: "dr. Qotrunnada",
//     variabel: "Kekurangan Garansi Fee",
//     jumlah: "",
//     total: 50000,
//   },
//   {
//     nama_dokter: "dr. Qotrunnada",
//     variabel: "Total Gaji",
//     jumlah: "",
//     total: 100000,
//   },
//   {
//     nama_dokter: "dr. Hilyatul Nadia",
//     variabel: "Insentif",
//     jumlah: 0,
//     total: 0,
//   },
//   {
//     nama_dokter: "dr. Hilyatul Nadia",
//     variabel: "Nominal Sift",
//     jumlah: 2,
//     total: 100000,
//   },
//   {
//     nama_dokter: "dr. Hilyatul Nadia",
//     variabel: "Kekurangan Garansi Fee",
//     jumlah: "",
//     total: 100000,
//   },
//   {
//     nama_dokter: "dr. Hilyatul Nadia",
//     variabel: "Total Gaji",
//     jumlah: "",
//     total: 185000,
//   },
// ];

// [
//   {
//     nama_dokter: "dr. Hilyatul Nadia",
//     data: [
//       {
//         variabel: "Insentif",
//         quantity: 0,
//         total: 0,
//       },
//       {
//         variabel: "Nominal",
//         quantity: 2,
//         total: 100000,
//       },
//       {
//         variabel: "Garansi Fee",
//         quantity: "",
//         total: 100000,
//       },
//       {
//         variabel: "Gaji Periode",
//         quantity: "",
//         total: 185000,
//       },
//     ],
//   },
// ];

// [
//   ["dr. aidyah", "Insentif", 0, 0],
//   ["", "Insentif", 0, 0],
//   ["", "Insentif", 0, 0],
//   ["", "Insentif", 0, 0],
//   ["dr. saipul", "Insentif", 0, 0],
//   ["", "Insentif", 0, 0],
//   ["", "Insentif", 0, 0],
//   ["", "Insentif", 0, 0],
// ]
