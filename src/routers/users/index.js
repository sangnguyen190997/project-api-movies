"use strict";
const express = require("express");
const { SYSTEM } = require("../../config");
const { authenticate } = require("../../middlewares/auth");
const { uploadAvatar } = require("../../middlewares/upload");
const {
  scriptPassword,
  comparePassword,
  genToken,
} = require("../../services/auth");
const {
  createUser,
  getUserByEmail,
  getUserList,
  checkExistUserById,
  getUserById,
  updateUserById,
  deleteUserById,
  storageAvatar,
  createAvatar,
  createTicket,
  getMovieHistoryByUser,
  getPanigationPageUser,
} = require("../../services/users");

const { getAllMovies } = require("../../services/movies");

const userRouter = express.Router();

//sign-up
userRouter.post("/sign-up", async (req, res) => {
  const { name, email, phone, password } = req.body;

  const passwordHashed = scriptPassword(password);
  const data = await createUser({
    name,
    email,
    phone,
    password: passwordHashed,
    role: "USER",
  });

  const url =
    "../../../public/images/avatar/283661626_7501286793246303_5271896000938689709_n.jpg";

  const avatar = await createAvatar(data.id, url);

  if (!data) {
    return res.status(500).send("Can't create user");
  }

  res.status(200).send({ data, avatar });
});

//sign-in
userRouter.post("/sign-in", async (req, res) => {
  const { email, password } = req.body;

  //check valid data input
  const user = await getUserByEmail(email);

  //check email is exist
  if (!user) {
    return res.status(400).send(`email: ${email} is not exist`);
  }

  //check password is match
  const isSuccess = comparePassword(password, user.password);

  if (!isSuccess) {
    return res.status(400).send(`password is not match`);
  }

  const token = genToken({ id: user.id });
  return res.status(200).send({ user, token });
});

//update user
userRouter.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { name, email, phone } = req.body;

  const isExistUser = await checkExistUserById(id);
  if (!isExistUser) {
    return res.status(404).send(`user id ${id} is not exist`);
  }

  if (!name || !name.trim()) {
    return res.status(400).send("name is required");
  }

  const data = {
    name,
    email,
    phone,
  };
  await updateUserById(id, data);
  res.status(200).send(data);
});

//delete user
userRouter.delete("/:id", async (req, res) => {
  const { id } = req.params;

  const isExistUser = await checkExistUserById(id);
  if (!isExistUser) {
    return res.status(404).send(`user id ${id} is not exist`);
  }

  const user = await deleteUserById(id);
  if (!user) {
    return res.status(400).send(`Can't delete user ${id}`);
  }
  res.status(200).send(`user id ${id} deleted`);
});

//upload avatar
userRouter.post("/avatar", [authenticate, uploadAvatar()], async (req, res) => {
  const user = req.user;

  const file = req.file;

  const url = `${SYSTEM.DOMAIN}/${file.path}`;

  const avatar = await storageAvatar(user.id, url);

  res.status(200).send(avatar);
});

//create ticket
userRouter.post("/ticket/:movieId", [authenticate], async (req, res) => {
  const { movieId } = req.params;
  const user = req.user;

  const ticket = await createTicket(movieId, user.id);

  if (!ticket) {
    return res.status(500).send(`Can't order movie ${movieId}`);
  }

  res.status(200).send(ticket);
});

//get history
userRouter.get("/history", [authenticate], async (req, res) => {
  const user = req.user;

  const data = await user.getMovies();

  if (!user) {
    return res.status(500).send("can not get data");
  }

  res.status(200).send(data);
});

//get detail user
userRouter.get("/:id", async (req, res) => {
  const { id } = req.params;
  const isExistUser = await checkExistUserById(id);
  if (!isExistUser) {
    return res.status(404).send(`user id ${id} is not exist`);
  }

  const user = await getUserById(id);
  res.status(200).send({ user });
});

//get panigation user
userRouter.get("/", async (req, res) => {
  const page = Number.parseInt(req.query.page);
  const size = Number.parseInt(req.query.size);

  if (page && size) {
    const users = await getPanigationPageUser(size, page);

    if (!users) {
      res.status(500).send("Can't get panigation");
    }

    res.status(200).send({
      totalPages: Math.ceil(users.count / size),
      content: users.rows,
    });
  } else {
    const data = await getUserList();
    if (!data) {
      return res.status(400).send("Data is not exist");
    }
    res.status(200).send({ data });
  }
});

module.exports = userRouter;
