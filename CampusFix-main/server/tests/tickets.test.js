const request = require('supertest');
const app = require('../src/app');
const { createUser, loginAs, createCategory } = require('./helpers');

describe('Tickets', () => {
  it('creates a ticket with a generated ticketId', async () => {
    const category = await createCategory();
    const user = await createUser();
    const token = await loginAs(user);

    const res = await request(app)
      .post('/api/tickets')
      .set('Authorization', `Bearer ${token}`)
      .field('title', 'Broken light')
      .field('description', 'The light in room 204 is flickering')
      .field('category', category._id.toString())
      .field('location', 'Block A')
      .field('priority', 'LOW');

    expect(res.status).toBe(201);
    expect(res.body.data.ticket.ticketId).toMatch(/^CFX-\d{4}-\d{4}$/);
    expect(res.body.data.ticket.status).toBe('OPEN');
  });

  it('lets the owner retrieve their own ticket', async () => {
    const category = await createCategory();
    const user = await createUser();
    const token = await loginAs(user);

    const create = await request(app)
      .post('/api/tickets')
      .set('Authorization', `Bearer ${token}`)
      .field('title', 'Broken light')
      .field('description', 'desc')
      .field('category', category._id.toString())
      .field('location', 'Block A');

    const ticketId = create.body.data.ticket._id;
    const res = await request(app).get(`/api/tickets/${ticketId}`).set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.data.ticket._id).toBe(ticketId);
  });

  it('blocks another user from viewing a ticket they do not own', async () => {
    const category = await createCategory();
    const owner = await createUser({ email: 'owner@test.dev' });
    const stranger = await createUser({ email: 'stranger@test.dev' });
    const ownerToken = await loginAs(owner);
    const strangerToken = await loginAs(stranger);

    const create = await request(app)
      .post('/api/tickets')
      .set('Authorization', `Bearer ${ownerToken}`)
      .field('title', 'Broken light')
      .field('description', 'desc')
      .field('category', category._id.toString())
      .field('location', 'Block A');

    const res = await request(app)
      .get(`/api/tickets/${create.body.data.ticket._id}`)
      .set('Authorization', `Bearer ${strangerToken}`);
    expect(res.status).toBe(403);
  });

  it('assigns a ticket to staff and moves it to ASSIGNED', async () => {
    const category = await createCategory();
    const admin = await createUser({ email: 'admin2@test.dev', role: 'ADMIN' });
    const staff = await createUser({ email: 'staff2@test.dev', role: 'STAFF' });
    const user = await createUser({ email: 'reporter@test.dev' });
    const adminToken = await loginAs(admin);
    const userToken = await loginAs(user);

    const create = await request(app)
      .post('/api/tickets')
      .set('Authorization', `Bearer ${userToken}`)
      .field('title', 'AC issue')
      .field('description', 'desc')
      .field('category', category._id.toString())
      .field('location', 'CSE Lab');

    const ticketId = create.body.data.ticket._id;
    const res = await request(app)
      .put(`/api/tickets/${ticketId}/assign`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ staffId: staff._id.toString() });

    expect(res.status).toBe(200);
    expect(res.body.data.ticket.status).toBe('ASSIGNED');
    expect(res.body.data.ticket.assignedTo).toBe(staff._id.toString());
  });

  it('enforces valid status transitions only', async () => {
    const category = await createCategory();
    const admin = await createUser({ email: 'admin3@test.dev', role: 'ADMIN' });
    const user = await createUser({ email: 'reporter3@test.dev' });
    const adminToken = await loginAs(admin);
    const userToken = await loginAs(user);

    const create = await request(app)
      .post('/api/tickets')
      .set('Authorization', `Bearer ${userToken}`)
      .field('title', 'Issue')
      .field('description', 'desc')
      .field('category', category._id.toString())
      .field('location', 'Block A');

    const ticketId = create.body.data.ticket._id;
    // OPEN -> RESOLVED is not an allowed direct transition
    const res = await request(app)
      .put(`/api/tickets/${ticketId}/status`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ status: 'RESOLVED' });

    expect(res.status).toBe(409);
  });

  it('allows admin to change ticket priority', async () => {
    const category = await createCategory();
    const admin = await createUser({ email: 'admin4@test.dev', role: 'ADMIN' });
    const user = await createUser({ email: 'reporter4@test.dev' });
    const adminToken = await loginAs(admin);
    const userToken = await loginAs(user);

    const create = await request(app)
      .post('/api/tickets')
      .set('Authorization', `Bearer ${userToken}`)
      .field('title', 'Issue')
      .field('description', 'desc')
      .field('category', category._id.toString())
      .field('location', 'Block A');

    const ticketId = create.body.data.ticket._id;
    const res = await request(app)
      .put(`/api/tickets/${ticketId}/priority`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ priority: 'URGENT' });

    expect(res.status).toBe(200);
    expect(res.body.data.ticket.priority).toBe('URGENT');
  });
});
