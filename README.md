# Veridian Corp Autonomous IT Agent

Hey! Welcome to my IT Service Desk Agent project for Veridian Corp. 

The goal of this project was to build an intelligent, autonomous agent that can read unstructured employee requests (like "my laptop screen is flickering" or "I need guest wifi"), check those requests against our company's Knowledge Base policies, and figure out the next best action without human intervention.

## 🏗️ Architecture & Workflow

I wanted the system to feel like a real IT dashboard but with an AI brain operating behind the scenes. Here is how the logic flows:

1. **The Ingestion Layer:** The system tracks incoming Employee Requests. These start in a "Not started" state.
2. **The Autonomous Agent:** When triggered, the backend fetches a batch of open requests and passes them to the LLM (Gemini).
3. **Policy Evaluation:** The agent doesn't just guess. It strictly compares the request against a seeded database of Veridian Corp IT policies.
4. **Decision Engine:** The AI decides between three core actions:
   - **RESOLVE:** For simple things (like Guest Wi-Fi) that require no IT action.
   - **ESCALATE:** For hardware replacements, security threats, or things requiring manager approval.
   - **FOLLOW UP:** When the user didn't provide enough info or just needs simple troubleshooting steps.
5. **Audit Logging:** Every single decision the AI makes is permanently logged in the database with the exact Policy ID it used to make that decision. This ensures the AI is never a "black box".

## 💻 Tech Stack & Why I Chose It

I wanted to keep the stack modern, fast, and unified.

* **Frontend: React + Vite** 
  * *Why?* I wanted a clean, snappy Single Page Application. Vite is incredibly fast for development, and React allowed me to build modular components (like the Dashboard, Requests table, and Audit Logs) without writing spaghetti code. I styled it with plain CSS and variables to easily support features like Dark Mode.
* **Backend: Node.js & Express** 
  * *Why?* Keeping the entire stack in JavaScript just makes sense. Express is lightweight and perfect for quickly standing up REST APIs to handle the agent processing logic and serve data to the frontend.
* **Database: MongoDB (Mongoose)** 
  * *Why?* IT requests and audit logs are inherently document-based. MongoDB gave me the flexibility to easily store unstructured text, nested entities, and ticket states without needing complex SQL joins.
* **AI Engine: Google Gemini API (1.5 Flash)**
  * *Why?* I needed a model that was extremely fast and cheap for batch processing. Gemini's structured JSON output mode made it super easy to force the LLM to return exactly the fields my backend needed (Decision, Reasoning, Target Status) without failing.

## 🚀 How to Run It Locally

If you want to run this on your own machine, you'll need two terminal windows.

### 1. Database Setup
First, make sure you have your MongoDB URI and Gemini API key ready.
Go into both the `frontend` and `backend` folders and duplicate the `.envexmaple` files to `.env`, filling in your keys.

### 2. Backend
\`\`\`bash
cd backend
npm install
npm run seed  # This will wipe and populate the DB with the initial test data
npm run dev
\`\`\`

### 3. Frontend
\`\`\`bash
cd frontend
npm install
npm run dev
\`\`\`

Open up `http://localhost:5173` and you're good to go!
