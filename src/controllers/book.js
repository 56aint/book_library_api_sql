const {
  getAllItems,
  createItem,
  updateItem,
  getItemById,
  deleteItem,
} = require('./helpers');

const getBook = (_, res) => getAllItems(res, 'book');

const createBook = (req, res) => createItem(res, 'book', req.body);

const getBookById = (req, res) => getItemById(res, 'book', req.params.id);

const updateBookById = (req, res) => updateItem(res, 'book', req.body, req.params.id);

const deleteBookById = (req, res) => deleteItem(res, 'book', req.params.id);

module.exports = {
  getBook,
  createBook,
  getBookById,
  updateBookById,
  deleteBookById,
};
