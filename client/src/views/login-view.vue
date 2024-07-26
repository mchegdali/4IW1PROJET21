<script setup lang="ts">
import LoginForm from '@/components/auth/login-form.vue';
import { RouterLink } from 'vue-router';
</script>

<template>
  <main class="grow flex justify-center items-center p-16">
    <div class="border p-5 rounded-lg shadow-lg max-w-screen-md">
      <h1 class="text-3xl font-bold mb-5">S'identifier</h1>
      <LoginForm />
      <div class="mt-5">
        <p>
          En continuant, vous acceptez les
          <RouterLink :to="{ name: 'conditions' }" class="text-tea-600"
            >conditions générales de vente et d'utilisation
          </RouterLink>
          de Fanthésie. Consultez notre
          <RouterLink :to="{ name: 'confidentiality-declaration' }" class="text-tea-600"
            >déclaration de confidentialité</RouterLink
          >, notre
          <RouterLink :to="{ name: 'cookie-policy' }" class="text-tea-600"
            >politique relative aux cookies</RouterLink
          >.
        </p>
      </div>
      <div class="text-center mt-5">
        <div class="flex items-center justify-center">
          <div class="flex-grow border-t border-current text-gray-300"></div>
          <RouterLink
            :to="{ name: 'forgot-password' }"
            class="text-center font-bold text-tea-600 mx-4"
            >Mot de passe oublié ?</RouterLink
          >
          <div class="flex-grow border-t border-current text-gray-300"></div>
        </div>
      </div>
    </div>
  </main>
</template>
