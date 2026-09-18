const mongoose = require('mongoose');

const employeeRequestSchema = new mongoose.Schema({
  requestId: { type: String, required: true, unique: true },
  employeeName: { type: String, required: true },
  employeeEmail: { type: String }, // Optional, as it wasn't provided for everyone in PDF
  dateOpened: { type: Date, default: Date.now },
  requestText: { type: String, required: true },
  initialAction: { type: String, required: true },
  status: { type: String, default: 'Not started' },
  actionTakenSoFar: { type: String, default: 'Not started' }
}, { timestamps: true });

module.exports = mongoose.model('EmployeeRequest', employeeRequestSchema);
