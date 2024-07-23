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
  stripe.value = await loadStripe(`${config.STRIPE_KEY}`); 
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
    const addressId = ref("bde4a27e-e382-4239-ac66-c114fb40b421").value;  // Make this dynamic

    // Create the order
    const orderData = {
      address: addressId,
    };

    const orderResponse = await fetch(`${config.apiBaseUrl}/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${userStore.accessToken}`
      },
      body: JSON.stringify(orderData),
      credentials: 'include'
    });

    if (!orderResponse.ok) {
      throw new Error('Erreur lors de la création de la commande');
    }

    const orderResult = await orderResponse.json();
    console.log('Order created:', orderResult);

    const stripeData = {
      order: orderResult.id  // Use the ID of the newly created order
    };
    console.log('Stripe data:', stripeData);

    const stripeResponse = await fetch(`${config.apiBaseUrl}/stripe`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${userStore.accessToken}`
      },
      body: JSON.stringify(stripeData),
      credentials: 'include'
    });

    if (!stripeResponse.ok) {
      throw new Error('Erreur lors de la création de la session de paiement');
    }

    const session = await stripeResponse.json();
if (session.id) {
      const { error } = await stripe.value.redirectToCheckout({
        sessionId: session.id,
      });
      
      if (error) {
        message.value = error.message;
        return;
      }
      
      // After successful redirect, we need to verify the payment
      // This part should be handled on the server-side, but we'll simulate it here
      const verifyPaymentResponse = await fetch(`${config.apiBaseUrl}/verify-payment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${userStore.accessToken}`
        },
        body: JSON.stringify({ sessionId: session.id }),
        credentials: 'include'
      });
      
      if (!verifyPaymentResponse.ok) {
        throw new Error('Erreur lors de la vérification du paiement');
      }
      
      const verificationResult = await verifyPaymentResponse.json();
      
      if (verificationResult.paymentStatus === 'succeeded') {
        // Create payment record
        const paymentData = {
          orderId: orderResult.id,
          amount: verificationResult.amount,
          paymentMethod: 'credit-card',
          transactionId: verificationResult.transactionId
        };
        
        const paymentResponse = await fetch(`${config.apiBaseUrl}/payment`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${userStore.accessToken}`
          },
          body: JSON.stringify(paymentData),
          credentials: 'include'
        });
        
        if (!paymentResponse.ok) {
          throw new Error('Erreur lors de l\'enregistrement du paiement');
        }
        
        alert('Paiement réussi et enregistré');
      } else {
        throw new Error('Le paiement n\'a pas été validé par la banque');
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