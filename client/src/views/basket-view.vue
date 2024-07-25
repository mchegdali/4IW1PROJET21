<script setup lang="ts">
import BasketInformation from '@/components/basket/basket-information.vue';
import BasketList from '@/components/basket/basket-list.vue';
import Button from '@/components/ui/button/Button.vue';
import { onBeforeMount } from 'vue';
import { useBasketStore } from '@/stores/basket';
import { fetchBasket } from '@/api/basket';
import { useUserStore } from '@/stores/user';
import { useRouter } from 'vue-router';

const userStore = useUserStore();
const basketStore = useBasketStore();
const router = useRouter();

onBeforeMount(async () => {
  if (userStore.isAuthenticated) {
    const response = await fetchBasket(userStore.user?.id!, userStore.accessToken!);
    basketStore.products = await response.json();
  }
});

const goToConfirmation = () => {
  router.push({ name: 'livraison' });
};

const goToLogin = () => {
  router.push({ name: 'login' });
};
</script>

<template>
  <main class="grow">
    <h1 class="text-3xl font-bold m-2">Panier</h1>
    <template v-if="userStore.isAuthenticated">
      <BasketInformation />
      <BasketList />
      <div class="m-4">
        <Button class="w-full" @click="goToConfirmation">Confirmer</Button>
      </div>
    </template>
    <template v-else>
      <div class="m-4">
        <p>Pour accéder à votre panier, il est nécessaire de vous authentifier.</p>
        <Button class="w-full" @click="goToLogin">Se connecter</Button>
      </div>
    </template>
  </main>
</template>
