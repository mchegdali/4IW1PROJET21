<script setup lang="ts">
import { MoveLeft } from 'lucide-vue-next';
import Order from '@/components/order.vue';
</script>

<template>
  <main class="grow">
    <div class="flex items-center w-full relative align">
      <div class="block lg:hidden">
        <RouterLink :to="{ name: 'orders' }"><MoveLeft /></RouterLink>
      </div>
      <h1 class="font-bold text-lg text-center w-full sm:text-3xl">Détails de la commande</h1>
    </div>
    <Order />
  </main>
</template>
