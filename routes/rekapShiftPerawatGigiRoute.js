const express = require("express");
const connection = require("../config/database");

const router = express.Router();

// 3 query menggambil insentif perawat
const queryRawatJalan = (tanggal, nik, jam_masuk, jam_keluar) => {
  const query = `select sum(rawat_jl_pr.biaya_rawat) as total from reg_periksa inner join rawat_jl_pr on rawat_jl_pr.no_rawat=reg_periksa.no_rawat inner join penjab on reg_periksa.kd_pj=penjab.kd_pj where reg_periksa.tgl_registrasi = '2024-04-19' and rawat_jl_pr.nip='12/09/1988/001' and reg_periksa.jam_reg BETWEEN '13:00:00' and '18:00:00'`;

  return query;
};

const queryRawatInap = (tanggal, nik, jam_masuk, jam_keluar) => {
  const query = `select sum(rawat_inap_pr.biaya_rawat) as total from rawat_inap_pr inner join reg_periksa on rawat_inap_pr.no_rawat=reg_periksa.no_rawat inner join penjab on reg_periksa.kd_pj=penjab.kd_pj where reg_periksa.tgl_registrasi = '2024-04-19' and rawat_inap_pr.nip='12/09/1988/001' and reg_periksa.jam_reg BETWEEN '13:00:00' and '18:00:00'`;

  return query;
};

const queryPeriksaLab = (tanggal, nik, jam_masuk, jam_keluar) => {
  const query = `select sum(periksa_lab.tarif_tindakan_petugas) as total from periksa_lab inner join reg_periksa on periksa_lab.no_rawat=reg_periksa.no_rawat inner join penjab on reg_periksa.kd_pj=penjab.kd_pj where reg_periksa.tgl_registrasi = '2024-04-19' and periksa_lab.nip='12/09/1988/001' and reg_periksa.jam_reg BETWEEN '13:00:00' and '18:00:00'`;

  return query;
};

router.post("/nominal", function (req, res, next) {
  const { tanggalRange, bulan, tahun } = req.body;
  tanggalRange.forEach((tgl) => {
    let tanggal = tgl.tanggal;

    const queryString = `SELECT `;
  });
});
