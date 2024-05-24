const express = require("express");
const connection = require("../config/database");

const router = express.Router();

const selectInsentifRawatJalanDr = (tanggalAwal, tanggalAkhir) => {
  const query = `SELECT sum(rawat_jl_dr.biaya_rawat) AS total 
  FROM reg_periksa 
  INNER JOIN rawat_jl_dr ON rawat_jl_dr.no_rawat = reg_periksa.no_rawat 
  INNER JOIN penjab ON reg_periksa.kd_pj = penjab.kd_pj 
  WHERE reg_periksa.tgl_registrasi BETWEEN '${tanggalAwal}' AND '${tanggalAkhir}';`;

  return query;
};

const selectInsentifRawatJalanDrPr = (tanggalAwal, tanggalAkhir) => {
  const query = `SELECT sum(rawat_jl_drpr.biaya_rawat) AS total 
  FROM reg_periksa 
  INNER JOIN rawat_jl_drpr ON rawat_jl_drpr.no_rawat = reg_periksa.no_rawat 
  INNER JOIN penjab ON reg_periksa.kd_pj = penjab.kd_pj 
  WHERE reg_periksa.tgl_registrasi BETWEEN '${tanggalAwal}' AND '${tanggalAkhir}';`;

  return query;
};

const selectInsentifRawatInapDr = (tanggalAwal, tanggalAkhir) => {
  const query = `SELECT SUM(rawat_inap_dr.biaya_rawat) AS total 
  FROM rawat_inap_dr 
  INNER JOIN reg_periksa ON rawat_inap_dr.no_rawat = reg_periksa.no_rawat 
  INNER JOIN penjab ON reg_periksa.kd_pj = penjab.kd_pj 
  WHERE reg_periksa.tgl_registrasi BETWEEN '${tanggalAwal}' AND '${tanggalAkhir}';`;

  return query;
};

const selectInsentifRawatInapDrPr = (tanggalAwal, tanggalAkhir) => {
  const query = `SELECT SUM(rawat_inap_drpr.biaya_rawat) AS total 
  FROM rawat_inap_drpr 
  INNER JOIN reg_periksa ON rawat_inap_drpr.no_rawat = reg_periksa.no_rawat 
  INNER JOIN penjab ON reg_periksa.kd_pj = penjab.kd_pj 
  WHERE reg_periksa.tgl_registrasi BETWEEN '${tanggalAwal}' AND '${tanggalAkhir}';`;

  return query;
};

