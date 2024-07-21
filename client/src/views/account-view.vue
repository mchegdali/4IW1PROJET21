<script setup lang="ts">
import AccountMenu from '@/components/account-menu.vue';
import { useUserStore } from '@/stores/user';

const userStore = useUserStore();
</script>

<template>
  <main class="grow lg:container">
    <h1 class="text-3xl font-bold m-2">Mon compte</h1>
    <div class="flex flex-col text-center mt-10">
      <p>Bonjour,</p>
      <p class="font-bold text-2xl">{{ userStore.user?.fullname }}</p>
    </div>
    <div class="flex justify-center">
      <AccountMenu />
    </div>
  </main>
</template>
