const express = require('express');

// Controllers
const {
  getAllPersonages,
  getPersonageByName,
  getPersonageByAge,
  getPersonageByMovie,
  createPersonage,
  updatePersonage,
  deletePersonage,
} = require('../controllers/personages.controller');

// Middlewares
const {
  createPersonageValidators,
} = require('../middlewares/validators.middleware');

// Utils
const { upload } = require('../utils/upload.util');

const { protectSession } = require('../middlewares/auth.middleware');

const personagesRouter = express.Router();

personagesRouter.use(protectSession);

personagesRouter.get('/', getAllPersonages);

personagesRouter.get('/name/:name', getPersonageByName);
personagesRouter.get('/age/:age', getPersonageByAge);
personagesRouter.get('/movies/:name', getPersonageByMovie);

personagesRouter.post(
  '/',
  upload.single('image'),
  createPersonageValidators,
  createPersonage
);

personagesRouter
  // .use('/:id')
  .route('/:id')
  .patch(updatePersonage)
  .delete(deletePersonage);

module.exports = { personagesRouter };
