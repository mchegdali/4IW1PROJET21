<script setup lang="ts">
import { computed, reactive } from 'vue'
import basket from '../api/basket.json'
import { Plus, Minus, Trash } from 'lucide-vue-next'

interface Product {
  id: number
  name: string
  description: string
  price: number
  quantity: number
  image: string
}

const products = reactive<Array<Product>>(basket.products)

// fetch(basket)
//   .then((response) => response.json())
//   .then((data) => {
//     const fiveProducts = data.slice(0, 5)
//     products.push(...fiveProducts)
//     console.log(products)
//   })
//   .catch((error) => console.error('Erreur lors de la récupération des produits:', error))


</script>

<template>
  <div v-for="product in products" :key="product.id" class="w-full bg-white p-4 border-b border-gray-200">
    <div class="flex gap-6">
      <div class="w-24 h-24">
        <img class="min-w-24 h-full bg-slate-400" :src="product.image" :alt="product.name" />
      </div>
      <div class="flex flex-col gap-2 w-full">
        <div class="flex justify-between w-full">
          <h2 class="font-bold text-sm">{{ product.price }} €</h2>
          <Trash />
        </div>

        <h2 class="text-sm">{{ product.name }}</h2>
        <p class="text-sm text-gray-500 line-clamp-2">
          {{ product.description }}
        </p>
        <div class="flex gap-2 w-full">
          <p class="text-sm w-full">Quantité:</p>
          <Button class="">
            <Minus />
          </Button>
          <p>{{ product.quantity }}</p>
          <Button>
            <Plus />
          </Button>
        </div>
      </div>
    </div>
  </div>
</template>
