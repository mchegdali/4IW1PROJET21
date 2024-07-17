<script setup lang="ts">
import Button from '@/components/ui/button/Button.vue';
</script>

<template>
  <main class="grow flex justify-center items-center p-16">
    <div class="border border-tea-200 p-5 rounded-lg shadow-lg shadow-tea-50 max-w-screen-md">
      <div class="flex flex-col items-center justify-center w-full">
        <div class="flex flex-col items-center justify-center w-full">
          <h1 class="text-3xl font-bold text-center">Réinitialisation de votre mot de passe</h1>
          <p class="text-center">
            Un email de réinitialisation de mot de passe vous a été envoyé. Veuillez consulter votre
            boîte mail et cliquer sur le lien de réinitialisation pour réinitialiser votre mot de
            passe.
          </p>
          <Button as-child variant="outline">
            <RouterLink :to="{ name: 'login' }"> Retour à la page de connexion </RouterLink>
          </Button>
        </div>
      </div>
    </div>
  </main>
</template>
