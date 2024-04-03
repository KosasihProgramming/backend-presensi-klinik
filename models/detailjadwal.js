"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class DetailJadwal extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  DetailJadwal.init(
    {
      id_jadwal: DataTypes.STRING,
      id_detail_jadwal: DataTypes.STRING,
      id_shift: DataTypes.STRING,
      tanggal: DataTypes.DATE,
      isHadir: DataTypes.INTEGER,
      isTelat: DataTypes.INTEGER,
      isPulangCepat: DataTypes.INTEGER,
      nominal: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "DetailJadwal",
      tableName: "detail_jadwal",
    }
  );
  return DetailJadwal;
};
