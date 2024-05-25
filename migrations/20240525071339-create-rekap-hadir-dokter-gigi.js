"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("rekap_hadir_dokter_gigi", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      tanggal: {
        type: Sequelize.STRING,
      },
      bulan: {
        type: Sequelize.STRING,
      },
      tahun: {
        type: Sequelize.STRING,
      },
      nama_shift: {
        type: Sequelize.STRING,
      },
      nama_dokter: {
        type: Sequelize.STRING,
      },
      jbtn: {
        type: Sequelize.STRING,
      },
      nominal_shift: {
        type: Sequelize.INTEGER,
      },
      garansi_fee: {
        type: Sequelize.INTEGER,
      },
      barcode: {
        type: Sequelize.STRING,
      },
      denda_telat: {
        type: Sequelize.INTEGER,
      },
      nama_dokter_pengganti: {
        type: Sequelize.STRING,
      },
      telat: {
        type: Sequelize.INTEGER,
      },
      nominal: {
        type: Sequelize.INTEGER,
      },
      total: {
        type: Sequelize.INTEGER,
      },
      kekurangan_garansi_fee: {
        type: Sequelize.INTEGER,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: true,
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("rekap_hadir_dokter_gigi");
  },
};
