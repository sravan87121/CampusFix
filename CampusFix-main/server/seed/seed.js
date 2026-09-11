require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../src/config/db');
const User = require('../src/models/User');
const Category = require('../src/models/Category');
const Ticket = require('../src/models/Ticket');
const Comment = require('../src/models/Comment');
const Notification = require('../src/models/Notification');
const Counter = require('../src/models/Counter');
const generateTicketId = require('../src/utils/generateTicketId');

const CATEGORY_NAMES = [
  'Electrical', 'Plumbing', 'Air Conditioning', 'Furniture', 'Internet',
  'Cleaning', 'Classroom', 'Laboratory', 'Security', 'Infrastructure', 'Other',
];

async function seed() {
  await connectDB(process.env.MONGO_URI);
  console.log('Connected. Clearing existing demo data...');

  await Promise.all([
    User.deleteMany({}),
    Category.deleteMany({}),
    Ticket.deleteMany({}),
    Comment.deleteMany({}),
    Notification.deleteMany({}),
    Counter.deleteMany({}),
  ]);

  console.log('Creating categories...');
  const categories = await Category.insertMany(
    CATEGORY_NAMES.map((name) => ({ name, description: `${name} related issues`, icon: 'wrench' }))
  );
  const cat = (name) => categories.find((c) => c.name === name)._id;

  console.log('Creating users (fake dev credentials only)...');
  // NOTE: these are clearly fake development-only credentials for local demo/testing.
  const admin = await User.create({
    name: 'Asha Rao', email: 'admin@campusfix.dev', password: 'DevPass123!', role: 'ADMIN', department: 'Facilities',
  });
  const staff = await User.insertMany(
    [
      { name: 'Ravi Kumar', email: 'ravi.staff@campusfix.dev', password: 'DevPass123!', role: 'STAFF', department: 'Electrical' },
      { name: 'Meena Iyer', email: 'meena.staff@campusfix.dev', password: 'DevPass123!', role: 'STAFF', department: 'Plumbing' },
      { name: 'Sam Verma', email: 'sam.staff@campusfix.dev', password: 'DevPass123!', role: 'STAFF', department: 'IT' },
    ].map((u) => new User(u))
  );
  for (const s of staff) await s.save(); // ensure pre-save password hashing runs

  const users = await User.insertMany(
    [1, 2, 3, 4, 5].map((i) => new User({
      name: `Student ${i}`, email: `student${i}@campusfix.dev`, password: 'DevPass123!', role: 'USER', department: 'CSE',
    }))
  );
  for (const u of users) await u.save();

  console.log('Creating sample tickets...');
  const sampleData = [
    { title: 'Broken chair in classroom', category: 'Furniture', location: 'Block A', priority: 'LOW', status: 'CLOSED' },
    { title: 'AC not cooling in CSE Lab', category: 'Air Conditioning', location: 'CSE Lab', priority: 'MEDIUM', status: 'RESOLVED' },
    { title: 'Water leakage near library entrance', category: 'Plumbing', location: 'Library', priority: 'HIGH', status: 'IN_PROGRESS' },
    { title: 'Exposed wiring near hostel block', category: 'Electrical', location: 'Hostel', priority: 'URGENT', status: 'ASSIGNED' },
    { title: 'WiFi down in Auditorium', category: 'Internet', location: 'Auditorium', priority: 'MEDIUM', status: 'OPEN' },
    { title: 'Washroom cleaning needed', category: 'Cleaning', location: 'Block B', priority: 'LOW', status: 'OPEN' },
  ];

  for (const [i, t] of sampleData.entries()) {
    const ticketId = await generateTicketId();
    const creator = users[i % users.length];
    const assignee = ['ASSIGNED', 'IN_PROGRESS', 'RESOLVED', 'CLOSED'].includes(t.status) ? staff[i % staff.length] : null;

    const ticket = await Ticket.create({
      ticketId,
      title: t.title,
      description: `${t.title} — reported for prompt attention.`,
      category: cat(t.category),
      location: t.location,
      priority: t.priority,
      status: t.status,
      createdBy: creator._id,
      assignedTo: assignee ? assignee._id : null,
      resolvedAt: ['RESOLVED', 'CLOSED'].includes(t.status) ? new Date() : null,
      closedAt: t.status === 'CLOSED' ? new Date() : null,
    });

    await Comment.create({ ticket: ticket._id, user: creator._id, message: 'Please look into this soon, thank you.' });
    if (assignee) {
      await Comment.create({ ticket: ticket._id, user: assignee._id, message: 'On it — will update shortly.' });
      await Notification.create({
        recipient: assignee._id, ticket: ticket._id, title: 'New ticket assigned',
        message: `You were assigned ${ticket.ticketId}`, type: 'TICKET_ASSIGNED',
      });
    }
    await Notification.create({
      recipient: creator._id, ticket: ticket._id, title: 'Ticket submitted',
      message: `Your ticket ${ticket.ticketId} was submitted`, type: 'TICKET_CREATED',
    });
  }

  console.log('Seed complete.');
  console.log('--- Demo credentials (dev only) ---');
  console.log('Admin:  admin@campusfix.dev / DevPass123!');
  console.log('Staff:  ravi.staff@campusfix.dev / DevPass123!');
  console.log('User:   student1@campusfix.dev / DevPass123!');

  await mongoose.connection.close();
  process.exit(0);
}

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
