"use strict";
const { Op } = require("sequelize");
const { User, Role, Avatar, Ticket } = require("../../models");

//create user
const createUser = async (data) => {
  try {
    const user = await User.create(data);
    return user;
  } catch (errors) {
    return null;
  }
};

//get user by email
const getUserByEmail = async (email) => {
  try {
    const user = await User.findOne({
      where: {
        email,
      },
      include: [
        {
          model: Avatar,
          as: "avatar",
          where: {
            isActive: true,
          },
        },
      ],
    });
    return user;
  } catch (errors) {
    console.log({ errors });
    return null;
  }
};

//get list user
const getUserList = async () => {
  try {
    const users = await User.findAll();
    return users;
  } catch (errors) {
    return null;
  }
};

//update user
const updateUserById = async (id, data) => {
  try {
    const user = await User.update(data, {
      where: {
        id,
      },
    });
    return user;
  } catch (errors) {
    return null;
  }
};

//check id
const checkExistUserById = async (id) => {
  try {
    const user = await User.findOne({
      where: {
        id,
      },
    });
    if (!user) {
      return false;
    }
    return true;
  } catch (error) {
    return false;
  }
};

//delete user
const deleteUserById = async (id) => {
  try {
    const user = await User.destroy({
      where: {
        id,
      },
    });
    return user;
  } catch (errors) {
    return null;
  }
};

//get user by id
const getUserById = async (id) => {
  try {
    const user = await User.findOne({
      where: {
        id,
      },
    });
    return user;
  } catch (errors) {
    return null;
  }
};

//create avatar
const createAvatar = async (userId, url) => {
  try {
    const avatar = await Avatar.create({ userId, url, isActive: true });
    return avatar;
  } catch (errors) {
    return null;
  }
};

//Create role user
const createRole = async (data) => {
  try {
    const role = await Role.create(data);

    return role;
  } catch (errors) {
    return null;
  }
};

//get role
const getListRole = async () => {
  try {
    const roles = await Role.findAll();
    return roles;
  } catch (errors) {
    return null;
  }
};

//store image
const storageAvatar = async (userId, url) => {
  try {
    const avatar = await Avatar.create({
      url,
      userId,
      isActive: true,
    });

    await Avatar.update(
      {
        isActive: false,
      },
      {
        where: {
          userId,
          id: {
            [Op.not]: avatar.id,
          },
        },
      }
    );
    return avatar;
  } catch (errors) {
    return null;
  }
};

//create ticket
const createTicket = async (movieId, userId) => {
  try {
    const ticket = Ticket.create({ movieId, userId });
    return ticket;
  } catch (errors) {
    return null;
  }
};

//get history movie
const getMovieHistoryByUser = async (userId) => {
  try {
    const data = await User.findOne({
      where: {
        userId,
      },
      include: [
        {
          model: Ticket,
          as: "tickets",
          where: {
            [Op.not]: 1,
          },
        },
      ],
    });
    console.log({ data });

    return data;
  } catch (error) {
    return null;
  }
};

//Panigation
const getPanigationPageUser = async (size, page) => {
  try {
    const users = await User.findAndCountAll({
      limit: size,
      offset: page * size,
    });
    return users;
  } catch (error) {
    return null;
  }
};
module.exports = {
  createUser,
  getUserByEmail,
  getUserList,
  updateUserById,
  checkExistUserById,
  deleteUserById,
  getUserById,
  createRole,
  getListRole,
  storageAvatar,
  createAvatar,
  createTicket,
  getMovieHistoryByUser,
  getPanigationPageUser,
};
