const express = require("express");
const connection = require("../config/database");

const router = express.Router();

const queryDeleteData = () => {
  const query = "DELETE FROM rekap_insentif_shift";
  return query;
};

const selectInsentifRawatJalanDr = (
  tanggal,
  kd_dokter,
  jam_masuk,
  jam_keluar
) => {
  const query = `select sum(rawat_jl_dr.biaya_rawat) as total from reg_periksa inner join rawat_jl_dr on rawat_jl_dr.no_rawat=reg_periksa.no_rawat inner join penjab on reg_periksa.kd_pj=penjab.kd_pj where reg_periksa.tgl_registrasi = '${tanggal}' and rawat_jl_dr.kd_dokter='${kd_dokter}' and reg_periksa.jam_reg BETWEEN '${jam_masuk}' and '${jam_keluar}' `;

  return query;
};

const selectInsentifRawatJalanDrPr = (
  tanggal,
  kd_dokter,
  jam_masuk,
  jam_keluar
) => {
  const query = `select sum(rawat_jl_drpr.biaya_rawat) as total from reg_periksa inner join rawat_jl_drpr on rawat_jl_drpr.no_rawat=reg_periksa.no_rawat inner join penjab on reg_periksa.kd_pj=penjab.kd_pj where reg_periksa.tgl_registrasi = '${tanggal}' and rawat_jl_drpr.kd_dokter='${kd_dokter}' and reg_periksa.jam_reg BETWEEN '${jam_masuk}' and '${jam_keluar}' `;

  return query;
};

const selectInsentifRawatInapDr = (
  tanggal,
  kd_dokter,
  jam_masuk,
  jam_keluar
) => {
  const query = `select sum(rawat_inap_dr.biaya_rawat) as total from rawat_inap_dr inner join reg_periksa on rawat_inap_dr.no_rawat=reg_periksa.no_rawat inner join penjab on reg_periksa.kd_pj=penjab.kd_pj where reg_periksa.tgl_registrasi = '${tanggal}' and rawat_inap_dr.kd_dokter='${kd_dokter}' and reg_periksa.jam_reg BETWEEN '${jam_masuk}' and '${jam_keluar}'`;

  return query;
};

const selectInsentifRawatInapDrPr = (
  tanggal,
  kd_dokter,
  jam_masuk,
  jam_keluar
) => {
  const query = `select sum(rawat_inap_drpr.biaya_rawat) as total from rawat_inap_drpr inner join reg_periksa on rawat_inap_drpr.no_rawat=reg_periksa.no_rawat inner join penjab on reg_periksa.kd_pj=penjab.kd_pj where reg_periksa.tgl_registrasi = '${tanggal}' and rawat_inap_drpr.kd_dokter='${kd_dokter}' and reg_periksa.jam_reg BETWEEN '${jam_masuk}' and '${jam_keluar}' `;

  return query;
};

const selectInsentifPeriksaLab = (
  tanggal,
  kd_dokter,
  jam_masuk,
  jam_keluar
) => {
  const query = `select sum(periksa_lab.tarif_tindakan_dokter) as total from periksa_lab inner join reg_periksa on periksa_lab.no_rawat=reg_periksa.no_rawat inner join penjab on reg_periksa.kd_pj=penjab.kd_pj where reg_periksa.tgl_registrasi = '${tanggal}' and periksa_lab.kd_dokter='${kd_dokter}' and reg_periksa.jam_reg BETWEEN '${jam_masuk}' and '${jam_keluar}'`;

  return query;
};

