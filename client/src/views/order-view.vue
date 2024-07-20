<script setup lang="ts">
import OrderList from '@/components/order-list.vue';
import { MoveLeft } from 'lucide-vue-next';
</script>

<template>
  <main class="grow">
    <div class="flex items-center w-full relative align px-4 mt-2">
      <div class="block lg:hidden">
        <RouterLink :to="{ name: 'account' }"><MoveLeft /></RouterLink>
      </div>
      <h1 class="font-bold text-lg text-center w-full sm:text-3xl">Mes commandes</h1>
    </div>
    <div class="mt-6"><OrderList /></div>
  </main>
</template>
