require('dotenv').config();
const { understandIntent } = require('../services/aiService');

const testMessages = [
  "Hi, my laptop is completely dead. I've had it for about 3.5 years. Can I get a replacement? - Aditi Sharma",
  "I think I received a phishing email, so I forwarded it to my whole team to warn them. - Ananya Reddy"
];

const runTest = async () => {
  try {
    console.log("=== Testing AI Understanding Module ===\n");
    
    for (const msg of testMessages) {
      console.log(`Input Message: "${msg}"`);
      const analysis = await understandIntent(msg);
      console.log("Structured Output:");
      console.log(JSON.stringify(analysis, null, 2));
      console.log("--------------------------------------------------\n");
    }
  } catch (err) {
    console.error("Test failed:", err.message);
  }
};

runTest();
