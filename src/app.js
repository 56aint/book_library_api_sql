const express = require('express');

const readerRouter = require('./routes/reader.js');
const bookRouter = require('./routes/book.js');

const app = express();

app.use(express.json());

app.use('/readers', readerRouter);
app.use('/books', bookRouter);

module.exports = app;
