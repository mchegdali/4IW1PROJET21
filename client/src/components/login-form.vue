<script setup lang="ts">
import { ref, computed } from 'vue';
import Input from './ui/input/Input.vue';
import Button from '@/components/ui/button/Button.vue';
import { z } from 'zod';
import logo from '@/assets/images/fanthesie.png';

const emailSchema = z.string().email({
  message: 'Adresse e-mail invalide'
});

const email = ref('');
const password = ref('');
const showEmailError = ref(false);

const emailError = computed(() => {
  const parsedEmail = emailSchema.safeParse(email.value);
  return parsedEmail.success ? '' : parsedEmail.error.issues[0].message;
});

function handleSubmit() {
  showEmailError.value = !emailSchema.safeParse(email.value).success;
}
</script>

<template>
  <img :src="logo" alt="Fanthesie" class="bg-tea-600 p-5 rounded-lg mb-5" />
  <div class="border p-5 rounded-lg shadow-lg">
    <form @submit.prevent="handleSubmit" class="flex flex-col gap-4">
      <div>
        <label
          >Adresse e-mail
          <Input id="email" v-model="email" autofocus />
        </label>
        <small class="error" v-if="showEmailError">
          {{ emailError }}
        </small>
      </div>
      <div>
        <label
          >Mot de passe
          <Input id="password" type="password" v-model="password" required />
        </label>
      </div>
      <div class="flex gap-4">
        <RouterLink :to="{ name: 'register' }" class="w-1/2">
          <Button class="w-full bg-white text-tea-600 border hover:bg-gray-100"
            >Créer un compte</Button
          >
        </RouterLink>
        <Button type="submit" class="w-1/2">Connexion</Button>
      </div>
    </form>
    <div class="mt-5">
      <p>
        En continuant, vous acceptez les
        <a href="/" class="text-tea-600">conditions d'utilisation et de vente</a> de Fanthésie.
        Consultez notre <a href="/" class="text-tea-600">déclaration de confidentialité</a>, notre
        <a href="/" class="text-tea-600">politique relative aux cookies</a>.
      </p>
    </div>
    <div class="text-center mt-5">
      <a href="/" class="text-center">Mot de passe oublié ?</a>
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
