<script setup lang="ts">
import Input from './ui/input/Input.vue';
import Button from '@/components/ui/button/Button.vue';
import { z } from 'zod';
import { useForm } from '@/composables/form';

const handleSubmit = () => {
  submitForm(async (data) => {
    console.log("Données d'adresse envoyées :", data);
  });
};

const addressSchema = z.object({
  fullName: z
    .string()
    .regex(/^[a-zA-ZàâçéèêëîïôûùüÿñæœÀÂÇÉÈÊËÎÏÔÛÙÜŸÑÆŒ \-']+$/, {
      message: 'Le nom complet contient des caractères invalides'
    }),
  street: z
    .string()
    .regex(/^[a-zA-Z0-9àâçéèêëîïôûùüÿñæœÀÂÇÉÈÊËÎÏÔÛÙÜŸÑÆŒ .,'-]+$/, {
      message: 'La rue contient des caractères invalides'
    }),
  city: z
    .string()
    .regex(/^[a-zA-ZàâçéèêëîïôûùüÿñæœÀÂÇÉÈÊËÎÏÔÛÙÜŸÑÆŒ \-']+$/, {
      message: 'La ville contient des caractères invalides'
    }),
  region: z
    .string()
    .regex(/^[a-zA-ZàâçéèêëîïôûùüÿñæœÀÂÇÉÈÊËÎÏÔÛÙÜŸÑÆŒ \-']+$/, {
      message: 'La région contient des caractères invalides'
    }),
  postalCode: z
    .string()
    .regex(/^\d{5}$/, { message: 'Le code postal doit être composé de 5 chiffres' }),
  country: z
    .string()
    .regex(/^[a-zA-ZàâçéèêëîïôûùüÿñæœÀÂÇÉÈÊËÎÏÔÛÙÜŸÑÆŒ \-']+$/, {
      message: 'Le pays contient des caractères invalides'
    }),
  phone: z
    .string()
    .regex(/^(\+33|0)[1-9](\d{2}){4}$/, { message: 'Le numéro de téléphone est invalide' })
});

const initialAddressData = {
  fullName: 'Jean Dupont',
  street: '52 rue Antoine',
  city: 'Paris',
  region: 'Ile de France',
  postalCode: '77016',
  country: 'France',
  phone: '07 45 62 41 23'
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
          >Nom et prénom
          <Input
            id="fullName"
            v-model="formData.fullName"
            :class="{ 'border-destructive': formErrors.fullName }"
            autofocus
          />
        </label>
        <small class="text-destructive" v-if="formErrors.fullName">
          {{ formErrors.fullName }}
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
          >Région
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
        <label
          >Code postal
          <Input
            id="postalCode"
            v-model="formData.postalCode"
            :class="{ 'border-destructive': formErrors.postalCode }"
          />
        </label>
        <small class="text-destructive" v-if="formErrors.postalCode">
          {{ formErrors.postalCode }}
        </small>
      </div>
      <div>
        <label
          >Pays
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
        <label
          >Téléphone
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
