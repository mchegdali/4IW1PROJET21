<script setup lang="ts">
import Input from './ui/input/Input.vue';
import Button from '@/components/ui/button/Button.vue';
import { z } from 'zod';
import { Info } from 'lucide-vue-next';
import { useForm } from '@/composables/form';

const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z0-9]).{8,}$/;

const loginSchema = z
  .object({
    email: z
      .string()
      .email({ message: "L'e-mail doit être sous cette forme : exemple@example.com" }),
    name: z.string().regex(/^[a-zA-ZÀ-ÿ' -]+ [a-zA-ZÀ-ÿ' -]+$/, {
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

const initialLoginData = {
  email: '',
  name: '',
  password: '',
  confirmPassword: ''
};

const { formData, formErrors, formSubmitting, submitForm } = useForm(loginSchema, initialLoginData);

const handleSubmit = () => {
  submitForm(async (data) => {
    console.log('Données de connexion envoyées :', data);
  });
};
</script>

<template>
  <div class="border p-5 rounded-lg shadow-lg">
    <h1 class="text-3xl bold mb-5">Créer un compte</h1>
    <form class="flex flex-col gap-4" @submit.prevent="handleSubmit">
      <div>
        <label>
          Adresse e-mail
          <Input
            id="email"
            v-model="formData.email"
            autofocus
            :class="{ 'border-destructive': formErrors.email }"
          />
        </label>
        <small class="text-destructive" v-if="formErrors.email">
          {{ formErrors.email }}
        </small>
      </div>
      <div>
        <label>
          Nom et Prénom
          <Input
            id="name"
            type="text"
            v-model="formData.name"
            :class="{ 'border-destructive': formErrors.name }"
          />
        </label>
        <small class="text-destructive" v-if="formErrors.name">
          {{ formErrors.name }}
        </small>
      </div>
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
    <div class="mt-5">
      <p>
        En continuant, vous acceptez les
        <a href="/" class="text-tea-600">conditions d'utilisation et de vente</a> de Fanthésie.
        Consultez notre <a href="/" class="text-tea-600">déclaration de confidentialité</a>, notre
        <a href="/" class="text-tea-600">politique relative aux cookies</a>.
      </p>
    </div>
    <div class="text-center mt-5">
    <h4>Déja un compte chez Fanthésie ?</h4>
    <div class="text-center mt-2">
      <RouterLink :to="{ name: 'login' }">
        <Button href="/" class="w-full text-center bg-white text-tea-600 border hover:bg-gray-100">S'identifier</Button>
      </RouterLink>
    </div>
  </div>
  </div>
  
</template>

<style scoped>
.error {
  color: red;
  display: block;
  padding-left: 20px;
}

.error-border {
  border: 1px solid red;
  padding: 5px;
}
</style>
