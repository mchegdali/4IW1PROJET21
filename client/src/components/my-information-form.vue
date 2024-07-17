<script setup lang="ts">
import { reactive, computed } from 'vue';
import Input from './ui/input/Input.vue';
import Button from '@/components/ui/button/Button.vue';
import { z } from 'zod';
import { useForm } from '@/composables/form';

const loginSchema = z.object({
  email: z.string().email({ message: "L'e-mail doit être sous cette forme : exemple@example.com" }),
  name: z.string().regex(/^[a-zA-ZÀ-ÿ' -]+ [a-zA-ZÀ-ÿ' -]+$/, {
    message: 'Ne peut contenir que des lettres, des apostrophes, des tirets et des accents.'
  })
});

const initialLoginData = reactive({
  email: '',
  name: ''
});

const { formData, formErrors, formSubmitting, submitForm } = useForm(loginSchema, initialLoginData);

const handleSubmit = () => {
  submitForm(async (data) => {
    console.log('Données de connexion envoyées :', data);
  });
};
</script>

<template>
  <div>
    <form class="flex flex-col gap-4" @submit.prevent="handleSubmit">
      <div>
        <label for="name">Nom et Prénom</label>
        <Input
          id="name"
          type="text"
          v-model="formData.name"
          :class="{ 'border-destructive': formErrors.name }"
        />
        <small class="text-destructive" v-if="formErrors.name">{{ formErrors.name }}</small>
      </div>
      <div>
        <label for="email">Adresse e-mail</label>
        <Input
          id="email"
          type="email"
          v-model="formData.email"
          autofocus
          :class="{ 'border-destructive': formErrors.email }"
        />
        <small class="text-destructive" v-if="formErrors.email">{{ formErrors.email }}</small>
      </div>
      <Button type="submit" class="w-full">Valider les modifications</Button>
    </form>
  </div>
</template>

<style scoped>
.text-destructive {
  color: red;
}
.border-destructive {
  border: 1px solid red;
}
</style>
