<script setup lang="ts">
import Button from '@/components/ui/button/Button.vue';
</script>

<template>
  <div class="text-center">
    <div class="flex flex-col gap-3">
      <h2 class="font-bold">REJOIGNEZ-NOUS</h2>
      <p>Voir vos commandes et mettre à jour vos informations</p>
    </div>
    <br />
    <div class="flex flex-col gap-2">
      <RouterLink :to="{ name: 'login' }" class="flex items-end flex-1">
        <Button class="w-full">Connexion</Button>
      </RouterLink>
      <RouterLink :to="{ name: 'register' }" class="flex items-end flex-1">
        <Button class="w-full bg-white text-tea-600 border hover:bg-gray-100">S'inscrire</Button>
      </RouterLink>
    </div>
  </div>
</template>

<style scoped>
.error {
  color: red;
  display: block;
  padding-left: 20px;
}
</style>
