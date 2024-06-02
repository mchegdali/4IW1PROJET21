<script setup lang="ts">
import { MoveLeft } from 'lucide-vue-next';
import Order from '@/components/order.vue';

</script>

<template>
  <div class="flex items-center w-full relative align">
    <RouterLink :to="{ name: 'order' }"><MoveLeft /></RouterLink>
    <h1 class="font-bold text-lg text-center w-full sm:text-3xl">Détails de la commande</h1>
  </div>
  <Order />
</template>