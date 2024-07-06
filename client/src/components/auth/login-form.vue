<script setup lang="ts">
import Input from '@/components/ui/input/Input.vue';
import Button from '@/components/ui/button/Button.vue';
import { z } from 'zod';
import { useForm } from '@/composables/form';
import { useFetch } from '@vueuse/core';
import { useRouter } from 'vue-router';
import { useUserStore } from '@/stores/user';

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

const initialLoginData = {
  email: '',
  password: ''
};

const { formData, formErrors, formSubmitting, submitForm } = useForm(loginSchema, initialLoginData);

const { data, execute, error, statusCode } = useFetch(`${import.meta.env.VITE_API_BASE_URL}/auth/login`, {
  immediate: false,
}).post(formData).json<LoginResponse>();

const handleSubmit = () => {
  submitForm(async () => {
    try {
      await execute(true);
      if (data?.value) {

        userStore.$patch({ accessToken: data.value.accessToken, refreshToken: data.value.refreshToken, user: data.value.user });
        router.push({ name: 'home' });
      }
    } catch {
      console.log("handleSubmit error", error.value);
    }
  });
};
</script>

<template>
  <div class="border p-5 rounded-lg shadow-lg">
    <h1 class="text-3xl bold mb-5">S'identifier</h1>
    <form @submit.prevent="handleSubmit" class="flex flex-col gap-4">
      <div>
        <label>Adresse e-mail
          <Input id="email" v-model="formData.email"
            :class="{ 'border-destructive': formErrors.email || statusCode === 401 }" autofocus />
        </label>
        <small class="text-destructive" v-if="formErrors.email">
          {{ formErrors.email }}
        </small>
        <small class="text-destructive" v-else-if="statusCode === 401">
          Email ou mot de passe incorrect
        </small>
      </div>
      <div>
        <label>Mot de passe
          <Input id="password" type="password" v-model="formData.password"
            :class="{ 'border-destructive': formErrors.password || statusCode === 401 }" />
        </label>
        <small class="text-destructive" v-if="formErrors.password">
          {{ formErrors.password }}
        </small>
        <small class="text-destructive" v-else-if="statusCode === 401">
          Email ou mot de passe incorrect
        </small>
      </div>
      <div class="flex gap-4">
        <RouterLink :to="{ name: 'register' }" class="w-1/2">
          <Button class="w-full bg-white text-tea-600 border hover:bg-gray-100" type="button">Créer un compte</Button>
        </RouterLink>
        <Button type="submit" class="w-1/2" :disabled="formSubmitting">Connexion</Button>
      </div>
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
      <div class="flex items-center justify-center">
        <div class="flex-grow border-t border-current text-gray-300"></div>
        <a href="/" class="text-center font-bold text-tea-600 mx-4">Mot de passe oublié ?</a>
        <div class="flex-grow border-t border-current text-gray-300"></div>
      </div>
    </div>
  </div>
</template>

<!-- <style scoped>
.error {
  color: red;
  display: block;
  padding-left: 20px;
}

.error-border {
  border: 1px solid red;
  padding: 5px;
}
</style> -->
