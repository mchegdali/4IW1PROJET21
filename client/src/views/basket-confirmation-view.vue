<script setup lang="ts">
import { useBasketStore } from '@/stores/basket';
import Button from '@/components/ui/button/Button.vue';
import { computed, onBeforeMount } from 'vue';
import { useRouter, RouterLink } from 'vue-router';
import BasketInformation from '@/components/basket/basket-information.vue';
import BasketListItem from '@/components/basket/basket-list-item.vue';
import { useUserStore } from '@/stores/user';
import { fetchBasket } from '@/api/basket';
import BasketList from '@/components/basket/basket-list.vue';

const basketStore = useBasketStore();
const userStore = useUserStore();
const router = useRouter();

const basketItems = computed(() => basketStore.view);

onBeforeMount(async () => {
  if (userStore.isAuthenticated) {
    const response = await fetchBasket(userStore.user?.id!, userStore.accessToken!);
    basketStore.products = await response.json();
  }
});

const goBackToBasket = () => {
  router.push({ name: 'basket' });
};

const proceedToCheckout = () => {
  // Implement checkout logic here
  console.log('Proceeding to checkout');
  // You might want to redirect to a new route, e.g., '/checkout' or '/livraison'
  // router.push({ name: 'checkout' });
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
      <p class="text-sm text-gray-600 m-4">
        En cliquant sur "Procéder au paiement", vous acceptez nos
        <RouterLink :to="{ name: 'conditions' }" class="text-tea-800 underline"
          >conditions générales de vente</RouterLink
        >
        et notre
        <RouterLink :to="{ name: 'confidentiality-declaration' }" class="text-tea-800 underline"
          >politique de confidentialité</RouterLink
        >.
      </p>
    </div>
  </main>
</template>
