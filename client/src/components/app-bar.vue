<script setup lang="ts">
import { Home, User } from 'lucide-vue-next';
import AppbarLink from '@/components/appbar-link.vue';
import { useBasketStore } from '@/stores/basket';
import { ref } from 'vue';
import ShoppingBasketWithCount from './shared/shopping-basket-with-count.vue';

const basketStore = useBasketStore();
const nbItems = ref(basketStore.nbItems);

basketStore.$subscribe((mutation, state) => {
  nbItems.value = state.products.length;
});
</script>

<template>
  <nav
    class="h-12 w-full border border-y-2 border-y-slate-100 bg-white flex items-center justify-around"
  >
    <AppbarLink :to="{ name: 'home' }">
      <template v-slot:icon>
        <Home class="w-6 h-6" />
      </template>
    </AppbarLink>
    <AppbarLink :to="{ name: 'account' }">
      <template v-slot:icon>
        <User class="w-6 h-6" />
      </template>
    </AppbarLink>
    <AppbarLink :to="{ name: 'basket' }">
      <template v-slot:icon>
        <ShoppingBasketWithCount v-model:nbItems="nbItems" size="small" />
      </template>
    </AppbarLink>
  </nav>
</template>
