<script setup lang="ts">
import { MoveLeft } from 'lucide-vue-next';
import { useUserStore } from '@/stores/user';
import { RouterLink } from 'vue-router';

const { user } = useUserStore();
</script>

<template>
  <main class="grow p-4 container">
    <div class="flex items-center w-full relative align">
      <div class="block lg:hidden">
        <RouterLink :to="{ name: 'account' }"><MoveLeft /></RouterLink>
      </div>
      <h1 class="font-bold text-lg text-center w-full sm:text-3xl">
        Vos informations personnelles
      </h1>
    </div>

    <div v-if="user" class="mt-4">
      <div class="mb-4"><strong>Votre nom:</strong> {{ user.fullname }}</div>
      <div class="mb-4"><strong>Votre adresse e-mail:</strong> {{ user.email }}</div>

      <RouterLink
        :to="{ name: 'edit-account' }"
        class="bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded"
      >
        Modifier vos informations
      </RouterLink>
    </div>
  </main>
</template>
