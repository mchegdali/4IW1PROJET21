<script setup lang="ts">
import { computed } from 'vue';
import { breakpointsTailwind, useBreakpoints } from '@vueuse/core'
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

const breakpoints = useBreakpoints(breakpointsTailwind)

const isMd = breakpoints.isSmaller('lg');
const isLg = breakpoints.isSmaller('xl');
const isXl = breakpoints.isSmaller('2xl');
const isXxl = breakpoints.isGreaterOrEqual('2xl');


const active = computed(() => {
    if (!Array.isArray(products)) {
        return false
    } else {
        return (
            (!isMd.value && products.length > 1) ||
            (isMd.value && !isLg.value && products.length > 2) ||
            (isLg.value && !isXl.value && products.length > 3) ||
            (isXl.value && !isXxl.value && products.length > 4) ||
            (isXxl.value && products.length > 5)
        )
    }
});
</script>

<template>
    <section class="flex flex-col gap-4 w-full max-w-screen-xs mb-2 ">
        <slot name="header">
            <h2 class="text-3xl font-semibold">{{ title }}</h2>
        </slot>
        <slot>
            <Carousel class="-mx-4 overflow-visible" v-if="products" :opts="{
                loop: true,
                active,
            }">
                <CarouselContent class="overflow-visible">
                    <CarouselItem class="basis-3/4 md:basis-auto" v-for="product in products" :key="product.id">
                        <ProductCard v-if="product" :product="product" />
                    </CarouselItem>
                </CarouselContent>

            </Carousel>
            <Carousel class="-mx-4" v-else :opts="{
                loop: true,
                active: false
            }">
                <CarouselContent>
                    <CarouselItem class="basis-3/4" v-for="index in [0, 1, 2, 3]" :key="index">
                        <Skeleton class="w-full max-w-sm h-96" />
                    </CarouselItem>
                </CarouselContent>
            </Carousel>
        </slot>
    </section>
</template>