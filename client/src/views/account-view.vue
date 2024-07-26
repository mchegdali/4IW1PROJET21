<script setup lang="ts">
import AccountMenu from '@/components/account-menu.vue';
import Button from '@/components/ui/button/Button.vue';
import { LogOut } from 'lucide-vue-next';
import { useUserStore } from '@/stores/user';
import { useRouter } from 'vue-router';

const userStore = useUserStore();
const router = useRouter();

const handleLogout = () => {
  userStore.logout();
  router.push({ name: 'home' });
};
</script>

<template>
  <main class="grow lg:container">
    <h1 class="text-3xl font-bold m-2">Mon compte</h1>
    <div class="flex flex-col text-center mt-10 mb-4">
      <p>Bonjour,</p>
      <p class="font-bold text-2xl">{{ userStore.user?.fullname }}</p>
    </div>
    <div class="flex justify-center">
      <AccountMenu />
    </div>
    <div class="flex justify-center mt-6">
      <Button @click="handleLogout" variant="outline-destructive" class="gap-2">
        Déconnexion
        <LogOut class="size-4" />
      </Button>
    </div>
  </main>
</template>
