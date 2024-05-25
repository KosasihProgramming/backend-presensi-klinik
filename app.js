const express = require("express");
const cors = require("cors");
const path = require("path");
const session = require("express-session");

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
const insentifPerawatGigi = require("./routes/rekapShiftPerawatGigiRoute");
const rekapPeriodePerawatGigi = require("./routes/rekapGajiPerawatGigi");
const insentifPerawatUmum = require("./routes/rekapShiftPerawatUmum");
const loginRoutes = require("./routes/loginRoutes");
const kehadiranDokter = require("./routes/rekapKehadiran/dokter");
const kehadiranDokterGigi = require("./routes/rekapKehadiran/dokterGigi");
const kehadiranPerawat = require("./routes/rekapKehadiran/perawat");
const kehadiranPerawatGigi = require("./routes/rekapKehadiran/perawatGigi");

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
app.use("/insentif-perawat-gigi", insentifPerawatGigi);
app.use("/periode-perawat-gigi", rekapPeriodePerawatGigi);
app.use("/insentif-perawat-umum", insentifPerawatUmum);

app.use("/login", loginRoutes);

// Rekap kehadiran
app.use("/rekap-kehadiran-dokter", kehadiranDokter);
app.use("/rekap-kehadiran-dokter-gigi", kehadiranDokterGigi);
app.use("/rekap-kehadiran-perawat", kehadiranPerawat);
app.use("/rekap-kehadiran-perawat-gigi", kehadiranPerawatGigi);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

module.exports = app;
