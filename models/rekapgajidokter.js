"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class RekapGajiDokter extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  RekapGajiDokter.init(
    {
      bulan: DataTypes.STRING,
      tahun: DataTypes.STRING,
      nama_dokter: DataTypes.STRING,
      total_data_insentif: DataTypes.INTEGER,
      total_insentif: DataTypes.INTEGER,
      total_data_nominal: DataTypes.INTEGER,
      total_nominal: DataTypes.INTEGER,
      total_garansi_fee: DataTypes.INTEGER,
      total_denda_telat: DataTypes.INTEGER,
      pajak: DataTypes.INTEGER,
      total_gaji_periode: DataTypes.INTEGER,
      gaji_akhir: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "rekap_gaji_dokter",
    }
  );
  return RekapGajiDokter;
};
