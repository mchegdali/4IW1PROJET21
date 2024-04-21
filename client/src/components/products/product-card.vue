<script setup lang="ts">
import { type Product } from '@/api/products.api';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import ProductQuantityInput from './product-quantity-input.vue';
import AddToCartButton from './add-to-cart-button.vue';

const { product } = defineProps<{ product: Product }>();
</script>

<template>
    <Card class="shadow-xl max-w-60 h-full flex flex-col">
        <CardHeader>
            <div class="w-32 self-center">
                <AspectRatio :ratio="1" class="bg-muted object-center">
                    <img :src="product.image" class="rounded-lg object-cover object-center w-full h-full" />
                </AspectRatio>
            </div>
            <CardTitle>{{ product.title }}</CardTitle>
            <CardDescription class="text-primary">{{ product.category }}</CardDescription>
        </CardHeader>
        <CardContent class="flex flex-col gap-1 items-center justify-self-end">
            <p class="text-xl font-semibold">{{ product.price }}€</p>
            <ProductQuantityInput class="text-xl" :product-id="product.id" />
            <AddToCartButton class="uppercase font-medium" />
        </CardContent>
    </Card>
</template>
