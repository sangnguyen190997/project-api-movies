"use strict";
const express = require("express");
const { authenticate, checkRole } = require("../../middlewares/auth");
const {
  getAllMovies,
  createMovie,
  getMovieById,
  checkExistMovieById,
  updateMovieById,
  deleteMovieById,
  getPanigationPageMovie,
} = require("../../services/movies");
const movieRouter = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Movie_VM:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *         trailer:
 *           type: string
 *         poster:
 *            type: string
 *         description:
 *            type: string
 *         startTime:
 *            type: string
 *         evaluate:
 *            type: integer
 */

/**
 * @swagger
 * /api/movies:
 *   post:
 *     tags: [Movies]
 *     summary: Create movie
 *     consumes:
 *     - application/json:
 *     parameters:
 *       - in: body
 *         name: nd
 *         description: The movie to create.
 *         schema:
 *             $ref: '#/components/schemas/Movie_VM'
 *     responses:
 *       200:
 *         content:
 *         description: Success
 *       404:
 *         description: The user was not found
 */

//create movie
movieRouter.post("/", async (req, res) => {
  const { name, trailer, poster, description, startTime, evaluate } = req.body;

  if (!name || !name.trim()) {
    res.status(400).send("name is required");
  }

  const movie = await createMovie({
    name,
    trailer,
    poster,
    description,
    startTime,
    evaluate,
  });

  if (!movie) {
    res.status(500).send("can't create movie");
  }
  res.status(200).send(movie);
});

/**
 * @swagger
 * /api/movies/{id}:
 *   get:
 *     summary: Get the movie by id
 *     tags: [Movies]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The movie id
 *     responses:
 *       200:
 *         description: The movie description by id
 *       404:
 *         description: The movie was not found
 */

//get movie by id
movieRouter.get("/:id", async (req, res) => {
  const { id } = req.params;
  const movie = await getMovieById(id);
  if (!movie) {
    res.status(404).send(`Movie id ${id} is not exist`);
  }
  res.status(200).send(movie);
});

/**
 * @swagger
 * /api/movies/{id}:
 *   put:
 *     tags: [Movies]
 *     summary: Update movie
 *     consumes:
 *     - application/json:
 *     parameters:
 *       - in: body
 *         name: nd
 *         description: The user to create.
 *         schema:
 *             $ref: '#/components/schemas/Movie_VM'
 *     responses:
 *       200:
 *         content:
 *         description: Success
 *       404:
 *         description: The user was not found
 */

//update movie
movieRouter.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { name, trailer, poster, description, startTime, evaluate } = req.body;

  if (!name || !name.trim()) {
    res.status(400).send("name is required");
  }

  const isExistMovie = await checkExistMovieById(id);

  if (!isExistMovie) {
    return res.status(404).send(`Movie id ${id} is not exist`);
  }

  const data = { name, trailer, poster, description, startTime, evaluate };
  await updateMovieById(id, data);

  res.status(200).send(data);
});

/**
 * @swagger
 * /api/movies/{id}:
 *   delete:
 *     tags: [Movies]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The movie id
 *     responses:
 *       200:
 *         description: The movie description by id
 *       404:
 *         description: The movie was not found
 */

//delete movie
movieRouter.delete(
  "/:id",
  [authenticate, checkRole("ADMIN")],
  async (req, res) => {
    const { id } = req.params;

    const isExistMovie = await checkExistMovieById(id);
    if (!isExistMovie) {
      return res.status(404).send(`Movie id ${id} is not exist`);
    }

    const item = await deleteMovieById(id);

    if (!item) {
      return res.status(500).send(`can't delete movie id ${id}`);
    }
    res.status(200).send(`movie id ${id} deleted`);
  }
);

/**
 * @swagger
 * /api/movies:
 *   get:
 *     tags: [Movies]
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

//paganation movie
movieRouter.get("/", async (req, res) => {
  const page = Number.parseInt(req.query.page);
  const size = Number.parseInt(req.query.size);

  if (page && size) {
    const movies = await getPanigationPageMovie(size, page);

    if (!movies) {
      res.status(500).send("Can't get panigation");
    }

    res.status(200).send({
      totalPages: Math.ceil(movies.count / size),
      content: movies.rows,
    });
  } else {
    const movies = await getAllMovies();
    if (!movies) {
      res.status(500).send("Can't get movie list");
    }
    res.status(200).send(movies);
  }
});

module.exports = movieRouter;
