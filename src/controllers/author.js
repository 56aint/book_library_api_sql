// src/controllers/author.js
const {
  getAllItems,
  createItem,
  updateItem,
  getItemById,
  deleteItem,
} = require('./helpers');

const getAuthors = (_, res) => getAllItems(res, 'genre');

const createAuthor = (req, res) => createItem(res, 'genre', req.body);

const getAuthorById = (req, res) => getItemById(res, 'genre', req.params.id);

const updateAuthor = (req, res) => updateItem(res, 'genre', req.body, req.params.id);


const deleteAuthor = (req, res) => deleteItem(res, 'genre', req.params.id);

module.exports = {
  getAuthors,
  createAuthor,
  getAuthorById,
  updateAuthor,
  deleteAuthor,
};
