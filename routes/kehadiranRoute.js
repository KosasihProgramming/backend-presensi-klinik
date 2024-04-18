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
    console.log("OK");
    res.json(result);
  });
});

// Ambil semua data kehadiran yang belum pulang
router.get("/now", function (req, res, next) {
  const stringQuery =
    "SELECT kehadiran.id_kehadiran, pegawai.nama, kehadiran.barcode, kehadiran.id_shift, shift.nama_shift, kehadiran.jam_masuk, kehadiran.foto_masuk FROM kehadiran JOIN barcode ON kehadiran.barcode = barcode.barcode JOIN pegawai ON barcode.id = pegawai.id JOIN shift ON kehadiran.id_shift = shift.id_shift WHERE kehadiran.foto_keluar IS NULL";

  // const query = "SELECT * FROM kehadiran WHERE ";

  connection.query(stringQuery, (error, result) => {
    if (error) {
      console.log("Error executing query", error);
      return;
    }
    console.log("OK");
    res.json(result);
  });
});

// Ambil data kepulangan hari ini
router.get("/pulang/all", function (req, res, next) {
  const stringQuery = `SELECT kehadiran.id_detail_jadwal, detail_jadwal.tanggal, pegawai.nama, kehadiran.barcode, kehadiran.id_shift, shift.nama_shift, kehadiran.jam_masuk, kehadiran.jam_keluar, kehadiran.foto_masuk, kehadiran.foto_keluar 
  FROM kehadiran 
  JOIN barcode ON kehadiran.barcode = barcode.barcode 
  JOIN pegawai ON barcode.id = pegawai.id 
  JOIN shift ON kehadiran.id_shift = shift.id_shift 
  JOIN detail_jadwal ON kehadiran.id_detail_jadwal = detail_jadwal.id
  WHERE kehadiran.foto_keluar IS NOT NULL AND detail_jadwal.tanggal = CURDATE();`;

  // const query = "SELECT * FROM kehadiran WHERE ";

  connection.query(stringQuery, (error, result) => {
    if (error) {
      console.log("Error executing query", error);
      return;
    }
    console.log("OK");
    res.json(result);
  });
});

