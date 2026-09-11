const Counter = require('../models/Counter');

/**
 * Generates a human-readable, sequential ticket ID like CFX-2026-0001.
 * Uses an atomic findOneAndUpdate on a per-year counter document so IDs
 * stay unique even under concurrent ticket creation.
 */
async function generateTicketId() {
  const year = new Date().getFullYear();
  const key = `ticket-${year}`;

  const counter = await Counter.findOneAndUpdate(
    { key },
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  );

  const padded = String(counter.seq).padStart(4, '0');
  return `CFX-${year}-${padded}`;
}

module.exports = generateTicketId;
