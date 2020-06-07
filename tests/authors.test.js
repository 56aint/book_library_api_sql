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
        console.log(newAuthorRecord);
        expect(newAuthorRecord.name).to.equal('David Baldacci');
      });
      /* xit('returns a 400 if author field is not unique', async () => {
        const response = await request(app)
          .post('/authors')
          .send({
            name: 'David Baldacci',
          });
        const newAuthorRecord = await Author.findByPk(response.body.id, {
          raw: true,
        });

        expect(response.status).to.equal(400);
        expect(response.body.errors.length).to.equal(1);
        expect(newAuthorRecord).to.equal(null);
      }); */
      it('returns a 400 if author field is an empty string', async () => {
        const response = await request(app)
          .post('/authors')
          .send({
            name: '',
          });
        const newAuthorRecord = await Author.findByPk(response.body.id, {
          raw: true,
        });
        expect(response.status).to.equal(400);
        expect(response.body.errors.length).to.equal(1);
        expect(newAuthorRecord).to.equal(null);
      });
      it('returns a 400 error if author is empty', async () => {
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
          name: 'Carter Brown',
        }),
        Author.create({ name: 'James Patterson' }),
        Author.create({ name: 'John Grisham' }),
      ]);
    });

    describe('GET /authors', () => {
      it('gets all authors records', async () => {
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
      it('gets authors record by id', async () => {
        const author = authors[0];
        const response = await request(app)
          .get(`/authors/${author.id}`);

        expect(response.status).to.equal(200);
        expect(response.body.name).to.equal(author.name);
        console.log(author.name, ':this is the first author created');
      });

      it('returns a 404 if the author does not exist', async () => {
        const response = await request(app)
          .get('/authors/12345');

        expect(response.status).to.equal(404);
        expect(response.body.error).to.equal('The author could not be found.');
      });
    });
    describe('PATCH /authors/:id', () => {
      it('updates authors by id', async () => {
        const author = authors[0];
        const response = await request(app)
          .patch(`/authors/${author.id}`)
          .send({
            name: 'Peter James',
          });
        const updatedAuthorRecord = await Author.findByPk(author.id, {
          raw: true,
        });

        expect(response.status).to.equal(200);
        expect(updatedAuthorRecord.name).to.equal('Peter James');
      });

      it('returns a 404 if the author does not exist', async () => {
        const response = await request(app)
          .patch('/authors/12345')
          .send({
            author: 'new_author',
          });

        expect(response.status).to.equal(404);
        expect(response.body.error).to.equal('The author could not be found.');
        console.log(response.body.error);
      });
    });
    describe('DELETE /autors/:id', () => {
      it('deletes author record by id', async () => {
        const author = authors[0];
        const response = await request(app)
          .delete(`/authors/${author.id}`);
        const deletedAuthor = await Author.findByPk(author.id, { raw: true });

        expect(response.status).to.equal(204);
        expect(deletedAuthor).to.equal(null);
      });

      it('returns a 404 if the author does not exist', async () => {
        const response = await request(app)
          .delete('/authors/12345');
        expect(response.status).to.equal(404);
        expect(response.body.error).to.equal('The author could not be found.');
      });
    });
  });
});
