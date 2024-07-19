<script setup lang="ts">
import { useRouter } from 'vue-router';
import Input from './ui/input/Input.vue';
import Button from '@/components/ui/button/Button.vue';
import { z } from 'zod';
import { useForm } from '@/composables/form';

const router = useRouter();
const user = JSON.parse(localStorage.getItem('user') || '{}');
const userId = user.id;

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

const {
  handleSubmit,
  isSubmitting,
  isError,
  defineField,
  errors
} = useForm({
  validationSchema: addressSchema,
  defaultValues: initialAddressData
});

const [firstName, firstNameField] = defineField('firstName');
const [lastName, lastNameField] = defineField('lastName');
const [street, streetField] = defineField('street');
const [city, cityField] = defineField('city');
const [region, regionField] = defineField('region');
const [zipCode, zipCodeField] = defineField('zipCode');
const [country, countryField] = defineField('country');
const [phone, phoneField] = defineField('phone');

const submitHandler = handleSubmit(async (data) => {
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
</script>

<template>
  <div class="mt-10 mx-4">
    <form @submit.prevent="submitHandler" class="flex flex-col gap-4">
      <div>
        <label
          >Prénom
          <Input
            id="firstName"
            v-model="firstName"
            @input="firstNameField.onInput"
            :class="{ 'border-destructive': errors.firstName }"
            autofocus
          />
        </label>
        <small class="text-destructive" v-if="errors.firstName">
          {{ errors.firstName }}
        </small>
      </div>
      <div>
        <label
          >Nom
          <Input
            id="lastName"
            v-model="lastName"
            @input="lastNameField.onInput"
            :class="{ 'border-destructive': errors.lastName }"
          />
        </label>
        <small class="text-destructive" v-if="errors.lastName">
          {{ errors.lastName }}
        </small>
      </div>
      <div>
        <label
          >Rue
          <Input
            id="street"
            v-model="street"
            @input="streetField.onInput"
            :class="{ 'border-destructive': errors.street }"
          />
        </label>
        <small class="text-destructive" v-if="errors.street">
          {{ errors.street }}
        </small>
      </div>
      <div>
        <label
          >Ville
          <Input
            id="city"
            v-model="city"
            @input="cityField.onInput"
            :class="{ 'border-destructive': errors.city }"
          />
        </label>
        <small class="text-destructive" v-if="errors.city">
          {{ errors.city }}
        </small>
      </div>
      <div>
        <label
          >Région
          <Input
            id="region"
            v-model="region"
            @input="regionField.onInput"
            :class="{ 'border-destructive': errors.region }"
          />
        </label>
        <small class="text-destructive" v-if="errors.region">
          {{ errors.region }}
        </small>
      </div>
      <div>
        <label
          >Code postal
          <Input
            id="zipCode"
            v-model="zipCode"
            @input="zipCodeField.onInput"
            :class="{ 'border-destructive': errors.zipCode }"
          />
        </label>
        <small class="text-destructive" v-if="errors.zipCode">
          {{ errors.zipCode }}
        </small>
      </div>
      <div>
        <label
          >Pays
          <Input
            id="country"
            v-model="country"
            @input="countryField.onInput"
            :class="{ 'border-destructive': errors.country }"
          />
        </label>
        <small class="text-destructive" v-if="errors.country">
          {{ errors.country }}
        </small>
      </div>
      <div>
        <label
          >Numéro de téléphone
          <Input
            id="phone"
            v-model="phone"
            @input="phoneField.onInput"
            :class="{ 'border-destructive': errors.phone }"
          />
        </label>
        <small class="text-destructive" v-if="errors.phone">
          {{ errors.phone }}
        </small>
      </div>
      <Button type="submit" class="w-full" :disabled="isSubmitting">Soumettre</Button>
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
