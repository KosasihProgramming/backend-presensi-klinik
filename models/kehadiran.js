"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Kehadiran extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Kehadiran.init(
    {
      barcode: DataTypes.INTEGER,
      id_jadwal: DataTypes.INTEGER,
      id_detail_jadwal: DataTypes.INTEGER,
      id_shift: DataTypes.INTEGER,
      foto_masuk: DataTypes.STRING,
      foto_keluar: DataTypes.STRING,
      jam_masuk: DataTypes.TIME,
      jam_keluar: DataTypes.TIME,
      durasi: DataTypes.INTEGER,
      telat: DataTypes.INTEGER,
      denda_telat: DataTypes.INTEGER,
      is_pindah_klinik: DataTypes.BOOLEAN,
      is_lanjut_shift: DataTypes.BOOLEAN,
      is_dokter_pengganti: DataTypes.BOOLEAN,
      nama_dokter_pengganti: DataTypes.STRING,
      lembur: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "kehadiran",
    }
  );
  return Kehadiran;
};
