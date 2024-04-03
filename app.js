const express = require("express");
const cors = require("cors");

const app = express();
const port = 5000;

const shift = require("./routes/shiftRoute");
const jadwal = require("./routes/JadwalRoute");
const detail_jadwal = require("./routes/DetailjadwalRoute");
const barcode = require("./routes/BarcodeRoute");
const kehadiran = require("./routes/kehadiranRoute");
const pegawai = require("./routes/PegawaiRoute");
app.get("/", (req, res) => {
  res.send("Web API untuk absensi");
});

app.use(cors());
app.use(express.json());

app.use("/shift", shift);
app.use("/jadwal", jadwal);
app.use("/detail-jadwal", detail_jadwal);
app.use("/barcode", barcode);
app.use("/kehadiran", kehadiran);
app.use("/pegawai", pegawai);
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

module.exports = app;
