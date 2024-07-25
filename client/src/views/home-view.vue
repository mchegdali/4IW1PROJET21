<script setup lang="ts">
import { computed, ref } from 'vue';
import { useFetch } from '@vueuse/core';
import { type Product, type ProductsResponse } from '@/api/products.api';
import ProductsSection from '@/components/products/products-section.vue';
import { descriptions } from '@/assets/strings.json';
import config from '@/config';

const productsUrl = ref(`${config.apiBaseUrl}/products?page=1`);
const recentProductsUrl = ref(`${config.apiBaseUrl}/products/recent`);
const { data } = useFetch(productsUrl).json<ProductsResponse>();
const { data: recentProducts } = useFetch(recentProductsUrl).json<Product[]>();

const products = computed(() => {
  return data.value?.data ?? [];
});
</script>

<template>
  <main class="grow py-4 px-2">
    <ProductsSection
      title="Nos best-sellers"
      :products="products"
      :description="descriptions.bestSellers"
    />
    <ProductsSection
      title="Nos nouveautés"
      :products="recentProducts ?? []"
      :description="descriptions.newProducts"
    />
  </main>
</template>
