require('dotenv').config();
const connectDB = require('../config/db');
const { understandIntent } = require('../services/aiService');
const { retrievePoliciesByIntent } = require('../services/retrievalService');
const { makeDecision } = require('../services/decisionService');
const mongoose = require('mongoose');

const scenarios = [
  "I have been locked out of my account, I tried my password 6 times.",
  "My VPN credentials expired yesterday.",
  "I am a new contractor and I need VPN access.",
  "I received a very suspicious email asking for my password, I think it's phishing.",
  "I need guest Wi-Fi for a visitor tomorrow.",
  "My mailbox is full, I need more space.",
  "Hey can you help, its not working"
];

const runTests = async () => {
  try {
    console.log("=== Testing Module 3: Retrieval & Decision Engine ===");
    await connectDB();

    for (const msg of scenarios) {
      console.log(`\nScenario: "${msg}"`);
      
      // 1. Intent from AI
      const aiResponse = await understandIntent(msg);
      // Let's force-map entities if Gemini structure is slightly different for our tests
      const intent = aiResponse.intent;
      
      // Attempt to map unstructured extracted values to our deterministic inputs for testing
      let mappedEntities = {};
      const strMsg = msg.toLowerCase();
      
      if (intent === 'PASSWORD_RESET' && strMsg.includes('6 times')) {
        mappedEntities = { attempts_made: 6, is_locked: true };
      } else if (intent === 'VPN_ACCESS' && strMsg.includes('contractor')) {
        mappedEntities = { employee_type: 'contractor', manager_approval: false };
      } else if (intent === 'VPN_ACCESS' && strMsg.includes('expired')) {
        mappedEntities = { issue: 'expired' };
      }
      
      console.log(`1. Intent: ${intent}`);

      // 2. Retrieval
      const policies = await retrievePoliciesByIntent(intent);
      const policyTitles = policies.map(p => p.title).join(', ') || 'No policy found';
      console.log(`2. Retrieved Policy: ${policyTitles}`);

      // 3 & 4 & 5. Decision
      const decisionResult = makeDecision(intent, mappedEntities, policies);
      console.log(`3. Decision: ${decisionResult.decision}`);
      console.log(`4. Reason: ${decisionResult.reason}`);
      console.log(`5. Source Policy ID(s): ${decisionResult.sourcePolicyIds.join(', ')}`);
      console.log("--------------------------------------------------");
    }
    
    mongoose.connection.close();
    process.exit(0);
  } catch (err) {
    console.error("Test failed:", err);
    process.exit(1);
  }
};

runTests();
