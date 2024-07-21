const dayjs = require('dayjs');
import config from '@/config';

// URL de l'API
const API_URL = `${config.apiBaseUrl}/orders`;

// Fonction pour récupérer les commandes
async function fetchOrders() {
    try {
        const fetch = (await import('node-fetch')).default;
        console.log('Récupération des commandes...');
        const response = await fetch(API_URL);
        if (!response.ok) {
            throw new Error(`Erreur HTTP lors de la récupération des commandes: ${response.status}`);
        }
        const orders = await response.json();
        console.log(`Nombre de commandes récupérées: ${orders.length}`);
        return orders;
    } catch (error) {
        console.error('Erreur lors de la récupération des commandes:', error);
        return [];
    }
}

// Fonction pour mettre à jour le statut d'une commande
async function updateOrderStatus(orderId) {
    try {
        const fetch = (await import('node-fetch')).default;
        console.log(`Mise à jour du statut de la commande ${orderId}...`);
        const response = await fetch(`${API_URL}/${orderId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                status: {
                    _id: '4443e94f-21df-4737-92d7-f7f637278c4d', // ID du statut "Livrer"
                    label: 'Livrer'
                }
            })
        });

        if (!response.ok) {
            throw new Error(`Erreur HTTP lors de la mise à jour de la commande ${orderId}: ${response.status}`);
        }

        console.log(`Commande ${orderId} mise à jour en 'Livrer'.`);
    } catch (error) {
        console.error(`Erreur lors de la mise à jour de la commande ${orderId}:`, error);
    }
}

// Fonction principale pour vérifier et mettre à jour les commandes
async function checkAndUpdateOrders() {
    console.log('Vérification des commandes...');
    const orders = await fetchOrders();
    const today = dayjs();
    
    for (const order of orders) {
        const createdAt = dayjs(order.createdAt);
        const daysDifference = today.diff(createdAt, 'day');

        if (daysDifference >= 2) {
            if (order.status.label !== 'Livrer') {
                console.log(`Commande ${order._id} a besoin d'une mise à jour.`);
                await updateOrderStatus(order._id);
            } else {
                console.log(`Commande ${order._id} est déjà marquée comme 'Livrer'.`);
            }
        } else {
            console.log(`Commande ${order._id} ne nécessite pas de mise à jour (écart de ${daysDifference} jours).`);
        }
    }
}

// Exécuter la vérification et la mise à jour toutes les 5 secondes
setInterval(checkAndUpdateOrders, 5 * 1000);

// Exécuter immédiatement au démarrage
checkAndUpdateOrders();
