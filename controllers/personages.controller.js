const { ref, uploadBytes, getDownloadURL } = require('firebase/storage');
// Models
const { Personage } = require('../models/personage.model');
const { Movie } = require('../models/movie.model');
// Utils
const { catchAsync } = require('../utils/catchAsync.util');
const { AppError } = require('../utils/appError.util');
const { storage } = require('../utils/firebase.util');

const getAllPersonages = catchAsync(async (req, res, next) => {
  const personages = await Personage.findAll({
    attributes: ['image', 'name'],
  });

  res.status(201).json({
    status: 'success',
    personages,
  });
});

const getPersonageByName = catchAsync(async (req, res, next) => {
  const { name } = req.query;

  const personageByName = await Personage.findOne({
    where: { name: name },
    attributes: ['id', 'image', 'name', 'age', 'weight', 'history'],
    include: [
      {
        model: Movie,
        required: false,
        attributes: [
          'id',
          'image',
          'title',
          'creationDate',
          'score',
          'genreId',
        ],
      },
    ],
  });

  if (!personageByName) {
    return next(new AppError('personage not found', 404));
  }

  res.status(201).json({
    status: 'success',
    personageByName,
  });
});

const getPersonageByAge = catchAsync(async (req, res, next) => {
  const { age } = req.query;

  const personageByAge = await Personage.findAll({
    where: { age: age },
    attributes: ['id', 'image', 'name', 'age', 'weight', 'history'],
    include: [
      {
        model: Movie,
        required: false,
        attributes: [
          'id',
          'image',
          'title',
          'creationDate',
          'score',
          'genreId',
        ],
      },
    ],
  });

  if (personageByAge.length < 1) {
    return next(new AppError('personages not found', 404));
  }

  res.status(201).json({
    status: 'success',
    personageByAge,
  });
});

const getPersonageByMovie = catchAsync(async (req, res, next) => {
  const { name } = req.query;

  const movieByName = await Movie.findOne({
    where: { title: name },
    include: [
      {
        model: Personage,
        required: false,
      },
    ],
  });

  if (movieByName === null) {
    return next(new AppError('movie not found', 404));
  }

  const personages = [];

  movieByName.personages.map((personage) => {
    personages.push(personage.name);
  });

  if (personages.length < 1) {
    return next(new AppError('movie without characters', 404));
  }

  res.status(201).json({
    status: 'success',
    personages,
  });
});

const createPersonage = catchAsync(async (req, res, next) => {
  const { name, age, weight, history } = req.body;
  const { file } = req;

  const imgRef = ref(storage, `personages/${Date.now()}_${file.originalname}`);
  const imgRes = await uploadBytes(imgRef, file.buffer);

  const newPersonage = await Personage.create({
    image: imgRes.metadata.fullPath,
    name,
    age,
    weight,
    history,
  });

  res.status(201).json({
    status: 'success',
    newPersonage,
  });
});

const updatePersonage = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const { name, age, weight, history } = req.body;

  const personage = await Personage.findOne({
    where: { id },
  });

  if (!personage) {
    return next(new AppError('personage not found', 404));
  }

  await personage.update({
    name,
    age,
    weight,
    history,
  });

  res.status(201).json({ status: 'success', personage });
});

const deletePersonage = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const personage = await Personage.findOne({
    where: { id },
  });

  if (!personage) {
    return next(new AppError('personage not found', 404));
  }

  await personage.destroy();
  res.status(201).json({ status: 'success', personage });
});

module.exports = {
  getAllPersonages,
  getPersonageByName,
  getPersonageByAge,
  getPersonageByMovie,
  createPersonage,
  updatePersonage,
  deletePersonage,
};
