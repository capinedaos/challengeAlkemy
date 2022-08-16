// Models
const { Genre } = require('./genre.model');
const { Movie } = require('./movie.model');
const { Personage } = require('./personage.model');
const { PersonageInMovie } = require('./personageInMovie.model');

const initModels = () => {
  // 1 Gender --> M Movie
  Genre.hasMany(Movie, { foreignKey: 'genreId' });
  Movie.belongsTo(Genre);

  // M Personage <----> M Movie
  Personage.belongsToMany(Movie, {
    through: PersonageInMovie,
  });

  // M Movie <----> M Personage
  Movie.belongsToMany(Personage, {
    through: PersonageInMovie,
  });
};

module.exports = { initModels };
