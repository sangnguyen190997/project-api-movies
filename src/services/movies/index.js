"use strict";
const { Movie } = require("../../models");

//get all movies
const getAllMovies = async () => {
  try {
    const movies = await Movie.findAll();
    return movies;
  } catch (errors) {
    return null;
  }
};

//create movie
const createMovie = async (data) => {
  try {
    const newMovie = await Movie.create(data);
    return newMovie;
  } catch (errors) {
    return null;
  }
};

//get movie id
const getMovieById = async (id) => {
  try {
    const movie = await Movie.findOne({
      where: {
        id,
      },
    });
    return movie;
  } catch (errors) {
    return null;
  }
};

//update movie
const updateMovieById = async (id, data) => {
  try {
    const movie = await Movie.update(data, {
      where: {
        id,
      },
    });
    return movie;
  } catch (errors) {
    return null;
  }
};

//check movie exist
const checkExistMovieById = async (id) => {
  try {
    const movie = await Movie.findOne({
      where: {
        id,
      },
    });
    if (!movie) {
      return false;
    }
    return true;
  } catch (error) {
    return false;
  }
};

//delete movie
const deleteMovieById = async (id) => {
  try {
    const movie = await Movie.destroy({
      where: {
        id,
      },
    });
    return movie;
  } catch (errors) {
    return null;
  }
};

//Panigation
const getPanigationPageMovie = async (size, page) => {
  try {
    const movies = await Movie.findAndCountAll({
      limit: size,
      offset: page * size,
    });
    return movies;
  } catch (error) {
    return null;
  }
};
module.exports = {
  getAllMovies,
  createMovie,
  getMovieById,
  updateMovieById,
  checkExistMovieById,
  deleteMovieById,
  getPanigationPageMovie,
};
