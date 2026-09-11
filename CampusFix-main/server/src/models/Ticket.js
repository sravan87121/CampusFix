const mongoose = require('mongoose');

const PRIORITIES = ['LOW', 'MEDIUM', 'HIGH', 'URGENT'];
const STATUSES = ['OPEN', 'ASSIGNED', 'IN_PROGRESS', 'RESOLVED', 'CLOSED', 'CANCELLED'];

// Allowed forward transitions. Anything not listed here is rejected by the
// controller layer, regardless of what the frontend sends.
const ALLOWED_TRANSITIONS = {
  OPEN: ['ASSIGNED', 'CANCELLED'],
  ASSIGNED: ['IN_PROGRESS', 'CANCELLED'],
  IN_PROGRESS: ['RESOLVED', 'ASSIGNED'],
  RESOLVED: ['CLOSED', 'IN_PROGRESS'],
  CLOSED: [],
  CANCELLED: [],
};

const attachmentSchema = new mongoose.Schema(
  {
    filename: String,
    url: String,
    mimeType: String,
    size: Number,
  },
  { _id: false }
);

const ticketSchema = new mongoose.Schema(
  {
    ticketId: { type: String, required: true, unique: true, index: true },
    title: { type: String, required: true, trim: true, maxlength: 150 },
    description: { type: String, required: true, trim: true, maxlength: 2000 },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
    location: { type: String, required: true, trim: true },
    priority: { type: String, enum: PRIORITIES, default: 'MEDIUM' },
    status: { type: String, enum: STATUSES, default: 'OPEN', index: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null, index: true },
    attachments: { type: [attachmentSchema], default: [] },
    resolutionNotes: { type: String, trim: true, default: '' },
    resolutionImages: { type: [attachmentSchema], default: [] },
    resolvedAt: { type: Date, default: null },
    closedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

ticketSchema.index({ createdAt: -1 });
ticketSchema.index({ title: 'text', description: 'text', ticketId: 'text' });

ticketSchema.statics.PRIORITIES = PRIORITIES;
ticketSchema.statics.STATUSES = STATUSES;
ticketSchema.statics.ALLOWED_TRANSITIONS = ALLOWED_TRANSITIONS;

ticketSchema.statics.canTransition = function canTransition(from, to) {
  if (from === to) return false;
  return (ALLOWED_TRANSITIONS[from] || []).includes(to);
};

module.exports = mongoose.model('Ticket', ticketSchema);
