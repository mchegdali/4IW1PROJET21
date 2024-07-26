<script setup lang="ts">
import type { Product } from '@/api/products.api';
import { computed, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import ProductsSection from '@/components/products/products-section.vue';
import { useBasketStore } from '@/stores/basket';
import Button from '@/components/ui/button/Button.vue';
import { useUserStore } from '@/stores/user';
import { addProductToBasket, fetchBasket } from '@/api/basket';

const route = useRoute();
const router = useRouter();
const basketStore = useBasketStore();
const userStore = useUserStore();

const productId = route.params.id;
const productUrl = ref(`${import.meta.env.VITE_API_BASE_URL}/products/${productId}`);
const relatedProductsUrl = computed(() => `${productUrl.value}/related`);

const product = ref<Product>();
const relatedProducts = ref<Product[]>([]);
const isLoading = ref(true);
const hasError = ref(false);

async function fetchProduct() {
  try {
    const response = await fetch(productUrl.value);
    if (response.status === 404) {
      router.push('/not-found');
      return;
    }
    product.value = await response.json();
  } catch (error) {
    hasError.value = true;
  } finally {
    isLoading.value = false;
  }
}

async function fetchRelatedProducts() {
  try {
    const response = await fetch(relatedProductsUrl.value);
    relatedProducts.value = await response.json();
  } catch (error) {
    hasError.value = true;
  }
}

async function handleAddToBasketClick() {
  if (product.value) {
    if (userStore.isAuthenticated) {
      const response = await addProductToBasket(
        userStore.user?.id!,
        userStore.accessToken!,
        product.value,
        1
      );

      if (response.ok) {
        const basketResponse = await fetchBasket(userStore.user?.id!, userStore.accessToken!);

        basketStore.products = await basketResponse.json();
      }
    }
  }
}

watch(
  () => route.params.id,
  async (id) => {
    productUrl.value = `${import.meta.env.VITE_API_BASE_URL}/products/${id}`;
    await fetchProduct();
    await fetchRelatedProducts();
  },
  {
    immediate: true
  }
);
</script>

<template>
  <main class="grow p-4 container">
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
      <section class="flex flex-col gap-4 items-center mb-4">
        <p class="text-xl font-semibold">{{ product.price }}€</p>
        <Button class="uppercase font-medium" @click="handleAddToBasketClick">
          Ajouter au panier
        </Button>
      </section>
      <section class="flex flex-col gap-1">
        <h1 class="text-2xl font-semibold">Détails du produit</h1>
        <div>
          <h2 class="text-base font-semibold">Description</h2>
          <p>{{ product.description }}</p>
        </div>
        <div>
          <h2 class="text-base font-semibold">Origine</h2>
          <p>{{ product.origin }}</p>
        </div>
        <div>
          <h2 class="text-base font-semibold">Instructions</h2>
          <p>
            Pour ce {{ product.category.name.toLocaleLowerCase() }}, nos experts vous conseillent de
            faire bouillir votre eau à
            <strong>{{ product.brewingInstructions.temperature }}°C</strong> et de la laisser
            infuser pendant <strong>{{ product.brewingInstructions.steepTime }}</strong> minutes.
          </p>
        </div>
        <div>
          <h2 class="text-base font-semibold">Poids</h2>
          <p>{{ product.weightGrams }} g</p>
        </div>
      </section>
      <section class="flex flex-col gap-1 w-full max-w-screen-xs"></section>
      <ProductsSection title="Explorez d'autres saveurs" :products="relatedProducts" />
    </template>
  </main>
</template>
