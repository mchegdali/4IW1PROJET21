<script setup lang="ts">
import type { Product } from '@/api/products.api';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious
} from '@/components/ui/carousel';
import ProductCard from '@/components/products/product-card.vue';

const { products, title } = defineProps<{
  products?: Product[] | null;
  title?: string;
}>();
</script>

<template>
  <section class="flex flex-col gap-4 w-full max-w-screen-xs mb-2">
    <slot name="header">
      <h2 class="text-3xl font-semibold">{{ title }}</h2>
    </slot>
    <slot>
      <Carousel
        class="relative w-full max-w-xs md:max-w-screen-sm lg:max-w-screen-lg xl:max-w-screen-xl overflow-hidden"
      >
        <CarouselContent class="gap-2">
          <CarouselItem v-for="product in products" :key="product._id">
            <ProductCard v-if="product" :product="product" />
          </CarouselItem>
        </CarouselContent>

        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </slot>
  </section>
</template>
