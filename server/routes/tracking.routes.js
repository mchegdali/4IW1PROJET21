const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const { generateTrackingEvents } = require('../utils/trackingUtils');
const Order = require('../models/mongo/orders.mongo');

router.get('/', async (req, res) => {
  const { tracking_number } = req.query;

  if (!tracking_number) {
    return res.status(400).json({ error: 'Le paramètre tracking_number est requis' });
  }

  try {
    const order = await Order.findOne({ orderNumber: tracking_number }).exec();

    if (!order) {
      return res.status(404).json({ error: 'Commande non trouvée' });
    }

    const response = generateTrackingEvents(order);
    res.json(response);
  } catch (error) {
    console.error('Erreur lors de la récupération de la commande:', error.message);
    res.status(500).json({ error: 'Erreur interne du serveur' });
  }
});

module.exports = router;
