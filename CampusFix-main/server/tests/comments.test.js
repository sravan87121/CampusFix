const request = require('supertest');
const app = require('../src/app');
const { createUser, loginAs, createCategory } = require('./helpers');

async function makeTicket(userToken, category) {
  const res = await request(app)
    .post('/api/tickets')
    .set('Authorization', `Bearer ${userToken}`)
    .field('title', 'Issue')
    .field('description', 'desc')
    .field('category', category._id.toString())
    .field('location', 'Block A');
  return res.body.data.ticket;
}

describe('Comments', () => {
  it('lets the owner add a comment on their ticket', async () => {
    const category = await createCategory();
    const user = await createUser();
    const token = await loginAs(user);
    const ticket = await makeTicket(token, category);

    const res = await request(app)
      .post(`/api/tickets/${ticket._id}/comments`)
      .set('Authorization', `Bearer ${token}`)
      .send({ message: 'Any update?' });

    expect(res.status).toBe(201);
    expect(res.body.data.comment.message).toBe('Any update?');
  });

  it('retrieves comments for a ticket', async () => {
    const category = await createCategory();
    const user = await createUser();
    const token = await loginAs(user);
    const ticket = await makeTicket(token, category);

    await request(app).post(`/api/tickets/${ticket._id}/comments`).set('Authorization', `Bearer ${token}`).send({ message: 'First' });
    const res = await request(app).get(`/api/tickets/${ticket._id}/comments`).set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.data.comments.length).toBe(1);
  });

  it('blocks an unrelated user from commenting', async () => {
    const category = await createCategory();
    const owner = await createUser({ email: 'owner5@test.dev' });
    const stranger = await createUser({ email: 'stranger5@test.dev' });
    const ownerToken = await loginAs(owner);
    const strangerToken = await loginAs(stranger);
    const ticket = await makeTicket(ownerToken, category);

    const res = await request(app)
      .post(`/api/tickets/${ticket._id}/comments`)
      .set('Authorization', `Bearer ${strangerToken}`)
      .send({ message: 'Not my business' });

    expect(res.status).toBe(403);
  });
});
