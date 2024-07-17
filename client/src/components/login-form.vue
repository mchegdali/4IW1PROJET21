<script setup lang="ts">
import Input from './ui/input/Input.vue';
import Button from '@/components/ui/button/Button.vue';
import { z } from 'zod';
import { useForm } from '@/composables/form';

const handleSubmit = () => {
  submitForm(async (data) => {
    console.log('Données de connexion envoyées :', data);
  });
};

const loginSchema = z.object({
  email: z.string().email({ message: 'Adresse e-mail invalide' }),
  password: z.string().min(8, { message: 'Le mot de passe est obligatoire' })
});

const initialLoginData = {
  email: '',
  password: ''
};

const { formData, formErrors, formSubmitting, submitForm } = useForm(loginSchema, initialLoginData);
</script>

<template>
  <div class="border p-5 rounded-lg shadow-lg">
    <h1 class="text-3xl bold mb-5">S'identifier</h1>
    <form @submit.prevent="handleSubmit" class="flex flex-col gap-4">
      <div>
        <label
          >Adresse e-mail
          <Input
            id="email"
            v-model="formData.email"
            :class="{ 'border-destructive': formErrors.email }"
            autofocus
          />
        </label>
        <small class="text-destructive" v-if="formErrors.email">
          {{ formErrors.email }}
        </small>
      </div>
      <div>
        <label
          >Mot de passe
          <Input
            id="password"
            type="password"
            v-model="formData.password"
            :class="{ 'border-destructive': formErrors.password }"
          />
        </label>
        <small class="text-destructive" v-if="formErrors.password">
          {{ formErrors.password }}
        </small>
      </div>
      <div class="flex gap-4">
        <RouterLink :to="{ name: 'register' }" class="w-1/2">
          <Button class="w-full bg-white text-tea-600 border hover:bg-gray-100"
            >Créer un compte</Button
          >
        </RouterLink>
        <Button type="submit" class="w-1/2" :disabled="formSubmitting">Connexion</Button>
      </div>
    </form>
    <div class="mt-5">
      <p>
        En continuant, vous acceptez les
        <RouterLink :to="{ name: 'conditions' }" class="text-tea-600"
          >conditions d'utilisation et de vente</RouterLink
        >
        de Fanthésie. Consultez notre
        <RouterLink :to="{ name: 'confidentiality-declaration' }" class="text-tea-600"
          >déclaration de confidentialité</RouterLink
        >, notre
        <RouterLink :to="{ name: 'cookie-policy' }" class="text-tea-600"
          >politique relative aux cookies</RouterLink
        >.
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
