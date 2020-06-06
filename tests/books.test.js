/* eslint-disable no-console */
const { expect } = require('chai');
const request = require('supertest');
const { Book } = require('../src/models');
const { Genre } = require('../src/models');
const app = require('../src/app');

describe('/books', () => {
  before(async () => Book.sequelize.sync());

  describe('with no books records in the database', () => {
    beforeEach(async () => {
      try {
        await Book.sequelize.sync();
      } catch (err) {
        console.log(err);
      }
    });
    describe('POST /books', () => {
      it('creates a new book in the database', async () => {
        const response = await request(app)
          .post('/books')
          .send({
            title: 'Life Row',
            author: 'Wenger',
            // genre: 'footy',
            ISBN: '1000000000',
          });
        const newBookRecord = await Book.findByPk(response.body.id, {
          raw: true,
        });

        expect(response.status).to.equal(201);
        expect(response.body.title).to.equal('Life Row');
        expect(newBookRecord.title).to.equal('Life Row');
        expect(newBookRecord.author).to.equal('Wenger');
        // expect(newBookRecord.genre).to.equal('footy');
        expect(newBookRecord.ISBN).to.equal('1000000000');
      });
      xit('returns a 404 if title field is empty', async () => {
        const response = await request(app)
          .post('/books')
          .send({
            title: '',
            author: 'Wenger',
            genre: 'footy',
            ISBN: '1000000000',
          });
        const newBookRecord = await Book.findByPk(response.body.id, {
          raw: true,
        });
        expect(response.status).to.equal(404);
        expect(newBookRecord).to.equal(null);
      });
      xit('returns a 404 if author field is empty', async () => {
        const response = await request(app)
          .post('/books')
          .send({
            title: 'Life Row',
            author: '',
            genre: 'footy',
            ISBN: '1000000000',
          });
        const newBookRecord = await Book.findByPk(response.body.id, {
          raw: true,
        });
        expect(response.status).to.equal(404);
        expect(newBookRecord).to.equal(null);
      });
    });
  });

  describe('with records in the database', () => {
    let books;

    // eslint-disable-next-line no-undef
    beforeEach(async () => {
      await Book.destroy({ where: {} });

      books = await Promise.all([
        Book.create({
          title: 'Life Row',
          author: 'Wenger',
          genre: 'footy',
          ISBN: '1000000000',
        }),
        Book.create({ title: 'Death Drag', author: 'Fergy' }),
        Book.create({ title: 'Crystal', author: 'Sam' }),
        Book.create({ title: 'Spurs', author: 'Emma' }),
      ]);
    });

    describe('GET /books', () => {
      it('gets all the book records', async () => {
        const response = await request(app)
          .get('/books');

        expect(response.status).to.equal(200);
        expect(response.body.length).to.equal(4);

        response.body.forEach((book) => {
          const expected = books.find((a) => a.id === book.id);

          expect(book.title).to.equal(expected.title);
          expect(book.author).to.equal(expected.author);
          console.log(book);
        });
      });
    });

    describe('GET /books/:id', () => {
      it('gets books record by id', async () => {
        const book = books[0];
        const response = await request(app)
          .get(`/books/${book.id}`);

        expect(response.status).to.equal(200);
        expect(response.body.title).to.equal(book.title);
        expect(response.body.author).to.equal(book.author);
      });

      it('returns a 404 if the reader does not exist', async () => {
        const response = await request(app)
          .get('/books/12345');

        expect(response.status).to.equal(404);
        expect(response.body.error).to.equal('The book could not be found.');
      });
    });

    describe('PATCH /books/:id', () => {
      it('updates book author by id', async () => {
        const book = books[0];
        const response = await request(app)
          .patch(`/books/${book.id}`)
          .send({ author: 'Bale' });
        const updatedBookRecord = await Book.findByPk(book.id, {
          raw: true,
        });

        expect(response.status).to.equal(200);
        expect(updatedBookRecord.author).to.equal('Bale');
      });

      it('returns a 404 if the reader does not exist', async () => {
        const response = await request(app)
          .patch('/books/12345')
          .send({ email: 'some_new_email@gmail.com' });

        expect(response.status).to.equal(404);
        expect(response.body.error).to.equal('The book could not be found.');
      });
    });

    describe('DELETE /books/:id', () => {
      it('deletes reader record by id', async () => {
        const book = books[0];
        const response = await request(app)
          .delete(`/books/${book.id}`);
        const deletedBook = await Book.findByPk(book.id, { raw: true });

        expect(response.status).to.equal(204);
        expect(deletedBook).to.equal(null);
      });

      it('returns a 404 if the reader does not exist', async () => {
        const response = await request(app).delete('/books/12345');
        expect(response.status).to.equal(404);
        expect(response.body.error).to.equal('The book could not be found.');
      });
    });
  });
});
