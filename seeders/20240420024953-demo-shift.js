"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert("shift", [
      {
        nama_shift: "Shift Dokter Pagi",
        jam_masuk: "08:00:00",
        jam_pulang: "15:00:00",
        nominal: 50000,
        garansi_fee: 150000,
      },
      {
        nama_shift: "Shift Dokter Siang",
        jam_masuk: "15:00:00",
        jam_pulang: "22:00:00",
        nominal: 50000,
        garansi_fee: 150000,
      },
      {
        nama_shift: "Shift Dokter Gigi Pagi",
        jam_masuk: "08:00:00",
        jam_pulang: "15:00:00",
        nominal: 50000,
        garansi_fee: 150000,
      },
      {
        nama_shift: "Shift Dokter Gigi Siang",
        jam_masuk: "15:00:00",
        jam_pulang: "22:00:00",
        nominal: 50000,
        garansi_fee: 150000,
      },
      {
        nama_shift: "Shift Perawat Pagi",
        jam_masuk: "08:00:00",
        jam_pulang: "15:00:00",
        nominal: 50000,
        garansi_fee: 0,
      },
      {
        nama_shift: "Shift Perawat Siang",
        jam_masuk: "15:00:00",
        jam_pulang: "22:00:00",
        nominal: 50000,
        garansi_fee: 0,
      },
      {
        nama_shift: "Shift Perawat Gigi Pagi",
        jam_masuk: "08:00:00",
        jam_pulang: "15:00:00",
        nominal: 50000,
        garansi_fee: 0,
      },
      {
        nama_shift: "Shift Perawat Gigi Siang",
        jam_masuk: "15:00:00",
        jam_pulang: "22:00:00",
        nominal: 50000,
        garansi_fee: 0,
      },
      {
        nama_shift: "Shift Perawat Umum Pagi",
        jam_masuk: "08:00:00",
        jam_pulang: "15:00:00",
        nominal: 50000,
        garansi_fee: 0,
      },
      {
        nama_shift: "Shift Perawat Umum Siang",
        jam_masuk: "15:00:00",
        jam_pulang: "22:00:00",
        nominal: 50000,
        garansi_fee: 0,
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete("shift", null, {});
  },
};
