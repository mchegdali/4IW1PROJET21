<script setup lang="ts">
import Input from './ui/input/Input.vue';
import Button from '@/components/ui/button/Button.vue';
import { z } from 'zod';
import { useForm } from '@/composables/form';
import { onBeforeUnmount } from 'vue';

const userInfosSchema = z.object({
const userInfosSchema = z.object({
  email: z.string().email({ message: "L'e-mail doit être sous cette forme : exemple@example.com" }),
  name: z.string().regex(/^[a-zA-ZÀ-ÿ' -]+ [a-zA-ZÀ-ÿ' -]+$/, {
    message: 'Ne peut contenir que des lettres, des apostrophes, des tirets et des accents.'
  })
});

const { handleSubmit, defineField, errors, cancel } = useForm({
  validationSchema: userInfosSchema,
  defaultValues: {
    email: '',
    name: ''
  }
});

const [email, emailField] = defineField('email');
const [name, nameField] = defineField('name');

const submitHandler = handleSubmit(async () => {});

onBeforeUnmount(() => {
  cancel();
});
</script>

<template>
  <div>
    <form class="flex flex-col gap-4" @submit.prevent="submitHandler">
    <form class="flex flex-col gap-4" @submit.prevent="submitHandler">
      <div>
        <label for="name">Nom et Prénom</label>
        <Input
          id="name"
          type="text"
          v-model="name"
          @input="nameField.onInput"
          :class="{ 'border-destructive': errors.name }"
          v-model="name"
          @input="nameField.onInput"
          :class="{ 'border-destructive': errors.name }"
        />
        <small class="text-destructive" v-if="errors.name">{{ errors.name }}</small>
        <small class="text-destructive" v-if="errors.name">{{ errors.name }}</small>
      </div>
      <div>
        <label for="email">Adresse e-mail</label>
        <Input
          id="email"
          type="email"
          v-model="email"
          @input="emailField.onInput"
          :class="{ 'border-destructive': errors.email }"
          v-model="email"
          @input="emailField.onInput"
          :class="{ 'border-destructive': errors.email }"
        />
        <small class="text-destructive" v-if="errors.email">{{ errors.email }}</small>
        <small class="text-destructive" v-if="errors.email">{{ errors.email }}</small>
      </div>
      <Button type="submit" class="w-full">Valider les modifications</Button>
    </form>
  </div>
</template>
