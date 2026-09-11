const asyncHandler = require('../utils/asyncHandler');
const Ticket = require('../models/Ticket');

async function countsFor(filter) {
  const [total, open, assigned, inProgress, resolved, urgent] = await Promise.all([
    Ticket.countDocuments(filter),
    Ticket.countDocuments({ ...filter, status: 'OPEN' }),
    Ticket.countDocuments({ ...filter, status: 'ASSIGNED' }),
    Ticket.countDocuments({ ...filter, status: 'IN_PROGRESS' }),
    Ticket.countDocuments({ ...filter, status: 'RESOLVED' }),
    Ticket.countDocuments({ ...filter, priority: 'URGENT' }),
  ]);
  return { total, open, assigned, inProgress, resolved, urgent };
}

async function averageResolutionHours(filter) {
  const resolved = await Ticket.find({ ...filter, resolvedAt: { $ne: null } }, 'createdAt resolvedAt');
  if (!resolved.length) return 0;
  const totalHours = resolved.reduce(
    (sum, t) => sum + (t.resolvedAt.getTime() - t.createdAt.getTime()) / 36e5,
    0
  );
  return Math.round((totalHours / resolved.length) * 10) / 10;
}

// GET /api/dashboard/user
const userDashboard = asyncHandler(async (req, res) => {
  const filter = { createdBy: req.user._id };
  const counts = await countsFor(filter);
  const recentTickets = await Ticket.find(filter)
    .populate('category', 'name icon')
    .sort({ createdAt: -1 })
    .limit(5);

  res.status(200).json({
    success: true,
    data: {
      myTotalTickets: counts.total,
      open: counts.open,
      inProgress: counts.inProgress,
      resolved: counts.resolved,
      recentTickets,
    },
  });
});

// GET /api/dashboard/staff
const staffDashboard = asyncHandler(async (req, res) => {
  const filter = { assignedTo: req.user._id };
  const counts = await countsFor(filter);

  res.status(200).json({
    success: true,
    data: {
      assigned: counts.total,
      pending: counts.assigned,
      inProgress: counts.inProgress,
      resolved: counts.resolved,
      urgent: counts.urgent,
    },
  });
});

// GET /api/dashboard/admin
const adminDashboard = asyncHandler(async (req, res) => {
  const counts = await countsFor({});
  const avgResolutionHours = await averageResolutionHours({});

  const [byCategory, byPriority, byStatus, staffWorkload] = await Promise.all([
    Ticket.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $lookup: { from: 'categories', localField: '_id', foreignField: '_id', as: 'category' } },
      { $unwind: { path: '$category', preserveNullAndEmptyArrays: true } },
      { $project: { _id: 0, category: '$category.name', count: 1 } },
    ]),
    Ticket.aggregate([{ $group: { _id: '$priority', count: { $sum: 1 } } }]),
    Ticket.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }]),
    Ticket.aggregate([
      { $match: { assignedTo: { $ne: null } } },
      { $group: { _id: '$assignedTo', count: { $sum: 1 } } },
      { $lookup: { from: 'users', localField: '_id', foreignField: '_id', as: 'staff' } },
      { $unwind: '$staff' },
      { $project: { _id: 0, staff: '$staff.name', count: 1 } },
    ]),
  ]);

  res.status(200).json({
    success: true,
    data: {
      totalTickets: counts.total,
      open: counts.open,
      assigned: counts.assigned,
      inProgress: counts.inProgress,
      resolved: counts.resolved,
      urgent: counts.urgent,
      avgResolutionHours,
      byCategory,
      byPriority,
      byStatus,
      staffWorkload,
    },
  });
});

module.exports = { userDashboard, staffDashboard, adminDashboard };
