<script setup lang="ts">
import Input from '../components/ui/input/Input.vue';
import Button from '../components/ui/button/Button.vue';
import { useForm } from '@/composables/form';
import {z} from 'Zod';
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
// gestion formulmaire
const handleSubmit = () => {
  submitForm(async (data) => {
    console.log('Données de connexion envoyées :', data);
  });
};


const shippingSchema = z.object({
  email: z.string()
    .min(5, { message: "5 caractères minimum" })
    .max(30, { message: "30 caractères maximum" })
    .email({ message: "Email invalide" }),
  fullName: z.string()
    .min(4, { message: "4 caractères minimum" })
    .max(50, { message: "50 caractères maximum" })
    .regex(/^[a-zA-Zà-öø-ÿÀ-ÖØ-ß\s-]+$/, { message: "Contient des caractères invalides" }),
  address: z.string()
    .min(10, { message: "10 caractères minimum" })
    .max(60, { message: "60 caractères maximum" })
    .regex(/^(?=.*[a-zA-Z])(?=.*\d).+$/, { message: "Adresse invalide" }),
  codePostal: z.string()
    .min(2, { message: "Le code postal doit contenir au moins 2 caractères" })
    .max(5, { message: "Le code postal doit contenir au plus 5 caractères" })
    .regex(/^[a-zA-Z0-9]+$/, { message: "Veuillez saisir correctement le code postal" }),
  phoneNumber: z.string()
    .regex(/^\d{10}$/, { message: "Le numéro de téléphone doit contenir 10 chiffres" }),
  city: z.string()
    .min(2, { message: "2 caractères minimum" })
    .max(25, { message: "25 caractères maximum" })
    .regex(/^[a-zA-Z]+$/, { message: "Ville invalide" })
});

const livraisonData = {
  email: '',
  fullName: '',
  address: '',
  codePostal: '',
  phoneNumber: '',
  city: ''
};

const { formData, formErrors, formSubmitting, submitForm } = useForm(shippingSchema,livraisonData);

</script>
<template>
  <div class="md:max-w-screen-md flex flex-col items-center">
    <form @submit.prevent="handleSubmit" class="flex flex-col gap-4">
      <section id="shipping">
        <div>
          <h1>Contact</h1>
          <label> adresse e-mail </label>
          <Input id="email" type="text" placeholder="email ex: arthur@gmail.com" 
          :class="{ 'border-destructive': formErrors.email }"
           v-model="formData.email" 
           required autofocus />
           <small class="text-destructive" v-if="formErrors.email">
          {{ formErrors.email }}
        </small>
        </div>

        <h1>Livraison</h1>
        <div class="flex">
          <label> Nom prénom </label>
          <Input v-model="formData.fullName"  :class="{ 'border-destructive': formErrors.fullName }" placeholder="nom prénom ex: MACRON emmanuelle" required autofocus />
          <small v-if="formErrors.fullName">{{ formErrors.fullName  }}</small>
        </div>
        
        <Input list="country" name="country" id="country" placeholder="France" required />
        <datalist id="country">
          <option value="Espagne" />
          <option value="Portugal" />
          <option value="Italie" />
          <option value="Londres" />
          <option value="Belgique" />
        </datalist>
        <label> adresse </label>
        <Input id="address" v-model="formData.address" :class="{ 'border-destructive': formErrors.address }" type="text" placeholder="Adresse ex: 101 avenue de la république" />
        <small v-if="formErrors.address">{{ formErrors.address }}</small>
        
        <div class="flex">
          <label> code postale </label>
          <Input v-model="formData.codePostal" :class="{'border-destructive': formErrors.codePostal}" placeholder="Code Postal ex: 75016" />
          <small v-if="formErrors.codePostal">{{ formErrors.codePostal }}</small>
          <label> ville </label>
          <Input v-model="formData.city" :class="{ 'border-destructive': formErrors.city }" placeholder="ville ex: Paris" required autofocus />
          <small v-if="formErrors.city ">{{formErrors.city  }}</small>
        </div>
        <label>numéros de téléphone </label>
        <Input id="phoneNumber" v-model="formData.phoneNumber" :class="{'border-destructive': formErrors.phoneNumber}" type="text" placeholder="Téléphone ex: 0654841238" required autofocus />
        <small v-if="formErrors.phoneNumber">{{ formErrors.phoneNumber}}</small>
        
        <div>
          <h1>Mode D'expedition</h1>
          <fieldset>
            <div class="flex items-center ps-4 border border-gray-200 rounded dark:border-gray-700">
              <Input id="bordered-radio-1" type="radio" value="" name="bordered-radio" class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
              <label for="bordered-radio-1" class="w-full py-4 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">Livraison Colissimo</label>
            </div>
            <div class="flex items-center ps-4 border border-gray-200 rounded dark:border-gray-700">
              <Input checked id="bordered-radio-2" type="radio" value="" name="bordered-radio" class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
              <label for="bordered-radio-2" class="w-full py-4 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">Livraison en point de retrait Mondial Relay (choix du point relais après paiement)</label>
            </div>
          </fieldset>
        </div>
        
        <div>
          <h1>Paiement</h1>
          <fieldset>
            <div class="items-center ps-4 border border-gray-200 rounded dark:border-gray-700">
              <Input @click="displayCredForm" id="bordered-radio-3" type="radio" value="" name="bordered-radio-payment" class="inline-flex w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
              <label for="bordered-radio-3" class="w-full py-4 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">Carte de Credit</label>
              <div class="flex-auto" id="carteDeCreditForm" :style="dispCred">
                <Input type="text" placeholder="Numéro de carte" />
                <Input type="text" placeholder="Date d'expiration" />
                <Input type="text" placeholder="Code de sécurité" />
              </div>
            </div>
            
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
          <Button class="bg-blue-900">Payer avec PayPal</Button>
        </div>
        
        <div v-else>
          <Button class="#">
            Payer Maintenant
          </Button>
        </div>
      </section>
    </form>
  </div>
</template>
