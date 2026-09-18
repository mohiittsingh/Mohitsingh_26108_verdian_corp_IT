const Policy = require('../models/Policy');
const EmployeeRequest = require('../models/EmployeeRequest');
const Ticket = require('../models/Ticket');

/**
 * Maps standard intents to their relevant Policy IDs.
 */
const intentToPolicyMap = {
  "PASSWORD_RESET": ["KB-01"],
  "VPN_ACCESS": ["KB-02"],
  "LAPTOP_ISSUE": ["KB-03", "AM-01"],
  "SOFTWARE_REQUEST": ["KB-04"],
  "PRINTER_ISSUE": ["KB-05"],
  "QUOTA_INCREASE": ["KB-06"],
  "GUEST_WIFI": ["KB-07"],
  "EXPENSE_SOFTWARE": ["KB-08"],
  "PHISHING_REPORT": ["KB-09"],
  "SECURITY_INCIDENT": ["KB-09"],
  "WFH_EQUIPMENT": ["KB-10"]
};

/**
 * Retrieves relevant policies based on the structured intent.
 * Does not invent data. Returns actual MongoDB documents.
 */
const retrievePoliciesByIntent = async (intent) => {
  const policyIds = intentToPolicyMap[intent];
  if (!policyIds || policyIds.length === 0) return [];
  
  // Retrieve the actual documents from MongoDB
  const policies = await Policy.find({ policyId: { $in: policyIds } });
  return policies;
};

/**
 * Retrieves a specific active ticket if a ticket ID is mentioned.
 */
const retrieveActiveTicket = async (ticketId) => {
  const ticket = await Ticket.findOne({ ticketId });
  // PDF states closed tickets remain visible for historical context, while active tickets are actionable.
  return ticket; 
};

/**
 * Retrieves an employee request by ID.
 */
const retrieveEmployeeRequest = async (requestId) => {
  return await EmployeeRequest.findOne({ requestId });
};

const retrieveAllPolicies = async () => {
  return await Policy.find({});
};

module.exports = {
  retrievePoliciesByIntent,
  retrieveActiveTicket,
  retrieveEmployeeRequest,
  retrieveAllPolicies
};
