<script setup lang="ts">
import { MoveLeft } from 'lucide-vue-next';
import MyInformationForm from '@/components/my-information-form.vue';
</script>

<template>
  <main class="grow p-4">
    <header class="flex items-center w-full relative align mb-6">
      <div class="block lg:hidden">
        <RouterLink :to="{ name: 'account' }"><MoveLeft /></RouterLink>
      </div>
      <h1 class="font-bold text-lg text-center w-full sm:text-3xl">Modifier vos informations</h1>
    </header>

    <MyInformationForm />
  </main>
</template>
