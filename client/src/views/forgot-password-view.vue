<script setup lang="ts">
import ForgotPasswordForm from '@/components/auth/forgot-password-form.vue';
import Button from '@/components/ui/button/Button.vue';
</script>

<template>
  <div class="flex justify-center items-center p-16">

    <div class="border p-5 rounded-lg shadow-lg max-w-screen-md">
      <h1 class="text-3xl font-bold mb-5">Réinitialiser votre mot de passe</h1>
      <ForgotPasswordForm />
      <div class="text-center mt-5">
        <Button as-child class="w-full text-center bg-white text-tea-600 border hover:bg-gray-100" role="link">
          <RouterLink :to="{ name: 'login' }">Retour à la page de connexion</RouterLink>
        </Button>

      </div>
    </div>

  </div>
</template>
