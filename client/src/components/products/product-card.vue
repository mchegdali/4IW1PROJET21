<script setup lang="ts">
import { type Product } from '@/api/products.api';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import QuantityInput from '@/components/shared/quantity-input.vue';
import { ref } from 'vue';
import Button from '../ui/button/Button.vue';
import { useBasketStore } from '@/stores/basket';

const { product } = defineProps<{ product: Product }>();

const basketStore = useBasketStore();

const count = ref(0);

function onIncrement() {
  count.value++;
}

function onDecrement() {
  if (count.value > 0) {
    count.value--;
  }
}

function handleAddToBasketClick() {
  basketStore.addProduct(product, count.value);
  count.value = 0;
}
</script>

<template>
  <Card class="shadow-xl min-w-80 max-w-xs h-full flex flex-col">
    <CardHeader>
      <div class="w-32 self-center">
        <AspectRatio :ratio="1" class="bg-muted object-center">
          <img :src="product.image" class="rounded-lg object-cover object-center w-full h-full" />
        </AspectRatio>
      </div>
      <CardTitle class="text-xl">
        <RouterLink :to="{ path: `/products/${product.id}` }">{{ product.title }}</RouterLink>
      </CardTitle>
      <CardDescription class="text-primary">{{ product.category }}</CardDescription>
    </CardHeader>
    <CardContent class="flex flex-col gap-1 items-center">
      <p class="text-xl font-semibold">{{ product.price }}€</p>
      <QuantityInput @decrement="onDecrement" @increment="onIncrement" :value="count"
        :is-decrease-disabled="count <= 0" />
      <Button class="uppercase font-medium" @click="handleAddToBasketClick">
        Ajouter au panier
      </Button>
    </CardContent>
  </Card>
</template>
