const { validationResult } = require('express-validator');
const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');
const Ticket = require('../models/Ticket');
const User = require('../models/User');
const generateTicketId = require('../utils/generateTicketId');
const { notify } = require('../services/notificationService');

function buildAttachments(files = []) {
  return files.map((f) => ({
    filename: f.filename,
    url: `/uploads/${f.filename}`,
    mimeType: f.mimetype,
    size: f.size,
  }));
}

function buildPagination(query) {
  const page = Math.max(parseInt(query.page, 10) || 1, 1);
  const limit = Math.min(Math.max(parseInt(query.limit, 10) || 10, 1), 100);
  const skip = (page - 1) * limit;
  return { page, limit, skip };
}

// Cross-cutting filter builder shared by list/mine/assigned endpoints.
function buildFilter(query) {
  const filter = {};
  if (query.status) filter.status = query.status;
  if (query.priority) filter.priority = query.priority;
  if (query.category) filter.category = query.category;
  if (query.location) filter.location = new RegExp(query.location, 'i');
  if (query.assignedTo) filter.assignedTo = query.assignedTo;
  if (query.search) filter.$text = { $search: query.search };
  return filter;
}

// GET /api/tickets (ADMIN/STAFF: all tickets, with filters + pagination)
const listTickets = asyncHandler(async (req, res) => {
  const { page, limit, skip } = buildPagination(req.query);
  const filter = buildFilter(req.query);

  const [tickets, totalTickets] = await Promise.all([
    Ticket.find(filter)
      .populate('category', 'name icon')
      .populate('createdBy', 'name email')
      .populate('assignedTo', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    Ticket.countDocuments(filter),
  ]);

  res.status(200).json({
    success: true,
    data: { tickets, currentPage: page, totalPages: Math.ceil(totalTickets / limit) || 1, totalTickets },
  });
});

// GET /api/tickets/my
const myTickets = asyncHandler(async (req, res) => {
  const { page, limit, skip } = buildPagination(req.query);
  const filter = { ...buildFilter(req.query), createdBy: req.user._id };

  const [tickets, totalTickets] = await Promise.all([
    Ticket.find(filter)
      .populate('category', 'name icon')
      .populate('assignedTo', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    Ticket.countDocuments(filter),
  ]);

  res.status(200).json({
    success: true,
    data: { tickets, currentPage: page, totalPages: Math.ceil(totalTickets / limit) || 1, totalTickets },
  });
});

// GET /api/tickets/assigned (STAFF)
const assignedTickets = asyncHandler(async (req, res) => {
  const { page, limit, skip } = buildPagination(req.query);
  const filter = { ...buildFilter(req.query), assignedTo: req.user._id };

  const [tickets, totalTickets] = await Promise.all([
    Ticket.find(filter)
      .populate('category', 'name icon')
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    Ticket.countDocuments(filter),
  ]);

  res.status(200).json({
    success: true,
    data: { tickets, currentPage: page, totalPages: Math.ceil(totalTickets / limit) || 1, totalTickets },
  });
});

function assertAccessOrThrow(ticket, user) {
  const isOwner = ticket.createdBy._id
    ? ticket.createdBy._id.toString() === user._id.toString()
    : ticket.createdBy.toString() === user._id.toString();
  const isAssignee = ticket.assignedTo && (ticket.assignedTo._id || ticket.assignedTo).toString() === user._id.toString();
  const isPrivileged = ['ADMIN', 'STAFF'].includes(user.role);

  if (!isOwner && !isAssignee && !isPrivileged) {
    throw new ApiError(403, 'You do not have access to this ticket');
  }
}

// GET /api/tickets/:id
const getTicket = asyncHandler(async (req, res) => {
  const ticket = await Ticket.findById(req.params.id)
    .populate('category', 'name icon')
    .populate('createdBy', 'name email')
    .populate('assignedTo', 'name email');

  if (!ticket) throw new ApiError(404, 'Ticket not found');
  assertAccessOrThrow(ticket, req.user);

  res.status(200).json({ success: true, data: { ticket } });
});

// POST /api/tickets
const createTicket = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) throw new ApiError(400, 'Validation failed', errors.array());

  const { title, description, category, location, priority } = req.body;
  const ticketId = await generateTicketId();

  const ticket = await Ticket.create({
    ticketId,
    title,
    description,
    category,
    location,
    priority: priority || 'MEDIUM',
    createdBy: req.user._id,
    attachments: buildAttachments(req.files),
  });

  res.status(201).json({ success: true, data: { ticket } });
});

// PUT /api/tickets/:id (owner while OPEN, or ADMIN)
const updateTicket = asyncHandler(async (req, res) => {
  const ticket = await Ticket.findById(req.params.id);
  if (!ticket) throw new ApiError(404, 'Ticket not found');

  const isOwner = ticket.createdBy.toString() === req.user._id.toString();
  const isAdmin = req.user.role === 'ADMIN';
  if (!isOwner && !isAdmin) throw new ApiError(403, 'You cannot edit this ticket');
  if (isOwner && !isAdmin && ticket.status !== 'OPEN') {
    throw new ApiError(409, 'Ticket can only be edited while it is OPEN');
  }

  const editable = ['title', 'description', 'location', 'category'];
  editable.forEach((field) => {
    if (req.body[field] !== undefined) ticket[field] = req.body[field];
  });

  await ticket.save();
  res.status(200).json({ success: true, data: { ticket } });
});

