# Veridian Corp Autonomous IT Agent

An intelligent, AI-powered IT Service Desk Agent designed for Veridian Corp. This system automates the triage, classification, and resolution of unstructured employee IT requests by evaluating them against a corporate Knowledge Base (KB).

---

## 🏛️ High-Level Architecture

The system is built on a decoupled architecture, separating the client-side dashboard from the intelligent decision-making backend.

```mermaid
graph TD
    subgraph Frontend [React / Vite SPA]
        UI[User Dashboard]
        ReqTab[Requests & Tickets View]
        Audit[Audit Logs]
    end

    subgraph Backend [Node.js / Express]
        API[RESTful API Routes]
        Engine[Agent Decision Engine]
    end
    
    subgraph Services [External Services]
        LLM[Google Gemini API]
        DB[(MongoDB)]
    end

    UI -->|HTTP POST| API
    ReqTab -->|HTTP GET| API
    Audit -->|HTTP GET| API
    
    API <--> Engine
    Engine <-->|Context & Policies| DB
    Engine <-->|Prompt & JSON Response| LLM
```

---

## 🔄 Request Processing Workflow

When the system processes the backlog of employee requests, it follows a strict sequence to ensure accuracy, safety, and traceability.

```mermaid
sequenceDiagram
    participant User as IT Admin
    participant Server as Node.js Backend
    participant DB as MongoDB
    participant AI as Gemini LLM

    User->>Server: Click "Run Agent on Backlog"
    Server->>DB: Fetch open requests (Status: Not started)
    DB-->>Server: Return batch of requests
    
    loop For each request
        Server->>DB: Fetch Knowledge Base policies
        DB-->>Server: Return relevant policies
        
        Server->>AI: Send prompt (Request Data + KB Policies)
        Note over AI: Analyzes intent<br/>Checks constraints<br/>Formulates decision
        AI-->>Server: Return structured JSON decision
        
        alt Decision == RESOLVE
            Server->>Server: Update status to "Resolved"
        else Decision == ESCALATE
            Server->>Server: Update status to "Escalated"
        else Decision == FOLLOW_UP
            Server->>Server: Request more info / Manager Approval
        end
        
        Server->>DB: Save updated Request state
        Server->>DB: Write permanent Audit Log
    end
    
    Server-->>User: Return Success (UI updates)
```

---

## 🧠 The AI Decision Engine

The core of the system is the autonomous AI agent. It acts as a rigid, policy-driven classifier rather than an open-ended chatbot. It is explicitly instructed to never hallucinate policies and to always base decisions strictly on the provided KB.

```mermaid
flowchart TD
    Start([Incoming Request]) --> Extract[Extract Intent & Entities]
    Extract --> Match[Retrieve Relevant KB Policies]
    Match --> Evaluate{Does request violate policy?}
    
    Evaluate -->|Yes| Reject[Action: REJECT / ESCALATE]
    Evaluate -->|No| CheckAction{Does it require IT action?}
    
    CheckAction -->|No| Resolve[Action: AUTO-RESOLVE]
    CheckAction -->|Yes| Escalate[Action: ESCALATE TO HUMAN]
    
    Reject --> Log
    Resolve --> Log
    Escalate --> Log
    
    Log[(Write to Audit Log)] --> End([Process Complete])
```

---

## 💻 Technology Stack & Rationale

* **Frontend: React + Vite** 
  * *Rationale:* Provides a highly responsive Single Page Application (SPA). Vite offers exceptional development speed. The UI is built with modular components (Dashboards, Tables, Audit Logs) and utilizes native CSS variables for seamless light/dark mode switching.
* **Backend: Node.js & Express** 
  * *Rationale:* Maintaining a unified JavaScript stack across the frontend and backend reduces context switching. Express is lightweight and highly unopinionated, making it perfect for standing up rapid REST APIs that interface with the AI engine.
* **Database: MongoDB (Mongoose)** 
  * *Rationale:* IT requests, chat history, and audit logs are inherently document-based and unstructured. A NoSQL database like MongoDB allows for flexible schema design, enabling us to easily store nested AI entity extractions without complex SQL migrations.
* **AI Engine: Google Gemini API**
  * *Rationale:* Gemini is utilized for its exceptional speed and robust `responseMimeType: "application/json"` capability. This guarantees that the LLM returns perfectly structured JSON (Decision, Reasoning, Target Status) directly to the backend without parsing errors.

---

## 🚀 Local Setup & Installation

To run this environment locally, you will need Node.js installed.

### 1. Environment Configuration
Duplicate the `.envexmaple` file in both the `/frontend` and `/backend` directories. Rename them to `.env` and insert your MongoDB URI and Gemini API Key.

### 2. Backend Initialization
\`\`\`bash
cd backend
npm install
npm run seed  # Wipes the DB and populates the initial Assignment 2 test data
npm run dev
\`\`\`

### 3. Frontend Initialization
\`\`\`bash
cd frontend
npm install
npm run dev
\`\`\`

Navigate to `http://localhost:5173` to access the Veridian Corp IT Dashboard.
