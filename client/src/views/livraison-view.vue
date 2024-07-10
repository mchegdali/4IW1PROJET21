<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useForm } from '../composables/form';
import { z } from 'zod';
import { useFetch } from '@vueuse/core';
import Input from '../components/ui/input/Input.vue';
import Button from '../components/ui/button/Button.vue';

// Définition du schéma de validation du formulaire
const shippingSchema = z.object({
  fullname: z.string()
    .min(4, { message: "4 caractères minimum" })
    .max(50, { message: "50 caractères maximum" })
    .regex(/^[a-zA-Zà-öø-ÿÀ-ÖØ-ß\s-]+$/, { message: "Contient des caractères invalides" }),
  street: z.string()
    .min(10, { message: "10 caractères minimum" })
    .max(60, { message: "60 caractères maximum" })
    .regex(/^(?=.*[a-zA-Z])(?=.*\d).+$/, { message: "Adresse invalide" }),
  zipCode: z.string()
    .min(2, { message: "Le code postal doit contenir au moins 2 caractères" })
    .max(5, { message: "Le code postal doit contenir au plus 5 caractères" })
    .regex(/^[a-zA-Z0-9]+$/, { message: "Veuillez saisir correctement le code postal" }),
  phone: z.string()
    .regex(/^\d{10}$/, { message: "Le numéro de téléphone doit contenir 10 chiffres" }),
  city: z.string()
    .min(2, { message: "2 caractères minimum" })
    .max(25, { message: "25 caractères maximum" })
    .regex(/^[a-zA-Z]+$/, { message: "Ville invalide" }),
  deliveryChoiceId: z.string()
});

// Données initiales du formulaire
const livraisonData = {
  fullname: '',
  street: '',
  zipCode: '',
  phone: '',
  city: '',
  deliveryChoiceId: '',
};

const { formData, formErrors, formSubmitting, submitForm } = useForm(shippingSchema, livraisonData);
const deliveryOptions = ref([]);
onMounted(async () => {
  try {
    const newAbortController = new AbortController();
    const response = await fetch('http://localhost:3000/deliveryChoices',{
      signal: newAbortController.signal
    });
    const data = await response.json();
    console.log(data)
    deliveryOptions.value = data;
  } catch (error) {
    console.error('Error fetching delivery options:', error);
  }
});

// Fonction pour gérer la soumission du formulaire
const handleSubmit = () => {
 console.log(formErrors)
  submitForm(async (data) => {
    console.log("hi");
    try {
    console.log("hello")
      const response = await fetch('http://localhost:3000/shipping', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      console.log(response)
      if (!response.ok) {
        throw new Error('Failed to submit form');
      }
      
      const result = await response.json();
      console.log('Données de livraison envoyées :', result);
      // Procéder au paiement PayPal
      await handlePayPalPayment();
      console.log("Redirection vers PayPal");
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  });
};

// Gestion du paiement PayPal
const handlePayPalPayment = async () => {
  try {
    formSubmitting.value = true;
    const response = await fetch('http://localhost:3000/payment', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });
    const data = await response.json();
    if (data.id) {
      // Redirection vers PayPal pour le paiement
      window.location.href = `https://www.sandbox.paypal.com/checkoutnow?token=${data.id}`;
    }
  } catch (error) {
    console.error('Error:', error);
  } finally {
    formSubmitting.value = false;
  }
};
</script>

<template>
   <h1 class="text-3xl font-bold m-2">Livraison</h1>
  <div class="flex flex-col items-center">
   
    <form @submit.prevent="handleSubmit" class="flex flex-col">
      <div id="shipping" class="space-y-5">
        <div class="flex flex-col">
          <label> Nom et Prénom </label>
          <Input v-model="formData.fullname"  :class="{ 'border-destructive': formErrors.fullname }" required autofocus />
          <small v-if="formErrors.fullname">{{ formErrors.fullname  }}</small>
        </div>
        <div class="flex flex-col">
          <label> Adresse </label>
          <Input id="street" v-model="formData.street" :class="{ 'border-destructive': formErrors.street }" type="text" />
          <small v-if="formErrors.address">{{ formErrors.street }}</small>
        </div>
        <div class="flex flex-col">
          <label> Code postale </label>
          <Input v-model="formData.zipCode" :class="{'border-destructive': formErrors.zipCode}"  />
          <small v-if="formErrors.codePostal">{{ formErrors.zipCode }}</small>
        </div>
        <div class="flex flex-col">
            <label> Ville </label>
            <Input v-model="formData.city" :class="{ 'border-destructive': formErrors.city }"  required autofocus />
            <small v-if="formErrors.city ">{{formErrors.city}}</small>
        </div>
        <div class="flex flex-col"> 
          <label> Téléphone </label>
          <Input id="phone" v-model="formData.phone" :class="{'border-destructive': formErrors.phone}" type="text" required autofocus />
          <small v-if="formErrors.phone">{{ formErrors.phone}}</small>
        </div>

        <div class="flex flex-col">
          <h1>Mode D'expédition</h1>
          <br>
          <fieldset>
            <div v-for="option in deliveryOptions" :key="option._id" class="flex items-center ps-4 border border-gray-200 rounded dark:border-gray-700">
              <input :id="'bordered-radio-' + option._id" type="radio" v-model="formData.deliveryChoiceId" :value="option._id" name="bordered-radio" class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
              <label :for="'bordered-radio-' + option._id" class="w-full py-4 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">{{ option.name }}</label>
            </div>
          </fieldset>
        </div>
      </div>
      <br>
      <div id="Payment">
          <div class="flex flex-col gap-5">
            
           
           
              
              <div id="paypalForm" v-bind:style="dispPayPal">
                <p>Après avoir cliqué sur "Passer au paiement" Vous serez redirigé(e) vers un recapitulatif de votre panier puis sur PayPal pour finaliser votre achat de façon sécurisée</p>
              </div>
            

        </div>
        <div class="#">
          <Button type="submit" class="w-1/2 bg-blue-900" :disabled="formSubmitting">Passer au Paiement</Button>
        </div>
      </div>
    </form>
  </div>
</template>