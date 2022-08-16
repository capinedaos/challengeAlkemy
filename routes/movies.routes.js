const express = require('express');

// Controllers
const {
  getAllMovies,
  getMovieByName,
  getMovieByGenre,
  getMovieByOrder,
  createMovie,
  updateMovie,
  deleteMovie,
  assignPersonageToMovie,
  getAllPersonageToMovie,
} = require('../controllers/movies.controller');

// Middlewares
const {
  createMovieValidators,
  createPersonageInMovieValidators,
} = require('../middlewares/validators.middleware');

// Utils
const { upload } = require('../utils/upload.util');

const { movieExists } = require('../middlewares/movie.middleware');

const { protectSession } = require('../middlewares/auth.middleware');

const moviesRouter = express.Router();

moviesRouter.use(protectSession);

moviesRouter.get('/assign/personageToMovie', getAllPersonageToMovie);
moviesRouter.get('/', getAllMovies);
moviesRouter.get('/:name', getMovieByName);
moviesRouter.get('/genre/:genreId', getMovieByGenre);
moviesRouter.get('/order/:order', getMovieByOrder);

moviesRouter.post(
  '/assign/assign-personage',
  createPersonageInMovieValidators,
  assignPersonageToMovie
);

moviesRouter.post(
  '/',
  upload.single('image'),
  createMovieValidators,
  createMovie
);

moviesRouter
  .use('/:id', movieExists)
  .route('/:id')
  .patch(updateMovie)
  .delete(deleteMovie);

module.exports = { moviesRouter };
