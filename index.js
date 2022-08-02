"use strict";
const express = require("express");
const { sequelize } = require("./src/models");
const rootRouter = require("./src/routers");
const path = require("path");
const swaggerUI = require("swagger-ui-express");
const swaggerJsDoc = require("swagger-jsdoc");
const app = express();

app.use(express.json());

app.use("/public", express.static(path.join(__dirname, "public")));

const options = {
  definition: {
    openapi: "3.0.3",
    info: {
      title: "My API",
      version: "1.0.0",
      description: "A simple Express Cybersoft API",
    },
    servers: [
      {
        url: "http://localhost:3000",
      },
    ],
  },
  apis: [
    "./src/routers/users/*js",
    "./src/routers/movies/*js",
    "./src/routers/users-type/*js",
  ],
};

const specs = swaggerJsDoc(options);
app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(specs));

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
