<script setup lang="ts">
import { useBasketStore } from '@/stores/basket';
import BasketListItem from './basket-list-item.vue';
import { computed } from 'vue';

const { readonly } = withDefaults(defineProps<{ readonly: boolean }>(), {
  readonly: false
});

const basketStore = useBasketStore();

const products = computed(() => {
  return basketStore.view;
});
</script>

<template>
  <div
    v-for="product in products"
    :key="product.slug"
    class="w-full bg-white p-4 border-b border-gray-200"
  >
    <BasketListItem :product="product" :readonly="readonly" />
  </div>
</template>
