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

const { products, title, description } = defineProps<{
  products?: Product[] | null;
  title?: string;
  description?: string;
}>();
</script>

<template>
  <section class="space-y-4 w-full mb-2">
    <header class="py-2 px-4">
      <slot name="header">
        <h2 class="text-3xl font-semibold">{{ title }}</h2>
      </slot>
      <slot name="description" v-if="description">
        <p class="text-base text-gray-500">
          {{ description }}
        </p>
      </slot>
    </header>
    <slot>
      <Carousel class="relative w-full overflow-hidden">
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
