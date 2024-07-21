<script setup lang="ts">
import Input from './ui/input/Input.vue';
import Button from '@/components/ui/button/Button.vue';
import { z } from 'zod';
import { useForm } from '@/composables/form';
import { onBeforeUnmount } from 'vue';
import config from '@/config';
import { useUserStore } from '@/stores/user';

const userStore = useUserStore();

const userInfosSchema = z.object({
  email: z.string().email({ message: "L'e-mail doit être sous cette forme : exemple@example.com" }),
  fullname: z.string().regex(/^[a-zA-ZÀ-ÿ' -]+ [a-zA-ZÀ-ÿ' -]+$/, {
    message: 'Ne peut contenir que des lettres, des apostrophes, des tirets et des accents.'
  })
});

const { handleSubmit, defineField, errors, cancel } = useForm({
  validationSchema: userInfosSchema,
  defaultValues: {
    email: userStore.user?.email || '',
    fullname: userStore.user?.fullname || ''
  }
});

const [email, emailField] = defineField('email');
const [fullname, fullnameField] = defineField('fullname');

const submitHandler = handleSubmit(async (data) => {
  try {
    const response = await fetch(`${config.apiBaseUrl}/users/${userStore.user?.id!}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userStore.accessToken}`
      },
      body: JSON.stringify({
        email: data.email,
        fullname: data.fullname
      })
    });

    if (!response.ok) {
      throw response;
    }
  } catch (error) {
    console.error('Error updating user:', error);
  }
});

onBeforeUnmount(() => {
  cancel();
});
</script>

<template>
  <div>
    <form class="flex flex-col gap-4" @submit.prevent="submitHandler">
      <div>
        <label for="name">Nom et Prénom</label>
        <Input
          id="name"
          type="text"
          v-model="fullname"
          @input="fullnameField.onInput"
          :class="{ 'border-destructive': errors.fullname }"
        />
        <small class="text-destructive" v-if="errors.fullname">{{ errors.fullname }}</small>
      </div>
      <div>
        <label for="email">Adresse e-mail</label>
        <Input
          id="email"
          type="email"
          v-model="email"
          @input="emailField.onInput"
          :class="{ 'border-destructive': errors.email }"
        />
        <small class="text-destructive" v-if="errors.email">{{ errors.email }}</small>
      </div>
      <Button type="submit" class="w-full">Valider les modifications</Button>
    </form>
  </div>
</template>
