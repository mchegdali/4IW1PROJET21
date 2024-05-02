<script setup lang="ts">
import { Home, User, ShoppingBasket } from 'lucide-vue-next';
import AppbarLink from '@/components/appbar-link.vue';
</script>

<template>
  <nav class="container px-16 border border-y-2 border-y-slate-100 bg-white flex items-center justify-around">
    <AppbarLink :to="{ name: 'home' }">
      <template v-slot:icon>
        <Home class="w-6 h-6 text-primary" />
      </template>
    </AppbarLink>
    <AppbarLink :to="{ name: 'account' }">
      <template v-slot:icon>
        <User class="w-6 h-6 text-primary" />
      </template>
    </AppbarLink>
    <AppbarLink :to="{ name: 'basket' }">
      <template v-slot:icon>
        <ShoppingBasket class="w-6 h-6 text-primary" />
      </template>
    </AppbarLink>
  </nav>
</template>
