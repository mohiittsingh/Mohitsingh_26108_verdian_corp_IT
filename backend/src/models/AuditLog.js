const mongoose = require('mongoose');

const auditLogSchema = new mongoose.Schema({
  timestamp: { type: Date, default: Date.now },
  requestId: { type: String },
  ticketId: { type: String },
  action: { type: String, required: true },
  decision: { type: String },
  sourcePolicyIds: [{ type: String }],
  details: { type: mongoose.Schema.Types.Mixed }
});

module.exports = mongoose.model('AuditLog', auditLogSchema);
