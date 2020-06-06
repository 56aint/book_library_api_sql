const { expect } = require('chai');
const request = require('supertest');
const { Genre } = require('../src/models');
const app = require('../src/app');

describe('/genres', () => {
  before(async () => {
    try {
      await Genre.sequelize.sync();
    } catch (err) {
      console.log(err);
    }
  });

  describe('with no genre records in the database', () => {
    describe('POST /genres', () => {
      it('creates a new genre in the database', async () => {
        const response = await request(app)
          .post('/genres')
          .send({
            genre: 'Romance',
          });
        const newGenreRecord = await Genre.findByPk(response.body.id, {
          raw: true,
        });

        expect(response.status).to.equal(201);
        expect(response.body.genre).to.equal('Romance');
        expect(newGenreRecord.genre).to.equal('Romance');
      });
    });
  });


  describe('with records in the database', () => {
    let genres;

    // eslint-disable-next-line no-undef
    beforeEach(async () => {
      await Genre.destroy({ where: {} });

      genres = await Promise.all([
        Genre.create({
          genre: 'Horror',
        }),
        Genre.create({ genre: 'Thriller' }),
        Genre.create({ genre: 'Crime' }),
      ]);
    });

    describe('GET /genres', () => {
      it('gets all genres records', async () => {
        const response = await request(app)
          .get('/genres');

        expect(response.status).to.equal(200);
        expect(response.body.length).to.equal(3);

        response.body.forEach((genre) => {
          const expected = genres.find((g) => g.id === genre.id);

          expect(genre.type).to.equal(expected.type);
        });
      });
    });

    describe('GET /genres/:id', () => {
      xit('gets genres record by id', async () => {
        const genre = genres[0];
        const response = await request(app)
          .get(`/genres/${genre.id}`);

        expect(response.status).to.equal(200);
        expect(response.body.genre).to.equal(genre.genre);
      });

      xit('returns a 404 if the genre does not exist', async () => {
        const response = await request(app)
          .get('/genres/12345');

        expect(response.status).to.equal(404);
        expect(response.body.error).to.equal('The genre could not be found.');
      });
    });

    describe('PATCH /genres/:id', () => {
      xit('updates genres by id', async () => {
        const genre = genres[0];
        const response = await request(app)
          .patch(`/genres/${genre.id}`)
          .send({ genre: 'Thrilling Thriller' });
        const updatedGenreRecord = await Reader.findByPk(genre.id, {
          raw: true,
        });

        expect(response.status).to.equal(200);
        expect(updatedGenreRecord.genre).to.equal('Thrilling Thriller');
      });

      xit('returns a 404 if the reader does not exist', async () => {
        const response = await request(app)
          .patch('/genre/12345')
          .send({ genre: 'new_genre' });

        expect(response.status).to.equal(404);
        expect(response.body.error).to.equal('The genre could not be found.');
      });
    });

    describe('DELETE /genres/:id', () => {
      xit('deletes genre record by id', async () => {
        const genre = genres[0];
        const response = await request(app).delete(`/readers/${genre.id}`);
        const deletedGenre = await Genre.findByPk(genre.id, { raw: true });

        expect(response.status).to.equal(204);
        expect(deletedGenre).to.equal(null);
      });

      xit('returns a 404 if the genre does not exist', async () => {
        const response = await request(app)
          .delete('/genres/12345');
        expect(response.status).to.equal(404);
        expect(response.body.error).to.equal('The genre could not be found.');
      });
    });
  });
});
