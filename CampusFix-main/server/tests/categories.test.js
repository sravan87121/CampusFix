const request = require('supertest');
const app = require('../src/app');
const { createUser, loginAs, createCategory } = require('./helpers');

describe('Categories', () => {
  it('lets any authenticated user retrieve categories', async () => {
    await createCategory({ name: 'Plumbing' });
    const user = await createUser();
    const token = await loginAs(user);
    const res = await request(app).get('/api/categories').set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.data.categories.length).toBe(1);
  });

  it('allows admin to create a category', async () => {
    const admin = await createUser({ role: 'ADMIN' });
    const token = await loginAs(admin);
    const res = await request(app).post('/api/categories').set('Authorization', `Bearer ${token}`).send({ name: 'Security' });
    expect(res.status).toBe(201);
    expect(res.body.data.category.name).toBe('Security');
  });

  it('blocks a non-admin from creating a category', async () => {
    const user = await createUser();
    const token = await loginAs(user);
    const res = await request(app).post('/api/categories').set('Authorization', `Bearer ${token}`).send({ name: 'Security' });
    expect(res.status).toBe(403);
  });
});
