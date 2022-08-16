const { ref, uploadBytes, getDownloadURL } = require('firebase/storage');

// Models
const { Movie } = require('../models/movie.model');
const { Personage } = require('../models/personage.model');
const { Genre } = require('../models/genre.model');
const { PersonageInMovie } = require('../models/personageInMovie.model');

// Utils
const { catchAsync } = require('../utils/catchAsync.util');
const { AppError } = require('../utils/appError.util');
const { storage } = require('../utils/firebase.util');

const getAllMovies = catchAsync(async (req, res, next) => {
  const movies = await Movie.findAll({
    attributes: ['image', 'title', 'creationDate'],
  });

  res.status(201).json({
    status: 'success',
    movies,
  });
});

const getMovieByName = catchAsync(async (req, res, next) => {
  const { name } = req.query;

  const movieByName = await Movie.findOne({
    where: { title: name },
    attributes: ['id', 'image', 'title', 'creationDate', 'score', 'genreId'],
    include: [
      {
        model: Personage,
        required: false,
        attributes: ['id', 'image', 'name', 'age', 'weight', 'history'],
      },
    ],
    include: [
      {
        model: Genre,
        required: false,
        attributes: ['id', 'name', 'image'],
      },
    ],
  });

  if (!movieByName) {
    return next(new AppError('movie not found', 404));
  }

  res.status(201).json({
    status: 'success',
    movieByName,
  });
});

const getMovieByGenre = catchAsync(async (req, res, next) => {
  const { genreId } = req.params;

  const genre = await Genre.findOne({
    where: { id: genreId },
  });

  if (!genre) {
    return next(new AppError('genre not found', 404));
  }

  const moviesByGenre = await Movie.findAll({
    where: { genreId },
    attributes: ['id', 'image', 'title', 'creationDate', 'score', 'genreId'],
    include: [
      {
        model: Personage,
        required: false,
        attributes: ['id', 'image', 'name', 'age', 'weight', 'history'],
      },
    ],
    include: [
      {
        model: Genre,
        required: false,
        attributes: ['id', 'name', 'image'],
      },
    ],
  });

  res.status(201).json({
    status: 'success',
    moviesByGenre,
  });
});

const getMovieByOrder = catchAsync(async (req, res, next) => {
  const { order } = req.query;

  const movies = await Movie.findAll({
    attributes: ['id', 'title', 'image', 'score', 'genreId', 'creationDate'],
  });

  if (order === 'asc') {
    movies.sort((a, b) => {
      if (new Date(a.creationDate) < new Date(b.creationDate)) {
        return -1;
      }
    });
    res.status(201).json({
      status: 'success',
      movies,
    });
  } else if (order === 'desc') {
    movies.sort((a, b) => {
      if (new Date(a.creationDate) > new Date(b.creationDate)) {
        return -1;
      }
    });

    res.status(201).json({
      status: 'success',
      movies,
    });
  } else {
    return next(new AppError('Order not defined', 404));
  }
});

const createMovie = catchAsync(async (req, res, next) => {
  const { title, creationDate, score, genreId } = req.body;
  const { file } = req;

  const genre = await Genre.findOne({
    where: { id: genreId },
  });

  if (!genre) {
    return next(new AppError('genre not found', 404));
  }

  if (score <= 0 || score > 5) {
    return next(new AppError('score must be between 0 and 5', 404));
  }

  const imgRef = ref(storage, `movies/${Date.now()}_${file.originalname}`);
  const imgRes = await uploadBytes(imgRef, file.buffer);

  const newMovie = await Movie.create({
    image: imgRes.metadata.fullPath,
    title,
    creationDate,
    score,
    genreId,
  });

  res.status(201).json({
    status: 'success',
    newMovie,
  });
});

const updateMovie = catchAsync(async (req, res, next) => {
  const { movie } = req;
  const { title, creationDate, score, genreId } = req.body;

  await movie.update({
    title,
    creationDate,
    score,
    genreId,
  });

  res.status(201).json({ status: 'success', movie });
});

const deleteMovie = catchAsync(async (req, res, next) => {
  const { movie } = req;
  await movie.destroy();
  res.status(201).json({ status: 'success', movie });
});

const assignPersonageToMovie = catchAsync(async (req, res, next) => {
  const { personageId, movieId } = req.body;

  const personage = await Personage.findOne({
    where: { id: personageId },
  });

  const movie = await Movie.findOne({
    where: { id: movieId },
  });

  if (!personage || !movie) {
    return next(new AppError('personage or movie not found', 404));
  }

  const personageInMovie = await PersonageInMovie.create({
    movieId,
    personageId,
  });

  res.status(201).json({
    status: 'success',
    personageInMovie,
  });
});

const getAllPersonageToMovie = catchAsync(async (req, res, next) => {
  const PersonageToMovie = await PersonageInMovie.findAll({});

  res.status(201).json({
    status: 'success',
    PersonageToMovie,
  });
});

module.exports = {
  getAllMovies,
  getMovieByName,
  getMovieByGenre,
  getMovieByOrder,
  createMovie,
  updateMovie,
  deleteMovie,
  assignPersonageToMovie,
  getAllPersonageToMovie,
};
