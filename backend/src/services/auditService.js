const AuditLog = require('../models/AuditLog');

/**
 * Records every agent decision/action factually.
 */
const logAction = async ({ action, requestId, ticketId, decision, sourcePolicyIds, details }) => {
  const logEntry = new AuditLog({
    action,
    requestId,
    ticketId,
    decision,
    sourcePolicyIds: sourcePolicyIds || [],
    details: details || {}
  });

  await logEntry.save();
  return logEntry;
};

module.exports = {
  logAction
};
