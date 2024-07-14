<script setup lang="ts">
import { reactive } from 'vue';
import { useBasketStore } from '@/stores/basket';
// import basket from '../api/basket.json';

const basketStore = useBasketStore();

const products = reactive(basketStore.products);

console.log(products);

</script>

<template>
  <div class="w-full bg-white flex justify-center gap-4 border-b border-gray-200 p-2">
    <p class="text-slate-500">{{ products.length }} Article(s): Total (hors livraison)</p>
    <p class="font-bold">{{ basketStore.totalPrice }} €</p>
  </div>
</template>
