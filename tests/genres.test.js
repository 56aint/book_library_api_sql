const { expect } = require('chai');
const request = require('supertest');
const { Genre } = require('../src/models');
const app = require('../src/app');

describe('/genres', () => {
  // before(async () => Reader.sequelize.sync());
  beforeEach(async () => {
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
      it('returns a 400 if genre field is not unique', async () => {
        const response = await request(app)
          .post('/genres')
          .send({
            genre: 'Romance',
          });
        const newGenreRecord = await Genre.findByPk(response.body.id, {
          raw: true,
        });

        expect(response.status).to.equal(400);
        expect(response.body.errors.length).to.equal(1);
        expect(newGenreRecord).to.equal(null);
      });
      it('returns a 400 if genre field is an empty string', async () => {
        const response = await request(app)
          .post('/genres')
          .send({
            genre: '',
          });
        const newGenreRecord = await Genre.findByPk(response.body.id, {
          raw: true,
        });
        expect(response.status).to.equal(400);
        expect(response.body.errors.length).to.equal(1);
        expect(newGenreRecord).to.equal(null);
      });
      it('returns a 400 error if genre is empty', async () => {
        const response = await request(app)
          .post('/genres')
          .send({});
        const newGenreRecord = await Genre.findByPk(response.body.id, {
          raw: true,
        });
        expect(response.status).to.equal(400);
        expect(response.body.errors.length).to.equal(1);
        expect(newGenreRecord).to.equal(null);
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

          expect(genre.genre).to.equal(expected.genre);
          console.log(genre);
        });
      });
    });
    describe('GET /genres/:id', () => {
      it('gets genres record by id', async () => {
        const genre = genres[0];
        const response = await request(app)
          .get(`/genres/${genre.id}`);

        expect(response.status).to.equal(200);
        expect(response.body.genre).to.equal(genre.genre);
        console.log(genre.genre, ':this is the first genre created');
        // console.log(response.body.length);
      });

      it('returns a 404 if the genre does not exist', async () => {
        const response = await request(app)
          .get('/genres/12345');

        expect(response.status).to.equal(404);
        expect(response.body.error).to.equal('The genre could not be found.');
      });
    });
    describe('PATCH /genres/:id', () => {
      it('updates genres by id', async () => {
        const genre = genres[0];
        const response = await request(app)
          .patch(`/genres/${genre.id}`)
          .send({ genre: 'Thrilling Thriller' });
        const updatedGenreRecord = await Genre.findByPk(genre.id, {
          raw: true,
        });

        expect(response.status).to.equal(200);
        expect(updatedGenreRecord.genre).to.equal('Thrilling Thriller');
        // console.log(genre.genre);
      });

      it('returns a 404 if the genre does not exist', async () => {
        const response = await request(app)
          .patch('/genres/12345')
          .send({ genre: 'new_genre' });

        expect(response.status).to.equal(404);
        expect(response.body.error).to.equal('The genre could not be found.');
        console.log(response.body.error);
      });
    });
    describe('DELETE /genres/:id', () => {
      it('deletes genre record by id', async () => {
        const genre = genres[0];
        const response = await request(app)
          .delete(`/genres/${genre.id}`);
        const deletedGenre = await Genre.findByPk(genre.id, { raw: true });

        expect(response.status).to.equal(204);
        expect(deletedGenre).to.equal(null);
      });

      it('returns a 404 if the genre does not exist', async () => {
        const response = await request(app)
          .delete('/genres/12345');
        expect(response.status).to.equal(404);
        expect(response.body.error).to.equal('The genre could not be found.');
      });
    });
  });
});
