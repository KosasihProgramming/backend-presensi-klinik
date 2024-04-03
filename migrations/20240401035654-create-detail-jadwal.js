"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("detail_jadwal", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      id_jadwal: {
        type: Sequelize.STRING,
      },
      id_detail_jadwal: {
        type: Sequelize.STRING,
      },
      id_shift: {
        type: Sequelize.STRING,
      },
      tanggal: {
        type: Sequelize.DATE,
      },
      isHadir: {
        type: Sequelize.BOOLEAN,
      },
      isTelat: {
        type: Sequelize.BOOLEAN,
      },
      isPulangCepat: {
        type: Sequelize.BOOLEAN,
      },
      nominal: {
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
    await queryInterface.dropTable("detail_jadwal");
  },
};
