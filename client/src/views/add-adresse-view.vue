<script setup lang="ts">
import AdresseForm from '@/components/adresse-form.vue';
import { MoveLeft } from 'lucide-vue-next';
</script>

<template>
  <main class="grow">
    <div class="flex items-center w-full relative align">
      <div class="block lg:hidden">
        <RouterLink :to="{ name: 'adresses' }"><MoveLeft /></RouterLink>
      </div>
      <h1 class="font-bold text-lg text-center w-full sm:text-3xl">Ajout d'une adresse</h1>
    </div>
    <AdresseForm />
  </main>
</template>
