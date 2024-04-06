"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class RekapInsentifShift extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  RekapInsentifShift.init(
    {
      tanggal: DataTypes.STRING,
      nama_shift: DataTypes.STRING,
      nama_dokter: DataTypes.STRING,
      insentif: DataTypes.INTEGER,
      nominal_shift: DataTypes.INTEGER,
      total_gaji: DataTypes.INTEGER,
      kekurangan_garansi_fee: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "rekap_insentif_shift",
    }
  );
  return RekapInsentifShift;
};
