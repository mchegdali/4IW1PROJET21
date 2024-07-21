const generateTrackingEvents = (order) => {
  const events = [];
  const createdAt = new Date(order.createdAt);

  // Calcul des dates des événements
  const shippingDate = new Date(createdAt);
  shippingDate.setDate(createdAt.getDate() + 1); // Expédition 1 jour après la création

  const inTransitDate = new Date(shippingDate);
  inTransitDate.setDate(shippingDate.getDate() + 2); // En transit 2 jours après l'expédition

  const deliveryDate = new Date(inTransitDate);
  deliveryDate.setDate(inTransitDate.getDate() + 5); // Livraison 5 jours après le transit

  // Ajouter les événements de suivi
  events.push({
    occurred_at: createdAt.toISOString(),
    description: "Commande reçue.",
    city_locality: "Paris",
    state_province: "Île-de-France",
    country_code: "FR",
    event_code: "RECEIVED"
  });

  if (order.status.label !== 'delivered') {
    events.push({
      occurred_at: shippingDate.toISOString(),
      description: "Colis expédié.",
      city_locality: "Paris",
      state_province: "Île-de-France",
      country_code: "FR",
      event_code: "SHIPPED"
    });

    if (order.status.label == 'Delivered') {
    events.push({
      occurred_at: inTransitDate.toISOString(),
      description: "Colis en transit.",
      city_locality: "Cergy",
      state_province: "Île-de-France",
      country_code: "FR",
      event_code: "IN_TRANSIT"
    });

    // Ajouter la livraison si l'état est 'Delivered'
    // La date de livraison est simulée ici pour la démonstration
    
      events.push({
        occurred_at: deliveryDate.toISOString(),
        description: "Colis livré.",
        city_locality: order.shipping.city,
        state_province: order.shipping.zipCode,
        country_code: "FR",
        event_code: "DELIVERED"
      });
    }
  } 

  return {
    tracking_number: order.orderNumber,
    status_description: order.status.label,
    status_code: order.status._id.toString(),
    carrier_code: "DHL",
    events
  };
};

module.exports = {
  generateTrackingEvents
};
