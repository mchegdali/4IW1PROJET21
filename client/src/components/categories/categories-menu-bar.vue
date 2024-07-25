<template>
  <nav class="bg-white text-tea-600 border-b border-tea-200">
    <ul class="flex justify-evenly py-2">
      <li v-for="category in categories" :key="category._id">
        <RouterLink
          :to="{ path: '/products', query: { category: category.slug } }"
          class="transition-colors relative group pb-0.5"
        >
          {{ category.name }}
          <span
            class="absolute bottom-0 left-0 w-0 h-0.5 bg-tea-600 transition-all group-hover:w-full"
          ></span>
        </RouterLink>
      </li>
    </ul>
  </nav>
</template>

<script setup lang="ts">
import type { ProductCategory } from '@/api/products.api';
import { ref, onMounted } from 'vue';
import { RouterLink } from 'vue-router';

const categories = ref<ProductCategory[]>([]);

onMounted(async () => {
  try {
    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/categories`);
    if (!response.ok) {
      throw new Error('Failed to fetch categories');
    }
    categories.value = await response.json();
  } catch (error) {
    console.error('Error fetching categories:', error);
  }
});
</script>
