<script setup lang="ts">
import type { Product } from '@/api/products.api';
import { computed, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useFetch } from '@vueuse/core';
import { Skeleton } from '@/components/ui/skeleton';
import ProductQuantityInput from '@/components/products/product-quantity-input.vue';
import AddToBasketButton from '@/components/products/add-to-basket-button.vue';
import ProductDescription from '@/components/products/product-description.vue';
import ProductsSection from '@/components/products/products-section.vue';


const route = useRoute();
const productId = route.params.id;
const productUrl = ref(`https://fakestoreapi.com/products/${productId}`);
const productsUrl = ref(`https://fakestoreapi.com/products?limit=4`);

const { data: product, isFetching } = useFetch(productUrl, { refetch: true }).json<Product>();
const { data: products } = useFetch(productsUrl, { refetch: true }).json<Product[]>();

const relatedProducts = computed(() => products.value?.filter((product) => `${product.id}` !== productId));

watch(() => route.params.id, (id) => {
    productUrl.value = `https://fakestoreapi.com/products/${id}`;
});
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
            <ProductQuantityInput v-if="!isFetching && product" class="text-xl" :product-id="product.id" />
            <Skeleton v-else class="h-5 w-[10ch] rounded-xl" />
            <AddToBasketButton v-if="!isFetching && product" class="uppercase font-medium" />
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
