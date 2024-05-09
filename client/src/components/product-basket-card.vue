<script setup lang="ts">
import { reactive } from 'vue';
import basket from '../api/basket.json';
import { Plus, Minus, Trash } from 'lucide-vue-next';
import type { Product } from '@/api/products.api';

interface BasketProduct extends Product {
  quantity: number;
}

const products = reactive<Array<BasketProduct>>(basket.products);
</script>

<template>
  <div
    v-for="product in products"
    :key="product._id"
    class="w-full bg-white p-4 border-b border-gray-200"
  >
    <div class="flex gap-6">
      <div class="w-24 h-24">
        <img class="min-w-24 h-full bg-slate-400" :src="product.image" :alt="product.title" />
      </div>
      <div class="flex flex-col gap-2 w-full">
        <div class="flex justify-between w-full">
          <h2 class="font-bold text-sm">{{ product.price }} €</h2>
          <Trash />
        </div>

        <h2 class="text-sm">{{ product.title }}</h2>
        <p class="text-sm text-gray-500 line-clamp-2">
          {{ product.description }}
        </p>
        <div class="flex gap-2 w-full">
          <p class="text-sm w-full">Quantité:</p>
          <Button class="">
            <Minus />
          </Button>
          <p>{{ product.quantity }}</p>
          <Button>
            <Plus />
          </Button>
        </div>
      </div>
    </div>
  </div>
</template>
