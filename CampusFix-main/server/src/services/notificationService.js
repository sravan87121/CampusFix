const Notification = require('../models/Notification');

/**
 * Creates a notification document. Centralized so every ticket lifecycle
 * event (create, assign, status/priority change, comment, resolve, close)
 * generates a consistent record.
 */
async function notify({ recipient, ticket, title, message, type }) {
  if (!recipient) return null;
  return Notification.create({ recipient, ticket, title, message, type });
}

module.exports = { notify };
