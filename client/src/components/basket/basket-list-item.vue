<script setup lang="ts">
import { computed } from 'vue';
import type { Product } from '@/api/products.api';
import {
  NumberField,
  NumberFieldContent,
  NumberFieldDecrement,
  NumberFieldIncrement,
  NumberFieldInput
} from '@/components/ui/number-field';
import { useBasketStore } from '@/stores/basket';
import { Trash } from 'lucide-vue-next';
const { product } = defineProps<{ product: Product }>();

const basketStore = useBasketStore();
const productCount = computed(() => {
  return basketStore.products.filter((p) => p._id === product._id).length;
});

function onIncrement() {
  basketStore.addProduct(product);
}

function onDecrement() {
  basketStore.removeProduct(product);
}
</script>

<template>
  <div class="flex gap-6">
    <div class="w-24 h-24">
      <img class="min-w-24 h-full bg-slate-400" :src="product.image" :alt="product.name" />
    </div>
    <div class="flex flex-col gap-2 w-full">
      <div class="flex justify-between w-full">
        <h2 class="font-bold text-sm">{{ product.price }} €</h2>
      </div>

      <h2 class="text-sm">{{ product.name }}</h2>
      <p class="text-sm text-gray-500 line-clamp-2">
        {{ product.description }}
      </p>
      <div class="flex gap-2 w-full">
        <NumberField :model-value="productCount" :min="0" class="max-w-40">
          <NumberFieldContent>
            <NumberFieldDecrement v-if="productCount > 1" @click="onDecrement" />
            <NumberFieldDecrement v-else @click="onDecrement">
              <template #default>
                <Trash width="16" height="16" />
              </template>
            </NumberFieldDecrement>
            <NumberFieldInput />
            <NumberFieldIncrement @click="onIncrement" />
          </NumberFieldContent>
        </NumberField>
      </div>
    </div>
  </div>
</template>
