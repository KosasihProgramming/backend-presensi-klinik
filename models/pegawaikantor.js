"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class PegawaiKantor extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  PegawaiKantor.init(
    {
      firstName: DataTypes.STRING,
      lastName: DataTypes.STRING,
      email: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "rekap_hadir_kantor",
    }
  );
  return PegawaiKantor;
};
