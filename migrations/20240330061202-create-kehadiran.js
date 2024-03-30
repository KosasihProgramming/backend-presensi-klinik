"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("kehadiran", {
      id_kehadiran: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      barcode: {
        type: Sequelize.INTEGER,
      },
      id_jadwal: {
        type: Sequelize.INTEGER,
      },
      id_detail_jadwal: {
        type: Sequelize.INTEGER,
      },
      id_shift: {
        type: Sequelize.INTEGER,
      },
      foto_masuk: {
        type: Sequelize.STRING,
      },
      foto_keluar: {
        type: Sequelize.STRING,
      },
      jam_masuk: {
        type: Sequelize.TIME,
      },
      jam_keluar: {
        type: Sequelize.TIME,
      },
      durasi: {
        type: Sequelize.INTEGER,
      },
      telat: {
        type: Sequelize.INTEGER,
      },
      denda_telat: {
        type: Sequelize.INTEGER,
      },
      is_pindah_klinik: {
        type: Sequelize.BOOLEAN,
      },
      lembur: {
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
    await queryInterface.dropTable("kehadiran");
  },
};
