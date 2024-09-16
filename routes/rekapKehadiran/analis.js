const express = require("express");
const connection = require("../../config/database");
const poolInsentif = require("../../config/dbInsentif");

const router = express.Router();

// Ambil semua data dari tabel kehadiran
router.post("/cek", async function (req, res, next) {
  const { bulan, tahun } = req.body;

  if (!bulan || !tahun) {
    res.status(400).send("Bulan dan tahun harus disertakan.");
    return;
  }

  const stringQuery = `SELECT * FROM rekap_hadir_analis WHERE bulan = ? AND tahun = ?`;

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

  const stringQuery = `DELETE FROM rekap_hadir_analis WHERE bulan = ? AND tahun = ?`;

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

  const stringQuery = `SELECT k.*, p.nama, p.jbtn, p.nik, p.jk, dj.tanggal, jk.tanggal_awal, jk.tanggal_akhir, s.nama_shift, s.nominal, s.jam_masuk as jam_masuk_shift, s.jam_pulang as jam_pulang_shift, s.garansi_fee
  FROM kehadiran k
  JOIN detail_jadwal dj ON k.id_detail_jadwal = dj.id
  JOIN jadwal_kehadiran jk ON k.id_jadwal = jk.id
  JOIN barcode b ON k.barcode = b.barcode
  JOIN pegawai p ON b.id = p.id
  JOIN shift s ON k.id_shift = s.id_shift
WHERE LOWER(p.nik) LIKE 'anl%'

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
        const insertQuery = `INSERT INTO rekap_hadir_analis 
      (tanggal, bulan, tahun, nama_shift, jam_masuk, jam_keluar, nama_analis,nama_pengganti,nama_petugas, jbtn, nominal_shift, barcode, servicedoerid,denda_telat,denda_pulang_cepat, telat,pulang_cepat, total,total_jam,keterangan, createdAt, updatedAt)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?,?, ?, ?, ?,?,?,?,?,?, ?,?,?,?,?)`;

        const currentDate = new Date();
        const total = item.nominal - item.denda_telat;
        let totalJam = 0;
        if (item.jam_masuk_shift == item.jam_pulang_shift) {
          totalJam = 24;
        } else {
          totalJam = calculateTimeDifference(
            item.jam_masuk_shift,
            item.jam_pulang_shift
          );
        }
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
                  "Data berhasil disisipkan ke tabel rekap_hadir_analis"
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
router.post("/get-insentif", async function (req, res, next) {
  const { tanggal, barcode } = req.body;

  if (!tanggal || !barcode) {
    return res.status(400).send("Bulan dan tahun harus disertakan.");
  }

  const stringQuery = `SELECT * FROM sales WHERE salesdate = "${tanggal}"`;

  try {
    const salesResult = await new Promise((resolve, reject) => {
      poolInsentif.query(stringQuery, (error, result) => {
        if (error) {
          console.error("Error executing Sales query:", error);
          return reject(error);
        }
        resolve(result);
      });
    });

    console.log("Query Sales sukses:", salesResult);

    // Iterasi melalui setiap item dalam hasil query dan lakukan query untuk salesdetail
    const updatedSalesResult = [];

    for (let item of salesResult) {
      const getQuery = `SELECT sd.*, p.costprice, s.formula, s.description, p.name 
      FROM salesdetail sd 
      JOIN product p ON sd.productid = p.id 
      JOIN servicedoercommrules s ON p.servicedoercommrules = s.id 
      WHERE sd.salesid = "${item.salesid}" and sd.servicedoerid = "${barcode}"`;
      try {
        const salesDetailResult = await new Promise((resolve, reject) => {
          poolInsentif.query(getQuery, (error, results) => {
            if (error) {
              console.error(
                `Error executing salesdetail query for salesid "${item.salesid}":`,
                error
              );
              return reject(error);
            }
            resolve(results); // Mengembalikan hasil dari salesdetail
          });
        });
        console.log(salesDetailResult);
        // Menambahkan properti baru 'salesdetail' ke objek item
        updatedSalesResult.push({
          ...item,
          salesdetail: salesDetailResult,
        });
      } catch (error) {
        console.error("Error executing salesdetail query:", error);
        throw error; // Menghentikan eksekusi saat error terjadi
      }
    }

    // console.log(updatedSalesResult);
    res.json(updatedSalesResult);
  } catch (error) {
    console.error("Error executing main query:", error);
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
