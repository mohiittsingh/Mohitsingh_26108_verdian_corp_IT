require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../config/db');

const Policy = require('../models/Policy');
const EmployeeRequest = require('../models/EmployeeRequest');
const Ticket = require('../models/Ticket');
const AuditLog = require('../models/AuditLog');

const policies = [
  { policyId: "KB-01", title: "Password Reset", content: "Employees can reset their own password via self-service at any time. After 5 failed attempts / locked out, contact IT for manual unlock. No approval required.", source: "Assignment 2_DataPack_InternalServiceAgent(2).pdf" },
  { policyId: "KB-02", title: "VPN Access", content: "Full-time employees get VPN automatically. Contractors require manager approval through the access request form. VPN credentials expire every 90 days and must be renewed.", source: "Assignment 2_DataPack_InternalServiceAgent(2).pdf" },
  { policyId: "KB-03", title: "Laptop Replacement", content: "Eligible after 3 years of service, or earlier for verified hardware failure. Request must be raised at least 2 weeks in advance.", source: "Assignment 2_DataPack_InternalServiceAgent(2).pdf" },
  { policyId: "KB-04", title: "Software Installation", content: "Standard approved-catalog software can be self-installed. Non-catalog software requires IT Security review. Review takes 3–5 business days.", source: "Assignment 2_DataPack_InternalServiceAgent(2).pdf" },
  { policyId: "KB-05", title: "Printer Troubleshooting", content: "Check printer queue and restart print spooler first. If issue persists, log a ticket with printer asset tag.", source: "Assignment 2_DataPack_InternalServiceAgent(2).pdf" },
  { policyId: "KB-06", title: "Email Mailbox Quota", content: "Default quota = 25GB. Employees nearing quota should archive old mail. Increase above 25GB requires manager approval. Maximum = 50GB.", source: "Assignment 2_DataPack_InternalServiceAgent(2).pdf" },
  { policyId: "KB-07", title: "Guest Wi-Fi", content: "Guest Wi-Fi credentials valid for 24 hours. Any employee can generate them at front-desk kiosk. No IT ticket required.", source: "Assignment 2_DataPack_InternalServiceAgent(2).pdf" },
  { policyId: "KB-08", title: "Expense Software", content: "Access is granted by Finance, not IT. IT can assist with login/technical issues only after an account exists.", source: "Assignment 2_DataPack_InternalServiceAgent(2).pdf" },
  { policyId: "KB-09", title: "Security Incident Reporting", content: "Suspected phishing, malware, or unauthorized access must be reported immediately to: security@veridian-corp.example. Should NOT be forwarded to other employees.", source: "Assignment 2_DataPack_InternalServiceAgent(2).pdf" },
  { policyId: "KB-10", title: "Work-From-Home Equipment", content: "Employees working remotely >3 days/week are eligible for a one-time home office equipment allowance (chair, monitor). Requires manager sign-off and Finance processing. IT handles shipping only after approval.", source: "Assignment 2_DataPack_InternalServiceAgent(2).pdf" },
  { policyId: "AM-01", title: "Asset Management Policy Extract", content: "Company hardware, including laptops and monitors, follows a standard 4-year refresh cycle from date of issue. Early replacement outside the cycle requires Finance sign-off in addition to IT approval.", source: "Assignment 2_DataPack_InternalServiceAgent(2).pdf" }
];

