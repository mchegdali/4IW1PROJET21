<script setup lang="ts">
// import { computed, watch, reactive } from 'vue';

import type { Product } from '@/api/products.api';
import { Skeleton } from '@/components/ui/skeleton';
import {
    Carousel,
    CarouselContent,
    CarouselItem,
} from '@/components/ui/carousel'
import ProductCard from '@/components/products/product-card.vue';
const { products, title } = defineProps<{
    products?: Product[] | null,
    title?: string,
}>();


</script>

<template>
    <section class="flex flex-col gap-1 w-full max-w-screen-xs mb-2">
        <slot name="header">
            <h2 class="text-3xl font-semibold">{{ title }}</h2>
        </slot>
        <slot>
            <Carousel class="-mx-4 pb-8 overflow-visible" v-if="products" :opts="{
                align: 'center',
                loop: true,
            }">
                <CarouselContent class="overflow-visible">
                    <CarouselItem class="basis-4/6" v-for="product in products" :key="product.id">
                        <ProductCard v-if="product" :product="product" />
                    </CarouselItem>
                </CarouselContent>

            </Carousel>
            <Carousel class="-mx-4" v-else :opts="{
                align: 'center',
                loop: true,
                active: false
            }">
                <CarouselContent>
                    <CarouselItem class="basis-4/6" v-for="index in [0, 1, 2]" :key="index">
                        <Skeleton class="w-60 h-96" />
                    </CarouselItem>
                </CarouselContent>
            </Carousel>
        </slot>
    </section>
</template>