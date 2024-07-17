<script setup lang="ts">
import Input from '@/components/ui/input/Input.vue';
import Button from '@/components/ui/button/Button.vue';
import { z } from 'zod';
import { useForm } from '@/composables/form';
import { onBeforeUnmount } from 'vue';
import config from '@/config';
import { useRouter } from 'vue-router';

const router = useRouter();

const forgotPasswordSchema = z.object({
  email: z.string().email({ message: 'Adresse e-mail invalide' })
});

const defaultValues = {
  email: ''
};

const { handleSubmit, defineField, cancel, isSubmitting, isError } = useForm({
  validationSchema: forgotPasswordSchema,
  defaultValues
});

const [email, emailField] = defineField('email');

const submitHandler = handleSubmit(async (data, signal) => {
  const response = await fetch(`${config.apiBaseUrl}/auth/forgot-password`, {
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

  router.push({ name: 'forgot-password-confirmation' });
});

onBeforeUnmount(() => {
  cancel();
});
</script>

<template>
  <form @submit.prevent="submitHandler" class="flex flex-col gap-4">
    <div>
      <label
        >Adresse e-mail
        <Input
          id="email"
          v-model="email"
          @input="emailField.onInput"
          :class="{ 'border-destructive': isError }"
          autofocus
        />
      </label>
      <small class="text-destructive" v-if="isError"> Email ou mot de passe incorrect </small>
    </div>
    <Button type="submit" :disabled="isSubmitting">Réinitialiser mon mot de passe</Button>
  </form>
</template>
