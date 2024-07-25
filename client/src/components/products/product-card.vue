<script setup lang="ts">
import { type Product } from '@/api/products.api';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

import Button from '../ui/button/Button.vue';
import { useBasketStore } from '@/stores/basket';
import { useUserStore } from '@/stores/user';
import { addProductToBasket, fetchBasket } from '@/api/basket';
import { toast } from '../ui/toast';

const { product } = defineProps<{ product: Product }>();

const userStore = useUserStore();
const basketStore = useBasketStore();

async function handleAddToBasketClick() {
  if (userStore.isAuthenticated) {
    const addToBasketResponse = await addProductToBasket(
      userStore.user?.id!,
      userStore.accessToken!,
      product,
      1
    );
    if (addToBasketResponse.ok) {
      const response = await fetchBasket(userStore.user?.id!, userStore.accessToken!);
      if (response.ok) {
        basketStore.products = await response.json();
      }
    }
  }

  toast({
    title: `${product.name} ajouté au panier`,
    description: 'Vous pouvez maintenant vous déplacer dans votre panier',
    type: 'foreground',
    duration: 2500,
    variant: 'success'
  });
}
</script>

<template>
  <Card class="shadow-sm shadow-primary/25">
    <CardHeader class="pb-0">
      <div class="w-32 self-center">
        <AspectRatio :ratio="1" class="bg-muted object-center">
          <img :src="product.image" class="rounded-lg object-cover object-center size-full" />
        </AspectRatio>
      </div>
      <CardTitle class="text-md md:text-lg line-clamp-1">
        <RouterLink :to="{ path: `/products/${product.slug}` }">{{ product.name }}</RouterLink>
      </CardTitle>
      <CardDescription class="text-xs text-tea-600 font-semibold">{{
        product.category.name
      }}</CardDescription>
    </CardHeader>
    <CardContent class="flex flex-col gap-1 items-center pt-0">
      <p class="text-md md:text-lg font-semibold">{{ product.price }}€</p>
      <Button class="uppercase font-medium text-xs md:text-sm" @click="handleAddToBasketClick">
        Ajouter au panier
      </Button>
    </CardContent>
  </Card>
</template>
