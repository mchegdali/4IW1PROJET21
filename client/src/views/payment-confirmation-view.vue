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
});

const goBackHome = () => {
  router.push({ name: 'home' });
};


</script>

<template>
  <main class="grow">
    <h1 class="text-3xl font-bold m-2">Récapitulatif de vos achat</h1>
    <BasketInformation />
    <BasketList readonly />
    <div class="flex flex-col gap-4 m-4 items-center w-full">
      <p> Paiement réaliser avec succès </p>
      <div class="flex w-full justify-center gap-4">
        <Button @click="goBackHome" class="w-fit" variant="outline">Retour a l'accueil</Button>
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