"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    toJSON() {
      const attributes = Object.assign({}, this.get());

      delete attributes.password;
      return attributes;
    }
    static associate({ Avatar, Movie, Ticket }) {
      this.hasOne(Avatar, {
        foreignKey: "userId",
        as: "avatar",
      });
      this.hasMany(Avatar, {
        foreignKey: "userId",
        as: "avatars",
      });
      this.belongsToMany(Movie, {
        through: Ticket,
        as: "movies",
        foreignKey: "userId",
      });
    }
  }
  User.init(
    {
      name: DataTypes.STRING,
      phone: DataTypes.STRING,
      email: DataTypes.STRING,
      password: DataTypes.STRING,
      role: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "User",
    }
  );
  return User;
};
