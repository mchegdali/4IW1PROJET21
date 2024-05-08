<script setup lang="ts">
import { ref, computed } from 'vue';
import Input from './ui/input/Input.vue';
import Button from '@/components/ui/button/Button.vue';
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
const password = ref('');

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
      <Input id="email" type="email" v-model="email" required autofocus class="pl-10" />
      <small class="error" v-if="emailError">
        {{ emailError }}
      </small>
    </div>
    <div>
      <label>Mot de passe</label>
      <Input id="password" type="password" v-model="password" required />
      <small class="error" v-if="passwordError">
        {{ passwordError }}
      </small>
    </div>
    <div class="flex gap-4">
      <RouterLink :to="{ name: 'register' }" class="flex items-end flex-1">
        <Button class="w-full">Créer un compte</Button>
      </RouterLink>
      <Button class="w-full">Connexion</Button>
    </div>
  </form>
  <div class="text-center mt-5">
    <a href="/" class="text-center">Mot de passe oublié ?</a>
  </div>
</template>

<style scoped>
.error {
  color: red;
  display: block;
  padding-left: 20px;
}
</style>
