const express = require('express');
const router = express.Router();
const { understandIntent } = require('../services/aiService');
const { retrievePoliciesByIntent } = require('../services/retrievalService');
const { makeDecision } = require('../services/decisionService');
const { logAction } = require('../services/auditService');
const { createTicket } = require('../services/ticketService');
const EmployeeRequest = require('../models/EmployeeRequest');

router.post('/process', async (req, res) => {
  try {
    const { message, employeeName = "Internal Employee" } = req.body;
    
    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    // 1. Create a request record to track this incoming query
    const requestId = `REQ-${Math.floor(Math.random() * 90000) + 10000}`;
    const newRequest = new EmployeeRequest({
      requestId,
      employeeName,
      requestText: message,
      initialAction: "Agent Processing"
    });
    await newRequest.save();

    // 2. AI understands intent
    const { intent, entities, summary } = await understandIntent(message);

    // 3. Retrieve policies
    const policies = await retrievePoliciesByIntent(intent);

    // 4. Decision Engine
    const decisionResult = makeDecision(intent, entities, policies);

    let ticket = null;
    
    // 5. Create ticket if ESCALATE
    if (decisionResult.decision === "ESCALATE") {
      ticket = await createTicket(employeeName, summary, decisionResult.decision, "Open");
    }

    // 6. Audit logging
    const audit = await logAction({
      action: summary,
      requestId,
      ticketId: ticket ? ticket.ticketId : null,
      decision: decisionResult.decision,
      sourcePolicyIds: decisionResult.sourcePolicyIds,
      details: { intent, entities, reason: decisionResult.reason }
    });

    // 7. Respond with API contract
    res.json({
      response: summary,
      decision: decisionResult.decision,
      reason: decisionResult.reason,
      sources: decisionResult.sourcePolicyIds,
      ticket: ticket,
      audit: audit
    });

  } catch (error) {
    console.error("Agent Process Error:", error);
    res.status(500).json({ error: "Failed to process request." });
  }
});

const { evaluateCase } = require('../services/aiService');
const { retrieveAllPolicies } = require('../services/retrievalService');
const Ticket = require('../models/Ticket');


const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

router.post('/process-backlog', async (req, res) => {
  try {
    const policies = await retrieveAllPolicies();
    
    // Process Employee Requests
    let processedCount = 0;
    let failedCount = 0;
    const BATCH_LIMIT = 15; // Process up to 15 items per click for the demonstration

    const openRequests = await EmployeeRequest.find({ status: { $ne: 'Resolved' } });
    for (const request of openRequests) {
      if (processedCount >= BATCH_LIMIT) break;
      if (request.status === 'Escalated to Security') continue;
      // Skip requests that were already agent-processed but waiting on someone else
      if (request.status === 'Waiting on Security review' || request.status === 'Waiting on employee response') continue;
      // Skip requests that already have a status assigned by the agent (not 'Not started')
      if (request.status !== 'Not started' && request.status !== 'In progress — reset queued' && request.status !== 'Agent Processing') continue;
      
      try {
        const evaluation = await evaluateCase(request, policies);
        request.status = evaluation.targetStatus;
        request.actionTakenSoFar = evaluation.updateActionTakenSoFar;
        await request.save();

        await logAction({
          action: `Agent processed request: ${request.requestId}`,
          requestId: request.requestId,
          decision: evaluation.decision,
          sourcePolicyIds: evaluation.sourcePolicyIds,
          details: { reasoning: evaluation.reasoning }
        });
        processedCount++;
      } catch (err) {
        console.warn(`Skipped request ${request.requestId} due to AI error`);
        failedCount++;
      }
      
      await sleep(1500);
    }

    // Process Tickets
    if (processedCount < BATCH_LIMIT) {
      const openTickets = await Ticket.find({ status: { $ne: 'Resolved (closed)' } });
      for (const ticket of openTickets) {
        if (processedCount >= BATCH_LIMIT) break;
        if (ticket.status.includes('Escalated') || ticket.status.includes('Pending')) {
           try {
             const evaluation = await evaluateCase(ticket, policies);
             
             if (evaluation.targetStatus !== ticket.status) {
               ticket.status = evaluation.targetStatus;
               await ticket.save();
               
               await logAction({
                 action: `Agent processed ticket: ${ticket.ticketId}`,
                 ticketId: ticket.ticketId,
                 decision: evaluation.decision,
                 sourcePolicyIds: evaluation.sourcePolicyIds,
                 details: { reasoning: evaluation.reasoning }
               });
             }
             processedCount++;
           } catch (err) {
             console.warn(`Skipped ticket ${ticket.ticketId} due to AI error`);
             failedCount++;
           }
           await sleep(1500);
        }
      }
    }

    res.json({ success: true, message: `Processed ${processedCount} items. ${failedCount > 0 ? `(${failedCount} skipped due to API rate limits)` : ''}` });
  } catch (error) {
    console.error("Backlog Process Error:", error);
    res.status(500).json({ error: "Failed to process backlog." });
  }
});

module.exports = router;
