<script setup lang="ts">
import Input from './ui/input/Input.vue';
import Button from '@/components/ui/button/Button.vue';
import { computed, ref } from 'vue';
import logo from '@/assets/images/fanthesie.png';
import { z } from 'zod';
import { Info } from 'lucide-vue-next';

const emailSchema = z.string().email({
  message: "L'e-mail doit etre sous cette forme : exemple@example.com"
});

const nameSchema = z.string().regex(/^[a-zA-ZÀ-ÿ' -]+$/, {
  message: "Ne peut contenir que des lettres, des apostrophes, des tirets et des accents."
});

const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z0-9]).{8,}$/;

const passwordSchema = z.string().regex(passwordRegex, {
  message: 'Le mot de passe ne répond pas aux critères requis.'
});

const email = ref('');
const name = ref('');
const password = ref('');
const confirmPassword = ref('');

const showEmailError = ref(false);
const showNameError = ref(false);
const showPasswordError = ref(false);
const showConfirmPasswordError = ref(false);

const emailError = computed(() => {
  const parsedEmail = emailSchema.safeParse(email.value);
  return parsedEmail.success ? '' : parsedEmail.error.issues[0].message;
});

const passwordError = computed(() => {
  const parsedPassword = passwordSchema.safeParse(password.value);

  if (parsedPassword.success) {
    return '';
  }

  return parsedPassword.error.issues[0].message;
});

const nameError = computed(() => {
  const parsedName = nameSchema.safeParse(name.value);

  if (parsedName.success) {
    return '';
  }
  return parsedName.error.issues[0].message;
});

const confirmPasswordError = computed(() => {
  return password.value === confirmPassword.value ? '' : 'Le mot de passe ne correspond pas';
});

function handleSubmit() {
  showEmailError.value = !emailSchema.safeParse(email.value).success;
  showNameError.value = !nameSchema.safeParse(name.value).success;
  showPasswordError.value = !passwordSchema.safeParse(password.value).success;
  showConfirmPasswordError.value = password.value !== confirmPassword.value;

  if (
    showEmailError.value ||
    showNameError.value ||
    showPasswordError.value ||
    showConfirmPasswordError.value
  ) {
    console.log('Il y a des erreurs dans les données');
    return;
  }
  console.log("Il n'y a pas d'erreurs dans les données");
}
</script>

<template>
  <img :src="logo" alt="Fanthesie" class="bg-tea-600 p-5 rounded-lg mb-5" />
  <div class="border p-5 rounded-lg shadow-lg">
    <form class="flex flex-col gap-4" @submit.prevent="handleSubmit">
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
          >Nom et Prénom
          <Input id="name" type="text" v-model="name" />
        </label>
        <small class="error" v-if="showNameError">
          {{ nameError }}
        </small>
      </div>
      <div>
        <label
          >Mot de passe
          <Input id="password" type="password" v-model="password" />
        </label>
        <div class="rounded-lg my-2 flex gap-2">
          <Info />
          <p class="text-xs">
            Le mot de passe doit contenir au moins une lettre minuscule, une lettre majuscule, un
            chiffre et un symbole, et doit avoir au moins 8 caractères.
          </p>
        </div>
        <small class="error" v-if="showPasswordError">
          {{ passwordError }}
        </small>
      </div>
      <div>
        <label
          >Confirmation du mot de passe
          <Input id="confirmPassword" type="password" v-model="confirmPassword" />
        </label>
        <small class="error" v-if="showConfirmPasswordError">
          {{ confirmPasswordError }}
        </small>
      </div>
      <Button type="submit" class="w-full">Confirmer</Button>
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
      <RouterLink :to="{ name: 'login' }">
        <a href="/" class="text-center">Déja un compte ?</a>
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
