const jwt = require('jsonwebtoken');
const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');
const User = require('../models/User');

/**
 * Verifies the JWT from the Authorization header and attaches the
 * authenticated user (minus password) to req.user.
 */
const requireAuth = asyncHandler(async (req, res, next) => {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;

  if (!token) {
    throw new ApiError(401, 'Authentication token missing');
  }

  let payload;
  try {
    payload = jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    throw new ApiError(401, 'Invalid or expired token');
  }

  const user = await User.findById(payload.id);
  if (!user || !user.isActive) {
    throw new ApiError(401, 'User no longer exists or is deactivated');
  }

  req.user = user;
  next();
});

/**
 * Restricts a route to one or more roles. Must run after requireAuth.
 * Usage: requireRole('ADMIN'), requireRole('ADMIN', 'STAFF')
 */
const requireRole = (...roles) => (req, res, next) => {
  if (!req.user) {
    throw new ApiError(401, 'Authentication required');
  }
  if (!roles.includes(req.user.role)) {
    throw new ApiError(403, 'You do not have permission to perform this action');
  }
  next();
};

module.exports = { requireAuth, requireRole };
