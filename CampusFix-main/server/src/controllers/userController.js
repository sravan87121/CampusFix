const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');
const User = require('../models/User');

// GET /api/users?role=STAFF (ADMIN only)
const listUsers = asyncHandler(async (req, res) => {
  const filter = {};
  if (req.query.role) filter.role = req.query.role;
  const users = await User.find(filter).sort({ createdAt: -1 });
  res.status(200).json({ success: true, data: { users } });
});

// PUT /api/users/:id/role (ADMIN only) - promote/demote e.g. USER -> STAFF
const changeRole = asyncHandler(async (req, res) => {
  const { role } = req.body;
  if (!['USER', 'ADMIN', 'STAFF'].includes(role)) throw new ApiError(400, 'Invalid role');

  const user = await User.findById(req.params.id);
  if (!user) throw new ApiError(404, 'User not found');

  user.role = role;
  await user.save();
  res.status(200).json({ success: true, data: { user } });
});

// PUT /api/users/:id/status (ADMIN only) - activate/deactivate an account
const toggleActive = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) throw new ApiError(404, 'User not found');

  user.isActive = req.body.isActive;
  await user.save();
  res.status(200).json({ success: true, data: { user } });
});

module.exports = { listUsers, changeRole, toggleActive };
