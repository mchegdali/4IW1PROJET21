<script setup lang="ts">
import Input from '@/components/ui/input/Input.vue';
import Button from '@/components/ui/button/Button.vue';
import { z } from 'zod';
import { useForm } from '@/composables/form';
import { useFetch } from '@vueuse/core';
import { useRouter } from 'vue-router';
import { useUserStore } from '@/stores/user';
import { useToast } from '../ui/toast';

const { toast } = useToast();

type LoginResponse = {
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    fullname: string;
    email: string;
    role: 'user' | 'admin' | 'accountant';
  };
};

const router = useRouter();
const userStore = useUserStore();

const loginSchema = z.object({
  email: z.string().email({ message: 'Adresse e-mail invalide' }),
  password: z.string().min(8, { message: 'Le mot de passe est obligatoire' })
});

const initialData = {
  email: '',
  password: ''
};

const { formData, formErrors, formSubmitting, submitForm } = useForm(loginSchema, initialData);

const { data, execute, error, statusCode } = useFetch(
  `${import.meta.env.VITE_API_BASE_URL}/auth/login`,
  {
    immediate: false
  }
)
  .post(formData)
  .json<LoginResponse>();

const { execute: resendConfirmationEmail } = useFetch(
  `${import.meta.env.VITE_API_BASE_URL}/auth/resend-confirmation-email`,
  {
    immediate: false
  }
)
  .post(formData)
  .text();

const handleSubmit = () => {
  submitForm(async () => {
    try {
      await execute(true);
      if (data?.value) {
        userStore.$patch({
          accessToken: data.value.accessToken,
          refreshToken: data.value.refreshToken,
          user: data.value.user
        });
        router.push({ name: 'home' });
      }
    } catch {
      console.log('handleSubmit error', error.value);
    }
  });
};

const handleResendConfirmationEmail = async () => {
  const response = await resendConfirmationEmail();
  if (response) {
    toast({
      title: 'Email de confirmation envoyé',
      description: 'Vérifiez votre boîte mail',
      type: 'foreground',
      duration: 2500
    });
  }
};
</script>

<template>
  <form @submit.prevent="handleSubmit" class="space-y-4">
    <div>
      <label
        >Adresse e-mail
        <Input
          id="email"
          v-model="formData.email"
          :class="{ 'border-destructive': formErrors.email || statusCode === 401 }"
          autofocus
        />
      </label>
      <small class="text-destructive" v-if="formErrors.email">
        {{ formErrors.email }}
      </small>
      <small class="text-destructive" v-else-if="statusCode === 401">
        Email ou mot de passe incorrect
      </small>
    </div>
    <div>
      <label
        >Mot de passe
        <Input
          id="password"
          type="password"
          v-model="formData.password"
          :class="{ 'border-destructive': formErrors.password || statusCode === 401 }"
        />
      </label>
      <small class="text-destructive" v-if="formErrors.password">
        {{ formErrors.password }}
      </small>
      <small class="text-destructive" v-else-if="statusCode === 401">
        Email ou mot de passe incorrect
      </small>
    </div>

    <div class="flex gap-4">
      <Button variant="outline" as-child type="button">
        <RouterLink :to="{ name: 'register' }" class="w-1/2"> Créer un compte </RouterLink>
      </Button>

      <Button type="submit" class="w-1/2" :disabled="formSubmitting">Connexion</Button>
    </div>
    <div v-if="statusCode === 403" class="flex gap-4">
      <small class="text-destructive">
        Votre compte n'est pas activé. Veuillez vérifier votre e-mail.
      </small>
      <Button type="button" variant="link" @click="handleResendConfirmationEmail">
        Demander un nouvel email de confirmation
      </Button>
    </div>
  </form>
</template>
