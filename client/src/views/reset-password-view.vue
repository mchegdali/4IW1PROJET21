<script setup lang="ts">
import RegisterForm from '@/components/auth/register-form.vue';
import Button from '@/components/ui/button/Button.vue';
</script>

<template>
  <div class="flex justify-center items-center p-16">

    <div class="border p-5 rounded-lg shadow-lg max-w-screen-md">
      <h1 class="text-3xl font-bold mb-5">Réinitialiser mon mot de passe</h1>
      <RegisterForm />

    </div>

  </div>
</template>
