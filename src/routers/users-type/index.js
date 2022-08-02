"use strict";
const express = require("express");
const { createRole, getListRole } = require("../../services/users");
const typeRouter = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     UserType:
 *       type: object
 *       properties:
 *         rolename:
 *           type: string
 *         type:
 *           type: string
 */

/**
 * @swagger
 * /api/users-type:
 *   post:
 *     tags: [Users-Type]
 *     summary: Create user type
 *     consumes:
 *     - application/json:
 *     parameters:
 *       - in: body
 *         name: nd
 *         description: The user type to create.
 *         schema:
 *             $ref: '#/components/schemas/UserType'
 *     responses:
 *       200:
 *         content:
 *         description: Success
 *       404:
 *         description: The user type was not create
 */

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

/**
 * @swagger
 * /api/users-type:
 *   get:
 *     summary: Get all user type
 *     tags: [Users-Type]
 *     description: The user id
 *     responses:
 *       200:
 *         description: Success
 *       404:
 *         description: The user was not found
 */

//Get All Role
typeRouter.get("/", async (req, res) => {
  const roles = await getListRole();

  if (!roles) {
    return res.status(400).send("Roles is not exist");
  }
  res.status(200).send(roles);
});

module.exports = typeRouter;
