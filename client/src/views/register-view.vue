<script setup lang="ts">
import RegisterForm from '@/components/auth/register-form.vue';
import Button from '@/components/ui/button/Button.vue';
</script>

<template>
  <main class="grow flex justify-center items-center p-16">
    <div class="border p-5 rounded-lg shadow-lg max-w-screen-md">
      <h1 class="text-3xl font-bold mb-5">Créer un compte</h1>
      <RegisterForm />
      <div class="mt-5">
        <p>
          En continuant, vous acceptez les
          <RouterLink :to="{ name: 'conditions' }" class="text-tea-600"
            >conditions générales de vente et d'utilisation</RouterLink
          >
          de Fanthésie. Consultez notre
          <RouterLink :to="{ name: 'confidentiality-declaration' }" class="text-tea-600"
            >déclaration de confidentialité</RouterLink
          >, notre
          <RouterLink :to="{ name: 'cookie-policy' }" class="text-tea-600"
            >politique relative aux cookies</RouterLink
          >.
        </p>
      </div>
      <div class="flex items-center gap-4">
        <h4>Déja un compte chez Fanthésie ?</h4>
        <Button variant="link" as-child type="button">
          <RouterLink :to="{ name: 'login' }"> S'identifier </RouterLink>
        </Button>
      </div>
    </div>
  </main>
</template>
