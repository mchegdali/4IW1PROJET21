<script setup lang="ts">
import { useBasketStore } from '@/stores/basket';

const basketStore = useBasketStore();
</script>

<template>
  <div class="w-full bg-white flex justify-center gap-4 border-b border-gray-200 p-2">
    <p class="text-slate-500">{{ basketStore.nbItems }} Article(s): Total (hors livraison)</p>
    <p class="font-bold">{{ basketStore.totalPrice }} €</p>
  </div>
</template>
