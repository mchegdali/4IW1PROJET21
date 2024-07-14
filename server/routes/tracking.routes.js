const express = require('express');
const router = express.Router();
const { simulateTrackingResponse } = require('../utils/trackingUtils');

// Route GET pour le suivi de colis
router.get('/', (req, res) => {
  const { tracking_number } = req.query;

  if (!tracking_number) {
    return res.status(400).json({ error: 'Le paramètre tracking_number est requis' });
  }

  // Simuler une réponse de suivi de colis
  const response = simulateTrackingResponse(tracking_number);
  res.json(response);
});

module.exports = router;
