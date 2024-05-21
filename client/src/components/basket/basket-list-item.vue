<script setup lang="ts">
import { computed } from 'vue';
import type { Product } from '@/api/products.api';
import QuantityInput from '@/components/shared/quantity-input.vue';
import { useBasketStore } from '@/stores/basket';
import { Minus, Trash } from 'lucide-vue-next';
const { product } = defineProps<{ product: Product }>();

const basketStore = useBasketStore();
const productCount = computed(() => {
  return basketStore.products.filter((p) => p._id === product._id).length;
})

function onIncrement() {
  basketStore.addProduct(product);
}

function onDecrement() {
  if (productCount.value > 0) {
    basketStore.removeProduct(product);
  }
}

function onInput(value: number) {
  basketStore.setProductNumber(product, value);
}
</script>

<template>
  <div class="flex gap-6">
    <div class="w-24 h-24">
      <img class="min-w-24 h-full bg-slate-400" :src="product.image" :alt="product.title" />
    </div>
    <div class="flex flex-col gap-2 w-full">
      <div class="flex justify-between w-full">
        <h2 class="font-bold text-sm">{{ product.price }} €</h2>
      </div>

      <h2 class="text-sm">{{ product.title }}</h2>
      <p class="text-sm text-gray-500 line-clamp-2">
        {{ product.description }}
      </p>
      <div class="flex gap-2 w-full">
        <QuantityInput @decrement="onDecrement" @increment="onIncrement" @input="onInput" :value="productCount"
          :is-decrease-disabled="productCount <= 0">
          <template v-slot:minus>
            <Minus v-if="productCount > 1" width="16" height="16" />
            <Trash v-else width="16" height="16" />
          </template>
        </QuantityInput>
      </div>
    </div>
  </div>
</template>
