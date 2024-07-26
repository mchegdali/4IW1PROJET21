<script setup lang="ts">
import { ref, onBeforeMount } from 'vue';
import { useBasketStore } from '@/stores/basket';
import { useUserStore } from '@/stores/user';
import { useRouter, RouterLink } from 'vue-router';
import { fetchBasket } from '@/api/basket';
import { loadStripe } from '@stripe/stripe-js';
import Button from '@/components/ui/button/Button.vue';
import BasketInformation from '@/components/basket/basket-information.vue';
import BasketList from '@/components/basket/basket-list.vue';
import config from '@/config';

const basketStore = useBasketStore();
const userStore = useUserStore();
const router = useRouter();
const stripe = ref(null);
const message = ref('');
const selectedAddress = ref('');

onBeforeMount(async () => {
  if (userStore.isAuthenticated) {
    const response = await fetchBasket(userStore.user?.id!, userStore.accessToken!);
    if (response.ok) {
      basketStore.products = await response.json();
    } else {
      message.value = 'Erreur lors de la récupération du panier';
      return;
    }
  }
  stripe.value = await loadStripe(`${config.STRIPE_KEY}`);

  const savedAddress = localStorage.getItem('selectedAddress');
  if (savedAddress) {
    selectedAddress.value = JSON.parse(savedAddress);
  } else {
    message.value = 'Aucune adresse sélectionnée. Veuillez choisir une adresse de livraison.';
  }
});

const goBackToBasket = () => {
  router.push({ name: 'basket' });
};

const proceedToCheckout = async () => {
  if (basketStore.products.length === 0) {
    alert('Votre panier est vide');
    return;
  }

  if (!selectedAddress.value) {
    alert('Veuillez sélectionner une adresse de livraison');
    return;
  }

  try {
    const addressId = selectedAddress.value._id;
    const orderData = {
      user: userStore.user?.id,
      address: addressId
    };

    const orderResponse = await fetch(`${config.apiBaseUrl}/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userStore.accessToken}`
      },
      body: JSON.stringify(orderData)
      // credentials: 'include'
    });

    if (!orderResponse.ok) {
      throw new Error('Erreur lors de la création de la commande');
    }

    const orderResult = await orderResponse.json();

    const stripeData = {
      order: orderResult.id
    };

    const stripeResponse = await fetch(`${config.apiBaseUrl}/stripe`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userStore.accessToken}`
      },
      body: JSON.stringify(stripeData)
      // credentials: 'include'
    });

    if (!stripeResponse.ok) {
      throw new Error('Erreur lors de la création de la session de paiement');
    }

    const session = await stripeResponse.json();
    if (session.id) {
      const { error } = await stripe.value.redirectToCheckout({
        sessionId: session.id
      });

      if (error) {
        message.value = error.message;
        return;
      }
    } else {
      throw new Error('No session ID returned from server');
    }
  } catch (error) {
    console.error('Error in checkout process:', error);
    message.value = error.message;
    alert('Une erreur est survenue lors du processus de paiement');
  }
};
</script>

<template>
  <main class="grow">
    <h1 class="text-3xl font-bold m-2">Récapitulatif de votre panier</h1>
    <BasketInformation />
    <BasketList readonly />

    <div v-if="selectedAddress" class="m-4 p-4 bg-white rounded">
      <h2 class="text-xl font-semibold mb-2">Adresse de livraison</h2>
      <p>{{ selectedAddress.firstName }} {{ selectedAddress.lastName }}</p>
      <p>{{ selectedAddress.street }}</p>
      <p>{{ selectedAddress.zipCode }} {{ selectedAddress.city }}</p>
      <p>{{ selectedAddress.country }}</p>
      <p>Téléphone : {{ selectedAddress.phone }}</p>
    </div>

    <div class="flex flex-col gap-4 m-4 items-center w-full">
      <div class="flex w-full justify-center gap-4">
        <Button @click="goBackToBasket" class="w-fit" variant="outline">Retour au panier</Button>
        <Button @click="proceedToCheckout" class="w-fit">Procéder au paiement</Button>
      </div>
      <p v-if="message" class="text-red-500">{{ message }}</p>
      <p class="text-sm text-gray-600 m-4">
        En cliquant sur "Procéder au paiement", vous acceptez nos
        <RouterLink :to="{ name: 'conditions' }" class="text-tea-800 underline"
          >conditions générales de vente</RouterLink
        >
        et notre
        <RouterLink :to="{ name: 'confidentiality-declaration' }" class="text-tea-800 underline"
          >déclaration de confidentialité</RouterLink
        >.
      </p>
    </div>
  </main>
</template>
