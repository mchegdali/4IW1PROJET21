<script setup lang="ts">
import type { Product } from '@/api/products.api';
import { computed, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useFetch } from '@vueuse/core';
import { Skeleton } from '@/components/ui/skeleton';
import ProductDescription from '@/components/products/product-description.vue';
import ProductsSection from '@/components/products/products-section.vue';
import { useBasketStore } from '@/stores/basket';
import Button from '@/components/ui/button/Button.vue';
import QuantityInput from '@/components/shared/quantity-input.vue';

const route = useRoute();
const productId = route.params.id;
const productUrl = ref(`http://localhost:3000/products/${productId}`);
const productsUrl = ref(`http://localhost:3000/products?page=1`);

const { data: product, isFetching } = useFetch(productUrl, { refetch: true }).json<Product>();
const { data: products } = useFetch(productsUrl, { refetch: true }).json<Product[]>();

const relatedProducts = computed(() =>
  products.value?.filter((product) => `${product._id}` !== productId)
);

watch(
  () => route.params.id,
  (id) => {
    productUrl.value = `https://fakestoreapi.com/products/${id}`;
  }
);

const basketStore = useBasketStore();

const count = ref(0);

function onIncrement() {
  count.value++;
}

function onDecrement() {
  if (count.value > 0) {
    count.value--;
  }
}

function handleAddToBasketClick() {
  if (product.value) {
    basketStore.addProduct(product.value, count.value);
    count.value = 0;
  }
}
</script>

<template>
  <div class="container">
    <header class="flex flex-col gap-1 mb-4">
      <h1 v-if="!isFetching && product" class="text-4xl font-extrabold">{{ product.title }}</h1>
      <Skeleton v-else class="h-10 w-full rounded-xl" />
      <p v-if="!isFetching && product" class="text-sm font-semibold capitalize text-gray-600">
        {{ product.category }}
      </p>
      <Skeleton v-else class="h-5 w-[10ch] rounded-xl" />
      <span v-if="!isFetching && product" class="flex justify-center">
        <img :src="product.image" alt="product" class="object-contain object-center h-64 w-64" height="256" />
      </span>
      <Skeleton v-else class="self-center h-64 w-64 rounded-xl" />
    </header>
    <section class="flex flex-col gap-1 items-center">
      <p v-if="!isFetching && product" class="text-xl font-semibold">{{ product.price }}€</p>
      <Skeleton v-else class="h-5 w-[10ch] rounded-xl" />
<<<<<<< HEAD
      <QuantityInput v-if="!isFetching && product" @decrement="onDecrement" @increment="onIncrement" :value="count"
        :is-decrease-disabled="count <= 0" />
=======
      <ProductQuantityInput
        v-if="!isFetching && product"
        class="text-xl"
        :product-id="product._id"
      />
>>>>>>> f7e1d43 (IW1S2G21-62 text search on products)
      <Skeleton v-else class="h-5 w-[10ch] rounded-xl" />
      <Button v-if="!isFetching && product" class="uppercase font-medium" @click="handleAddToBasketClick">
        Ajouter au panier
      </Button>
      <Skeleton v-else class="h-5 w-[10ch] rounded-xl" />
    </section>
    <section class="flex flex-col gap-1 w-full max-w-screen-xs">
      <h2 v-if="!isFetching && product" class="text-3xl font-semibold">Détails du produit</h2>
      <Skeleton v-else class="h-5 w-full rounded-xl" />
      <ProductDescription v-if="!isFetching && product" :product="product" />
    </section>
    <ProductsSection title="Explorez d'autres saveurs" :products="relatedProducts" />
  </div>
</template>
