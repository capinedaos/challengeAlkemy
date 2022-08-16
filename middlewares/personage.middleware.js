// Models
const { Personage } = require('../models/personage.model');

// Utils
const { AppError } = require('../utils/appError.util');
const { catchAsync } = require('../utils/catchAsync.util');

const personageExists = catchAsync(async (req, res, next) => {
  const { id, name, age } = req.params;

  const personage = await Personage.findAll({
    where: { id: id || name || age },
  });

  if (!personage) {
    return next(new AppError('personage not found', 404));
  }

  req.personage = personage;
  next();
});

module.exports = { personageExists };
