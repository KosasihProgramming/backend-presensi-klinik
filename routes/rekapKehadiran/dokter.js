const express = require("express");
const connection = require("../../config/database");
// const poolInsentif = require("../../config/dbInsentif");
const router = express.Router();
const {
  poolRajabasa,
  poolBugis,
  poolGading,
  poolGtsKemiling,
  poolGtsTirtayasa,
  poolKemiling,
  poolPalapa,
  poolPanjang,
  poolTeluk,
  poolTirtayasa,
  poolTugu,
  poolUrip,
} = require("../../config/allDatabase");
// Ambil semua data dari tabel kehadiran
router.post("/cek", async function (req, res, next) {
  const { bulan, tahun, cabang } = req.body;

  if (!bulan || !tahun) {
    res.status(400).send("Bulan dan tahun harus disertakan.");
    return;
  }

  const stringQuery = `SELECT * FROM rekap_hadir_dokter WHERE bulan = ? AND tahun = ? AND cabang= ?`;

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
    console.log("/cek", req.body);
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

  const stringQuery = `DELETE FROM rekap_hadir_dokter WHERE bulan = ? AND tahun = ? AND cabang=?`;

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

  console.log("/get", req.body);
  if (!bulan || !tahun) {
    res.status(400).send("Bulan dan tahun harus disertakan.");
    return;
  }

  const stringQuery = `SELECT k.*, p.nama, p.jbtn, p.nik, p.jk, dj.tanggal, jk.tanggal_awal, jk.tanggal_akhir, s.nama_shift, s.jam_pulang, s.nominal, s.garansi_fee
FROM kehadiran k
JOIN detail_jadwal dj ON k.id_detail_jadwal = dj.id
JOIN jadwal_kehadiran jk ON k.id_jadwal = jk.id
JOIN barcode b ON k.barcode = b.barcode
JOIN pegawai p ON b.id = p.id
JOIN shift s ON k.id_shift = s.id_shift
WHERE LOWER(p.jbtn) LIKE 'dokte%'
  AND jk.bulan = ?
    AND k.cabang= ?
  AND jk.tahun = ?
  AND k.foto_keluar IS NOT NULL;
`;

  try {
    const result = await new Promise((resolve, reject) => {
      connection.query(stringQuery, [bulan, cabang, tahun], (error, result) => {
        if (error) {
          reject(error);
          return;
        }
        console.log(result);
        resolve(result);
      });
    });

    console.log("kehadiran", result);

    // Iterasi melalui setiap item dalam hasil query dan lakukan operasi insert
    await Promise.all(
      result.map(async (item) => {
        const insertQuery = `INSERT INTO rekap_hadir_dokter 
  (tanggal, bulan, tahun, nama_shift, nama_dokter, jbtn,cabang, nominal_shift,jam_masuk,jam_pulang, garansi_fee, barcode,salesmanid, denda_telat, denda_pulang_cepat, nama_dokter_pengganti, nama_petugas,telat,pulang_cepat, nominal, total, kekurangan_garansi_fee,keterangan, createdAt, updatedAt)
  VALUES (?, ?, ?, ?, ?, ?, ?,?, ?, ?, ?, ?, ?, ?, ?,?, ?, ?, ?,?,?,?,?,?,?)`;

        const currentDate = new Date();
        const values = [
          item.tanggal,
          bulan,
          tahun,
          item.nama_shift,
          item.nama,
          item.jbtn,
          item.cabang,
          item.nominal,
          item.jam_masuk,
          item.jam_keluar,
          item.garansi_fee,
          item.barcode,
          item.nik,
          item.denda_telat,
          item.dendaPulangCepat,
          item.nama_dokter_pengganti,
          item.nama_petugas,
          item.telat,
          item.pulangCepat,
          item.nominal,
          (total = item.nominal - item.denda_telat),
          (kekurangan_garansi_fee = item.garansi_fee - total),
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
                  "Data berhasil disisipkan ke tabel rekap_hadir_dokter"
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
  const { tanggal, barcode, cabang } = req.body;

  if (!tanggal || !barcode) {
    return res.status(400).send("Bulan dan tahun harus disertakan.");
  }

  const stringQuery = `SELECT * FROM sales WHERE salesdate = "${tanggal}" AND salesmanid="${barcode}"`;
  const poolInsentif = getPoolByCabang(cabang);
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
      JOIN salesmancommrules s ON p.salesmancommrules = s.id 
      WHERE sd.salesid = "${item.salesid}"`;
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

const getPoolByCabang = (cabang) => {
  switch (cabang) {
    case "Rajabasa":
      return poolRajabasa;
    case "Amanah":
      return poolBugis;
    case "Gading":
      return poolGading;
    case "GTSKemiling":
      return poolGtsKemiling;
    case "GTSTirtayasa":
      return poolGtsTirtayasa;
    case "Kemiling":
      return poolKemiling;
    case "Palapa":
      return poolPalapa;
    case "Panjang":
      return poolPanjang;
    case "Teluk":
      return poolTeluk;
    case "Tirtayasa":
      return poolTirtayasa;
    case "Tugu":
      return poolTugu;
    case "Urip":
      return poolUrip;
    default:
      throw new Error("Cabang tidak valid atau tidak dikenali.");
  }
};
module.exports = router;
