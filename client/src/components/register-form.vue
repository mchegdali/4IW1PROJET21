<script setup lang="ts">
import Input from './ui/input/Input.vue';
import Button from '@/components/ui/button/Button.vue';
import { computed, ref } from 'vue';

import { z } from 'zod';

const emailSchema = z
  .string()
  .min(5, {
    message: '5 characters minimum'
  })
  .max(30, {
    message: '30 characters maximum'
  })
  .email({
    message: 'Invalid email'
  });

const passwordSchema = z
  .string()
  .regex(/[a-z]/, {
    message: 'Lowercase letter missing'
  })
  .regex(/[A-Z]/, {
    message: 'Uppercase letter missing'
  })
  .regex(/\d/, {
    message: 'Number missing'
  })
  .regex(/[^a-zA-Z0-9]/, {
    message: 'Symbol missing'
  })
  .min(8, {
    message: '8 characters minimum'
  });

const email = ref('');
const name = ref('');
const lastName = ref('');
const password = ref('');
const dateOfBirth = ref('');

const emailError = computed(() => {
  const parsedEmail = emailSchema.safeParse(email.value);

  if (parsedEmail.success) {
    return '';
  }

  return parsedEmail.error.issues[0].message;
});

const passwordError = computed(() => {
  const parsedPassword = passwordSchema.safeParse(password.value);

  if (parsedPassword.success) {
    return '';
  }

  return parsedPassword.error.issues[0].message;
});
</script>

<template>
  <form class="flex flex-col gap-4">
    <div>
      <label>Adresse e-mail</label>
      <Input id="email" type="email" v-model="email" required autofocus />
      <small class="error" v-if="emailError">
        {{ emailError }}
      </small>
    </div>
    <div>
      <label>Prenom</label>
      <Input id="name" type="text" placeholder="Prenom" v-model="name" required />
    </div>
    <div>
      <label>Nom de famille</label>
      <Input id="lastname" type="text" placeholder="Nom de famille" v-model="lastName" required />
    </div>
    <div>
      <label>Mot de passe</label>
      <Input id="password" type="password" v-model="password" required />
      <small class="error" v-if="passwordError">
        {{ passwordError }}
      </small>
    </div>
    <div class="flex flex-col">
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
        class="border p-2"
        v-model="dateOfBirth"
      />
    </div>
    <Button class="w-full">Confirmer</Button>
  </form>
  <div class="text-center mt-5">
    <RouterLink :to="{ name: 'login' }">
      <a href="/" class="text-center">Déja un compte ?</a>
    </RouterLink>
  </div>
</template>
