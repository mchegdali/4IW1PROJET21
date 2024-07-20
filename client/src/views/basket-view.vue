<script setup lang="ts">
import BasketInformation from '@/components/basket/basket-information.vue';
import BasketList from '@/components/basket/basket-list.vue';
import Button from '@/components/ui/button/Button.vue';
import { onBeforeMount } from 'vue';
import { useBasketStore } from '@/stores/basket';
import { fetchBasket } from '@/api/basket';
import { useUserStore } from '@/stores/user';

const userStore = useUserStore();
const basketStore = useBasketStore();

onBeforeMount(async () => {
  if (userStore.isAuthenticated) {
    {
      const response = await fetchBasket(userStore.user?.id!, userStore.accessToken!);
      basketStore.products = await response.json();
    }
  }
});
</script>

<template>
  <main class="grow">
    <h1 class="text-3xl font-bold m-2">Panier</h1>
    <BasketInformation />
    <BasketList />
    <div class="m-4">
      <Button class="w-full">Paiement</Button>
    </div>
  </main>
</template>

// import { useRouter } from 'vue-router';
// import { ref, computed } from 'vue';
// import { useStore } from 'vue';
// import BasketInformation from '@/components/basket/basket-information.vue';
// import BasketList from '@/components/basket/basket-list.vue';
// import Button from '@/components/ui/button/Button.vue';

// const router = useRouter();
// const store = useStore();

// const panier = computed(() => store.state.panier);

// const handlePaiementClick = () => {
//   if (panier.value.length > 0) {
//     router.push({ name: 'livraison' });
//   } else {
//     alert('Votre panier est vide');
//   }
// };
// </script>

// <template>
//   <main class="grow">
//     <h1 class="text-3xl font-bold m-2">Panier</h1>
//     <BasketInformation />
//     <BasketList />
//     <div class="m-4">
//       <Button class="w-full" @click="handlePaiementClick">
//         Paiement
//       </Button>
//     </div>
//   </main>
// </template>

