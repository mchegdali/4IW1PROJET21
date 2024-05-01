<script setup lang="ts">
import BasketInformation from '@/components/BasketInformation.vue'
import ProductBasketCard from '@/components/ProductBasketCard.vue'
import Button from '@/components/ui/button/Button.vue'
</script>

<template>
  <h1 class="text-3xl font-bold m-2">Panier</h1>
  <BasketInformation />
  <ProductBasketCard />

  <div class="m-4">
    <Button class="w-full">Paiement</Button>
  </div>
</template>
