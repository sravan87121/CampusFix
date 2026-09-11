const express = require('express');
const { register, login, logout, me } = require('../controllers/authController');
const { registerRules, loginRules } = require('../validators/authValidators');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

router.post('/register', registerRules, register);
router.post('/login', loginRules, login);
router.post('/logout', logout);
router.get('/me', requireAuth, me);

module.exports = router;
