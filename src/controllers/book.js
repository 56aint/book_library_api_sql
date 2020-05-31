// src/controllers/book.js
const { Book } = require('../models');

/* const getBooks = (_, res) => {
  Book.findAll().then((books) => {
    res.status(200).json(books);
  });
}; */

const createBook = (req, res) => {
  const newBook = req.body;

  Book
    .create(newBook)
    .then(newBookCreated => res.status(201).json(newBookCreated));
};


module.exports = {
  // getBooks,
  createBook,
};
