const express = require("express");
const userRouter = require("./users");
const userType = require("./users-type");
const movieRouter = require("./movies");

const rootRouter = express.Router();

rootRouter.use("/users", userRouter);
rootRouter.use("/users-type", userType);
rootRouter.use("/movies", movieRouter);

module.exports = rootRouter;
