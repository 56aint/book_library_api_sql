// src/models/indexjs
const Sequelize = require('sequelize');
const ReaderModel = require('./reader');
const BookModel = require('./book.js');
const GenreModel = require('./genre.js');
const AuthorModel = require('./author.js');

const {
  DB_NAME, DB_USER, DB_PASSWORD, DB_HOST, DB_PORT,
} = process.env;

const setupDatabase = () => {
  const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
    host: DB_HOST,
    port: DB_PORT,
    dialect: 'mysql',
    logging: false,
  });

  const Reader = ReaderModel(sequelize, Sequelize);

  const Book = BookModel(sequelize, Sequelize);

  const Genre = GenreModel(sequelize, Sequelize);

  const Author = AuthorModel(sequelize, Sequelize);

  Genre.hasMany(Book);
  Book.belongsTo(Genre);

  Author.hasMany(Book);
  Book.belongsTo(Author);

  sequelize.sync({ alter: true });
  return {
    Reader,
    Book,
    Genre,
    Author,
  };
};

module.exports = setupDatabase();
