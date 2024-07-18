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

const nameRegex = /^[a-zA-ZÀ-ÿ '-]{2,}$/;
const streetRegex = /^[a-zA-Z0-9À-ÿ '-]{2,}$/;
const cityRegionCountryRegex = /^[a-zA-ZÀ-ÿ '-]{2,}$/;
const zipCodeRegex = /^[0-9]{5}$/;
const phoneRegex = /^[0-9]{10}$/;

const addressSchema = z.object({
  firstName: z.string().regex(nameRegex, 'Prénom invalide'),
  lastName: z.string().regex(nameRegex, 'Nom de famille invalide'),
  street: z.string().regex(streetRegex, 'Adresse invalide'),
  city: z.string().regex(cityRegionCountryRegex, 'Ville invalide'),
  region: z.string().regex(cityRegionCountryRegex, 'Région invalide'),
  zipCode: z.string().regex(zipCodeRegex, 'Code postal invalide'),
  country: z.string().regex(cityRegionCountryRegex, 'Pays invalide'),
  phone: z.string().regex(phoneRegex, 'Numéro de téléphone invalide')
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
        <label
          >Prénom
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
        <label
          >Nom
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
          >Numéro de téléphone
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
