require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../config/db');

const { understandIntent } = require('../services/aiService');
const { retrievePoliciesByIntent } = require('../services/retrievalService');
const { makeDecision } = require('../services/decisionService');
const { createTicket } = require('../services/ticketService');
const { logAction } = require('../services/auditService');

const scenarios = [
  { name: "Karan Mehta", msg: "I have been locked out of my account, I tried my password 6 times." },
  { name: "Sanjay Oberoi", msg: "My VPN credentials expired yesterday." },
  { name: "Nikhil Bansal", msg: "I am a new contractor and I need VPN access." },
  { name: "Ananya Reddy", msg: "I received a very suspicious email asking for my password, I think it's phishing." }
];

const runTests = async () => {
  try {
    console.log("=== Testing Module 4: Ticket & Audit System Integration ===\n");
    await connectDB();

    for (const scenario of scenarios) {
      console.log(`[Processing Request for ${scenario.name}] -> "${scenario.msg}"`);
      
      // 1. Audit: Started processing
      const reqId = `TEST-REQ-${Date.now()}`;
      await logAction({ action: "RECEIVED_REQUEST", requestId: reqId, details: { message: scenario.msg } });

      // 2. AI Intent
      const aiResponse = await understandIntent(scenario.msg);
      const intent = aiResponse.intent;
      await logAction({ action: "PARSED_INTENT", requestId: reqId, details: { intent } });
      
      // Mapped entities for testing deterministic behavior
      let mappedEntities = {};
      const strMsg = scenario.msg.toLowerCase();
      if (intent === 'PASSWORD_RESET' && strMsg.includes('6 times')) mappedEntities = { attempts_made: 6, is_locked: true };
      if (intent === 'VPN_ACCESS' && strMsg.includes('contractor')) mappedEntities = { employee_type: 'contractor', manager_approval: false };
      if (intent === 'VPN_ACCESS' && strMsg.includes('expired')) mappedEntities = { issue: 'expired' };

      // 3. Retrieval
      const policies = await retrievePoliciesByIntent(intent);
      await logAction({ action: "RETRIEVED_POLICIES", requestId: reqId, sourcePolicyIds: policies.map(p => p.policyId) });

      // 4. Decision
      const decisionResult = makeDecision(intent, mappedEntities, policies);
      console.log(` -> Decision: ${decisionResult.decision}`);
      console.log(` -> Reason: ${decisionResult.reason}`);

      // 5. Ticket Creation (if ESCALATE or certain cases)
      let createdTicket = null;
      if (decisionResult.decision === "ESCALATE") {
        createdTicket = await createTicket(scenario.name, `Escalation for ${intent}: ${scenario.msg}`, decisionResult.decision, "Pending IT Review");
        console.log(` -> 🎟️ Ticket Created: ${createdTicket.ticketId}`);
      }

      // 6. Audit: Final decision
      await logAction({ 
        action: "FINAL_DECISION", 
        requestId: reqId, 
        ticketId: createdTicket ? createdTicket.ticketId : null,
        decision: decisionResult.decision, 
        sourcePolicyIds: decisionResult.sourcePolicyIds,
        details: { reason: decisionResult.reason }
      });
      
      console.log(" -> ✅ Request processed and audited.\n--------------------------------------------------");
    }
    
    // Check audit logs
    const AuditLog = require('../models/AuditLog');
    const logCount = await AuditLog.countDocuments();
    console.log(`\nTotal Audit Logs created during this test: ${logCount}`);

    mongoose.connection.close();
    process.exit(0);
  } catch (err) {
    console.error("Test failed:", err);
    process.exit(1);
  }
};

runTests();
