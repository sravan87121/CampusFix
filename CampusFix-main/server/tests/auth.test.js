const request = require('supertest');
const app = require('../src/app');
const { createUser } = require('./helpers');

describe('Auth', () => {
  it('registers a new user', async () => {
    const res = await request(app).post('/api/auth/register').send({
      name: 'Jane Doe', email: 'jane@test.dev', password: 'Password123!',
    });
    expect(res.status).toBe(201);
    expect(res.body.data.user.email).toBe('jane@test.dev');
    expect(res.body.data.user.role).toBe('USER');
    expect(res.body.data.user.password).toBeUndefined();
    expect(res.body.data.token).toBeDefined();
  });

  it('rejects duplicate registration', async () => {
    await request(app).post('/api/auth/register').send({ name: 'A', email: 'dup@test.dev', password: 'Password123!' });
    const res = await request(app).post('/api/auth/register').send({ name: 'B', email: 'dup@test.dev', password: 'Password123!' });
    expect(res.status).toBe(409);
  });

  it('logs in with correct credentials', async () => {
    await createUser({ email: 'login@test.dev' });
    const res = await request(app).post('/api/auth/login').send({ email: 'login@test.dev', password: 'Password123!' });
    expect(res.status).toBe(200);
    expect(res.body.data.token).toBeDefined();
  });

  it('rejects invalid login', async () => {
    await createUser({ email: 'wrongpass@test.dev' });
    const res = await request(app).post('/api/auth/login').send({ email: 'wrongpass@test.dev', password: 'nope' });
    expect(res.status).toBe(401);
  });

  it('blocks /api/auth/me without a token', async () => {
    const res = await request(app).get('/api/auth/me');
    expect(res.status).toBe(401);
  });

  it('allows /api/auth/me with a valid token', async () => {
    const user = await createUser({ email: 'me@test.dev' });
    const login = await request(app).post('/api/auth/login').send({ email: 'me@test.dev', password: 'Password123!' });
    const res = await request(app).get('/api/auth/me').set('Authorization', `Bearer ${login.body.data.token}`);
    expect(res.status).toBe(200);
    expect(res.body.data.user.email).toBe(user.email);
  });
});
