<script setup lang="ts">
import type { Product } from '@/api/products.api';
import { computed, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useFetch } from '@vueuse/core';
import { Skeleton } from '@/components/ui/skeleton';
import ProductQuantityInput from '@/components/products/product-quantity-input.vue';
import AddToCartButton from '@/components/products/add-to-cart-button.vue';
import ProductDescription from '@/components/products/product-description.vue';
import ProductsSection from '@/components/products/products-section.vue';


const route = useRoute();
const productId = route.params.id;
const productsUrl = ref('https://fakestoreapi.com/products?limit=4');
const { data: products } = useFetch(productsUrl).json<Product[]>();

const product = ref(products.value?.find((product) => `${product.id}` === productId));
const relatedProducts = computed(() => products.value?.filter((product) => `${product.id}` !== productId));

watch(() => route.params.id, (newId) => {
    product.value = products.value?.find((product) => `${product.id}` === newId);
});
</script>

<template>
    <header class="flex flex-col gap-1 mb-4">
        <h1 v-if="product" class="text-4xl font-extrabold">{{ product.title }}</h1>
        <Skeleton v-else class="h-9 w-full rounded-xl" />
        <p v-if="product" class="text-sm font-semibold capitalize text-gray-600">
            {{ product.category }}
        </p>
        <Skeleton v-else class="h-[0.875rem] w-[10ch] rounded-xl" />
        <img v-if="product" :src="product.image" alt="product" height="256" width="256" class="self-center" />
        <Skeleton v-else class="self-center h-64 w-64 rounded-xl" />
    </header>
    <section class="flex flex-col gap-1 items-center">
        <p v-if="product" class="text-xl font-semibold">{{ product.price }}€</p>
        <Skeleton v-else class="h-5 w-[10ch] rounded-xl" />
        <ProductQuantityInput v-if="product" class="text-xl" :product-id="product.id" />
        <Skeleton v-else class="h-5 w-[10ch] rounded-xl" />
        <AddToCartButton v-if="product" class="uppercase font-medium" />
        <Skeleton v-else class="h-5 w-[10ch] rounded-xl" />
    </section>
    <section class="flex flex-col gap-1 w-full max-w-screen-xs">
        <h2 v-if="product" class="text-3xl font-semibold">Détails du produit</h2>
        <Skeleton v-else class="h-5 w-full rounded-xl" />
        <ProductDescription v-if="product" :product="product" />
    </section>
    <ProductsSection title="Explorez d'autres saveurs" :products="relatedProducts" />
</template>
