<script setup lang="ts">
import Input from '@/components/ui/input/Input.vue';
import Button from '@/components/ui/button/Button.vue';
import { z } from 'zod';
import { useForm } from '@/composables/form';
import { useRouter } from 'vue-router';
import { useUserStore } from '@/stores/user';
import { useToast } from '../ui/toast';
import Label from '../ui/label/Label.vue';
import { onBeforeUnmount } from 'vue';
import config from '@/config';
import { useBasketStore } from '@/stores/basket';
import type { Product } from '@/api/products.api';
import { useBasketStore } from '@/stores/basket';
import type { Product } from '@/api/products.api';

const { toast } = useToast();

const router = useRouter();
const userStore = useUserStore();
const basketStore = useBasketStore();
const basketStore = useBasketStore();

const loginSchema = z.object({
  email: z
    .string({
      required_error: 'Adresse e-mail obligatoire'
    })
    .min(1, { message: 'Adresse e-mail obligatoire' })
    .email({ message: 'Adresse e-mail invalide' }),
  password: z
    .string({
      required_error: 'Mot de passe obligatoire'
    })
    .min(8, { message: 'Le mot de passe doit contenir au moins 8 caractères' })
});

const defaultValues = {
  email: '',
  password: ''
};

const { handleSubmit, isSubmitting, isError, defineField, errors, cancel, status, formValues } =
  useForm({
    validationSchema: loginSchema,
    defaultValues
  });

const [email, emailField] = defineField('email');
const [password, passwordField] = defineField('password');

const submitHandler = handleSubmit(async (data) => {
  const { user, accessToken } = await userStore.login(data.email, data.password);

  const basketResponse = await fetch(`${config.apiBaseUrl}/users/${user.id}/basket`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`
    }
  });

  if (!response.ok) {
    throw response;
  }

  const loginResponseBody: {
    accessToken: string;
    refreshToken: string;
    user: {
      id: string;
      fullname: string;
      email: string;
      role: 'user' | 'admin' | 'accountant';
    };
  } = await response.json();

  const user = loginResponseBody.user;

  const basketResponse = await fetch(`${config.apiBaseUrl}/users/${user.id}/basket`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${loginResponseBody.accessToken}`
    }
  });

  if (basketResponse.ok) {
    const basketResponseBody: Product[] = await basketResponse.json();
    basketStore.setProducts(basketResponseBody);
  }

  userStore.$patch({
    accessToken: loginResponseBody.accessToken,
    refreshToken: loginResponseBody.refreshToken,
    user: loginResponseBody.user
  });
  router.push({ name: 'home' });
});

onBeforeUnmount(() => {
  cancel();
});

const handleResendConfirmationEmail = async () => {
  const response = await fetch(
    `${import.meta.env.VITE_API_BASE_URL}/auth/resend-confirmation-email`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: formValues.value.email
      })
    }
  );
  if (response.ok) {
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
  <form @submit.prevent="submitHandler" class="space-y-4">
    <div>
      <Label for="email" :class="{ 'text-destructive': errors.email }">Adresse e-mail</Label>
      <Input
        id="email"
        v-model="email"
        @input="emailField.onInput"
        :class="{ 'border-destructive': errors.email || isError }"
        autofocus
      />
      <small class="text-destructive" v-if="errors.email">
        {{ errors.email }}
      </small>
      <small class="text-destructive" v-else-if="isError"> Email ou mot de passe incorrect </small>
    </div>
    <div>
      <Label for="password" :class="{ 'text-destructive': errors.password }">Mot de passe</Label>
      <Input
        id="password"
        type="password"
        v-model="password"
        @input="passwordField.onInput"
        :class="{ 'border-destructive': errors.password || isError }"
        autofocus
      />
      <small class="text-destructive" v-if="errors.password">
        {{ errors.password }}
      </small>
      <small class="text-destructive" v-else-if="isError"> Email ou mot de passe incorrect </small>
    </div>

    <div class="flex gap-4">
      <Button variant="outline" as-child type="button">
        <RouterLink :to="{ name: 'register' }" class="w-1/2"> Créer un compte </RouterLink>
      </Button>

      <Button type="submit" class="w-1/2" :disabled="isSubmitting">Connexion</Button>
    </div>
    <div v-if="status === 403" class="flex gap-4">
      <small class="text-destructive">
        Votre compte n'est pas activé. Veuillez vérifier votre e-mail.
      </small>
      <Button type="button" variant="outline-destructive" @click="handleResendConfirmationEmail">
        Demander un nouvel email de confirmation
      </Button>
    </div>
  </form>
</template>
