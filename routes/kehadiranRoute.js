const express = require("express");
const connection = require("../config/database");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const bodyParser = require("body-parser");
const { DendaPulangCepat } = require("./utils");
const { uploadImageToFirebase } = require("../middleware/uploadImages");
const router = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // Direktori penyimpanan file
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname); // Penamaan file
  },
});
// Filter untuk tipe file
const fileFilter = (req, file, cb) => {
  const fileTypes = /jpeg|jpg|png/;
  const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = fileTypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb(new Error("Only .jpeg, .jpg, and .png files are allowed!"));
  }
};
// Upload handler
const upload = multer({
  storage: storage,
  limits: { fileSize: 1024 * 1024 * 5 }, // Max 5 MB
  fileFilter: fileFilter,
});

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
router.post("/now", function (req, res, next) {
  const { cabang } = req.body; // Ambil 'cabang' dari body request
  if (!cabang) {
    return res.status(400).send("Cabang harus disertakan.");
  }
  console.log("cabang", cabang);
  const stringQuery = `
    SELECT kehadiran.id_kehadiran, pegawai.nama, kehadiran.barcode, detail_jadwal.tanggal, 
    kehadiran.id_shift, shift.nama_shift, kehadiran.jam_masuk, kehadiran.foto_masuk 
    FROM kehadiran 
    JOIN barcode ON kehadiran.barcode = barcode.barcode 
    JOIN pegawai ON barcode.id = pegawai.id 
    JOIN detail_jadwal ON kehadiran.id_detail_jadwal = detail_jadwal.id 
    JOIN shift ON kehadiran.id_shift = shift.id_shift 
    WHERE kehadiran.foto_keluar IS NULL 
    AND kehadiran.cabang = ?;
  `;

  // Gunakan parameterized query untuk menghindari SQL injection
  connection.query(stringQuery, [cabang], (error, result) => {
    if (error) {
      console.log("Error executing query", error);
      return res.status(500).send("Error executing query");
    }
    console.log("Query successful");
    res.json(result);
  });
});

// Ambil data kepulangan hari ini
router.post("/pulang/all", function (req, res, next) {
  const { cabang } = req.body; // Ambil 'cabang' dari body request
  console.log(cabang, "cabang");
  if (!cabang) {
    return res.status(400).send("Cabang harus disertakan.");
  }

  const stringQuery = `
    SELECT kehadiran.id_detail_jadwal, detail_jadwal.tanggal, pegawai.nama, kehadiran.barcode, kehadiran.id_shift, shift.nama_shift, 
           kehadiran.jam_masuk, kehadiran.jam_keluar, kehadiran.foto_masuk, kehadiran.foto_keluar 
    FROM kehadiran 
    JOIN barcode ON kehadiran.barcode = barcode.barcode 
    JOIN pegawai ON barcode.id = pegawai.id 
    JOIN shift ON kehadiran.id_shift = shift.id_shift 
    JOIN detail_jadwal ON kehadiran.id_detail_jadwal = detail_jadwal.id
    WHERE kehadiran.foto_keluar IS NOT NULL 
    AND detail_jadwal.tanggal = CURDATE() 
    AND kehadiran.cabang = ?;`; // Gunakan parameterized query untuk keamanan

  // Gunakan parameterized query untuk menghindari SQL injection
  connection.query(stringQuery, [cabang], (error, result) => {
    if (error) {
      console.log("Error executing query", error);
      return res.status(500).send("Error executing query");
    }
    console.log("Query successful");
    res.json(result);
  });
});

