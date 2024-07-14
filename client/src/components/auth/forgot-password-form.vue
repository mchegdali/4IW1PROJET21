<script setup lang="ts">
import Input from '@/components/ui/input/Input.vue';
import Button from '@/components/ui/button/Button.vue';
import { z } from 'zod';
import { useForm } from '@/composables/form';
import { useFetch } from '@vueuse/core';
import { useToast } from '../ui/toast';

const { toast } = useToast();
const forgotPasswordSchema = z.object({
  email: z.string().email({ message: 'Adresse e-mail invalide' }),
});

const initialData = {
  email: '',
};

const { formData, formErrors, submitForm, formSubmitting } = useForm(forgotPasswordSchema, initialData);

const { data, execute, error, statusCode } = useFetch(`${import.meta.env.VITE_API_BASE_URL}/auth/forgot-password`, {
  immediate: false,
}).post(formData).text();

const handleSubmit = () => {
  submitForm(async () => {
    try {
      const response = await execute(true);
      console.log(response);

      if (response) {

        toast({ title: 'Email de réinitialisation envoyé', description: 'Vérifiez votre boîte mail', type: 'foreground', duration: 2500 });
      }
    } catch {
      console.log("handleSubmit error", error.value);
    }
  });
};
</script>

<template>
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
    <Button type="submit" :disabled="formSubmitting">Réinitialiser mon mot de passe</Button>
  </form>
</template>
