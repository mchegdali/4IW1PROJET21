const generateTrackingEvents = (order) => {
  const events = [];
  const createdAt = new Date(order.createdAt);

  const setEventTime = (date, hours, minutes, seconds = 0) => {
    date.setUTCHours(hours, minutes, seconds);
  };

  const shippingDate = new Date(createdAt);
  shippingDate.setUTCDate(createdAt.getUTCDate() + 1); // Expédition 1 jour après la création
  setEventTime(shippingDate, 10, 0);

  const inTransitDate = new Date(shippingDate);
  inTransitDate.setUTCDate(shippingDate.getUTCDate() + 1); // En transit 1 jour après l'expédition
  setEventTime(inTransitDate, 12, 30);

  const outForDeliveryDate = new Date(inTransitDate);
  outForDeliveryDate.setUTCDate(inTransitDate.getUTCDate() + 1); // En cours de livraison 1 jour après le transit
  setEventTime(outForDeliveryDate, 14, 45);

  const deliveryDate = new Date(outForDeliveryDate);
  deliveryDate.setUTCDate(outForDeliveryDate.getUTCDate());
  setEventTime(deliveryDate, 16, 0);

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

    if (order.status.label === 'Delivered') {
      events.push({
        occurred_at: inTransitDate.toISOString(),
        description: "Colis en transit.",
        city_locality: "Cergy",
        state_province: "Île-de-France",
        country_code: "FR",
        event_code: "IN_TRANSIT"
      });

      events.push({
        occurred_at: outForDeliveryDate.toISOString(),
        description: "En cours de livraison.",
        city_locality: order.address.city,
        state_province: order.address.zipCode,
        country_code: "FR",
        event_code: "OUT_FOR_DELIVERY"
      });

      events.push({
        occurred_at: deliveryDate.toISOString(),
        description: "Colis livré.",
        city_locality: order.address.city,
        state_province: order.address.zipCode,
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
