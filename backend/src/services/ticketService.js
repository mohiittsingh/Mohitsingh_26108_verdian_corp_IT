const Ticket = require('../models/Ticket');

/**
 * Creates a new structured ticket for cases that require ticketing/escalation.
 * Does not modify historical tickets.
 */
const createTicket = async (employeeName, issueSummary, decision, status) => {
  // Generate a unique ticket ID. E.g. TK-83492
  const uniqueId = `TK-${Math.floor(Math.random() * 90000) + 10000}`;
  
  const newTicket = new Ticket({
    ticketId: uniqueId,
    employeeName: employeeName || "Unknown Employee",
    issueSummary: issueSummary,
    status: status || "Open"
  });

  await newTicket.save();
  return newTicket;
};

module.exports = {
  createTicket
};
