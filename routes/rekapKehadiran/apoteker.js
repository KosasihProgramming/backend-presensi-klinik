const express = require("express");
const connection = require("../../config/database");
const poolInsentif = require("../../config/dbInsentif");

const router = express.Router();

// Ambil semua data dari tabel kehadiran
router.post("/cek", async function (req, res, next) {
  const { bulan, tahun, cabang } = req.body;

  if (!bulan || !tahun) {
    res.status(400).send("Bulan dan tahun harus disertakan.");
    return;
  }

  const stringQuery = `SELECT * FROM rekap_hadir_apoteker WHERE bulan = ? AND tahun = ? AND cabang = ?`;

  try {
    const result = await new Promise((resolve, reject) => {
      connection.query(stringQuery, [bulan, tahun, cabang], (error, result) => {
        if (error) {
          reject(error);
          return;
        }
        resolve(result);
      });
    });

    console.log("Sukses");
    res.json(result);
  } catch (error) {
    console.log("Error executing query", error);
    res.status(500).send("Error executing query");
  }
});

router.post("/delete", async function (req, res, next) {
  const { bulan, tahun, cabang } = req.body;

  if (!bulan || !tahun) {
    res.status(400).send("Bulan dan tahun harus disertakan.");
    return;
  }

  const stringQuery = `DELETE FROM rekap_hadir_apoteker WHERE bulan = ? AND tahun = ? AND cabang = ?`;

  try {
    const result = await new Promise((resolve, reject) => {
      connection.query(stringQuery, [bulan, tahun, cabang], (error, result) => {
        if (error) {
          reject(error);
          return;
        }
        resolve(result);
      });
    });

    console.log("Sukses");
    res.json({ message: "Data berhasil dihapus" });
  } catch (error) {
    console.log("Error executing query", error);
    res.status(500).send("Error executing query");
  }
});

router.post("/get", async function (req, res, next) {
  const { bulan, tahun, cabang } = req.body;

  if (!bulan || !tahun) {
    res.status(400).send("Bulan dan tahun harus disertakan.");
    return;
  }

  const stringQuery = `SELECT k.*, p.nama, p.jbtn, p.nik, p.jk, dj.tanggal, jk.tanggal_awal, jk.tanggal_akhir, s.nama_shift, s.nominal, s.jam_masuk as jam_masuk_shift, s.jam_pulang as jam_pulang_shift, s.garansi_fee
  FROM kehadiran k
  JOIN detail_jadwal dj ON k.id_detail_jadwal = dj.id
  JOIN jadwal_kehadiran jk ON k.id_jadwal = jk.id
  JOIN barcode b ON k.barcode = b.barcode
  JOIN pegawai p ON b.id = p.id
  JOIN shift s ON k.id_shift = s.id_shift
WHERE LOWER(p.nik) LIKE 'ap%'

    AND jk.bulan = ?
    AND jk.tahun = ?
    AND k.cabang= ?

    AND k.foto_keluar IS NOT NULL;`;

  try {
    const result = await new Promise((resolve, reject) => {
      connection.query(stringQuery, [bulan, tahun, cabang], (error, result) => {
        if (error) {
          reject(error);
          return;
        }
        resolve(result);
      });
    });

    console.log("Sukses");

    // Iterasi melalui setiap item dalam hasil query dan lakukan operasi insert
    await Promise.all(
      result.map(async (item) => {
        const insertQuery = `INSERT INTO rekap_hadir_apoteker 
      (tanggal, bulan, tahun, nama_shift, jam_masuk, jam_keluar, nama_apoteker,nama_pengganti,nama_petugas, jbtn,cabang, nominal_shift, barcode, servicedoerid,denda_telat,denda_pulang_cepat, telat, pulang_cepat,total,total_jam,keterangan, createdAt, updatedAt)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?,?, ?, ?, ?,?,?,?,?,?, ?,?,?,?,?, ?)`;

        const currentDate = new Date();
        const total = item.nominal - item.denda_telat;
        let totalJam = 0;

        totalJam = calculateTimeDifference(item.jam_masuk, item.jam_keluar);

        const values = [
          item.tanggal,
          bulan,
          tahun,
          item.nama_shift,
          item.jam_masuk,
          item.jam_keluar,
          item.nama,
          item.nama_dokter_pengganti,
          item.nama_petugas,
          item.jbtn,
          item.cabang,
          item.nominal,
          item.barcode,
          item.nik,
          item.denda_telat,
          item.dendaPulangCepat,
          item.telat,
          item.pulangCepat,
          total,
          totalJam,
          item.keterangan,
          currentDate,
          currentDate,
        ];

        try {
          await new Promise((resolve, reject) => {
            connection.query(insertQuery, values, (error, results) => {
              if (error) {
                reject(error);
              } else {
                console.log(
                  "Data berhasil disisipkan ke tabel rekap_hadir_apoteker"
                );
                resolve();
              }
            });
          });
        } catch (error) {
          console.log("Error executing insert query", error);
        }
      })
    );

    res.json(result);
  } catch (error) {
    console.log("Error executing query", error);
    res.status(500).send("Error executing query");
  }
});


function calculateTimeDifference(startTime, endTime) {
  // Parsing the time strings into Date objects
  const [startHours, startMinutes, startSeconds] = startTime
    .split(":")
    .map(Number);
  const [endHours, endMinutes, endSeconds] = endTime.split(":").map(Number);

  // Convert start and end times to total seconds
  const startTotalSeconds =
    startHours * 3600 + startMinutes * 60 + startSeconds;
  const endTotalSeconds = endHours * 3600 + endMinutes * 60 + endSeconds;

  // Calculate the difference in seconds
  let differenceInSeconds = endTotalSeconds - startTotalSeconds;

  // Handle case where end time is on the next day (past midnight)
  if (differenceInSeconds < 0) {
    differenceInSeconds += 24 * 3600; // Add 24 hours worth of seconds
  }

  // Convert the difference to hours (with decimal part)
  const differenceInHours = differenceInSeconds / 3600;

  return differenceInHours;
}
module.exports = router;
