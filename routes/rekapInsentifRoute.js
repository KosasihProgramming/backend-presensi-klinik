const express = require("express");
const connection = require("../config/database");

const router = express.Router();

const queryDeleteData = () => {
  const query = "DELETE FROM rekap_insentif_shift";
  return query;
};

const selectInsentifRawatJalanDr = (bulan, tahun) => {
  const tanggalAwal = `${tahun}-${bulan}-01`;
  const tanggalAkhir = `${tahun}-${bulan}-31`;

  const query = `select sum(rawat_jl_dr.tarif_tindakandr) as total from reg_periksa inner join rawat_jl_dr on rawat_jl_dr.no_rawat=reg_periksa.no_rawat inner join penjab on reg_periksa.kd_pj=penjab.kd_pj where reg_periksa.tgl_registrasi between '${tanggalAwal}' and ${tanggalAkhir} and rawat_jl_dr.tarif_tindakandr>0`;

  return query;
};

const selectInsentifRawatJalanDrPr = (bulan, tahun) => {
  const tanggalAwal = `${tahun}-${bulan}-01`;
  const tanggalAkhir = `${tahun}-${bulan}-31`;

  const query = `select sum(rawat_jl_drpr.tarif_tindakandr) as total from reg_periksa inner join rawat_jl_drpr on rawat_jl_drpr.no_rawat=reg_periksa.no_rawat inner join penjab on reg_periksa.kd_pj=penjab.kd_pj where reg_periksa.tgl_registrasi between '${tanggalAwal}' and '${tanggalAkhir}' and rawat_jl_drpr.tarif_tindakandr>0`;

  return query;
};

const selectInsentifRawatInapDr = (bulan, tahun) => {
  const tanggalAwal = `${tahun}-${bulan}-01`;
  const tanggalAkhir = `${tahun}-${bulan}-31`;

  const query = `select sum(rawat_inap_dr.tarif_tindakandr) as total from rawat_inap_dr inner join reg_periksa on rawat_inap_dr.no_rawat=reg_periksa.no_rawat inner join penjab on reg_periksa.kd_pj=penjab.kd_pj where rawat_inap_dr.tgl_perawatan between ${tanggalAwal} and ${tanggalAkhir} and rawat_inap_dr.tarif_tindakandr>0`;

  return query;
};

const selectInsentifRawatInapDrPr = (bulan, tahun) => {
  const tanggalAwal = `${tahun}-${bulan}-01`;
  const tanggalAkhir = `${tahun}-${bulan}-31`;

  const query = `select sum(rawat_inap_drpr.tarif_tindakandr) as total from rawat_inap_drpr inner join reg_periksa on rawat_inap_drpr.no_rawat=reg_periksa.no_rawat inner join penjab on reg_periksa.kd_pj=penjab.kd_pj where rawat_inap_drpr.tgl_perawatan between '${tanggalAwal}' and '${tanggalAkhir}'  and concat(reg_periksa.kd_pj,penjab.png_jawab) like '%BPJBPJS%' and rawat_inap_drpr.tarif_tindakandr>0`;

  return query;
};

const selectInsentifPeriksaLab = (bulan, tahun) => {
  const tanggalAwal = `${tahun}-${bulan}-01`;
  const tanggalAkhir = `${tahun}-${bulan}-31`;

  const query = `select sum(periksa_lab.tarif_tindakan_dokter) as total from periksa_lab inner join reg_periksa on periksa_lab.no_rawat=reg_periksa.no_rawat inner join penjab on reg_periksa.kd_pj=penjab.kd_pj where periksa_lab.tgl_periksa between '${tanggalAwal}' and '${tanggalAkhir}' and concat(reg_periksa.kd_pj,penjab.png_jawab) like '%BPJBPJS%' and periksa_lab.tarif_tindakan_dokter>0`;

  return query;
};

