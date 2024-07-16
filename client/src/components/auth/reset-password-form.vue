<script setup lang="ts">
import Input from '@/components/ui/input/Input.vue';
import Button from '@/components/ui/button/Button.vue';
import { z } from 'zod';
import { Info } from 'lucide-vue-next';
import { useForm } from '@/composables/form';
import { useRouter, type LocationQueryValue } from 'vue-router';
import config from '@/config';

const router = useRouter();

const token = router.currentRoute.value.query.token as LocationQueryValue;

const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z0-9]).{8,}$/;

const resetPasswordSchema = z
  .object({
    password: z.string().regex(passwordRegex, {
      message: 'Le mot de passe ne répond pas aux critères requis.'
    }),
    confirmPassword: z.string()
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Les mots de passe ne correspondent pas',
    path: ['confirmPassword']
  });

const defaultValues = {
  email: '',
  fullname: '',
  password: '',
  confirmPassword: ''
};

const { defineField, handleSubmit, errors, isSubmitting } = useForm({
  validationSchema: resetPasswordSchema,
  defaultValues
});

const [password, passwordField] = defineField('password');
const [confirmPassword, confirmPasswordField] = defineField('confirmPassword');

const submitHandler = handleSubmit(async (data, signal) => {
  const response = await fetch(`${config.apiBaseUrl}/auth/reset-password`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(data),
    signal
  });

  if (!response.ok) {
    throw response;
  }

  router.push({ name: 'reset-password-confirmation' });
});
</script>

<template>
  <form class="space-y-4" @submit.prevent="submitHandler">
    <div>
      <label>
        Mot de passe
        <Input
          id="password"
          type="password"
          v-model="password"
          @input="passwordField.onInput"
          :class="{ 'border-destructive': errors.password }"
        />
      </label>
      <div class="rounded-lg my-2 flex gap-2">
        <Info />
        <p class="text-xs">
          Le mot de passe doit contenir au moins une lettre minuscule, une lettre majuscule, un
          chiffre et un symbole, et doit avoir au moins 8 caractères.
        </p>
      </div>
      <small class="text-destructive" v-if="errors.password">
        {{ errors.password }}
      </small>
    </div>
    <div>
      <label>
        Confirmation du mot de passe
        <Input
          id="confirmPassword"
          type="password"
          v-model="confirmPassword"
          @input="confirmPasswordField.onInput"
          :class="{ 'border-destructive': errors.confirmPassword }"
        />
      </label>
      <small class="text-destructive" v-if="errors.confirmPassword">
        {{ errors.confirmPassword }}
      </small>
    </div>
    <Button type="submit" class="w-full" :disabled="isSubmitting">Confirmer</Button>
  </form>
</template>
