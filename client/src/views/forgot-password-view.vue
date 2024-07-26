<script setup lang="ts">
import ForgotPasswordForm from '@/components/auth/forgot-password-form.vue';
import Button from '@/components/ui/button/Button.vue';
</script>

<template>
  <main class="bg-blue-500 h-full w-full">
    <div class="border p-5 rounded-lg shadow-lg max-w-screen-md">
      <h1 class="text-3xl font-bold mb-5">Réinitialiser votre mot de passe</h1>
      <ForgotPasswordForm />
      <div class="text-center mt-5">
        <Button as-child variant="outline" class="w-full" role="link">
          <RouterLink :to="{ name: 'login' }">Retour à la page de connexion</RouterLink>
        </Button>
      </div>
    </div>
  </main>
</template>
