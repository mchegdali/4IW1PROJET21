<script setup lang="ts">
import { Search, ShoppingBasket } from 'lucide-vue-next';
import Input from './ui/input/Input.vue';
import Button from '@/components/ui/button/Button.vue';

import logo from '@/assets/images/fanthesie.png';
import { useUserStore } from '@/stores/user';
import { ref } from 'vue';

const userStore = useUserStore();
const isAuthenticated = ref(userStore.isAuthenticated);

userStore.$subscribe((mutation, state) => {
  console.log('setIsAuthenticated', mutation, state);
  isAuthenticated.value = userStore.isAuthenticated;
  if (state.accessToken) {
    localStorage.setItem("accessToken", state.accessToken);
  }
  if (state.refreshToken) {
    localStorage.setItem("refreshToken", state.refreshToken);
  }
  if (state.user) {
    localStorage.setItem("user", JSON.stringify(state.user));
  }
});
</script>

<template>
  <nav class="px-4 py-2 bg-gradient-to-r from-tea-600 to-tea-400 w-svw">
    <div class="md:flex md:justify-around md:items-center md:gap-8">
      <RouterLink :to="{ name: 'home' }"><img :src="logo" alt="Fanthesie"
          class="hidden w-auto min-w-32 h-12 md:inline md:justify-self-start" /></RouterLink>
      <div class="relative w-full md:max-w-lg lg:max-w-xl xl:max-w-4xl 2xl:max-w-5xl">
        <Input id="search" type="text" placeholder="Rechercher votre thé sur Fanthesie" class="pl-10" />
        <span class="absolute start-0 inset-y-0 flex items-center justify-center px-2">
          <Search class="size-6 text-muted-foreground" />
        </span>
      </div>
      <div class="hidden md:flex">
        <Button variant="link" as-child class="text-white">
          <RouterLink :to="{ name: 'login' }" v-if="!isAuthenticated">Se connecter</RouterLink>
          <RouterLink :to="{ name: 'account' }" v-else>Mon compte</RouterLink>
        </Button>
        <Button variant="link" as-child class="text-white">
          <RouterLink :to="{ name: 'basket' }" class="flex items-end">
            <ShoppingBasket class="size-8" />
            Panier
          </RouterLink>
        </Button>
      </div>
    </div>
  </nav>
</template>
