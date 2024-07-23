require('dotenv').config();
const dayjs = require('dayjs');
const Order = require('../models/mongo/orders.mongo');
const StatusMongo = require('../models/mongo/status.mongo');

async function fetchOrders() {
    try {
        console.log('Récupération des commandes...');
        const orders = await Order.find({});
        console.log(`Nombre de commandes récupérées: ${orders.length}`);
        return orders;
    } catch (error) {
        console.error('Erreur lors de la récupération des commandes:', error);
        return [];
    }
}

async function updateOrderStatus(orderId, statusLabel) {
    try {
        console.log(`Mise à jour du statut de la commande ${orderId} en ${statusLabel}...`);

        const status = await StatusMongo.findOne({ label: statusLabel }).exec();
        if (!status) {
            throw new Error(`Statut '${statusLabel}' introuvable`);
        }

        const updateFields = { 
            status: { _id: status._id, label: statusLabel }
        };

        if (statusLabel === 'Shipped') {
            const order = await Order.findById(orderId).exec();
            if (!order) {
                throw new Error(`Commande ${orderId} introuvable`);
            }
            const createdAt = dayjs(order.createdAt);
            updateFields.shippingDate = createdAt.add(1, 'minute').toDate();
        }

        const result = await Order.updateOne(
            { _id: orderId },
            { $set: updateFields }
        ).exec();

        if (result.nModified === 0) {
            throw new Error(`Aucune mise à jour effectuée pour la commande ${orderId}`);
        }

        console.log(`Commande ${orderId} mise à jour en '${statusLabel}'.`);
    } catch (error) {
        console.error(`Erreur lors de la mise à jour de la commande ${orderId}:`, error);
    }
}

async function checkAndUpdateOrders() {
    console.log('Vérification des commandes...');
    const orders = await fetchOrders();
    const now = dayjs();

    for (const order of orders) {
        const createdAt = dayjs(order.createdAt);
        const minutesDifference = now.diff(createdAt, 'minute');

        if (order.status.label === 'Cancelled') {
            console.log(`Commande ${order._id} est annulée. Aucun changement à effectuer.`);
            continue;
        }

        if (minutesDifference >= 2) {
            if (order.status.label !== 'Delivered') {
                console.log(`Commande ${order._id} passe au statut 'Delivered'.`);
                await updateOrderStatus(order._id, 'Delivered');
            } else {
                console.log(`Commande ${order._id} est déjà marquée comme 'Delivered'.`);
            }
        } else if (minutesDifference >= 1) {
            if (order.status.label === 'Pending') {
                console.log(`Commande ${order._id} passe au statut 'Shipped'.`);
                await updateOrderStatus(order._id, 'Shipped');
            } else {
                console.log(`Commande ${order._id} est déjà marquée comme '${order.status.label}'.`);
            }
        } else {
            console.log(`Commande ${order._id} ne nécessite pas de mise à jour (écart de ${minutesDifference} minutes).`);
        }
    }
}

setInterval(checkAndUpdateOrders, 60 * 1000); 

checkAndUpdateOrders();
