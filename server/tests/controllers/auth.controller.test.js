const app = require('../../app');
const request = require('supertest');

describe('auth.controller', () => {
  describe('POST /auth/login', () => {
    test('should return 200 and a token', (done) => {
      request(app)
        .post('/auth/login')
        .send({
          email: 'admin@admin.fr',
          password: 'Password1234.',
        })
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('accessToken');
          expect(res.body).toHaveProperty('refreshToken');
          expect(res.body).toHaveProperty('user');
        })
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          done();
        });
    });
  });
});