const selectInsentifDetailPeriksaLab = (bulan, tahun) => {
  const tanggalAwal = `${tahun}-${bulan}-01`;
  const tanggalAkhir = `${tahun}-${bulan}-31`;

  const query = `select sum(detail_periksa_lab.bagian_dokter) as total from detail_periksa_lab inner join periksa_lab on periksa_lab.no_rawat=detail_periksa_lab.no_rawat and periksa_lab.kd_jenis_prw=detail_periksa_lab.kd_jenis_prw and periksa_lab.tgl_periksa=detail_periksa_lab.tgl_periksa and periksa_lab.jam=detail_periksa_lab.jam inner join reg_periksa on periksa_lab.no_rawat=reg_periksa.no_rawat inner join penjab on reg_periksa.kd_pj=penjab.kd_pj where detail_periksa_lab.tgl_periksa between '${tanggalAwal}' and '${tanggalAkhir}' and concat(reg_periksa.kd_pj,penjab.png_jawab) like '%BPJBPJS%' and detail_periksa_lab.bagian_dokter>0`;

  return query;
};

const selectInsentifTarifPeriksaLab = (bulan, tahun) => {
  const tanggalAwal = `${tahun}-${bulan}-01`;
  const tanggalAkhir = `${tahun}-${bulan}-31`;

  const query = `select sum(periksa_lab.tarif_perujuk) as total from periksa_lab inner join reg_periksa on periksa_lab.no_rawat=reg_periksa.no_rawat inner join penjab on reg_periksa.kd_pj=penjab.kd_pj where periksa_lab.tgl_periksa between '${tanggalAwal}' and '${tanggalAkhir}' and concat(reg_periksa.kd_pj,penjab.png_jawab) like '%BPJBPJS%' and periksa_lab.tarif_perujuk>0`;

  return query;
};

const selectInsentifDetailTarifPeriksaLab = (bulan, tahun) => {
  const tanggalAwal = `${tahun}-${bulan}-01`;
  const tanggalAkhir = `${tahun}-${bulan}-31`;

  const query = `select sum(detail_periksa_lab.bagian_perujuk) as total from detail_periksa_lab inner join periksa_lab on periksa_lab.no_rawat=detail_periksa_lab.no_rawat and periksa_lab.kd_jenis_prw=detail_periksa_lab.kd_jenis_prw and periksa_lab.tgl_periksa=detail_periksa_lab.tgl_periksa and periksa_lab.jam=detail_periksa_lab.jam inner join reg_periksa on periksa_lab.no_rawat=reg_periksa.no_rawat inner join penjab on reg_periksa.kd_pj=penjab.kd_pj where detail_periksa_lab.tgl_periksa between '${tanggalAwal}' and '${tanggalAkhir}' and concat(reg_periksa.kd_pj,penjab.png_jawab) like '%BPJBPJS%' and detail_periksa_lab.bagian_perujuk>0`;

  return query;
};

const queryInsertData = () => {
  const query =
    "INSERT INTO `rekap_insentif_shift`(`id`, `tanggal`, `nama_shift`, `nama_dokter`, `insentif`, `nominal_shift`, `total_gaji`, `kekurangan_garansi_fee`, `createdAt`, `updatedAt`) VALUES ('[value-1]','[value-2]','[value-3]','[value-4]','[value-5]','[value-6]','[value-7]','[value-8]','[value-9]','[value-10]')";

  return query;
};

const querySelectData = () => {
  const query = "SELECT * FROM rekap_insentif_shift";
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
        console.log("index 0", results[0].total);
        totalInsentif = totalInsentif + parseInt(results[0].total);
        console.log("parse int: ", parseInt(results));
      }

      processedQueries++;

      // Jika semua query telah diproses, kirim respons
      if (processedQueries === querySelectInsentif.length) {
        res.json(totalInsentif);
      }
    });
  });
});

router.post("/nominal", function (req, res, next) {
  const { tanggal } = req.body;

  const stringQuery = `SELECT 
    detail_jadwal.tanggal,
    shift.nama_shift,
    pegawai.nama,
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
    res.json(result);
    console.log(result);
  });
});

module.exports = router;
