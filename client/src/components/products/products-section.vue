<script setup lang="ts">
import { computed } from 'vue';
import { breakpointsTailwind, useBreakpoints } from '@vueuse/core';
import type { Product } from '@/api/products.api';
import { Skeleton } from '@/components/ui/skeleton';
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

const breakpoints = useBreakpoints(breakpointsTailwind);

const isMd = breakpoints.isSmaller('lg');
const isLg = breakpoints.isSmaller('xl');
const isXl = breakpoints.isSmaller('2xl');
const isXxl = breakpoints.isGreaterOrEqual('2xl');
</script>

<template>
  <section class="flex flex-col gap-4 w-full max-w-screen-xs mb-2">
    <slot name="header">
      <h2 class="text-3xl font-semibold">{{ title }}</h2>
    </slot>
    <slot>
      <Carousel
        class="relative w-full max-w-xs md:max-w-screen-sm lg:max-w-screen-lg xl:max-w-screen-xl"
        v-slot="{ canScrollNext, canScrollPrev }"
      >
        <CarouselContent>
          <CarouselItem
            v-for="product in products"
            :key="product._id"
            class="basis-3/5 md:basis-3/4 lg:basis-2/3 xl:basis-1/3"
          >
            <ProductCard v-if="product" :product="product" />
          </CarouselItem>
        </CarouselContent>

        <CarouselPrevious v-if="canScrollPrev" />
        <CarouselNext v-if="canScrollNext" />
      </Carousel>
      <!-- <Carousel
        class="-mx-4 overflow-visible"
        v-if="products"
        :opts="{
          loop: true,
          active
        }"
      >
        <CarouselContent class="overflow-visible">
          <CarouselItem
            class="basis-3/4 md:basis-auto"
            v-for="product in products"
            :key="product._id"
          >
            <ProductCard v-if="product" :product="product" />
          </CarouselItem>
        </CarouselContent>
      </Carousel>
      <Carousel
        class="-mx-4"
        v-else
        :opts="{
          loop: true,
          active: false
        }"
      >
        <CarouselContent>
          <CarouselItem class="basis-3/4" v-for="index in [0, 1, 2, 3]" :key="index">
            <Skeleton class="w-full max-w-sm h-96" />
          </CarouselItem>
        </CarouselContent>
      </Carousel> -->
    </slot>
  </section>
</template>
