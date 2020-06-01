// src/routes/book.js
const express = require('express');

const router = express.Router();
const bookController = require('../controllers/book.js');

router
  .route('/')
  .get(bookController.getBooks)
  .post(bookController.createBook);

router
  .route('/:id')
  .get(bookController.getBookById)
  .patch(bookController.updateBookById)
  .delete(bookController.deleteBookById);

module.exports = router;
