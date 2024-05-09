<script setup lang="ts">
import Input from './ui/input/Input.vue';
import Button from '@/components/ui/button/Button.vue';
import { computed, ref } from 'vue';

import { z } from 'zod';

const emailSchema = z.string().email({
  message: "L'e-mail doit etre sous cette forme : exemple@example.com"
});

const nameSchema = z.string().regex(/^[a-zA-ZÀ-ÿ']+$/, {
  message: 'Ne peut contenir que des lettres, des apostrophes et des accents.'
});

const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z0-9]).{8,}$/;

const passwordSchema = z.string().regex(passwordRegex, {
  message:
    'Le mot de passe doit contenir au moins une lettre minuscule, une lettre majuscule, un chiffre et un symbole, et doit avoir au moins 8 caractères.'
});

const email = ref('');
const name = ref('');
const lastName = ref('');
const password = ref('');
const confirmPassword = ref('');
// const dateOfBirth = ref('');

const showEmailError = ref(false);
const showNameError = ref(false);
const showLastNameError = ref(false);
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

const lastNameError = computed(() => {
  const parsedLastName = nameSchema.safeParse(lastName.value);

  if (parsedLastName.success) {
    return '';
  }
  return parsedLastName.error.issues[0].message;
});

const confirmPasswordError = computed(() => {
  return password.value === confirmPassword.value ? '' : 'Le mot de passe ne correspond pas';
});

function handleSubmit() {
  showEmailError.value = !emailSchema.safeParse(email.value).success;
  showNameError.value = !nameSchema.safeParse(name.value).success;
  showLastNameError.value = !nameSchema.safeParse(lastName.value).success;
  showPasswordError.value = !passwordSchema.safeParse(password.value).success;
  showConfirmPasswordError.value = password.value !== confirmPassword.value;

  if (
    showEmailError.value ||
    showNameError.value ||
    showLastNameError.value ||
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
  <div class="border p-5 rounded-lg shadow-lg">
    <form class="flex flex-col gap-4" @submit.prevent="handleSubmit">
      <div>
        <label>Adresse e-mail</label>
        <Input id="email" v-model="email" autofocus />
        <small class="error" v-if="showEmailError">
          {{ emailError }}
        </small>
      </div>
      <div>
        <label>Prénom</label>
        <Input id="name" type="text" placeholder="Prenom" v-model="name" />
        <small class="error" v-if="showNameError">
          {{ nameError }}
        </small>
      </div>
      <div>
        <label>Nom de famille</label>
        <Input id="lastname" type="text" placeholder="Nom de famille" v-model="lastName" />
        <small class="error" v-if="showLastNameError">
          {{ lastNameError }}
        </small>
      </div>
      <div>
        <label>Mot de passe</label>
        <Input id="password" type="password" v-model="password" />
        <small class="error" v-if="showPasswordError">
          {{ passwordError }}
        </small>
      </div>
      <div>
        <label>Confirmation du mot de passe</label>
        <Input id="confirmPassword" type="password" v-model="confirmPassword" />
        <small class="error" v-if="showConfirmPasswordError">
          {{ confirmPasswordError }}
        </small>
      </div>

      <!-- <div class="flex flex-col">
        <div class="flex gap-2">
          <label>Date de naissance</label>
          <p class="text-gray-400">(Facultatif)</p>
        </div>
        <input
          type="date"
          id="start"
          name="trip-start"
          value="2018-07-22"
          min="2018-01-01"
          class="border p-2 rounded-lg"
          v-model="dateOfBirth"
        />
      </div> -->
      <Button type="submit" class="w-full">Confirmer</Button>
    </form>
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
