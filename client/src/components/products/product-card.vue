<script setup lang="ts">
import { type Product } from '@/api/products.api';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import ProductQuantityInput from './product-quantity-input.vue';
import AddToBasketButton from './add-to-basket-button.vue';

const { product } = defineProps<{ product: Product }>();
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
            <ProductQuantityInput class="text-xl" :product-id="product.id" />
            <AddToBasketButton class="uppercase font-medium" />
        </CardContent>
    </Card>
</template>
