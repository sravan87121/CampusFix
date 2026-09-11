const express = require('express');
const { requireAuth } = require('../middleware/auth');
const ctrl = require('../controllers/notificationController');

const router = express.Router();

router.use(requireAuth);
router.get('/', ctrl.listNotifications);
router.put('/read-all', ctrl.markAllAsRead);
router.put('/:id/read', ctrl.markAsRead);

module.exports = router;
