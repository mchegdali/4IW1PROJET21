<script setup lang="ts">
import Input from '@/components/ui/input/Input.vue';
import Button from '@/components/ui/button/Button.vue';
import { z } from 'zod';
import { Info } from 'lucide-vue-next';
import { useForm } from '@/composables/form';
import { useFetch } from '@vueuse/core';
import { useRouter } from 'vue-router';
import config from '@/config';

const router = useRouter();
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z0-9]).{8,}$/;

const registerSchema = z
  .object({
    email: z
      .string()
      .email({ message: "L'e-mail doit être sous cette forme : exemple@example.com" }),
    fullname: z.string().regex(/^[a-zA-ZÀ-ÿ' -]+ [a-zA-ZÀ-ÿ' -]+$/, {
      message: 'Ne peut contenir que des lettres, des apostrophes, des tirets et des accents.'
    }),
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

const { defineField, handleSubmit, errors, isError, isSubmitting } = useForm({
  validationSchema: registerSchema,
  defaultValues
});

const [email, emailField] = defineField('email');
const [fullname, fullnameField] = defineField('fullname');
const [password, passwordField] = defineField('password');
const [confirmPassword, confirmPasswordField] = defineField('confirmPassword');

const submitHandler = handleSubmit(async (data, signal) => {
  const response = await fetch(`${config.apiBaseUrl}/users`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data),
    signal
  });

  if (!response.ok) {
    throw response;
  }

  router.push({ name: 'register-confirmation' });
});
</script>

<template>
  <form class="space-y-4" @submit.prevent="submitHandler">
    <div>
      <Label for="email" :class="{ 'text-destructive': errors.email }">Adresse e-mail</Label>
      <Input
        id="email"
        v-model="email"
        @input="emailField.onInput"
        :class="{ 'border-destructive': errors.email }"
        autofocus
      />
      <small class="text-destructive" v-if="errors.email">
        {{ errors.email }}
      </small>
    </div>
    <div>
      <Label for="fullname" :class="{ 'text-destructive': errors.password }">Nom complet</Label>
      <Input
        id="fullname"
        type="text"
        v-model="fullname"
        @input="fullnameField.onInput"
        :class="{ 'border-destructive': errors.fullname }"
        autofocus
      />
      <small class="text-destructive" v-if="errors.fullname">
        {{ errors.fullname }}
      </small>
    </div>
    <div>
      <Label for="password" :class="{ 'text-destructive': errors.password }">Mot de passe</Label>
      <Input
        id="password"
        type="password"
        v-model="password"
        @input="passwordField.onInput"
        :class="{ 'border-destructive': errors.password || errors.confirmPassword }"
        autofocus
      />
      <small class="text-destructive" v-if="errors.password">
        {{ errors.password }}
      </small>
      <small class="text-destructive" v-if="errors.confirmPassword">
        {{ errors.confirmPassword }}
      </small>
    </div>
    <div>
      <Label for="confirmPassword" :class="{ 'text-destructive': errors.password }"
        >Confirmation du mot de passe</Label
      >
      <Input
        id="confirmPassword"
        type="password"
        v-model="confirmPassword"
        @input="confirmPasswordField.onInput"
        :class="{ 'border-destructive': errors.confirmPassword }"
        autofocus
      />
      <small class="text-destructive" v-if="errors.confirmPassword">
        {{ errors.confirmPassword }}
      </small>
    </div>
    <Button type="submit" class="w-full" :disabled="isSubmitting">Confirmer</Button>
  </form>
</template>
