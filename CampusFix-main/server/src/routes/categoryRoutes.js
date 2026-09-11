const express = require('express');
const { requireAuth, requireRole } = require('../middleware/auth');
const ctrl = require('../controllers/categoryController');

const router = express.Router();

router.get('/', requireAuth, ctrl.listCategories);
router.post('/', requireAuth, requireRole('ADMIN'), ctrl.createCategory);
router.put('/:id', requireAuth, requireRole('ADMIN'), ctrl.updateCategory);
router.delete('/:id', requireAuth, requireRole('ADMIN'), ctrl.deleteCategory);

module.exports = router;
