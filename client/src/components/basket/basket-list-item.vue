<script setup lang="ts">
import type { Product } from '@/api/products.api';
import ProductQuantityInput from '@/components/products/product-quantity-input.vue';

const { product } = defineProps<{ product: Product }>();
</script>

<template>
  <div class="flex gap-6">
    <div class="w-24 h-24">
      <img class="min-w-24 h-full bg-slate-400" :src="product.image" :alt="product.title" />
    </div>
    <div class="flex flex-col gap-2 w-full">
      <div class="flex justify-between w-full">
        <h2 class="font-bold text-sm">{{ product.price }} €</h2>
      </div>

      <h2 class="text-sm">{{ product.title }}</h2>
      <p class="text-sm text-gray-500 line-clamp-2">
        {{ product.description }}
      </p>
      <div class="flex gap-2 w-full">
        <ProductQuantityInput :product="product" />
      </div>
    </div>
  </div>
</template>
