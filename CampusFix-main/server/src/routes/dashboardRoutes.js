const express = require('express');
const { requireAuth, requireRole } = require('../middleware/auth');
const ctrl = require('../controllers/dashboardController');

const router = express.Router();

router.get('/user', requireAuth, ctrl.userDashboard);
router.get('/staff', requireAuth, requireRole('STAFF', 'ADMIN'), ctrl.staffDashboard);
router.get('/admin', requireAuth, requireRole('ADMIN'), ctrl.adminDashboard);

module.exports = router;
