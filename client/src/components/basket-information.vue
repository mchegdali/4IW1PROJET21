<script setup lang="ts">
import { computed, reactive } from 'vue';
import basket from "../api/basket.json"

interface Product {
  id: number,
  name: string,
  description: string,
  price: number,
  quantity: number,
  image: string
}

const products = reactive<Array<Product>>(basket.products)

const ProductNumber = products.length

const totalPrice = computed(() => {
  return products.reduce((prev, curr) => {
    return prev + curr.price;
  }, 0)
})

</script>

<template>

<div class="w-full bg-white flex justify-center gap-4 border-b border-gray-200 p-2">
    <p class=" text-slate-500">{{ ProductNumber }} Article(s): Total (hors livraison)</p>
    <p class="font-bold">{{ totalPrice }} €</p>
</div>

</template>