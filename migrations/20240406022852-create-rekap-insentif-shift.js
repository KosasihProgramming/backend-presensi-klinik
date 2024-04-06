"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("rekap_insentif_shift", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      tanggal: {
        type: Sequelize.STRING,
      },
      nama_shift: {
        type: Sequelize.STRING,
      },
      nama_dokter: {
        type: Sequelize.STRING,
      },
      insentif: {
        type: Sequelize.INTEGER,
      },
      nominal_shift: {
        type: Sequelize.INTEGER,
      },
      total_gaji: {
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
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("rekap_insentif_shift");
  },
};
