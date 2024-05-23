<script setup lang="ts">
import Input from '../components/ui/input/Input.vue';
import Button from '../components/ui/button/Button.vue';
import {ref, computed} from 'vue';
import {z} from 'Zod';
// form gestion erreur
const emailSchema = z.string()
    .min(5, { message: "5 characters minimum" })
    .max(30, {  message: "30 characters maximum" })
    .email({ message: "Invalid email" });
const fullNameSchema = z.string()
    .min(4, { message: "4 characters minimum" })
    .max(50, { message: "50 characters maximum" })
    .regex(/^[a-zA-Zà-öø-ÿÀ-ÖØ-ß\s'-]+$/, { message: "Contains invalid characters" });
const addressSchema = z.string()
    .min(10, { message: "10 characters minimum" })
    .max(60, { message: "60 characters maximum" })
    .regex(/^(?=.*[a-zA-Z])(?=.*\d).+$/, { message: "Invalid address" });
const codePostalSchema = z.coerce.number()
    .gte(10, { message: "Postal code must be at least 2 digits" })
    .lte(99999, { message: "Postal code must be at most 5 digits" });
const phoneNumberSchema = z.string()
    .length(10, { message: "Phone number must be 10 digits" })
    .regex(/^\d{10}$/, { message: "Invalid phone number" });
const citySchema = z.string()
    .min(2, { message: "2 characters minimum" })
    .max(25, { message: "25 characters maximum" })
    .regex(/^[a-zA-Z]+$/, { message: "Invalid city" });

const email = ref("");
const fullName = ref("");
const address = ref("");
const phoneNumber = ref("");
const city = ref("");
const codePostal = ref("");

const formSchema = z.object({
  email: emailSchema,
  fullName: fullNameSchema,
  address: addressSchema,
  phoneNumber: phoneNumberSchema,
  codePostal: codePostalSchema,
  city: citySchema,
});

const formErrors = computed(() => {
  const formData = {
    email: email.value,
    fullName: fullName.value,
    address: address.value,
    phoneNumber: phoneNumber.value,
    codePostal: codePostal.value,
    city: city.value,
  };
  
  const result = formSchema.safeParse(formData);
  if (result.success) {
    return {};
  }
  
  return result.error.issues.reduce((acc: Record<string, string>, issue) => {
    if (typeof issue.path[0] === 'string') {
      acc[issue.path[0]] = issue.message;
    }
    return acc;
  }, {});
});

 const isFormValid = computed(() => {
  return Object.keys(formErrors.value).length === 0;
});


// Importer les erreurs de validation
const errors = computed(() => formErrors.value);

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
</script>
<template>
  <div class="md:max-w-screen-md flex flex-col items-center">
    <section id="shipping">
      <div>
        <h1>Contact</h1>
        <Input id="email" type="text" placeholder="email ex: arthur@gmail.com" class="pl-10" v-model="email" required autofocus />
        <small v-if="errors.email">{{ errors.email }}</small>
      </div>

      <h1>Livraison</h1>
      <div class="flex">
        <Input v-model="fullName" placeholder="nom prénom ex: MACRON emmanuelle" required autofocus />
        <small v-if="errors.fullName">{{ errors.fullName }}</small>
      </div>
      
      <Input list="country" name="country" id="country" placeholder="France" required />
      <datalist id="country">
        <option value="Espagne" />
        <option value="Portugal" />
        <option value="Italie" />
        <option value="Londres" />
        <option value="Belgique" />
      </datalist>
      
      <Input id="address" v-model="address" type="text" placeholder="Adresse ex: 101 avenue de la république" />
      <small v-if="errors.address">{{ errors.address }}</small>
      
      <div class="flex">
        <Input v-model="codePostal" placeholder="Code Postal ex: 75016" />
        <small v-if="errors.codePostal">{{ errors.codePostal }}</small>
        <Input v-model="city" placeholder="ville ex: Paris" required autofocus />
        <small v-if="errors.city">{{ errors.city }}</small>
      </div>
      
      <Input id="phoneNumber" v-model="phoneNumber" type="text" placeholder="Téléphone ex: 0654841238" required autofocus />
      <small v-if="errors.phoneNumber">{{ errors.phoneNumber }}</small>
      
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
  </div>
</template>
