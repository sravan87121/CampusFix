const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');
const Comment = require('../models/Comment');
const Ticket = require('../models/Ticket');
const { notify } = require('../services/notificationService');

function assertAccessOrThrow(ticket, user) {
  const isOwner = ticket.createdBy.toString() === user._id.toString();
  const isAssignee = ticket.assignedTo && ticket.assignedTo.toString() === user._id.toString();
  const isPrivileged = ['ADMIN', 'STAFF'].includes(user.role);
  if (!isOwner && !isAssignee && !isPrivileged) {
    throw new ApiError(403, 'You do not have access to this ticket');
  }
}

const listComments = asyncHandler(async (req, res) => {
  const ticket = await Ticket.findById(req.params.id);
  if (!ticket) throw new ApiError(404, 'Ticket not found');
  assertAccessOrThrow(ticket, req.user);

  const comments = await Comment.find({ ticket: ticket._id })
    .populate('user', 'name role')
    .sort({ createdAt: 1 });

  res.status(200).json({ success: true, data: { comments } });
});

const createComment = asyncHandler(async (req, res) => {
  const { message } = req.body;
  if (!message || !message.trim()) throw new ApiError(400, 'Comment message is required');

  const ticket = await Ticket.findById(req.params.id);
  if (!ticket) throw new ApiError(404, 'Ticket not found');
  assertAccessOrThrow(ticket, req.user);

  const comment = await Comment.create({ ticket: ticket._id, user: req.user._id, message: message.trim() });
  await comment.populate('user', 'name role');

  // Notify the other party (owner <-> assignee) but never the author themselves.
  const recipients = new Set(
    [ticket.createdBy.toString(), ticket.assignedTo ? ticket.assignedTo.toString() : null].filter(Boolean)
  );
  recipients.delete(req.user._id.toString());

  await Promise.all(
    [...recipients].map((recipient) =>
      notify({
        recipient,
        ticket: ticket._id,
        title: 'New comment on your ticket',
        message: `${req.user.name} commented on ${ticket.ticketId}`,
        type: 'COMMENT_ADDED',
      })
    )
  );

  res.status(201).json({ success: true, data: { comment } });
});

module.exports = { listComments, createComment };