// Filter tanggal
router.get("/filter/:tanggal/:cabang", function (req, res, next) {
  const { tanggal, cabang } = req.params;
  const stringQuery = `SELECT kehadiran.id_detail_jadwal, detail_jadwal.tanggal, pegawai.nama, kehadiran.barcode, kehadiran.id_shift, shift.nama_shift, kehadiran.jam_masuk, kehadiran.jam_keluar, kehadiran.foto_masuk, kehadiran.foto_keluar 
  FROM kehadiran 
  JOIN barcode ON kehadiran.barcode = barcode.barcode 
  JOIN pegawai ON barcode.id = pegawai.id 
  JOIN shift ON kehadiran.id_shift = shift.id_shift 
  JOIN detail_jadwal ON kehadiran.id_detail_jadwal = detail_jadwal.id
  WHERE kehadiran.foto_keluar IS NOT NULL AND detail_jadwal.tanggal = "${tanggal}" AND kehadiran.cabang = "${cabang}"`;

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
router.post("/presensi", function (req, res) {
  const { id_kehadiran } = req.body; // Mengambil id_kehadiran dari body request

  if (!id_kehadiran) {
    return res.status(400).send("id_kehadiran harus disertakan.");
  }

  const showQuery = `
    SELECT kehadiran.*, detail_jadwal.tanggal, shift.nama_shift, 
           shift.jam_masuk AS jam_masuk_shift, shift.jam_pulang AS jam_keluar_shift
    FROM kehadiran
    JOIN shift ON kehadiran.id_shift = shift.id_shift
    JOIN detail_jadwal ON kehadiran.id_detail_jadwal = detail_jadwal.id
    WHERE kehadiran.id_kehadiran = ?`; // Menggunakan parameterized query untuk keamanan

  connection.query(showQuery, [id_kehadiran], (error, result) => {
    if (error) {
      console.log("Error executing query", error);
      return res.status(500).send("Error executing query");
    }
    console.log("OK kehadiran");
    res.json(result);
  });
});

// isi data kehadiran (absen datang)
router.post("/", async function (req, res, next) {
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
    nama_petugas,
    keterangan,
    lokasiAbsen,
    cabang,
  } = req.body;

  try {
    // Menghapus prefix Base64 dan konversi ke buffer
    const base64Data = foto_masuk.replace(/^data:image\/\w+;base64,/, "");
    const buffer = Buffer.from(base64Data, "base64");

    // Tentukan nama file berdasarkan timestamp
    const fileName = Date.now() + ".jpg"; // Atur ekstensi sesuai jenis gambar (jpg dalam hal ini)

    // Fungsi untuk mengunggah gambar ke Firebase
    const downloadURL = await uploadImageToFirebase(buffer, fileName);

    // Lanjutkan dengan penyimpanan data ke database, menggunakan downloadURL dari Firebase
    const insertQuery =
      "INSERT INTO kehadiran (barcode, id_jadwal, id_detail_jadwal, id_shift,cabang, foto_masuk, jam_masuk, telat, denda_telat, is_pindah_klinik, is_lanjut_shift, is_dokter_pengganti, nama_dokter_pengganti,nama_petugas, lokasi_absen, keterangan) VALUES (?, ?, ?, ?, ?, ?, NOW(), ?, ?, ?, ?, ?, ?, ?, ?, ?)";

    connection.query(
      insertQuery,
      [
        barcode,
        id_jadwal,
        id_detail_jadwal,
        id_shift,
        cabang,
        downloadURL, // Simpan URL Firebase di database
        telat,
        denda_telat,
        is_pindah_klinik,
        is_lanjut_shift,
        is_dokter_pengganti,
        nama_dokter_pengganti,
        nama_petugas,
        lokasiAbsen,
        keterangan,
      ],
      (error, result) => {
        if (error) {
          console.error("Error executing query:", error);
          res.status(500).json({ error: "Internal Server Error" });
          return;
        }

        let isTelat = telat > 0 ? 1 : 0;
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
      }
    );
  } catch (error) {
    console.error("Error processing request:", error);
    res.status(500).json({ message: "Gagal memproses permintaan" });
  }
});

// Absen pulang
router.patch("/:id_kehadiran", async function (req, res, next) {
  const { id_kehadiran } = req.params;
  const { foto_keluar, jam_masuk, jam_keluar, isIzin, ket } = req.body;

  const sendMessageToTelegram = async (message) => {
    try {
      const botToken = "bot6823587684:AAE4Ya6Lpwbfw8QxFYec6xAqWkBYeP53MLQ";
      const chatId = "-1001812360373";
      const thread = "4294967304";
      const response = await fetch(
        `https://api.telegram.org/${botToken}/sendMessage`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            chat_id: chatId,
            text: message,
            parse_mode: "html",
            message_thread_id: thread,
          }),
        }
      );

      if (response.ok) {
        console.log("Berhasil Dikirmkan");
      } else {
        console.log("Gagal mengirim pesan");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  try {
    // Mengubah base64 menjadi buffer
    const base64Data = foto_keluar.replace(/^data:image\/\w+;base64,/, "");
    const buffer = Buffer.from(base64Data, "base64");

    // Tentukan nama file berdasarkan timestamp
    const fileName = Date.now() + ".jpg";

    // Upload ke Firebase dan dapatkan URL-nya
    const downloadURL = await uploadImageToFirebase(buffer, fileName);

    const dateTimeString = jam_masuk;
    const date = new Date(dateTimeString);

    const year = date.getFullYear();
    const month = ("0" + (date.getMonth() + 1)).slice(-2);
    const day = ("0" + date.getDate()).slice(-2);
    const hours = ("0" + date.getHours()).slice(-2);
    const minutes = ("0" + date.getMinutes()).slice(-2);
    const seconds = ("0" + date.getSeconds()).slice(-2);

    const jamMasukBaru = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    console.log("jam Baru", jamMasukBaru);

    // Simpan URL dari Firebase ke dalam database
    const updateQuery = `UPDATE kehadiran k JOIN shift s ON k.id_shift = s.id_shift 
      SET k.foto_keluar = '${downloadURL}', k.jam_keluar = NOW(), k.durasi = TIMESTAMPDIFF(MINUTE, s.jam_masuk, s.jam_pulang), 
      k.lembur = 0 , k.keterangan = '${ket}' 
      WHERE k.id_kehadiran = '${id_kehadiran}';`;

    connection.query(updateQuery, (error, result) => {
      if (error) {
        console.error("Error executing query:", error);
        return res.status(500).json({ error: "Internal Server Error" });
      }

      const selectQuery = `SELECT 
        kehadiran.id_detail_jadwal, kehadiran.jam_masuk,detail_jadwal.tanggal,
        kehadiran.barcode, kehadiran.lokasi_absen,
        pegawai.nama, pegawai.jbtn,pegawai.nik,
        kehadiran.jam_keluar, 
        kehadiran.id_shift, 
        shift.jam_pulang,
        shift.nominal,
        setting.nama_instansi 
        FROM kehadiran
        JOIN shift ON kehadiran.id_shift = shift.id_shift
        JOIN detail_jadwal ON kehadiran.id_detail_jadwal = detail_jadwal.id
        JOIN barcode ON kehadiran.barcode = barcode.barcode
        JOIN pegawai ON barcode.id = pegawai.id
        CROSS JOIN setting
        WHERE kehadiran.id_kehadiran = ${id_kehadiran};`;

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
        const [jam, menit, detik] = dateString.split(":");
        console.log(`Jam: ${jam}, Menit: ${menit}, Detik: ${detik}`);

        const id_detail_jadwal = resultSelect[0].id_detail_jadwal;
        const jam_absen_pulang = `${jam}:${menit}:${detik}`;
        const jam_pulang = resultSelect[0].jam_pulang;
        const tanggalMasuk = resultSelect[0].tanggal;
        const tanggalKeluar = getToday();

        const [jam1, menit1, detik1] = jam_absen_pulang.split(":").map(Number);
        const [jam2, menit2, detik2] = jam_pulang.split(":").map(Number);

        const totalMenit1 = jam1 * 60 + menit1 + detik1 / 60;
        const totalMenit2 = jam2 * 60 + menit2 + detik2 / 60;

        let menitPulangCepat = 0;
        const selisihMenit = Math.abs(totalMenit2 - totalMenit1);
        let dendaPulangCepat = 0;

        const nama = resultSelect[0].nama;
        const nominal = resultSelect[0].nominal;
        console.log("tanggal Masuk", tanggalMasuk);
        console.log("tanggal Keluar", tanggalKeluar);
        let isPulangCepat = 0;
        if (selisihMenit > 0) {
          isPulangCepat = 1;

          if (tanggalMasuk == tanggalKeluar) {
            const message = `${nama} pulang cepat ${selisihMenit} Menit Pada Pukul ${jam1}:${menit1} sebelum Pukul ${jam2}:${menit2} di ${resultSelect[0].lokasi_absen}.`;
            console.log("Pesan", message, "pesan");
            if (isIzin == false) {
              if (
                !resultSelect[0].nik.includes("PO") &&
                !resultSelect[0].nik.includes("AP")
              ) {
                const cekJam = isTimeGreater(
                  `${jam2}:${menit2}`,
                  `${jam1}:${menit1}`
                );
                if (cekJam == true) {
                  menitPulangCepat = selisihMenit;
                  dendaPulangCepat = DendaPulangCepat(
                    resultSelect[0],
                    selisihMenit
                  );
                  sendMessageToTelegram(message);
                }
              }
            }
          } else {
            dendaPulangCepat = 0;
            menitPulangCepat = 0;
          }
        } else {
          menitPulangCepat = 0;
          isPulangCepat = 0;
        }

        const updateQuery = `UPDATE detail_jadwal SET isPulangCepat=${isPulangCepat}, nominal=${nominal} WHERE id = ${id_detail_jadwal}`;

        connection.query(updateQuery, (error, resultUpdateIsPulangCepet) => {
          if (error) {
            console.error("Error executing query:", error);
            res.status(500).json({ error: "Internal Server Error" });
            return;
          }

          const updateHadir = `UPDATE kehadiran SET pulangCepat=${menitPulangCepat}, dendaPulangCepat=${dendaPulangCepat} WHERE id_kehadiran = ${id_kehadiran}`;

          connection.query(updateHadir, (error, resultUpdateHadir) => {
            if (error) {
              console.error("Error executing query:", error);
              res.status(500).json({ error: "Internal Server Error" });
              return;
            }
          });
        });
      });

      console.log("Record updated successfully:", result);
      res.status(200).json({ message: "Data berhasil diperbarui" });
    });
  } catch (error) {
    console.error("Error processing request:", error);
    res.status(500).json({ message: "Gagal memproses permintaan" });
  }
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

const formatTanggal = (datetime) => {
  const date = new Date(datetime);
  const day = date.getUTCDate(); // Mendapatkan tanggal (hari)
  const month = date.getUTCMonth() + 1; // Mendapatkan bulan (dimulai dari 0, jadi perlu +1)
  const year = date.getUTCFullYear(); // Mendapatkan tahun

  // Format dengan leading zero jika perlu
  const formattedDay = day < 10 ? "0" + day : day;
  const formattedMonth = month < 10 ? "0" + month : month;

  return `${year}-${formattedMonth}-${formattedDay}`;
};
const getToday = () => {
  const today = new Date();

  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0"); // Menambahkan leading zero jika bulan kurang dari 10
  const day = String(today.getDate()).padStart(2, "0"); // Menambahkan leading zero jika hari kurang dari 10

  return `${year}/${month}/${day}`;
};

// Rute untuk menambah izin dengan gambar
router.post("/add-izin/", upload.single("image"), function (req, res, next) {
  const {
    idJadwal,
    idDetailJadwal,
    idShift,
    waktuMulai,
    waktuSelesai,
    tanggal,
    durasi,
    jenisizin,
    alasan,
    barcode,
  } = req.body;
  console.log(req, "image req");
  // Mendapatkan tanggal hari ini
  const today = new Date();
  const year = today.getFullYear();
  const month = ("0" + (today.getMonth() + 1)).slice(-2); // Menambahkan 0 jika bulan kurang dari 10
  const day = ("0" + today.getDate()).slice(-2); // Menambahkan 0 jika hari kurang dari 10

  // Array nama bulan dalam bahasa Indonesia
  const monthNamesIndo = [
    "Januari",
    "Februari",
    "Maret",
    "April",
    "Mei",
    "Juni",
    "Juli",
    "Agustus",
    "September",
    "Oktober",
    "November",
    "Desember",
  ];

  // Mendapatkan nama bulan dalam bahasa Indonesia
  const monthIndo = monthNamesIndo[today.getMonth()]; // Mengambil bulan dari 0 - 11
  // Menggabungkan tanggal hari ini dengan string jam
  const datetime = `${year}-${month}-${day} ${waktuMulai}:00`;
  const datetime2 = `${year}-${month}-${day} ${waktuSelesai}:00`;
  const image = req.file ? req.file.filename : null; // Ambil nama file dari multer
  const addQuery = `
    INSERT INTO izinpegawai (idJadwal,idDetailJadwal,idShift, waktuMulai, tanggal, waktuSelesai, durasi, jenisIzin, alasan, barcode, bukti, bulan, tahun)
    VALUES (?,?,?, ?, ?, ?, ?, ?, ?, ?, ?,?,?)
  `;

  connection.query(
    addQuery,
    [
      idJadwal,
      idDetailJadwal,
      idShift,
      datetime,
      tanggal,
      datetime2,
      durasi,
      jenisizin,
      alasan,
      barcode,
      image,
      monthIndo,
      year,
    ],
    (error, result) => {
      if (error) {
        console.log("Error executing query", error);
        return res.status(500).json({ error: "Database query failed" });
      }
      console.log("Jumlah data ditambah: ", result.affectedRows);
      res.json({
        message: "Data added successfully",
        affectedRows: result.affectedRows,
      });
    }
  );
});
// isi data kehadiran (absen datang)
router.post("/absen-izin", function (req, res, next) {
  const {
    barcode,
    id_jadwal,
    id_detail_jadwal,
    id_shift,
    jam_masuk,
    jam_keluar,
    lokasiAbsen,
    ket,
    petugas,
  } = req.body;

  const insertQuery = `
    INSERT INTO kehadiran (
      barcode, id_jadwal, id_detail_jadwal, id_shift, foto_masuk, foto_keluar, 
      jam_masuk, jam_keluar, durasi, lembur, telat, denda_telat, 
      is_pindah_klinik, is_lanjut_shift, is_dokter_pengganti, nama_dokter_pengganti, lokasi_absen, keterangan, nama_petugas
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?,?, ?)
  `;

  const insertValues = [
    barcode,
    id_jadwal,
    id_detail_jadwal,
    id_shift,
    "", // foto_masuk
    "", // foto_keluar
    jam_masuk,
    jam_keluar,
    0, // durasi
    0, // lembur
    0, // telat
    0, // denda_telat
    0, // is_pindah_klinik
    0, // is_lanjut_shift
    0, // is_dokter_pengganti
    "", // nama_dokter_pengganti
    lokasiAbsen,
    ket,
    petugas,
  ];

  connection.query(insertQuery, insertValues, (error, result) => {
    if (error) {
      console.error("Error executing insert query:", error);
      res.status(500).json({ error: "Internal Server Error" });
      return;
    }

    console.log("New record created:", result);
    res.status(201).json({ message: "Data berhasil ditambahkan" });
  });
});

router.get("/izin/today", function (req, res, next) {
  // Mendapatkan tanggal hari ini dengan format YYYY-MM-DD
  const today = new Date();
  const year = today.getFullYear();
  const month = ("0" + (today.getMonth() + 1)).slice(-2); // Menambahkan 0 jika bulan kurang dari 10
  const day = ("0" + today.getDate()).slice(-2); // Menambahkan 0 jika hari kurang dari 10
  const tanggal = `${year}-${month}-${day}`;

  const stringQuery = `
    SELECT izinpegawai.idIzin, pegawai.nama, izinpegawai.barcode,izinpegawai.alasan, izinpegawai.idShift,izinpegawai.jenisIzin, shift.nama_shift, 
    izinpegawai.waktuMulai,izinpegawai.tanggal, izinpegawai.waktuSelesai, izinpegawai.bukti , izinpegawai.durasi 
    FROM izinpegawai 
    JOIN barcode ON izinpegawai.barcode = barcode.barcode 
    JOIN pegawai ON barcode.id = pegawai.id 
    JOIN shift ON izinpegawai.idShift = shift.id_shift 
    WHERE izinpegawai.tanggal='${tanggal}';
  `;

  connection.query(stringQuery, (error, result) => {
    if (error) {
      console.log("Error executing query", error);
      return res.status(500).json({ error: "Database query failed" });
    }
    console.log("OK");
    res.json(result);
  });
});

function isTimeGreater(jamA, jamB) {
  // Mengubah string waktu ke dalam bentuk Date object
  const timeA = new Date(`1970-01-01T${jamA}:00`);
  const timeB = new Date(`1970-01-01T${jamB}:00`);

  // Membandingkan apakah timeA lebih besar dari timeB
  return timeA > timeB;
}
module.exports = router;