// Filter tanggal
router.get("/filter/:tanggal", function (req, res, next) {
  const { tanggal } = req.params;
  const stringQuery = `SELECT kehadiran.id_detail_jadwal, detail_jadwal.tanggal, pegawai.nama, kehadiran.barcode, kehadiran.id_shift, shift.nama_shift, kehadiran.jam_masuk, kehadiran.jam_keluar, kehadiran.foto_masuk, kehadiran.foto_keluar 
  FROM kehadiran 
  JOIN barcode ON kehadiran.barcode = barcode.barcode 
  JOIN pegawai ON barcode.id = pegawai.id 
  JOIN shift ON kehadiran.id_shift = shift.id_shift 
  JOIN detail_jadwal ON kehadiran.id_detail_jadwal = detail_jadwal.id
  WHERE kehadiran.foto_keluar IS NOT NULL AND detail_jadwal.tanggal = "${tanggal}"`;

  connection.query(stringQuery, (error, result) => {
    if (error) {
      console.log("Error executing query", error);
      return;
    }
    console.log("OK");
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
    console.log("OK");
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
    is_lanjut_shift,
    is_dokter_pengganti,
    nama_dokter_pengganti,
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
      "INSERT INTO kehadiran (barcode, id_jadwal, id_detail_jadwal, id_shift, foto_masuk, jam_masuk, telat, denda_telat, is_pindah_klinik, is_lanjut_shift, is_dokter_pengganti, nama_dokter_pengganti) VALUES ('" +
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
      "','" +
      is_lanjut_shift +
      "','" +
      is_dokter_pengganti +
      "','" +
      nama_dokter_pengganti +
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

  const sendMessageToTelegram = async (message) => {
    const botToken = "6450512353:AAEPzql6mikTouuEse_S_GhzA7XlmC1lNgE";
    const chatId = "1391434253";

    const url = `https://api.telegram.org/bot${botToken}/sendMessage`;
    const params = new URLSearchParams({
      chat_id: chatId,
      text: message,
    });

    try {
      const response = await fetch(`${url}?${params.toString()}`);
      const data = await response.json();
      console.log("Message sent:", data);
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const base64Data = foto_keluar.replace(/^data:image\/\w+;base64,/, "");
  const buffer = Buffer.from(base64Data, "base64");

  const fileName = Date.now() + ".jpg"; // Atur nama file sesuai kebutuhan
  const filePath = path.join("uploads", fileName);

  fs.writeFile(filePath, buffer, (err) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Gagal menyimpan foto" });
    }

    const dateTimeString = jam_masuk;
    const date = new Date(dateTimeString);

    const year = date.getFullYear();
    const month = ("0" + (date.getMonth() + 1)).slice(-2);
    const day = ("0" + date.getDate()).slice(-2);
    const hours = ("0" + date.getHours()).slice(-2);
    const minutes = ("0" + date.getMinutes()).slice(-2);
    const seconds = ("0" + date.getSeconds()).slice(-2);

    const jamMasukBaru = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;

    const updateQuery = `UPDATE kehadiran k JOIN shift s ON k.id_shift = s.id_shift SET k.foto_keluar = '${fileName}', k.jam_keluar = NOW(), k.durasi = TIMESTAMPDIFF(MINUTE, s.jam_masuk, s.jam_pulang), k.lembur = 0 WHERE k.id_kehadiran = '${id_kehadiran}';`;

    connection.query(updateQuery, (error, result) => {
      if (error) {
        console.error("Error executing query:", error);
        return res.status(500).json({ error: "Internal Server Error" });
      }

      const selectQuery = `SELECT 
      kehadiran.id_detail_jadwal, 
      kehadiran.barcode, 
      pegawai.nama, 
      kehadiran.jam_keluar, 
      kehadiran.id_shift, 
      shift.jam_pulang,
      shift.nominal,
      setting.nama_instansi FROM kehadiran
      JOIN shift ON kehadiran.id_shift = shift.id_shift
      JOIN barcode ON kehadiran.barcode = barcode.barcode
      JOIN pegawai ON barcode.id = pegawai.id
      CROSS JOIN setting
      WHERE kehadiran.id_kehadiran = ${id_kehadiran};
  `;

      connection.query(selectQuery, (error, resultSelect) => {
        if (error) {
          console.error("Error executing query:", error);
          res.status(500).json({ error: "Internal Server Error" });
          return;
        }
        const namaInstansi = resultSelect[0].nama_instansi;
        console.log(selectQuery);
        console.log({ data: resultSelect[0] });
        const dateString = resultSelect[0].jam_keluar;
        const date = new Date(dateString);
        const jam = date.getHours();
        const menit = date.getMinutes();
        const detik = date.getSeconds();
        console.log(`Jam: ${jam}, Menit: ${menit}, Detik: ${detik}`);

        const id_detail_jadwal = resultSelect[0].id_detail_jadwal;
        const jam_absen_pulang = `${jam}:${menit}:${detik}`;
        const jam_pulang = resultSelect[0].jam_pulang;

        // Pisahkan jam, menit, dan detik untuk setiap waktu
        const [jam1, menit1, detik1] = jam_absen_pulang.split(":").map(Number);
        const [jam2, menit2, detik2] = jam_pulang.split(":").map(Number);

        // Konversi waktu menjadi total menit
        const totalMenit1 = jam1 * 60 + menit1 + detik1 / 60;
        const totalMenit2 = jam2 * 60 + menit2 + detik2 / 60;

        // Hitung selisih waktu dalam menit
        const selisihMenit = totalMenit2 - totalMenit1;

        const nama = resultSelect[0].nama;
        const nominal = resultSelect[0].nominal;

        let isPulangCepat = 0;
        if (selisihMenit <= 0) {
          isPulangCepat = 0;
        } else {
          isPulangCepat = 1;
          const message = `${nama} pulang cepat sebelum jadwal di ${namaInstansi}`;
          sendMessageToTelegram(message);
        }

        const updateQuery = `UPDATE detail_jadwal SET isPulangCepat=${isPulangCepat}, nominal=${nominal} WHERE id = ${id_detail_jadwal}`;

        connection.query(updateQuery, (error, resultUpdateIsPulangCepet) => {
          if (error) {
            console.error("Error executing query:", error);
            res.status(500).json({ error: "Internal Server Error" });
            return;
          }
        });
      });
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
