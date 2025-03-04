"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("shift", {
      id_shift: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      nama_shift: {
        type: Sequelize.STRING,
      },
      jam_masuk: {
        type: Sequelize.TIME,
      },
      jam_pulang: {
        type: Sequelize.TIME,
      },
      nominal: {
        type: Sequelize.DECIMAL,
      },
      garansi_fee: {
        type: Sequelize.DECIMAL,
      },
      createdAt: {
        allowNull: true,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: true,
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("shift");
  },
};
