<script setup lang="ts">
import Input from '../components/ui/input/Input.vue';
import Button from '../components/ui/button/Button.vue';
import { useForm } from '@/composables/form';
import {z} from 'zod';
import {ref} from 'vue';


// gestion mode de paiement
const dispCred = ref({display:"none"});
const dispPayPal = ref ({display:"none"});
const disPayPalButt = ref(false);
const displayCredForm = () => {
  dispCred.value = {display:"block"};
  dispPayPal.value = {display:"none"};
  disPayPalButt.value = false;
}
const displayPayPalForm = () => {
  dispPayPal.value = {display:"block"};
  dispCred.value = {display:"none"};
  disPayPalButt.value = true;
}



const shippingSchema = z.object({

  fullname: z.string()
    .min(4, { message: "4 caractères minimum" })
    .max(50, { message: "50 caractères maximum" })
    .regex(/^[a-zA-Zà-öø-ÿÀ-ÖØ-ß\s-]+$/, { message: "Contient des caractères invalides" }),
  street: z.string()
    .min(10, { message: "10 caractères minimum" })
    .max(60, { message: "60 caractères maximum" })
    .regex(/^(?=.*[a-zA-Z])(?=.*\d).+$/, { message: "Adresse invalide" }),
  emailCustomer: z.string()
    .min(5, { message: "5 caractères minimum" })
    .max(60, { message: "60 caractères maximum" })
    .email({ message: "email invalide" }),
  zipCode: z.string()
    .min(2, { message: "Le code postal doit contenir au moins 2 caractères" })
    .max(5, { message: "Le code postal doit contenir au plus 5 caractères" })
    .regex(/^[a-zA-Z0-9]+$/, { message: "Veuillez saisir correctement le code postal" }),
  phone: z.string()
    .regex(/^\d{10}$/, { message: "Le numéro de téléphone doit contenir 10 chiffres" }),
  city: z.string()
    .min(2, { message: "2 caractères minimum" })
    .max(25, { message: "25 caractères maximum" })
    .regex(/^[a-zA-Z]+$/, { message: "Ville invalide" })
});

const livraisonData = {
  fullname: '',
  emailCustomer:'',
  street: '',
  zipCode: '',
  phone: '',
  city: ''
};

const { formData, formErrors, formSubmitting, submitForm } = useForm(shippingSchema,livraisonData);
//gestion de formulaire avec le back
const handleSubmit = () => {
  submitForm(async (data) => {
    try {
      const response = await fetch('http://localhost:3000/shipping', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (!response.ok) {
        throw new Error('Failed to submit form');
      }
      const result = await response.json();
      console.log('Données de livraison envoyées :', result);
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  });
};
</script>
<template>
   <h1 class="text-3xl font-bold m-2">Livraison</h1>
  <div class="flex flex-col items-center">
   
    <form @submit.prevent="handleSubmit" class="flex flex-col">
      <div id="shipping" class="space-y-5">
        <div class="flex flex-col">
          <label> email </label>
          <Input v-model="formData.emailCustomer"  :class="{ 'border-destructive': formErrors.emailCustomer }" required autofocus />
          <small v-if="formErrors.emailCustomer">{{ formErrors.emailCustomer  }}</small>
        </div>
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
            <label> Livraison Domicile </label>
            <div class="flex items-center ps-4 border border-gray-200 rounded dark:border-gray-700">
              <Input id="bordered-radio-1" type="radio" value="" name="bordered-radio" class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
              <label for="bordered-radio-1" class="w-full py-4 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">Livraison Colissimo</label>
            </div>
            <label> Livraison Point relais </label>
            <div class="flex items-center ps-4 border border-gray-200 rounded dark:border-gray-700">
              <Input checked id="bordered-radio-2" type="radio" value="" name="bordered-radio" class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
              <label for="bordered-radio-2" class="w-full py-4 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">Livraison en point de retrait Mondial Relay (choix du point relais après paiement)</label>
            </div>
          </fieldset>
        </div>
      </div>
      <br>
      <div id="Payment">
          <div class="flex flex-col gap-5">
          <h1>Paiement</h1>
          <fieldset>
            <label> Carte Bleu </label>
            <div class="items-center p-4 border border-gray-200 rounded dark:border-gray-700">
              <Input @click="displayCredForm" id="bordered-radio-3" type="radio" value="" name="bordered-radio-payment" class="inline-flex w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
              <label for="bordered-radio-3" class="w-full py-4 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">Carte de Credit</label>
              <div class="flex-auto gap-5" id="carteDeCreditForm" :style="dispCred">
                <div class="flex flex-col"> 
                  <label> Numéro de Carte</label>
                  <Input type="text"/> 
                </div>
                <div class="flex flex-col"> 
                  <label> Date d'expiration </label>
                  <Input type="text" />
                </div>
                <div class="flex flex-col">
                <label> Code de sécurité </label>
                <Input type="text" />
                </div>
                
              </div>
            </div>
            
            <label> PayPal </label>
            <div @click="displayPayPalForm" class="items-center ps-4 border border-gray-200 rounded dark:border-gray-700">
              
              <Input checked id="bordered-radio-4" type="radio" value="" name="bordered-radio-payment" class="inline-flex w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
              <label for="bordered-radio-4" class="w-full py-4 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">PayPal</label>
              <div id="paypalForm" v-bind:style="dispPayPal">
                <p>Après avoir cliqué sur "Payer avec PayPal" Vous serez redirigé(e) vers PayPal pour finaliser votre achat de façon sécurisée</p>
              </div>
            </div>
          </fieldset>
        </div>
        <div v-if="disPayPalButt" class="#">
          <Button type="submit" class="w-1/2 bg-blue-900" :disabled="formSubmitting">Payer avec PayPal</Button>
        </div>
        <div v-else>
         <Button type="submit" class="w-1/2" :disabled="formSubmitting">Payer Maintenant</Button>
        </div>
      </div>
    </form>
  </div>
</template>
