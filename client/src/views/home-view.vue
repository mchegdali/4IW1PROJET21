<script setup lang="ts">
import { ref } from 'vue';
import { useFetch } from '@vueuse/core';
import { type Product } from '@/api/products.api';
import ProductsSection from '@/components/products/products-section.vue';
const productsUrl = ref('https://fakestoreapi.com/products?limit=3');
const { data: products } = useFetch(productsUrl).json<Product[]>();
</script>

<template>
  <div class="md:container">
    <ProductsSection title="Nos best-sellers" :products="products" />
    <ProductsSection title="Nos nouveautés" :products="products" />
  </div>
</template>
