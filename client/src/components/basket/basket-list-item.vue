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
import { fetchBasket, setProductCountToBasket } from '@/api/basket';
import { useUserStore } from '@/stores/user';

const { readonly, product } = withDefaults(defineProps<{ readonly: boolean; product: Product }>(), {
  readonly: false
});

const userStore = useUserStore();
const basketStore = useBasketStore();
const userStore = useUserStore();

const productCount = computed(() => {
  return basketStore.products.filter((p) => p.id === product.id).length;
});

async function onInput(value: number) {
  const
  basketStore.setProductCount(product, value);
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
        <NumberField
          :model-value="productCount"
          :min="0"
          class="max-w-40"
          @update:model-value="onInput"
        >
          <NumberFieldContent>
            <NumberFieldDecrement v-if="productCount > 0" />
            <NumberFieldDecrement v-else>
              <template #default>
                <Trash width="16" height="16" class="text-red-500" />
              </template>
            </NumberFieldDecrement>
            <NumberFieldInput />
            <NumberFieldIncrement />
          </NumberFieldContent>
        </NumberField>
        <div v-else class="text-sm font-medium">Quantité: {{ productCount }}</div>
      </div>
    </div>
  </div>
</template>
