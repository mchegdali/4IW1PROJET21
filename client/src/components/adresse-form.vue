<script setup lang="ts">
import { useRouter } from 'vue-router';
import Input from './ui/input/Input.vue';
import Button from '@/components/ui/button/Button.vue';
import { z } from 'zod';
import { useForm } from '@/composables/form';

const router = useRouter();
const user = JSON.parse(localStorage.getItem('user') || '{}');
const userId = user.id;

const handleSubmit = () => {
  submitForm(async (data) => {
    try {
      const response = await fetch(`http://localhost:3000/users/${userId}/addresses`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        throw new Error("Erreur lors de l'ajout de l'adresse");
      }

      router.push({ name: 'adresses', params: { userId } });
    } catch (error) {
      console.error("Erreur lors de l'ajout de l'adresse:", error);
    }
  });
};

const addressSchema = z.object({
  name: z.string().regex(/^[a-zA-ZàâçéèêëîïôûùüÿñæœÀÂÇÉÈÊËÎÏÔÛÙÜŸÑÆŒ \-']+$/, {
    message: 'Le nom contient des caractères invalides'
  }),
  street: z.string().regex(/^[a-zA-Z0-9àâçéèêëîïôûùüÿñæœÀÂÇÉÈÊËÎÏÔÛÙÜŸÑÆŒ .,'-]+$/, {
    message: 'La rue contient des caractères invalides'
  }),
  city: z.string().regex(/^[a-zA-ZàâçéèêëîïôûùüÿñæœÀÂÇÉÈÊËÎÏÔÛÙÜŸÑÆŒ \-']+$/, {
    message: 'La ville contient des caractères invalides'
  }),
  phone: z.string({message: 'La ville contient des caractères invalides'}),
  zipCode: z
    .string()
    .regex(/^\d{5}$/, { message: 'Le code postal doit être composé de 5 chiffres' })
});

const initialAddressData = {
  name: '',
  street: '',
  city: '',
  zipCode: '',
  phone: ''
};

const { formData, formErrors, formSubmitting, submitForm } = useForm(
  addressSchema,
  initialAddressData
);
</script>

<template>
  <div class="mt-10">
    <form @submit.prevent="handleSubmit" class="flex flex-col gap-4">
      <div>
        <label
          >Nom
          <Input
            id="name"
            v-model="formData.name"
            :class="{ 'border-destructive': formErrors.name }"
            autofocus
          />
        </label>
        <small class="text-destructive" v-if="formErrors.name">
          {{ formErrors.name }}
        </small>
      </div>
      <div>
        <label
          >Rue
          <Input
            id="street"
            v-model="formData.street"
            :class="{ 'border-destructive': formErrors.street }"
          />
        </label>
        <small class="text-destructive" v-if="formErrors.street">
          {{ formErrors.street }}
        </small>
      </div>
      <div>
        <label
          >Ville
          <Input
            id="city"
            v-model="formData.city"
            :class="{ 'border-destructive': formErrors.city }"
          />
        </label>
        <small class="text-destructive" v-if="formErrors.city">
          {{ formErrors.city }}
        </small>
      </div>
      <div>
        <label
          >Code postal
          <Input
            id="zipCode"
            v-model="formData.zipCode"
            :class="{ 'border-destructive': formErrors.zipCode }"
          />
        </label>
        <small class="text-destructive" v-if="formErrors.zipCode">
          {{ formErrors.zipCode }}
        </small>
      </div>
      <div>
        <label
          >Numero de telephone
          <Input
            id="zipCode"
            v-model="formData.phone"
            :class="{ 'border-destructive': formErrors.zipCode }"
          />
        </label>
        <small class="text-destructive" v-if="formErrors.zipCode">
          {{ formErrors.phone }}
        </small>
      </div>
      <Button type="submit" class="w-full" :disabled="formSubmitting">Soumettre</Button>
    </form>
  </div>
</template>
