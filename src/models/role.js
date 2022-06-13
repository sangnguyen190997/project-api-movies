"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Role extends Model {
    static associate() {}
  }
  Role.init(
    {
      rolename: DataTypes.STRING,
      type: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Role",
    }
  );
  return Role;
};
