"use strict";
const express = require("express");
const { sequelize } = require("./src/models");
const rootRouter = require("./src/routers");
const path = require("path");
const app = express();

app.use(express.json());

app.use("/public", express.static(path.join(__dirname, "public")));
app.use("/api", rootRouter);

sequelize
  .authenticate()
  .then(() => {
    console.log("Connection has established successfully");
  })
  .catch((err) => {
    console.log("Unable to connect to the database: ", err);
  });
const port = 3000;
app.listen(port, () => {
  console.log(`Connected to ${port} successfully`);
});
