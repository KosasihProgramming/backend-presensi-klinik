"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class shift extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  shift.init(
    {
      nama_shift: DataTypes.STRING,
      jam_masuk: DataTypes.TIME,
      jam_pulang: DataTypes.TIME,
      nominal: DataTypes.DECIMAL,
    },
    {
      sequelize,
      modelName: "shift",
    }
  );
  return shift;
};
