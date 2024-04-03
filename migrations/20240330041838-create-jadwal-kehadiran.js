"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("jadwal_kehadiran", {
      // Use singular "kehadiran"
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      tanggal_awal: {
        // Consider using Sequelize.DATE if storing full dates
        type: Sequelize.DATE, // Or Sequelize.DATE depending on your needs
      },
      tanggal_akhir: {
        // Consider using Sequelize.DATE if storing full dates
        type: Sequelize.DATE, // Or Sequelize.DATE depending on your needs
      },
      bulan: {
        // Consider Sequelize.INTEGER for month numbers (1-12)
        type: Sequelize.STRING, // Or Sequelize.INTEGER depending on your needs
      },
      tahun: {
        // Consider Sequelize.INTEGER for month numbers (1-12)
        type: Sequelize.STRING, // Or Sequelize.INTEGER depending on your needs
      },
      jumlah_kehadiran: {
        // Use INTEGER or FLOAT based on precision required
        type: Sequelize.INTEGER, // Or Sequelize.FLOAT
      },
      jumlah_shift: {
        // Use INTEGER or FLOAT based on precision required
        type: Sequelize.INTEGER, // Or Sequelize.FLOAT
      },
      barcode: {
        // Use INTEGER or FLOAT based on precision required
        type: Sequelize.STRING, // Or Sequelize.FLOAT
      },
      createdAt: {
        allowNull: false, // Consider making createdAt non-nullable for data integrity
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false, // Consider making updatedAt non-nullable for data integrity
        type: Sequelize.DATE,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("jadwal_kehadiran");
  },
};
