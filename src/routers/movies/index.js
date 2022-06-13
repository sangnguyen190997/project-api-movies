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

//get movie by id
movieRouter.get("/:id", async (req, res) => {
  const { id } = req.params;
  const movie = await getMovieById(id);
  if (!movie) {
    res.status(404).send(`Movie id ${id} is not exist`);
  }
  res.status(200).send(movie);
});

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