const selectInsentifDetailPeriksaLab = (
  tanggal,
  kd_dokter,
  jam_masuk,
  jam_keluar
) => {
  const query = `select sum(detail_periksa_lab.bagian_dokter) as total from detail_periksa_lab inner join periksa_lab on periksa_lab.no_rawat=detail_periksa_lab.no_rawat and periksa_lab.kd_jenis_prw=detail_periksa_lab.kd_jenis_prw and periksa_lab.tgl_periksa=detail_periksa_lab.tgl_periksa and periksa_lab.jam=detail_periksa_lab.jam inner join reg_periksa on periksa_lab.no_rawat=reg_periksa.no_rawat inner join penjab on reg_periksa.kd_pj=penjab.kd_pj where reg_periksa.tgl_registrasi = '${tanggal}' and periksa_lab.kd_dokter='${kd_dokter}' and reg_periksa.jam_reg BETWEEN '${jam_masuk}' and '${jam_keluar}' `;

  return query;
};

const selectInsentifTarifPeriksaLab = (
  tanggal,
  kd_dokter,
  jam_masuk,
  jam_keluar
) => {
  const query = `select sum(periksa_lab.tarif_perujuk) as total from periksa_lab inner join reg_periksa on periksa_lab.no_rawat=reg_periksa.no_rawat inner join penjab on reg_periksa.kd_pj=penjab.kd_pj where reg_periksa.tgl_registrasi = '${tanggal}' and  periksa_lab.dokter_perujuk='${kd_dokter}' and reg_periksa.jam_reg BETWEEN '${jam_masuk}' and '${jam_keluar}'`;

  return query;
};

const selectInsentifDetailTarifPeriksaLab = (
  tanggal,
  kd_dokter,
  jam_masuk,
  jam_keluar
) => {
  const query = `select sum(detail_periksa_lab.bagian_perujuk) as total from detail_periksa_lab inner join periksa_lab on periksa_lab.no_rawat=detail_periksa_lab.no_rawat and periksa_lab.kd_jenis_prw=detail_periksa_lab.kd_jenis_prw and periksa_lab.tgl_periksa=detail_periksa_lab.tgl_periksa and periksa_lab.jam=detail_periksa_lab.jam inner join reg_periksa on periksa_lab.no_rawat=reg_periksa.no_rawat inner join penjab on reg_periksa.kd_pj=penjab.kd_pj where reg_periksa.tgl_registrasi = '${tanggal}' and periksa_lab.dokter_perujuk='${kd_dokter}' and reg_periksa.jam_reg BETWEEN '${jam_masuk}' and '${jam_keluar}' `;

  return query;
};

const queryInsertData = () => {
  const query =
    "INSERT INTO `rekap_insentif_shift`(`id`, `tanggal`, `nama_shift`, `nama_dokter`, `insentif`, `nominal_shift`, `total_gaji`, `kekurangan_garansi_fee`, `createdAt`, `updatedAt`) VALUES ('[value-1]','[value-2]','[value-3]','[value-4]','[value-5]','[value-6]','[value-7]','[value-8]','[value-9]','[value-10]')";

  return query;
};

const querySelectData = (bulan, tahun) => {
  const query =
    "SELECT * FROM rekap_insentif_shift where bulan='" +
    bulan +
    "' and tahun='" +
    tahun +
    "'";
  return query;
};

const queryDelete = (bulan, tahun) => {
  const query =
    "DELETE FROM rekap_insentif_shift where bulan='" +
    bulan +
    "' and tahun='" +
    tahun +
    "'";
  return query;
};

