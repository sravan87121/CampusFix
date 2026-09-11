const express = require('express');
const { requireAuth, requireRole } = require('../middleware/auth');
const upload = require('../middleware/upload');
const {
  createTicketRules,
  statusRules,
  priorityRules,
  assignRules,
} = require('../validators/ticketValidators');
const ctrl = require('../controllers/ticketController');
const commentRoutes = require('./commentRoutes');

const router = express.Router();

router.use(requireAuth);
router.use('/:id/comments', commentRoutes);

router.get('/my', ctrl.myTickets);
router.get('/assigned', requireRole('STAFF', 'ADMIN'), ctrl.assignedTickets);

router.get('/', requireRole('ADMIN', 'STAFF'), ctrl.listTickets);
router.post('/', upload.array('attachments', 5), createTicketRules, ctrl.createTicket);

router.get('/:id', ctrl.getTicket);
router.put('/:id', ctrl.updateTicket);
router.delete('/:id', ctrl.cancelTicket);

router.put('/:id/assign', requireRole('ADMIN'), assignRules, ctrl.assignTicket);
router.put('/:id/status', requireRole('ADMIN', 'STAFF'), statusRules, ctrl.changeStatus);
router.put('/:id/priority', requireRole('ADMIN'), priorityRules, ctrl.changePriority);
router.put(
  '/:id/resolve',
  requireRole('ADMIN', 'STAFF'),
  upload.array('resolutionImages', 5),
  ctrl.resolveTicket
);

module.exports = router;
