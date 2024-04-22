"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("rekap_gaji_perawat_gigi", {
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
      nama_perawat: {
        type: Sequelize.STRING,
      },
      total_data_nominal: {
        type: Sequelize.INTEGER,
      },
      total_nominal: {
        type: Sequelize.INTEGER,
      },
      total_insentif: {
        type: Sequelize.INTEGER,
      },
      total_denda_telat: {
        type: Sequelize.INTEGER,
      },
      total_data_gaji_akhir: {
        type: Sequelize.INTEGER,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("rekap_gaji_perawat_gigi");
  },
};
