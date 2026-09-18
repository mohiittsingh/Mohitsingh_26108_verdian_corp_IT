require('dotenv').config();
const connectDB = require('../config/db');

const Policy = require('../models/Policy');
const EmployeeRequest = require('../models/EmployeeRequest');
const Ticket = require('../models/Ticket');
const AuditLog = require('../models/AuditLog');

const verifyDb = async () => {
  try {
    await connectDB();
    
    const policyCount = await Policy.countDocuments();
    const requestCount = await EmployeeRequest.countDocuments();
    const ticketCount = await Ticket.countDocuments();
    const auditCount = await AuditLog.countDocuments();

    console.log("\n--- Database Verification ---");
    console.log(`policies: ${policyCount}`);
    console.log(`employee_requests: ${requestCount}`);
    console.log(`tickets: ${ticketCount}`);
    console.log(`audit_logs: ${auditCount}`);

    process.exit(0);
  } catch (error) {
    console.error("Error verifying data:", error);
    process.exit(1);
  }
};

verifyDb();
