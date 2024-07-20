<script setup lang="ts">
import Button from '@/components/ui/button/Button.vue';
import ProductsSearchForm from '@/components/products/products-search-form.vue';

import logo from '@/assets/images/fanthesie.png';
import { useUserStore } from '@/stores/user';
import { useBasketStore } from '@/stores/basket';
import { ref } from 'vue';
import ShoppingBasketWithCount from './shared/shopping-basket-with-count.vue';

const userStore = useUserStore();
const basketStore = useBasketStore();
const isAuthenticated = ref(!!userStore.user);

const nbItems = ref(basketStore.nbItems);

userStore.$subscribe((mutation, state) => {
  isAuthenticated.value = !!state.user;
});

basketStore.$subscribe((mutation, state) => {
  nbItems.value = state.products.length;
});
</script>

<template>
  <nav
    class="bg-gradient-to-r from-tea-600 to-tea-400 via-tea-500 via-75% flex justify-between items-center h-14 px-4 py-2"
  >
    <RouterLink
      :to="{ name: 'home' }"
      class="hidden lg:inline lg:justify-self-start h-full my-auto"
    >
      <img
        :src="logo"
        alt="Fanthesie"
        class="w-[120px] h-[40px] object-center"
        width="120"
        height="40"
      />
    </RouterLink>
    <div class="flex items-center gap-4 w-full lg:max-w-xl xl:max-w-4xl 2xl:max-w-5xl">
      <ProductsSearchForm />
    </div>
    <div class="hidden lg:flex lg:h-full">
      <Button
        variant="outline"
        as-child
        class="bg-transparent text-white border border-transparent hover:border hover:border-primary-foreground"
      >
        <RouterLink :to="{ name: 'login' }" v-if="!isAuthenticated">Se connecter</RouterLink>
        <RouterLink :to="{ name: 'account' }" v-else>Mon compte</RouterLink>
      </Button>
      <Button
        variant="outline"
        as-child
        class="bg-transparent text-white border border-transparent hover:border hover:border-primary-foreground"
      >
        <RouterLink :to="{ name: 'basket' }" class="flex items-center gap-2">
          Panier
          <ShoppingBasketWithCount v-model:nbItems="nbItems" />
        </RouterLink>
      </Button>
    </div>
  </nav>
</template>
