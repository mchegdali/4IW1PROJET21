// trackingUtils.js

// Fonction pour générer une date aléatoire dans une plage donnée
const randomDate = (start, end) => {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
};

// Fonction pour ajouter des jours à une date
const addDays = (date, days) => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

// Fonction pour simuler des données aléatoires de suivi de colis
const simulateTrackingResponse = (trackingNumber) => {
  const randomCarrierCode = Math.random() < 0.5 ? "ups" : "fedex"; // Choisir aléatoirement entre "ups" et "fedex"
  
  // Générer une date de commande aléatoire (entre le 20 et le 24 juillet)
  const orderDate = randomDate(new Date(2023, 6, 20), new Date(2023, 6, 24));

  // Générer une date de livraison au moins 3 jours après la date de commande
  const deliveredDate = addDays(orderDate, 3 + Math.floor(Math.random() * 3));

  // Générer des événements aléatoires
  const events = [];

  // Première étape: Expédition de Paris
  events.push({
    occurred_at: addDays(orderDate, 1).toISOString(),
    description: "Colis parti de l'installation.",
    city_locality: "Paris",
    state_province: "Île-de-France",
    country_code: "FR",
    event_code: "DEPARTURE"
  });

  // Étape intermédiaire: Tri au centre de distribution à Cergy (dans le 95)
  const sortedDate = addDays(orderDate, 2);
  events.push({
    occurred_at: sortedDate.toISOString(),
    description: "Colis trié au centre de distribution.",
    city_locality: "Cergy",
    state_province: "Île-de-France",
    country_code: "FR",
    event_code: "SORTING"
  });

  // Dernière étape: En cours de livraison dans le 95
  const inTransitDate = randomDate(sortedDate, deliveredDate);
  events.push({
    occurred_at: inTransitDate.toISOString(),
    description: "Colis en cours de livraison.",
    city_locality: "Argenteuil",
    state_province: "Île-de-France",
    country_code: "FR",
    event_code: "IN_TRANSIT"
  });

  // Événement final: Livraison dans le 95
  events.push({
    occurred_at: deliveredDate.toISOString(),
    description: "Colis livré avec succès.",
    city_locality: "Argenteuil",
    state_province: "Île-de-France",
    country_code: "FR",
    event_code: "DELIVERED"
  });

  return {
    tracking_number: trackingNumber,
    tracking_url: `http://www.example.com/tracking/${trackingNumber}`,
    status_code: "DL",
    carrier_code: randomCarrierCode,
    carrier_id: Math.floor(Math.random() * 10) + 1, // Identifiant de transporteur aléatoire entre 1 et 10
    status_description: "Livré",
    events: events.sort((a, b) => new Date(a.occurred_at) - new Date(b.occurred_at))
  };
};

module.exports = {
  simulateTrackingResponse
};
