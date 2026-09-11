const request = require('supertest');
const app = require('../src/app');
const User = require('../src/models/User');
const Category = require('../src/models/Category');

async function createUser(overrides = {}) {
  const defaults = { name: 'Test User', email: `user${Date.now()}${Math.random()}@test.dev`, password: 'Password123!', role: 'USER' };
  const user = await User.create({ ...defaults, ...overrides });
  return user;
}

async function loginAs(user, password = 'Password123!') {
  const res = await request(app).post('/api/auth/login').send({ email: user.email, password });
  return res.body.data.token;
}

async function createCategory(overrides = {}) {
  return Category.create({ name: 'Electrical', description: 'Electrical issues', ...overrides });
}

module.exports = { createUser, loginAs, createCategory, request, app };
