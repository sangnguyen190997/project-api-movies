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
  getPanigationPageUser,
} = require("../../services/users");

const userRouter = express.Router();

/**
 * @swagger
 * tags:
 *   name: Movies Cinema
 *   description: The movies managing API
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     UserVM:
 *       type: object
 *       required:
 *          - name
 *       properties:
 *         name:
 *           type: string
 *         email:
 *           type: string
 *         password:
 *           type: string
 *         phone:
 *            type: string
 */

/**
 * @swagger
 * /api/users/sign-up:
 *   post:
 *     tags: [Users]
 *     consumes:
 *     - application/json:
 *     parameters:
 *       - in: body
 *         name: nd
 *         description: The user to create.
 *         schema:
 *             $ref: '#/components/schemas/UserVM'
 *     responses:
 *       200:
 *         content:
 *         description: Success
 *       404:
 *         description: The user was not found
 */

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

/**
 * @swagger
 * components:
 *   schemas:
 *     InfoUserVM:
 *       type: object
 *       properties:
 *         email:
 *           type: string
 *         password:
 *           type: string
 */

/**
 * @swagger
 * /api/users/sign-in:
 *   post:
 *     tags: [Users]
 *     consumes:
 *     - application/json:
 *     parameters:
 *       - in: body
 *         name: nd
 *         description: The user sign-in.
 *         schema:
 *             $ref: '#/components/schemas/InfoUserVM'
 *     responses:
 *       200:
 *         description: Successful operation
 *         schema:
 *             $ref: "#/components/schemas/InfoUserVM"
 *       404:
 *         description: The user was not found
 */

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

/**
 * @swagger
 * components:
 *   schemas:
 *     User_VM:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *         email:
 *           type: string
 *         phone:
 *            type: string
 */

/**
 * @swagger
 * /api/users/{id}:
 *   put:
 *     tags: [Users]
 *     consumes:
 *     - application/json:
 *     parameters:
 *       - in: body
 *         name: nd
 *         description: The user to create.
 *         schema:
 *             $ref: '#/components/schemas/User_VM'
 *     responses:
 *       200:
 *         content:
 *         description: Success
 *       404:
 *         description: The user was not found
 */

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

/**
 * @swagger
 * /api/users/{id}:
 *   delete:
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The user id
 *     responses:
 *       200:
 *         description: The user description by id
 *       404:
 *         description: The user was not found
 */

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

/**
 * @swagger
 * /api/users/avatar:
 *   post:
 *     summary: Upload an avatar
 *     tags: [Users]
 *     requestBody:
 *      required: true
 *      content:
 *        multipart/form-data:
 *          schema:
 *             type: object
 *             properties:
 *               image:
 *                 type: string
 *                 format: base64
 *     responses:
 *       200:
 *         description: success
 */
//upload avatar
userRouter.post("/avatar", [authenticate, uploadAvatar()], async (req, res) => {
  const user = req.user;

  const file = req.file;

  const url = `${SYSTEM.DOMAIN}/${file.path}`;

  const avatar = await storageAvatar(user.id, url);

  res.status(200).send(avatar);
});

/**
 * @swagger
 * /api/users/ticket/{movieId}:
 *   post:
 *     tags: [Users]
 *     summary: Create Ticket
 *     parameters:
 *      - in: query
 *        name: movieId
 *     responses:
 *       200:
 *         description: success
 *       404:
 *         description: The movie was not found
 */

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

/**
 * @swagger
 * /api/users/history:
 *   get:
 *     tags: [Users]
 *     parameters:
 *      - in: query
 *        name: authenticate
 *     responses:
 *       200:
 *         description: success
 *       403:
 *         description: Token is invalid
 */
//get history
userRouter.get("/history", [authenticate], async (req, res) => {
  const user = req.user;

  const data = await user.getMovies();

  if (!user) {
    return res.status(500).send("can not get data");
  }

  res.status(200).send(data);
});

/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     summary: Get the user by id
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The user id
 *     responses:
 *       200:
 *         description: The user description by id
 *       404:
 *         description: The user was not found
 */

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

/**
 * @swagger
 * /api/users:
 *   get:
 *     tags: [Users]
 *     summary: Get users paganation
 *     parameters:
 *      - in: query
 *        name: size
 *        type: integer
 *      - in: query
 *        name: page
 *        type: integer
 *     responses:
 *       200:
 *         description: Success
 *       404:
 *         description: Value is invalid
 */

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