router.get("/", function (req, res, next) {
  const { bulan, tahun } = req.query;

  const query1 = selectInsentifRawatJalanDr(bulan, tahun);
  const query2 = selectInsentifRawatJalanDrPr(bulan, tahun);
  const query3 = selectInsentifRawatInapDr(bulan, tahun);
  const query4 = selectInsentifRawatInapDrPr(bulan, tahun);
  const query5 = selectInsentifPeriksaLab(bulan, tahun);
  const query6 = selectInsentifDetailPeriksaLab(bulan, tahun);
  const query7 = selectInsentifTarifPeriksaLab(bulan, tahun);
  const query8 = selectInsentifDetailTarifPeriksaLab(bulan, tahun);

  const querySelectInsentif = [
    query1,
    query2,
    query3,
    query4,
    query5,
    query6,
    query7,
    query8,
  ];

  var totalInsentif = 0;
  var processedQueries = 0;

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

      if (results[0].total != null) {
        totalInsentif = totalInsentif + parseInt(results[0].total);
      }

      processedQueries++;

      // Jika semua query telah diproses, kirim respons
      if (processedQueries === querySelectInsentif.length) {
        res.json(totalInsentif);
      }
    });
  });
  console.log("total", totalInsentif);
});

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
    shift.garansi_fee,
    pegawai.nik,
    pegawai.nama,
    kehadiran.barcode,
    kehadiran.denda_telat,
    kehadiran.nama_dokter_pengganti,
    detail_jadwal.nominal FROM kehadiran
    JOIN detail_jadwal ON kehadiran.id_detail_jadwal = detail_jadwal.id
    JOIN shift ON kehadiran.id_shift = shift.id_shift
    JOIN barcode ON kehadiran.barcode = barcode.barcode
    JOIN pegawai ON barcode.id = pegawai.id
    WHERE DATE(kehadiran.jam_masuk) = '${tanggal}';`;

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

          const query1 = selectInsentifRawatJalanDr(
            tanggal,
            item.nik,
            jam_masuk,
            jam_keluar
          );
          const query2 = selectInsentifRawatJalanDrPr(
            tanggal,
            item.nik,
            jam_masuk,
            jam_keluar
          );
          const query3 = selectInsentifRawatInapDr(
            tanggal,
            item.nik,
            jam_masuk,
            jam_keluar
          );
          const query4 = selectInsentifRawatInapDrPr(
            tanggal,
            item.nik,
            jam_masuk,
            jam_keluar
          );
          const query5 = selectInsentifPeriksaLab(
            tanggal,
            item.nik,
            jam_masuk,
            jam_keluar
          );
          const query6 = selectInsentifDetailPeriksaLab(
            tanggal,
            item.nik,
            jam_masuk,
            jam_keluar
          );
          const query7 = selectInsentifTarifPeriksaLab(
            tanggal,
            item.nik,
            jam_masuk,
            jam_keluar
          );
          const query8 = selectInsentifDetailTarifPeriksaLab(
            tanggal,
            item.nik,
            jam_masuk,
            jam_keluar
          );

          const querySelectInsentif = [
            query1,
            query2,
            query3,
            query4,
            query5,
            query6,
            query7,
            query8,
          ];

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
                const addQuery =
                  "insert into rekap_insentif_shift (tanggal, bulan, tahun, nama_shift, nama_dokter, insentif, nominal_shift, total_gaji, kekurangan_garansi_fee, garansi_fee, barcode, denda_telat, nama_dokter_pengganti, createdAt) values ('" +
                  tanggal +
                  "','" +
                  bulan +
                  "','" +
                  tahun +
                  "','" +
                  item.nama_shift +
                  "','" +
                  item.nama +
                  "','" +
                  totalInsentif +
                  "','" +
                  item.nominal +
                  "','" +
                  komisi +
                  "','" +
                  kekurangan +
                  "','" +
                  item.garansi_fee +
                  "','" +
                  item.barcode +
                  "','" +
                  item.denda_telat +
                  "','" +
                  item.nama_dokter_pengganti +
                  "',CURDATE())";

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

router.post("/informasi/", function (req, res) {
  const namaDokter = req.params.nama_dokter;
  const tahun = req.params.tahun;
  const bulan = req.params.bulan;

  const querySearch = `SELECT nama_shift, tanggal FROM rekap_insentif_shift WHERE nama_dokter='${namaDokter}' AND tahun='${tahun}' AND bulan='${bulan}'`;

  connection.query(querySearch, (error, result) => {
    if (error) {
      console.log("Error executing query", error);
      return;
    }
    res.json(result);
  });
});

module.exports = router;
