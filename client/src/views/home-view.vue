<script setup lang="ts">
import { computed, ref } from 'vue';
import { useFetch } from '@vueuse/core';
import { type ProductsResponse } from '@/api/products.api';
import ProductsSection from '@/components/products/products-section.vue';
import { descriptions } from '@/assets/strings.json';

const productsUrl = ref(`${import.meta.env.VITE_API_BASE_URL}/products?page=1`);
const { data } = useFetch(productsUrl).json<ProductsResponse>();

const products = computed(() => {
  return data.value?.data ?? [];
});
</script>

<template>
  <main class="grow py-2">
    <ProductsSection
      title="Nos best-sellers"
      :products="products"
      :description="descriptions.bestSellers"
    />
    <ProductsSection
      title="Nos nouveautés"
      :products="products"
      :description="descriptions.newProducts"
    />
  </main>
</template>
