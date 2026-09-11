const express = require('express');
const mongoose = require('mongoose');

const router = express.Router();

router.get('/', (req, res) => {
  const dbState = mongoose.connection.readyState; // 1 = connected
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    database: dbState === 1 ? 'connected' : 'disconnected',
  });
});

module.exports = router;
