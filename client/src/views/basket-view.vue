<script setup lang="ts">
import BasketInformation from '@/components/basket/basket-information.vue';
import BasketList from '@/components/basket/basket-list.vue';
import Button from '@/components/ui/button/Button.vue';
</script>

<template>
  <main class="grow">
    <h1 class="text-3xl font-bold m-2">Panier</h1>
    <BasketInformation />
    <BasketList />
    <div class="m-4">
      <Button class="w-full">Paiement</Button>
    </div>
  </main>
</template>