const employeeRequests = [
  { requestId: "REQ-01", employeeName: "Aditi Sharma", employeeEmail: "aditi.sharma@veridian-corp.example", dateOpened: new Date("2026-09-21T09:00:00Z"), requestText: "laptop completely dead, about 3.5 years", initialAction: "Not started" },
  { requestId: "REQ-02", employeeName: "Vikram Chawla", employeeEmail: "vikram.chawla@veridian-corp.example", dateOpened: new Date("2026-09-21T09:00:00Z"), requestText: "guest Wi-Fi tomorrow", initialAction: "Not started" },
  { requestId: "REQ-03", employeeName: "Karan Mehta", employeeEmail: "karan.mehta@veridian-corp.example", dateOpened: new Date("2026-09-21T09:00:00Z"), requestText: "locked out, password tried 6 times", initialAction: "Not started" },
  { requestId: "REQ-04", employeeName: "Ritu Bhatia", employeeEmail: "ritu.bhatia@veridian-corp.example", dateOpened: new Date("2026-09-21T09:00:00Z"), requestText: "non-catalog data-analysis tool", initialAction: "Not started" },
  { requestId: "REQ-05", employeeName: "Sanjay Oberoi", employeeEmail: "sanjay.oberoi@veridian-corp.example", dateOpened: new Date("2026-09-21T09:00:00Z"), requestText: "VPN credentials expired", initialAction: "Not started" },
  { requestId: "REQ-06", employeeName: "Meera Iyer", employeeEmail: "meera.iyer@veridian-corp.example", dateOpened: new Date("2026-09-21T09:00:00Z"), requestText: "3rd-floor printer false paper-jam", initialAction: "technician assigned" },
  { requestId: "REQ-07", employeeName: "Farhan Ali", employeeEmail: "farhan.ali@veridian-corp.example", dateOpened: new Date("2026-09-21T09:00:00Z"), requestText: "WFH 4 days/week, asks how to get monitor", initialAction: "Not started" },
  { requestId: "REQ-08", employeeName: "Ananya Reddy", employeeEmail: "ananya.reddy@veridian-corp.example", dateOpened: new Date("2026-09-21T09:00:00Z"), requestText: "suspected phishing email, forwarding to teammates", initialAction: "Escalated to Security (auto-flagged)" },
  { requestId: "REQ-09", employeeName: "Rohit Desai", employeeEmail: "rohit.desai@veridian-corp.example", dateOpened: new Date("2026-09-21T09:00:00Z"), requestText: "mailbox full, can't send emails", initialAction: "Not started" },
  { requestId: "REQ-10", employeeName: "Kavya Pillai", employeeEmail: "kavya.pillai@veridian-corp.example", dateOpened: new Date("2026-09-21T09:00:00Z"), requestText: "urgent admin access to finance reporting server", initialAction: "Not started" },
  { requestId: "REQ-11", employeeName: "Nikhil Bansal", employeeEmail: "nikhil.bansal@veridian-corp.example", dateOpened: new Date("2026-09-21T09:00:00Z"), requestText: "new contractor needs VPN", initialAction: "Not started" },
  { requestId: "REQ-12", employeeName: "Sneha Kulkarni", employeeEmail: "sneha.kulkarni@veridian-corp.example", dateOpened: new Date("2026-09-21T09:00:00Z"), requestText: "cannot log into expense tool, invalid credentials", initialAction: "waiting for screenshot/no reply" },
  { requestId: "REQ-13", employeeName: "Aman Gupta", employeeEmail: "aman.gupta@veridian-corp.example", dateOpened: new Date("2026-09-21T09:00:00Z"), requestText: "laptop screen flickering, 2 years old, may need repair", initialAction: "Not started" },
  { requestId: "REQ-14", employeeName: "Tanya Chopra", employeeEmail: "tanya.chopra@veridian-corp.example", dateOpened: new Date("2026-09-21T09:00:00Z"), requestText: "approval to install productivity-tracking browser extension", initialAction: "Not started" },
  { requestId: "REQ-15", employeeName: "Rahul Menon", employeeEmail: "rahul.menon@veridian-corp.example", dateOpened: new Date("2026-09-21T09:00:00Z"), requestText: "hey can you help, its not working", initialAction: "Not started" }
];

const tickets = [
  { ticketId: "TK-1042", employeeName: "R. Verma", issueSummary: "VPN credential expired", status: "Resolved (closed)" },
  { ticketId: "TK-1043", employeeName: "S. Iyer", issueSummary: "Laptop replacement (3.2 yrs old)", status: "Approved, pending fulfillment (active)" },
  { ticketId: "TK-1044", employeeName: "A. Khan", issueSummary: "Non-catalog software request", status: "Pending Security review (active)" },
  { ticketId: "TK-1045", employeeName: "P. Joshi", issueSummary: "Mailbox quota increase", status: "Approved at 35GB (closed)" },
  { ticketId: "TK-1046", employeeName: "M. Das", issueSummary: "Printer paper jam, floor 2", status: "Resolved (closed)" },
  { ticketId: "TK-1047", employeeName: "K. Singh", issueSummary: "Home office equipment request", status: "Pending Finance (active)" },
  { ticketId: "TK-1048", employeeName: "T. Rao", issueSummary: "Phishing email reported", status: "Escalated to Security, under investigation (active)" },
  { ticketId: "TK-1049", employeeName: "V. Nambiar", issueSummary: "Password reset", status: "Resolved (closed)" },
  { ticketId: "TK-1050", employeeName: "J. Fernandes", issueSummary: "Admin access request", status: "Rejected, no business justification provided (closed)" },
  { ticketId: "TK-1051", employeeName: "L. Menon", issueSummary: "Guest Wi-Fi issued", status: "Resolved (closed)" }
];

const seedData = async () => {
  try {
    await connectDB();

    console.log("Seeding policies...");
    for (const policy of policies) {
      await Policy.findOneAndUpdate({ policyId: policy.policyId }, policy, { upsert: true, new: true });
    }

    console.log("Seeding employee requests...");
    for (const req of employeeRequests) {
      req.status = req.initialAction;
      req.actionTakenSoFar = req.initialAction;
      await EmployeeRequest.findOneAndUpdate({ requestId: req.requestId }, req, { upsert: true, new: true });
    }

    console.log("Seeding tickets...");
    for (const ticket of tickets) {
      await Ticket.findOneAndUpdate({ ticketId: ticket.ticketId }, ticket, { upsert: true, new: true });
    }

    // Explicitly not creating mock audit logs to keep it at 0.
    
    console.log("\n--- Seeding Complete ---");
    
    // We will verify in verifyDb.js, but printing here too
    const policyCount = await Policy.countDocuments();
    const requestCount = await EmployeeRequest.countDocuments();
    const ticketCount = await Ticket.countDocuments();
    const auditCount = await AuditLog.countDocuments();

    console.log(`policies: ${policyCount}`);
    console.log(`employee_requests: ${requestCount}`);
    console.log(`tickets: ${ticketCount}`);
    console.log(`audit_logs: ${auditCount}`);

    process.exit(0);
  } catch (error) {
    console.error("Error seeding data:", error);
    process.exit(1);
  }
};

seedData();
