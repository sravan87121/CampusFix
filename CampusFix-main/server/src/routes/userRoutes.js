const express = require('express');
const { requireAuth, requireRole } = require('../middleware/auth');
const ctrl = require('../controllers/userController');

const router = express.Router();

router.use(requireAuth, requireRole('ADMIN'));
router.get('/', ctrl.listUsers);
router.put('/:id/role', ctrl.changeRole);
router.put('/:id/status', ctrl.toggleActive);

module.exports = router;
