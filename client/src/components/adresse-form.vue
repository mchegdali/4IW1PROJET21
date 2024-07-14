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
  firstName: z.string().regex(/^[a-zA-ZàâçéèêëîïôûùüÿñæœÀÂÇÉÈÊËÎÏÔÛÙÜŸÑÆŒ \-']+$/, {
    message: 'Le prénom contient des caractères invalides'
  }),
  lastName: z.string().regex(/^[a-zA-ZàâçéèêëîïôûùüÿñæœÀÂÇÉÈÊËÎÏÔÛÙÜŸÑÆŒ \-']+$/, {
    message: 'Le nom contient des caractères invalides'
  }),
  street: z.string().regex(/^[a-zA-Z0-9àâçéèêëîïôûùüÿñæœÀÂÇÉÈÊËÎÏÔÛÙÜŸÑÆŒ .,'-]+$/, {
    message: 'La rue contient des caractères invalides'
  }),
  city: z.string().regex(/^[a-zA-ZàâçéèêëîïôûùüÿñæœÀÂÇÉÈÊËÎÏÔÛÙÜŸÑÆŒ \-']+$/, {
    message: 'La ville contient des caractères invalides'
  }),
  region: z.string().regex(/^[a-zA-ZàâçéèêëîïôûùüÿñæœÀÂÇÉÈÊËÎÏÔÛÙÜŸÑÆŒ \-']+$/, {
    message: 'La région contient des caractères invalides'
  }),
  country: z.string().regex(/^[a-zA-ZàâçéèêëîïôûùüÿñæœÀÂÇÉÈÊËÎÏÔÛÙÜŸÑÆŒ \-']+$/, {
    message: 'Le pays contient des caractères invalides'
  }),
  zipCode: z
    .string()
    .regex(/^\d{5}$/, { message: 'Le code postal doit être composé de 5 chiffres' }),
  phone: z.string().regex(/^\+?\d{10,15}$/, {
    message: 'Le numéro de téléphone est invalide'
  })
});

const initialAddressData = {
  firstName: '',
  lastName: '',
  street: '',
  city: '',
  region: '',
  zipCode: '',
  country: '',
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
        <label>Prénom
          <Input
            id="firstName"
            v-model="formData.firstName"
            :class="{ 'border-destructive': formErrors.firstName }"
            autofocus
          />
        </label>
        <small class="text-destructive" v-if="formErrors.firstName">
          {{ formErrors.firstName }}
        </small>
      </div>
      <div>
        <label>Nom
          <Input
            id="lastName"
            v-model="formData.lastName"
            :class="{ 'border-destructive': formErrors.lastName }"
          />
        </label>
        <small class="text-destructive" v-if="formErrors.lastName">
          {{ formErrors.lastName }}
        </small>
      </div>
      <div>
        <label>Rue
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
        <label>Ville
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
        <label>Région
          <Input
            id="region"
            v-model="formData.region"
            :class="{ 'border-destructive': formErrors.region }"
          />
        </label>
        <small class="text-destructive" v-if="formErrors.region">
          {{ formErrors.region }}
        </small>
      </div>
      <div>
        <label>Code postal
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
        <label>Pays
          <Input
            id="country"
            v-model="formData.country"
            :class="{ 'border-destructive': formErrors.country }"
          />
        </label>
        <small class="text-destructive" v-if="formErrors.country">
          {{ formErrors.country }}
        </small>
      </div>
      <div>
        <label>Numéro de téléphone
          <Input
            id="phone"
            v-model="formData.phone"
            :class="{ 'border-destructive': formErrors.phone }"
          />
        </label>
        <small class="text-destructive" v-if="formErrors.phone">
          {{ formErrors.phone }}
        </small>
      </div>
      <Button type="submit" class="w-full" :disabled="formSubmitting">Soumettre</Button>
    </form>
  </div>
</template>

<style scoped>
.border-destructive {
  border-color: #f00;
}
.text-destructive {
  color: #f00;
}
</style>
