<script setup lang="ts">
import { ref } from 'vue'

interface Product {
  name: string
  description: string
}

const products = ref<Array<Product>>([])

fetch('https://fakestoreapi.com/products')
  .then((response) => response.json())
  .then((data) => {
    const fiveProducts = data.slice(0, 5)
    products.value = fiveProducts
    console.log(products.value)
  })
  .catch((error) => console.error('Erreur lors de la récupération des produits:', error))

function reduceLenghtDescription(value: string) {
  let parseValue = value.length

  if (parseValue > 30) {
    let newDescription = value.slice(0, 30)
    return newDescription + '...'
  }
}

const prices: number[] = []
function calculPrice(price: number) {
  prices.push(price)
  return price;
}

console.log(prices);

function totalPrice(prices: number[]): number {
  let total = 0;
  for (let i = 0; i < prices.length; i++) {
    total += prices[i];
    console.log(total)
  }
  return total;
}

const result = totalPrice(prices);

</script>

<template>
  <div
    v-for="product in products"
    :key="product.id"
    class="w-full bg-white p-4 border-b border-gray-200"
  >
    <div class="flex gap-6">
      <div class="w-24 h-24 bg-red-200">
        <img class="w-24 h-full bg-slate-400" :src="product.image" :alt="product.title" />
      </div>
      <div class="flex flex-col gap-2">
        <h2 class="font-bold">{{ calculPrice(product.price) }}$</h2>
        <p class="text-sm text-gray-500">{{ reduceLenghtDescription(product.description) }}</p>
        <p>Quantité: 1 {{ result }}</p>
        <!-- Ajoutez d'autres informations du produit ici -->
      </div>
    </div>
  </div>
</template>
