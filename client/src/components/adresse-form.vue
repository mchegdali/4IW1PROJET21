<!-- AdresseForm.vue -->
<script setup lang="ts">
import { watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import Input from './ui/input/Input.vue';
import Button from '@/components/ui/button/Button.vue';
import { z } from 'zod';
import { useForm } from '@/composables/form';

const props = defineProps<{
  isEditing: boolean;
  initialAddressData?: {
    firstName: string;
    lastName: string;
    street: string;
    city: string;
    region: string;
    zipCode: string;
    country: string;
    phone: string;
  };
}>();

const emit = defineEmits<{
  (e: 'submitted'): void;
}>();

const router = useRouter();
const route = useRoute();
const user = JSON.parse(localStorage.getItem('user') || '{}');
const userId = user.id;
const addressId = route.params.id as string;

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

const initialAddressData = props.initialAddressData || {
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
  defineField,
  errors,
  formValues
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
    const url = props.isEditing 
      ? `http://localhost:3000/users/${userId}/addresses/${addressId}`
      : `http://localhost:3000/users/${userId}/addresses`;

    const method = props.isEditing ? 'PUT' : 'POST';

    const response = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      throw new Error(props.isEditing ? "Erreur lors de la mise à jour de l'adresse" : "Erreur lors de l'ajout de l'adresse");
    }

    emit('submitted');
    router.push({ name: 'adresses', params: { userId } });
  } catch (error) {
    if (import.meta.env.MODE === 'development') {
      console.error(props.isEditing ? "Erreur lors de la mise à jour de l'adresse:" : "Erreur lors de l'ajout de l'adresse:", error);
    }
  }
});

watch(() => props.isEditing, async (newVal) => {
  if (newVal && addressId) {
    try {
      const response = await fetch(`http://localhost:3000/users/${userId}/addresses/${addressId}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const addressData = await response.json();
      Object.assign(formValues.value, addressData);
    } catch (error) {
      if (import.meta.env.MODE === 'development') {
        console.error('Erreur lors du chargement de l’adresse:', error);
      }
    }
  }
}, { immediate: true });
</script>

<template>
  <div class="mt-10 mx-4">
    <form @submit.prevent="submitHandler" class="flex flex-col gap-4">
      <div>
        <label>
          Prénom
          <Input
            id="firstName"
            v-model="firstName"
            @input="firstNameField.onInput"
            :class="{ 'border-destructive': errors.firstName }"
            v-model="firstName"
            @input="firstNameField.onInput"
            :class="{ 'border-destructive': errors.firstName }"
            autofocus
          />
        </label>
        <small class="text-destructive" v-if="errors.firstName">
          {{ errors.firstName }}
        <small class="text-destructive" v-if="errors.firstName">
          {{ errors.firstName }}
        </small>
      </div>
      <div>
        <label>
          Nom
          <Input
            id="lastName"
            v-model="lastName"
            @input="lastNameField.onInput"
            :class="{ 'border-destructive': errors.lastName }"
            v-model="lastName"
            @input="lastNameField.onInput"
            :class="{ 'border-destructive': errors.lastName }"
          />
        </label>
        <small class="text-destructive" v-if="errors.lastName">
          {{ errors.lastName }}
        <small class="text-destructive" v-if="errors.lastName">
          {{ errors.lastName }}
        </small>
      </div>
      <div>
        <label>
          Rue
          <Input
            id="street"
            v-model="street"
            @input="streetField.onInput"
            :class="{ 'border-destructive': errors.street }"
            v-model="street"
            @input="streetField.onInput"
            :class="{ 'border-destructive': errors.street }"
          />
        </label>
        <small class="text-destructive" v-if="errors.street">
          {{ errors.street }}
        <small class="text-destructive" v-if="errors.street">
          {{ errors.street }}
        </small>
      </div>
      <div>
        <label>
          Ville
          <Input
            id="city"
            v-model="city"
            @input="cityField.onInput"
            :class="{ 'border-destructive': errors.city }"
            v-model="city"
            @input="cityField.onInput"
            :class="{ 'border-destructive': errors.city }"
          />
        </label>
        <small class="text-destructive" v-if="errors.city">
          {{ errors.city }}
        <small class="text-destructive" v-if="errors.city">
          {{ errors.city }}
        </small>
      </div>
      <div>
        <label>
          Région
          <Input
            id="region"
            v-model="region"
            @input="regionField.onInput"
            :class="{ 'border-destructive': errors.region }"
            v-model="region"
            @input="regionField.onInput"
            :class="{ 'border-destructive': errors.region }"
          />
        </label>
        <small class="text-destructive" v-if="errors.region">
          {{ errors.region }}
        <small class="text-destructive" v-if="errors.region">
          {{ errors.region }}
        </small>
      </div>
      <div>
        <label>
          Code postal
          <Input
            id="zipCode"
            v-model="zipCode"
            @input="zipCodeField.onInput"
            :class="{ 'border-destructive': errors.zipCode }"
            v-model="zipCode"
            @input="zipCodeField.onInput"
            :class="{ 'border-destructive': errors.zipCode }"
          />
        </label>
        <small class="text-destructive" v-if="errors.zipCode">
          {{ errors.zipCode }}
        <small class="text-destructive" v-if="errors.zipCode">
          {{ errors.zipCode }}
        </small>
      </div>
      <div>
        <label>
          Pays
          <Input
            id="country"
            v-model="country"
            @input="countryField.onInput"
            :class="{ 'border-destructive': errors.country }"
            v-model="country"
            @input="countryField.onInput"
            :class="{ 'border-destructive': errors.country }"
          />
        </label>
        <small class="text-destructive" v-if="errors.country">
          {{ errors.country }}
        <small class="text-destructive" v-if="errors.country">
          {{ errors.country }}
        </small>
      </div>
      <div>
        <label>
          Numéro de téléphone
          <Input
            id="phone"
            v-model="phone"
            @input="phoneField.onInput"
            :class="{ 'border-destructive': errors.phone }"
            v-model="phone"
            @input="phoneField.onInput"
            :class="{ 'border-destructive': errors.phone }"
          />
        </label>
        <small class="text-destructive" v-if="errors.phone">
          {{ errors.phone }}
        <small class="text-destructive" v-if="errors.phone">
          {{ errors.phone }}
        </small>
      </div>
      <Button type="submit" class="w-full" :disabled="isSubmitting">
        {{ props.isEditing ? 'Mettre à jour' : 'Ajouter' }}
      </Button>
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
