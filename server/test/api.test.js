import assert from 'assert';
import http from 'http';
import app from '../src/app.js';

describe('Server Basic API Tests', () => {
  let server;
  const PORT = 5001;

  before((done) => {
    server = app.listen(PORT, () => {
      console.log(`Test server running on port ${PORT}`);
      done();
    });
  });

  after((done) => {
    server.close(done);
  });

  it('GET /api/auth/me should return 401 Unauthorized without token', (done) => {
    http.get(`http://localhost:${PORT}/api/auth/me`, (res) => {
      assert.strictEqual(res.statusCode, 401);
      done();
    });
  });
});
