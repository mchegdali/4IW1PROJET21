<script setup lang="ts">
import Input from '@/components/ui/input/Input.vue';
import Button from '@/components/ui/button/Button.vue';
import { z } from 'zod';
import { Info } from 'lucide-vue-next';
import { useForm } from '@/composables/form';
import { useFetch } from '@vueuse/core';
import { useRouter } from 'vue-router';

const router = useRouter();

const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z0-9]).{8,}$/;

const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, 'Le mot de passe doit contenir au moins 8 caractères.')
      .regex(passwordRegex, {
        message: 'Le mot de passe ne répond pas aux critères requis.'
      }),
    confirmPassword: z.string()
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Les mots de passe ne correspondent pas',
    path: ['confirmPassword']
  });

const initialData = {
  password: '',
  confirmPassword: ''
};

const { formData, formErrors, formSubmitting, submitForm } = useForm(
  resetPasswordSchema,
  initialData
);

const { data, error, statusCode, execute } = useFetch(
  `${import.meta.env.VITE_API_BASE_URL}/users`,
  {
    immediate: false,
    onFetchError: ({ data }) => {
      return {
        error: data
      };
    }
  }
)
  .post(formData)
  .json();

const handleSubmit = () => {
  submitForm(async () => {
    await execute();
  });
};
</script>

<template>
  <form class="space-y-4" @submit.prevent="handleSubmit">
    <div>
      <label>
        Mot de passe
        <Input
          id="password"
          type="password"
          v-model="formData.password"
          :class="{ 'border-destructive': formErrors.password }"
        />
      </label>
      <div class="rounded-lg my-2 flex gap-2">
        <Info />
        <p class="text-xs">
          Le mot de passe doit contenir au moins une lettre minuscule, une lettre majuscule, un
          chiffre et un symbole, et doit avoir au moins 8 caractères.
        </p>
      </div>
      <small class="text-destructive" v-if="formErrors.password">
        {{ formErrors.password }}
      </small>
    </div>
    <div>
      <label>
        Confirmation du mot de passe
        <Input
          id="confirmPassword"
          type="password"
          v-model="formData.confirmPassword"
          :class="{ 'border-destructive': formErrors.confirmPassword }"
        />
      </label>
      <small class="text-destructive" v-if="formErrors.confirmPassword">
        {{ formErrors.confirmPassword }}
      </small>
    </div>
    <Button type="submit" class="w-full" :disabled="formSubmitting">Confirmer</Button>
  </form>
</template>
