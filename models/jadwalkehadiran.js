'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class JadwalKehadiran extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  JadwalKehadiran.init({
    idJadwal: DataTypes.STRING,
    tanggal: DataTypes.STRING,
    barcode: DataTypes.STRING,
    bulan: DataTypes.STRING,
    jumlahKehadiran: DataTypes.NUMBER
  }, {
    sequelize,
    modelName: 'JadwalKehadiran',
  });
  return JadwalKehadiran;
};