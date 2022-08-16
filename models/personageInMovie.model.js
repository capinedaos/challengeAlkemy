const { db, DataTypes } = require('../utils/database.util');
const { Movie } = require('./movie.model');
const { Personage } = require('./personage.model');

// Create our first model (table)
const PersonageInMovie = db.define('personageInMovie', {
  id: {
    primaryKey: true,
    autoIncrement: true,
    type: DataTypes.INTEGER,
    allowNull: false,
    unique: false,
  },
  movieId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Movie,
      key: 'id',
    },
  },
  personageId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Personage,
      key: 'id',
    },
  },
});

module.exports = { PersonageInMovie };
