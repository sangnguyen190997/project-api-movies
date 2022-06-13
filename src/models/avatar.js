"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Avatar extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ User }) {
      this.belongsTo(User, {
        foreignKey: "userId",
      });
    }
  }
  Avatar.init(
    {
      url: DataTypes.STRING,
      userId: DataTypes.INTEGER,
      isActive: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: "Avatar",
    }
  );
  return Avatar;
};
