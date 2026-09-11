const express = require('express');
const { requireAuth } = require('../middleware/auth');
const ctrl = require('../controllers/commentController');

// mergeParams so :id (ticket id) from the parent /api/tickets mount is visible here
const router = express.Router({ mergeParams: true });

router.get('/', requireAuth, ctrl.listComments);
router.post('/', requireAuth, ctrl.createComment);

module.exports = router;
