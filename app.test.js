const request = require('supertest');
const app     = require('./app');

describe('GET /', () => {
  it('should return 200 with message', async () => {
    const res = await request(app).get('/');
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toContain('Hello');
  });
});

describe('GET /health', () => {
  it('health check should return UP', async () => {
    const res = await request(app).get('/health');
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('UP');
  });
});
