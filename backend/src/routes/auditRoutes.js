const express = require('express');
const router = express.Router();
const AuditLog = require('../models/AuditLog');

router.get('/', async (req, res) => {
  try {
    const audits = await AuditLog.find().sort({ timestamp: -1 });
    res.json(audits);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch audits" });
  }
});

module.exports = router;
