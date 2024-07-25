
<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useUserStore } from '@/stores/user';

const route = useRoute();
const userStore = useUserStore();
const order = ref(null);
const error = ref('');

const fetchOrder = async () => {
  const orderId = route.params.id;
  try {
    const response =  await fetch(`${import.meta.env.VITE_API_URL}/order/${orderId}`, {
      headers: {
        'Authorization': `Bearer ${userStore.accessToken}`
      }
    });
    
    if (!response.ok) {
      throw new Error('Erreur lors de la récupération de la commande');
    }
    
    order.value = await response.json();
  } catch (err) {
    console.error('Erreur:', err);
    error.value = 'Impossible de récupérer les détails de la commande. Veuillez réessayer.';
  }
};

onMounted(() => {
  if (userStore.isAuthenticated) {
    fetchOrder();
  }
});
</script>

<template>
  <main class="grow">
    <h1 class="text-3xl font-bold m-2">Récapitulatif de votre achat</h1>
    
    <div v-if="error" class="text-red-500">{{ error }}</div>
    
    <div v-if="order">
      <h2>Commande #{{ order._id }}</h2>
      <p>Statut : {{ order.status }}</p>
      <ul>
        <li v-for="item in order.items" :key="item._id">
          {{ item.name }} - Quantité: {{ item.quantity }} - Prix: {{ item.price }}€
        </li>
      </ul>
      <p>Total : {{ order.totalPrice }}€</p>
    </div>
    
    <div class="flex flex-col gap-4 m-4 items-center w-full">
      <p v-if="order && order.status === 'Paid'">Paiement réalisé avec succès</p>
      <div class="flex w-full justify-center gap-4">
        <Button @click="$router.push({ name: 'home' })" class="w-fit" variant="outline">
          Retour à l'accueil
        </Button>
      </div>
    </div>
  </main>
</template>