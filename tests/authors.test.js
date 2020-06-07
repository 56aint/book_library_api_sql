const { expect } = require('chai');
const request = require('supertest');
const { Author } = require('../src/models');
const app = require('../src/app');

describe('/authors', () => {
  // before(async () => Author.sequelize.sync());
  before(async () => {
    try {
      await Author.sequelize.sync();
    } catch (err) {
      console.log(err);
    }
  });


  describe('with no authors records in the database', () => {
    describe('POST /authors', () => {
      it('creates a new author in the database', async () => {
        const response = await request(app)
          .post('/authors')
          .send({
            name: 'David Baldacci',
          });
        const newAuthorRecord = await Author.findByPk(response.body.id, {
          raw: true,
        });
        expect(response.status).to.equal(201);
        expect(response.body.name).to.equal('David Baldacci');
        expect(newAuthorRecord.name).to.equal('David Baldacci');
      });
      xit('returns a 400 if genre field is not unique', async () => {
        const response = await request(app)
          .post('/authors')
          .send({
            author: 'Romance',
          });
        const newAuthorRecord = await Author.findByPk(response.body.id, {
          raw: true,
        });

        expect(response.status).to.equal(400);
        expect(response.body.errors.length).to.equal(1);
        expect(newAuthorRecord).to.equal(null);
      });
      xit('returns a 400 if author field is an empty string', async () => {
        const response = await request(app)
          .post('/authors')
          .send({
            author: '',
          });
        const newAuthorRecord = await Author.findByPk(response.body.id, {
          raw: true,
        });
        expect(response.status).to.equal(400);
        expect(response.body.errors.length).to.equal(1);
        expect(newAuthorRecord).to.equal(null);
      });
      xit('returns a 400 error if author is empty', async () => {
        const response = await request(app)
          .post('/authors')
          .send({});
        const newAuthorRecord = await Author.findByPk(response.body.id, {
          raw: true,
        });
        expect(response.status).to.equal(400);
        expect(response.body.errors.length).to.equal(1);
        expect(newAuthorRecord).to.equal(null);
      });
    });
  });
  describe('with author records in the database', () => {
    let authors;
    // eslint-disable-next-line no-undef
    beforeEach(async () => {
      await Author.destroy({ where: {} });

      authors = await Promise.all([
        Author.create({
          genre: 'Horror',
        }),
        Author.create({ author: 'Thriller' }),
        Author.create({ author: 'Crime' }),
      ]);
    });

    describe('GET /authors', () => {
      xit('gets all authors records', async () => {
        const response = await request(app)
          .get('/authors');

        expect(response.status).to.equal(200);
        expect(response.body.length).to.equal(3);

        response.body.forEach((author) => {
          const expected = authors.find((a) => a.id === author.id);

          expect(author.name).to.equal(expected.name);
          console.log(author);
        });
      });
    });
    describe('GET /authors/:id', () => {
      xit('gets authors record by id', async () => {
        const author = authors[0];
        const response = await request(app)
          .get(`/authors/${author.id}`);

        expect(response.status).to.equal(200);
        expect(response.body.name).to.equal(author.name);
        console.log(author.name, ':this is the first author created');
        // console.log(response.body.length);
      });

      xit('returns a 404 if the author does not exist', async () => {
        const response = await request(app)
          .get('/authors/12345');

        expect(response.status).to.equal(404);
        expect(response.body.error).to.equal('The genre could not be found.');
      });
    });
    describe('PATCH /authors/:id', () => {
      xit('updates authors by id', async () => {
        const author = authors[0];
        const response = await request(app)
          .patch(`/genres/${author.id}`)
          .send({ author: 'Thrilling Thriller' });
        const updatedAuthorRecord = await Author.findByPk(author.id, {
          raw: true,
        });

        expect(response.status).to.equal(200);
        expect(updatedAuthorRecord.name).to.equal('Thrilling Thriller');
        // console.log(genre.genre);
      });

      xit('returns a 404 if the author does not exist', async () => {
        const response = await request(app)
          .patch('/authors/12345')
          .send({ author: 'new_author' });

        expect(response.status).to.equal(404);
        expect(response.body.error).to.equal('The genre could not be found.');
        console.log(response.body.error);
      });
    });
    describe('DELETE /autors/:id', () => {
      xit('deletes author record by id', async () => {
        const author = authors[0];
        const response = await request(app)
          .delete(`/authors/${author.id}`);
        const deletedAuthor = await Author.findByPk(author.id, { raw: true });

        expect(response.status).to.equal(204);
        expect(deletedAuthor).to.equal(null);
      });

      xit('returns a 404 if the author does not exist', async () => {
        const response = await request(app)
          .delete('/authors/12345');
        expect(response.status).to.equal(404);
        expect(response.body.error).to.equal('The genre could not be found.');
      });
    });
  });
});
