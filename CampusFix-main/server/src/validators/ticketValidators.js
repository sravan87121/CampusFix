const { body } = require('express-validator');
const Ticket = require('../models/Ticket');

const createTicketRules = [
  body('title').trim().notEmpty().withMessage('Title is required').isLength({ max: 150 }),
  body('description').trim().notEmpty().withMessage('Description is required').isLength({ max: 2000 }),
  body('category').isMongoId().withMessage('A valid category is required'),
  body('location').trim().notEmpty().withMessage('Location is required'),
  body('priority').optional().isIn(Ticket.PRIORITIES).withMessage('Invalid priority'),
];

const statusRules = [
  body('status').isIn(Ticket.STATUSES).withMessage('Invalid status'),
];

const priorityRules = [
  body('priority').isIn(Ticket.PRIORITIES).withMessage('Invalid priority'),
];

const assignRules = [
  body('staffId').isMongoId().withMessage('A valid staff member id is required'),
];

module.exports = { createTicketRules, statusRules, priorityRules, assignRules };
