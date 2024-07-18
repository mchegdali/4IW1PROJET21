<script setup lang="ts">
import type { Product } from '@/api/products.api';
import { computed, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useFetch } from '@vueuse/core';
import ProductDescription from '@/components/products/product-description.vue';
import ProductsSection from '@/components/products/products-section.vue';
import { useBasketStore } from '@/stores/basket';
import Button from '@/components/ui/button/Button.vue';
import {
  NumberField,
  NumberFieldContent,
  NumberFieldDecrement,
  NumberFieldIncrement,
  NumberFieldInput
} from '@/components/ui/number-field';

const route = useRoute();
const basketStore = useBasketStore();

const productId = route.params.id;
const productUrl = ref(`${import.meta.env.VITE_API_BASE_URL}/products/${productId}`);
const relatedProductsUrl = computed(() => `${productUrl.value}/related`);
const { data: product } = useFetch(productUrl, { refetch: true }).json<Product>();
const { data: relatedProducts } = useFetch(relatedProductsUrl, { refetch: true }).json<Product[]>();

const count = ref(0);

function handleQuantityChange(value: number) {
  if (value >= 0) {
    count.value = value;
  } else {
    count.value = 0;
  }
}

function handleAddToBasketClick() {
  if (product.value) {
    basketStore.addProduct(product.value, count.value);
    count.value = 0;
  }
}

watch(
  () => route.params.id,
  (id) => {
    productUrl.value = `${import.meta.env.VITE_API_BASE_URL}/products/${id}`;
  },
  {
    immediate: true
  }
);
</script>

<template>
  <main class="grow p-4">
    <template v-if="product">
      <header class="flex flex-col gap-1 mb-4">
        <h1 class="text-4xl font-extrabold">{{ product.name }}</h1>
        <p class="text-sm font-semibold capitalize text-gray-600">
          {{ product.category.name }}
        </p>
        <span class="flex justify-center">
          <img
            :src="product.image"
            alt="product"
            class="object-contain object-center h-64 w-64"
            height="256"
          />
        </span>
      </header>
      <section class="flex flex-col gap-1 items-center">
        <p class="text-xl font-semibold">{{ product.price }}€</p>
        <NumberField
          :model-value="count"
          :min="0"
          @update:model-value="handleQuantityChange"
          class="max-w-40"
        >
          <NumberFieldContent>
            <NumberFieldDecrement />
            <NumberFieldInput />
            <NumberFieldIncrement />
          </NumberFieldContent>
        </NumberField>
        <Button class="uppercase font-medium" @click="handleAddToBasketClick">
          Ajouter au panier
        </Button>
      </section>
      <section class="flex flex-col gap-1 w-full max-w-screen-xs">
        <h2 class="text-3xl font-semibold">Détails du produit</h2>
        <ProductDescription :product="product" />
      </section>
      <ProductsSection title="Explorez d'autres saveurs" :products="relatedProducts" />
    </template>
  </main>
</template>
