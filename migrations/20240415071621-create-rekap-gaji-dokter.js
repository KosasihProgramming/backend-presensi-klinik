"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("rekap_gaji_dokter", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      bulan: {
        type: Sequelize.STRING,
      },
      tahun: {
        type: Sequelize.STRING,
      },
      barcode: {
        type: Sequelize.STRING,
      },
      nama_dokter: {
        type: Sequelize.STRING,
      },
      nama_dokter_pengganti: {
        type: Sequelize.STRING,
        defaultValue: null,
      },
      total_data_insentif: {
        type: Sequelize.INTEGER,
      },
      total_insentif: {
        type: Sequelize.INTEGER,
      },
      total_data_nominal: {
        type: Sequelize.INTEGER,
      },
      total_nominal: {
        type: Sequelize.INTEGER,
      },
      total_garansi_fee: {
        type: Sequelize.INTEGER,
      },
      total_denda_telat: {
        type: Sequelize.INTEGER,
      },
      pajak: {
        type: Sequelize.INTEGER,
      },
      total_gaji_periode: {
        type: Sequelize.INTEGER,
      },
      gaji_akhir: {
        type: Sequelize.INTEGER,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("rekap_gaji_dokter");
  },
};
