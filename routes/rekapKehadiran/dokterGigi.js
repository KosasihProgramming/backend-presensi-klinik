const express = require("express");
const connection = require("../../config/database");

const router = express.Router();

// Ambil semua data dari tabel kehadiran
router.post("/cek", async function (req, res, next) {
  const { bulan, tahun } = req.body;

  if (!bulan || !tahun) {
    res.status(400).send("Bulan dan tahun harus disertakan.");
    return;
  }

  const stringQuery = `SELECT * FROM rekap_hadir_dokter_gigi WHERE bulan = ? AND tahun = ?`;

  try {
    const result = await new Promise((resolve, reject) => {
      connection.query(stringQuery, [bulan, tahun], (error, result) => {
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
  const { bulan, tahun } = req.body;

  if (!bulan || !tahun) {
    res.status(400).send("Bulan dan tahun harus disertakan.");
    return;
  }

  const stringQuery = `DELETE FROM rekap_hadir_dokter_gigi WHERE bulan = ? AND tahun = ?`;

  try {
    const result = await new Promise((resolve, reject) => {
      connection.query(stringQuery, [bulan, tahun], (error, result) => {
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
  const { bulan, tahun } = req.body;

  if (!bulan || !tahun) {
    res.status(400).send("Bulan dan tahun harus disertakan.");
    return;
  }

  const stringQuery = `SELECT k.*, p.nama, p.jbtn, p.jk, dj.tanggal, jk.tanggal_awal, jk.tanggal_akhir, s.nama_shift, s.nominal, s.garansi_fee
  FROM kehadiran k
  JOIN detail_jadwal dj ON k.id_detail_jadwal = dj.id
  JOIN jadwal_kehadiran jk ON k.id_jadwal = jk.id
  JOIN barcode b ON k.barcode = b.barcode
  JOIN pegawai p ON b.id = p.id
  JOIN shift s ON k.id_shift = s.id_shift
  WHERE p.jbtn = 'drg'
    AND jk.bulan = ?
    AND jk.tahun = ?
    AND k.foto_keluar IS NOT NULL;`;

  try {
    const result = await new Promise((resolve, reject) => {
      connection.query(stringQuery, [bulan, tahun], (error, result) => {
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
        const insertQuery = `INSERT INTO rekap_hadir_dokter_gigi 
  (tanggal, bulan, tahun, nama_shift, nama_dokter, jbtn, nominal_shift, garansi_fee, barcode, denda_telat, nama_dokter_pengganti, telat, nominal, total, kekurangan_garansi_fee, createdAt, updatedAt)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

        const currentDate = new Date();
        const values = [
          item.tanggal,
          bulan,
          tahun,
          item.nama_shift,
          item.nama,
          item.jbtn,
          item.nominal,
          item.garansi_fee,
          item.barcode,
          item.denda_telat,
          item.nama_dokter_pengganti,
          item.telat,
          item.nominal,
          (total = item.nominal - item.denda_telat),
          (kekurangan_garansi_fee = item.garansi_fee - total),
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
                  "Data berhasil disisipkan ke tabel rekap_hadir_dokter_gigi"
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

module.exports = router;
