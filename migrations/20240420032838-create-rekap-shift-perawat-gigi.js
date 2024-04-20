"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("rekap_shift_perawat_gigi", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      tanggal: {
        type: Sequelize.STRING,
      },
      nama_perawat: {
        type: Sequelize.STRING,
      },
      nama_shift: {
        type: Sequelize.STRING,
      },
      nominal_shift: {
        type: Sequelize.INTEGER,
      },
      insentif: {
        type: Sequelize.INTEGER,
      },
      denda_telat: {
        type: Sequelize.INTEGER,
      },
      total_gaji: {
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
    await queryInterface.dropTable("rekap_shift_perawat_gigi");
  },
};