// DELETE /api/tickets/:id (owner while OPEN, or ADMIN) - soft delete via CANCELLED
const cancelTicket = asyncHandler(async (req, res) => {
  const ticket = await Ticket.findById(req.params.id);
  if (!ticket) throw new ApiError(404, 'Ticket not found');

  const isOwner = ticket.createdBy.toString() === req.user._id.toString();
  const isAdmin = req.user.role === 'ADMIN';
  if (!isOwner && !isAdmin) throw new ApiError(403, 'You cannot cancel this ticket');

  if (!Ticket.canTransition(ticket.status, 'CANCELLED') && !isAdmin) {
    throw new ApiError(409, `Ticket cannot be cancelled from status ${ticket.status}`);
  }

  ticket.status = 'CANCELLED';
  await ticket.save();
  res.status(200).json({ success: true, data: { ticket } });
});

// PUT /api/tickets/:id/assign (ADMIN)
const assignTicket = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) throw new ApiError(400, 'Validation failed', errors.array());

  const ticket = await Ticket.findById(req.params.id);
  if (!ticket) throw new ApiError(404, 'Ticket not found');

  const staff = await User.findOne({ _id: req.body.staffId, role: 'STAFF' });
  if (!staff) throw new ApiError(400, 'Staff member not found');

  ticket.assignedTo = staff._id;
  if (ticket.status === 'OPEN') ticket.status = 'ASSIGNED';
  await ticket.save();

  await notify({
    recipient: staff._id,
    ticket: ticket._id,
    title: 'New ticket assigned',
    message: `You have been assigned ticket ${ticket.ticketId}: ${ticket.title}`,
    type: 'TICKET_ASSIGNED',
  });
  await notify({
    recipient: ticket.createdBy,
    ticket: ticket._id,
    title: 'Your ticket was assigned',
    message: `${ticket.ticketId} has been assigned to a maintenance staff member`,
    type: 'TICKET_ASSIGNED',
  });

  res.status(200).json({ success: true, data: { ticket } });
});

// PUT /api/tickets/:id/status (ADMIN, STAFF for own assigned tickets)
const changeStatus = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) throw new ApiError(400, 'Validation failed', errors.array());

  const ticket = await Ticket.findById(req.params.id);
  if (!ticket) throw new ApiError(404, 'Ticket not found');

  const isAdmin = req.user.role === 'ADMIN';
  const isAssignedStaff =
    req.user.role === 'STAFF' && ticket.assignedTo && ticket.assignedTo.toString() === req.user._id.toString();
  if (!isAdmin && !isAssignedStaff) throw new ApiError(403, 'You cannot change this ticket status');

  const { status } = req.body;
  if (!Ticket.canTransition(ticket.status, status)) {
    throw new ApiError(409, `Cannot move ticket from ${ticket.status} to ${status}`);
  }

  ticket.status = status;
  if (status === 'RESOLVED') ticket.resolvedAt = new Date();
  if (status === 'CLOSED') ticket.closedAt = new Date();
  await ticket.save();

  await notify({
    recipient: ticket.createdBy,
    ticket: ticket._id,
    title: 'Ticket status updated',
    message: `${ticket.ticketId} is now ${status}`,
    type: status === 'RESOLVED' ? 'TICKET_RESOLVED' : status === 'CLOSED' ? 'TICKET_CLOSED' : 'STATUS_CHANGED',
  });

  res.status(200).json({ success: true, data: { ticket } });
});

// PUT /api/tickets/:id/priority (ADMIN)
const changePriority = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) throw new ApiError(400, 'Validation failed', errors.array());

  const ticket = await Ticket.findById(req.params.id);
  if (!ticket) throw new ApiError(404, 'Ticket not found');

  ticket.priority = req.body.priority;
  await ticket.save();

  await notify({
    recipient: ticket.createdBy,
    ticket: ticket._id,
    title: 'Ticket priority updated',
    message: `${ticket.ticketId} priority changed to ${ticket.priority}`,
    type: 'PRIORITY_CHANGED',
  });

  res.status(200).json({ success: true, data: { ticket } });
});

// PUT /api/tickets/:id/resolve (STAFF assigned, or ADMIN)
const resolveTicket = asyncHandler(async (req, res) => {
  const ticket = await Ticket.findById(req.params.id);
  if (!ticket) throw new ApiError(404, 'Ticket not found');

  const isAdmin = req.user.role === 'ADMIN';
  const isAssignedStaff =
    req.user.role === 'STAFF' && ticket.assignedTo && ticket.assignedTo.toString() === req.user._id.toString();
  if (!isAdmin && !isAssignedStaff) throw new ApiError(403, 'You cannot resolve this ticket');

  if (!Ticket.canTransition(ticket.status, 'RESOLVED')) {
    throw new ApiError(409, `Cannot resolve a ticket in status ${ticket.status}`);
  }

  ticket.status = 'RESOLVED';
  ticket.resolvedAt = new Date();
  if (req.body.resolutionNotes) ticket.resolutionNotes = req.body.resolutionNotes;
  ticket.resolutionImages = ticket.resolutionImages.concat(buildAttachments(req.files));
  await ticket.save();

  await notify({
    recipient: ticket.createdBy,
    ticket: ticket._id,
    title: 'Ticket resolved',
    message: `${ticket.ticketId} has been marked resolved`,
    type: 'TICKET_RESOLVED',
  });

  res.status(200).json({ success: true, data: { ticket } });
});

module.exports = {
  listTickets,
  myTickets,
  assignedTickets,
  getTicket,
  createTicket,
  updateTicket,
  cancelTicket,
  assignTicket,
  changeStatus,
  changePriority,
  resolveTicket,
};
