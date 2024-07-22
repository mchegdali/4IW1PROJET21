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

onBeforeMount(async () => {
  if (userStore.isAuthenticated) {
    
    const response = await fetchBasket(userStore.user?.id!, userStore.accessToken!);
    basketStore.products = await response.json();
  }
  stripe.value = await loadStripe('pk_test_51PeDeeId99a4h4TCLqm4w85nDdjK25k5H7667JNgbrkhPwCQ04JsEWtZAuQ6EM47nyE3H79XonnUy4eQH3HEaJW000eWWBhyPr'); 
});

const goBackToBasket = () => {
  router.push({ name: 'basket' });
};
const proceedToCheckout = async () => {
  if (basketStore.products.length === 0) {
    alert('Votre panier est vide');
    return;
  }

  try {
    
    const shippingId = ref('03de8070-af31-4ad6-a2aa-a4261e66d94b').value;  //je dois rendre dynam
    
    const paymentData = {
      user: userStore.user?.id,
      shippingId: shippingId,
      paymentType: 'credit-card' // rendre dynam
    };

    const response = await fetch('http://localhost:3000/payment', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${userStore.accessToken}`
      },
      body: JSON.stringify(paymentData),
      credentials: 'include'
    });

    if (!response.ok) {
      throw new Error('Erreur lors de la création de la session de paiement');
    }

    const session = await response.json();

    if (session.id) {
      const { error } = await stripe.value.redirectToCheckout({
        sessionId: session.id,
      });

      if (error) {
        message.value = error.message;
      }
    } else {
      throw new Error('No session ID returned from server');
    }
  } catch (error) {
    console.error('Error creating payment session:', error);
    message.value = error.message;
    alert('Une erreur est survenue lors de la création de la session de paiement');
  }
};
</script>

<template>
  <main class="grow">
    <h1 class="text-3xl font-bold m-2">Récapitulatif de votre panier</h1>
    <BasketInformation />
    <BasketList readonly />
    <div class="flex flex-col gap-4 m-4 items-center w-full">
      <div class="flex w-full justify-center gap-4">
        <Button @click="goBackToBasket" class="w-fit" variant="outline">Retour au panier</Button>
        <Button @click="proceedToCheckout" class="w-fit">Procéder au paiement</Button>
      </div>
      <p v-if="message" class="text-red-500">{{ message }}</p>
      <p class="text-sm text-gray-600 m-4">
        En cliquant sur "Procéder au paiement", vous acceptez nos
        <RouterLink :to="{ name: 'conditions' }" class="text-tea-800 underline">conditions générales de vente</RouterLink>
        et notre
        <RouterLink :to="{ name: 'confidentiality-declaration' }" class="text-tea-800 underline">politique de confidentialité</RouterLink>.
      </p>
    </div>
  </main>
</template>