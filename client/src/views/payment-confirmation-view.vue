<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useOrderStore } from '@/stores/order';
import { useUserStore } from '@/stores/user';
import config from '@/config';
import { useRouter, RouterLink } from 'vue-router';
const router = useRouter();
const orderStore = useOrderStore();
const userStore = useUserStore();
const order = ref(null);
const isLoading = ref(true);
const paymentSuccessful = ref(false);

onMounted(async () => {
  const orderId = orderStore.id;
  console.log("orderStore", orderId);

  if (!orderId) {
    console.error("Aucun ID de commande trouvé dans le orderStore");
    isLoading.value = false;
    paymentSuccessful.value = true;
    return;
  }

  try {
    const response = await fetch(`${config.apiBaseUrl}/orders/${orderId}`, {
      headers: {
        'Authorization': `Bearer ${userStore.accessToken}`,
      },
    });

    if (!response.ok) {
      throw new Error('Erreur lors de la récupération de la commande');
    }

    order.value = await response.json();
  } catch (error) {
    console.error('Erreur lors de la récupération de la commande:', error);
    paymentSuccessful.value = true;
  } finally {
    isLoading.value = false;
  }
});

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString();
};

const formatPrice = (price: number) => {
  return price.toFixed(2);
};
const goToHome = () => {
  router.push({ name: 'home' });
};
</script>

<template>
  <div v-if="isLoading">
    Chargement...
  </div>
  <div v-else-if="paymentSuccessful">
    <h1>Paiement réussi</h1>
    <p>Votre paiement a été traité avec succès. Merci pour votre commande !</p>
    <p>Un email de confirmation vous sera envoyé prochainement.</p>
    <button @click="goToHome" class="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
      Retour à l'accueil
    </button>
  </div>
  <div v-else-if="order">
    <h1>Détails de la commande</h1>
    <p>Order ID: {{ order.id }}</p>
    <p>User ID: {{ order.user }}</p>
    <p>Total Price: {{ formatPrice(order.totalPrice) }}</p>
    <p>Status: {{ order.status }}</p>
    <p>Created At: {{ formatDate(order.createdAt) }}</p>
    <div>
      <h2>Products</h2>
      <ul>
        <li v-for="product in order.products" :key="product.id">
          {{ product.name }} - {{ formatPrice(product.price) }}
        </li>
      </ul>
    </div>
    <div>
      <h2>Address</h2>
      <p>{{ order.address }}</p>
    </div>
    <button @click="goToHome" class="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
      Retour à l'accueil
    </button>
  </div>
  <div v-else>
    <h1>Erreur</h1>
    <p>Une erreur est survenue lors de la récupération des détails de votre commande. Veuillez contacter notre service client.</p>
    <button @click="goToHome" class="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
      Retour à l'accueil
    </button>
  </div>
</template>
 