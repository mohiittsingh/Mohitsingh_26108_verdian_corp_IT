const mongoose = require('mongoose');

const policySchema = new mongoose.Schema({
  policyId: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  content: { type: String, required: true },
  source: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Policy', policySchema);
