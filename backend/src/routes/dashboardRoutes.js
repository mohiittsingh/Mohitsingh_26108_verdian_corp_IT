const express = require('express');
const router = express.Router();
const Ticket = require('../models/Ticket');
const EmployeeRequest = require('../models/EmployeeRequest');
const AuditLog = require('../models/AuditLog');

router.get('/stats', async (req, res) => {
  try {
    const totalRequests = await EmployeeRequest.countDocuments();
    const activeTickets = await Ticket.countDocuments({ status: 'Open' });
    const resolvedTickets = await Ticket.countDocuments({ status: 'Resolved' });
    
    // An Escalated case could mean tickets that have "Escalated" status, or Audits with decision ESCALATE.
    const escalatedCases = await AuditLog.countDocuments({ decision: 'ESCALATE' });
    
    // We can also count resolved cases from audits if a ticket wasn't generated
    const resolvedCases = await AuditLog.countDocuments({ decision: 'RESOLVE' });
    
    res.json({
      totalRequests,
      activeTickets,
      resolvedTickets: resolvedTickets + resolvedCases,
      escalatedCases
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch stats" });
  }
});

router.get('/activity', async (req, res) => {
  try {
    const activities = await AuditLog.find().sort({ timestamp: -1 }).limit(10);
    res.json(activities);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch activity" });
  }
});

module.exports = router;
