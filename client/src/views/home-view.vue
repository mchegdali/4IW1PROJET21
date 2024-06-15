<script setup lang="ts">
import { computed, ref } from 'vue';
import { useFetch } from '@vueuse/core';
import { type ProductsResponse } from '@/api/products.api';
import ProductsSection from '@/components/products/products-section.vue';

const productsUrl = ref(`${import.meta.env.VITE_API_BASE_URL}/products?page=1`);
const { data } = useFetch(productsUrl).json<ProductsResponse>();

const products = computed(() => {
  return data.value?.data ?? [];
});
</script>

<template>
  <div class="md:container">
    <ProductsSection title="Nos best-sellers" :products="products" />
    <ProductsSection title="Nos nouveautés" :products="products" />
  </div>
</template>
