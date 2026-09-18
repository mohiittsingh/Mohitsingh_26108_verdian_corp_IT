const express = require('express');
const router = express.Router();
const EmployeeRequest = require('../models/EmployeeRequest');

router.get('/', async (req, res) => {
  try {
    const requests = await EmployeeRequest.find().sort({ createdAt: -1 });
    res.json(requests);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch requests" });
  }
});

module.exports = router;
