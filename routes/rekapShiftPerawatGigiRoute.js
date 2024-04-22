const express = require("express");
const connection = require("../config/database");

const router = express.Router();

// 3 query menggambil insentif perawat
const queryRawatJalan = (tanggal, nik, jam_masuk, jam_keluar) => {
  const query = `select sum(rawat_jl_pr.biaya_rawat) as total from reg_periksa inner join rawat_jl_pr on rawat_jl_pr.no_rawat=reg_periksa.no_rawat inner join penjab on reg_periksa.kd_pj=penjab.kd_pj where reg_periksa.tgl_registrasi = '${tanggal}' and rawat_jl_pr.nip='${nik}' and reg_periksa.jam_reg BETWEEN '${jam_masuk}' and '${jam_keluar}'`;

  return query;
};

const queryRawatInap = (tanggal, nik, jam_masuk, jam_keluar) => {
  const query = `select sum(rawat_inap_pr.biaya_rawat) as total from rawat_inap_pr inner join reg_periksa on rawat_inap_pr.no_rawat=reg_periksa.no_rawat inner join penjab on reg_periksa.kd_pj=penjab.kd_pj where reg_periksa.tgl_registrasi = '${tanggal}' and rawat_inap_pr.nip='${nik}' and reg_periksa.jam_reg BETWEEN '${jam_masuk}' and '${jam_keluar}'`;

  return query;
};

const queryPeriksaLab = (tanggal, nik, jam_masuk, jam_keluar) => {
  const query = `select sum(periksa_lab.tarif_tindakan_petugas) as total from periksa_lab inner join reg_periksa on periksa_lab.no_rawat=reg_periksa.no_rawat inner join penjab on reg_periksa.kd_pj=penjab.kd_pj where reg_periksa.tgl_registrasi = '${tanggal}' and periksa_lab.nip='${nik}' and reg_periksa.jam_reg BETWEEN '${jam_masuk}' and '${jam_keluar}'`;

  return query;
};

const querySelectData = (bulan, tahun) => {
  const query = `SELECT * FROM rekap_shift_perawat_gigi WHERE bulan='${bulan}' AND tahun='${tahun}'`;
  return query;
};

const queryDelete = (bulan, tahun) => {
  const query = `DELETE FROM rekap_shift_perawat_gigi where bulan='${bulan}' AND tahun='${tahun}'`;
  return query;
};

// Route Select data
router.post("/cek/data/", function (req, res, next) {
  const { bulan, tahun } = req.body;

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
    WHERE DATE(kehadiran.jam_masuk) = '${tanggal}' AND pegawai.jbtn = 'prg';`;

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
