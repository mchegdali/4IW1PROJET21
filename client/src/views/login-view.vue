<script setup lang="ts">
import LoginForm from '@/components/auth/login-form.vue';
import { RouterLink } from 'vue-router';
</script>

<template>
  <div class="flex justify-center items-center p-16">

    <div class="border p-5 rounded-lg shadow-lg max-w-screen-md">
      <h1 class="text-3xl font-bold mb-5">S'identifier</h1>
      <LoginForm />
      <div class="mt-5">
        <p>
          En continuant, vous acceptez les
          <a href="/" class="text-tea-600">conditions d'utilisation et de vente</a> de Fanthésie.
          Consultez notre <a href="/" class="text-tea-600">déclaration de confidentialité</a>, notre
          <a href="/" class="text-tea-600">politique relative aux cookies</a>.
        </p>
      </div>
      <div class="text-center mt-5">
        <div class="flex items-center justify-center">
          <div class="flex-grow border-t border-current text-gray-300"></div>
          <RouterLink :to="{ name: 'forgot-password' }" class="text-center font-bold text-tea-600 mx-4">Mot de passe
            oublié ?</RouterLink>
          <div class="flex-grow border-t border-current text-gray-300"></div>
        </div>
      </div>
    </div>

  </div>
</template>
