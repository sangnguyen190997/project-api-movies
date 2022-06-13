"use strict";
const express = require("express");
const { createRole, getListRole } = require("../../services/users");
const typeRouter = express.Router();

//Create Role
typeRouter.post("/", async (req, res) => {
  const { rolename, type } = req.body;

  const data = await createRole({
    rolename,
    type,
  });

  if (!data) {
    return res.status(500).send("Can't create role");
  }

  res.status(200).send(data);
});

//Get All Role
typeRouter.get("/", async (req, res) => {
  const roles = await getListRole();

  if (!roles) {
    return res.status(400).send("Roles is not exist");
  }
  res.status(200).send(roles);
});

module.exports = typeRouter;
