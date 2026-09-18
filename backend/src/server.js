require("dotenv").config();

const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

// Mount Routes
app.use("/api/agent", require("./routes/agentRoutes"));
app.use("/api/dashboard", require("./routes/dashboardRoutes"));
app.use("/api/tickets", require("./routes/ticketRoutes"));
app.use("/api/requests", require("./routes/requestRoutes"));
app.use("/api/audits", require("./routes/auditRoutes"));

const startServer = async () => {
  try {
    await connectDB();

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Server startup failed:", error.message);
    process.exit(1);
  }
};

startServer();
