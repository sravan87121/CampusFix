const request = require('supertest');
const app = require('../src/app');
const { createUser, loginAs } = require('./helpers');

describe('Dashboards', () => {
  it('returns the user dashboard for a logged-in user', async () => {
    const user = await createUser();
    const token = await loginAs(user);
    const res = await request(app).get('/api/dashboard/user').set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.data).toHaveProperty('myTotalTickets');
  });

  it('returns the admin dashboard for an admin', async () => {
    const admin = await createUser({ role: 'ADMIN' });
    const token = await loginAs(admin);
    const res = await request(app).get('/api/dashboard/admin').set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.data).toHaveProperty('totalTickets');
  });

  it('blocks a regular user from the admin dashboard', async () => {
    const user = await createUser();
    const token = await loginAs(user);
    const res = await request(app).get('/api/dashboard/admin').set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(403);
  });

  it('returns the staff dashboard for staff', async () => {
    const staff = await createUser({ role: 'STAFF' });
    const token = await loginAs(staff);
    const res = await request(app).get('/api/dashboard/staff').set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.data).toHaveProperty('assigned');
  });
});
