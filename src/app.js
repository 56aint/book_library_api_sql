const express = require('express');

const readerRouter = require('./routes/reader.js');
const bookRouter = require('./routes/book.js');
const genreRouter = require('./routes/genre.js');
// const authorRouter = require('./routes/author.js');

const app = express();

app.use(express.json());

app.use('/readers', readerRouter);
app.use('/books', bookRouter);
app.use('/genres', genreRouter);
// app.use('/authors', authorRouter);

module.exports = app;