// Rute untuk menghitung total insentif
router.post("/total-insentif", async (req, res) => {
  try {
    const { bulan, tahun } = req.body;

    const tanggalAwal = new Date(tahun, bulan - 1, 1);
    tanggalAwal.setDate(1); // Set tanggal ke 1 untuk mendapatkan awal bulan
    tanggalAwal.setDate(tanggalAwal.getDate() - 7);

    const tanggalAkhir = new Date(tahun, bulan, 0);

    console.log("tanggalAwal:", tanggalAwal.toISOString().slice(0, 10));
    console.log("tanggalAkhir:", tanggalAkhir.toISOString().slice(0, 10));

    // const query1 = selectInsentifRawatJalanDr(tanggal);
    // const query2 = selectInsentifRawatJalanDrPr(tanggal);
    // const query3 = selectInsentifRawatInapDr(tanggal);
    // const query4 = selectInsentifRawatInapDrPr(tanggal);

    // const querySelectInsentif = [query1, query2, query3, query4];

    // var totalInsentif = 0;

    // for (const query of querySelectInsentif) {
    //   const results = await runQuery(query);

    //   if (results.length > 0 && results[0].total != null) {
    //     totalInsentif += parseInt(results[0].total);
    //   }
    // }

    // console.log("total", totalInsentif);
    // res.json({ total: totalInsentif });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

const querySelectData = (bulan, tahun) => {
  const query = `SELECT * FROM rekap_shift_perawat_umum WHERE bulan='${bulan}' AND tahun='${tahun}'`;
  return query;
};

const queryDelete = (bulan, tahun) => {
  const query = `DELETE FROM rekap_shift_perawat_umum where bulan='${bulan}' AND tahun='${tahun}'`;
  return query;
};

// Route Select data
router.post("/cek/data/", function (req, res, next) {
  const { bulan, tahun } = req.body;

  const bulanAwal = bulan - 1;

  const tanggalAwal = `${tahun}-${bulanAwal}-23`;
  const tanggalAkhir = `${tahun}-${bulan}-22`;

  console.log("tanggalAwal:", tanggalAwal);
  console.log("tanggalAkhir:", tanggalAkhir);

  const addQuery = querySelectData(bulan, tahun);

  connection.query(addQuery, (error, result) => {
    if (error) {
      console.log("Error executing query", error);
      return;
    }
    res.json(result);
    console.log(addQuery, "queryselectshift");
  });
});

// Untuk Post data
router.post("/nominal", function (req, res, next) {
  const { tanggalRange, bulan, tahun } = req.body;
  tanggalRange.forEach((tgl) => {
    let tanggal = tgl.tanggal;

    const stringQuery = `SELECT 
    detail_jadwal.tanggal,
    detail_jadwal.id as id_detail_jadwal,
    shift.id_shift,
    shift.nama_shift,
    shift.jam_masuk,
    shift.jam_pulang,
    shift.nominal,
    pegawai.nik,
    pegawai.nama,
    pegawai.jbtn,
    kehadiran.barcode,
    kehadiran.denda_telat,
    detail_jadwal.nominal FROM kehadiran
    JOIN detail_jadwal ON kehadiran.id_detail_jadwal = detail_jadwal.id
    JOIN shift ON kehadiran.id_shift = shift.id_shift
    JOIN barcode ON kehadiran.barcode = barcode.barcode
    JOIN pegawai ON barcode.id = pegawai.id
    WHERE DATE(kehadiran.jam_masuk) = '${tanggal}' AND pegawai.jbtn = 'pr';`;

    connection.query(stringQuery, (error, result) => {
      if (error) {
        console.log("Error executing query", error);
        return;
      }

      if (result.length > 0) {
        console.log(stringQuery);
        console.log(result);
        const dataAwal = result;
        const data = result;
        data.forEach((item, i) => {
          const tanggal = item.tanggal;
          const jam_masuk = item.jam_masuk;
          const jam_keluar = item.jam_pulang;
          const totalInsentifArray = [];

          // dataSelect.forEach((item) => {
          console.log(item.kd_dokter);

          const query1 = queryRawatJalan(
            tanggal,
            item.nik,
            jam_masuk,
            jam_keluar
          );
          const query2 = queryRawatInap(
            tanggal,
            item.nik,
            jam_masuk,
            jam_keluar
          );
          const query3 = queryPeriksaLab(
            tanggal,
            item.nik,
            jam_masuk,
            jam_keluar
          );

          const querySelectInsentif = [query1, query2, query3];

          var totalInsentif = 0;
          var processedQueries = 0;
          let komisi = 0;
          let kekurangan = 0;
          querySelectInsentif.forEach((query, index) => {
            connection.query(query, function (error, results, fields) {
              if (error) {
                console.error("Error executing query:", error);
                return connection.rollback(function () {
                  console.error("Error rolling back transaction:", error);
                  throw error;
                });
              }

              console.log("result: ", results);
              console.log(results[0].total, "total insentif");

              if (results[0].total != null) {
                console.log("index 0", results[0].total);
                totalInsentif += parseInt(results[0].total);
              }

              processedQueries++;

              let garansi = totalInsentif + item.nominal;
              if (garansi <= item.garansi_fee) {
                kekurangan = item.garansi_fee - garansi;
                komisi = item.garansi_fee;
                if (item.denda_telat > 0) {
                  komisi = komisi - item.denda_telat;
                }
              } else {
                komisi = garansi;
                if (item.denda_telat > 0) {
                  komisi = komisi - item.denda_telat;
                }
              }

              if (processedQueries === querySelectInsentif.length) {
                totalInsentifArray.push(totalInsentif);

                // Mengecek apakah item.kode ada di dalam data.nik
                const foundIndex = dataAwal.findIndex(
                  (dataItem) =>
                    dataItem.id_detail_jadwal === item.id_detail_jadwal
                );

                // Jika item.kode ditemukan di dalam data.nik
                if (foundIndex !== -1) {
                  console.log("Adaaa");
                  // Menambahkan properti insentif ke objek yang sesuai
                  dataAwal[foundIndex].insentif = totalInsentif;
                  dataAwal[foundIndex].totalgaji = komisi;
                  dataAwal[foundIndex].kekurangan = kekurangan;
                }
                console.log(results[0]);
                console.log(totalInsentif, "total insentif Akhir");
                console.log("nominal", item.nominal);
                console.log("garansi", item.garansi_fee);
                console.log("Komisi", komisi);
                console.log(dataAwal, "Data Hasil");
                const addQuery = `INSERT INTO rekap_shift_perawat_gigi (tanggal, bulan, tahun, nama_perawat, nama_shift, nominal_shift, insentif, denda_telat, total_gaji, barcode, createdAt, updatedAt) VALUES ('${tanggal}', '${bulan}', '${tahun}', '${item.nama}', '${item.nama_shift}', '${item.nominal}', '${totalInsentif}', '${item.denda_telat}','${komisi}', '${item.barcode}', NOW(), NOW())`;

                connection.query(addQuery, (error, result) => {
                  if (error) {
                    console.log("Error executing query", error);
                    return;
                  }
                  const selectData = querySelectData(bulan, tahun);

                  connection.query(selectData, (error, resultDataSelect) => {
                    if (error) {
                      console.log("Error executing query", error);
                      return;
                    }
                    if (i == data.length - 1) {
                      console.log(resultDataSelect, "Hasil");
                      res.json(resultDataSelect);
                    }
                  });
                });
              }
            });
          });

          // });
        });
      }
    });
  });
});

// untuk hapus data
router.post("/hapus/data/", function (req, res, next) {
  const { bulan, tahun } = req.body;

  const addQuery = queryDelete(bulan, tahun);

  connection.query(addQuery, (error, result) => {
    if (error) {
      console.log("Error executing query", error);
      return;
    }
    res.json("berhasil");
  });
});

module.exports = router;
