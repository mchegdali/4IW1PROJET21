const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const { generateTrackingEvents } = require('../utils/trackingUtils');
const Order = require('../models/mongo/orders.mongo'); // Assurez-vous que le chemin est correct

// Route GET pour le suivi de colis
router.get('/', async (req, res) => {
  const { tracking_number } = req.query;

  if (!tracking_number) {
    return res.status(400).json({ error: 'Le paramètre tracking_number est requis' });
  }

  try {
    // Trouver la commande dans la base de données en utilisant l'ID de suivi
    const order = await Order.findOne({ orderNumber: tracking_number }).exec();

    if (!order) {
      return res.status(404).json({ error: 'Commande non trouvée' });
    }

    // Générer les événements de suivi en utilisant les informations de la commande
    const response = generateTrackingEvents(order);
    res.json(response);
  } catch (error) {
    console.error('Erreur lors de la récupération de la commande:', error.message);
    res.status(500).json({ error: 'Erreur interne du serveur' });
  }
});

module.exports = router;
