<script setup lang="ts">
import Input from '../components/ui/input/Input.vue';
import Button from '../components/ui/button/Button.vue';
import {displayCredForm,displayPayPalForm,dispCred,dispPayPal,disPayPalButt } from "../Script/livraisonPaymentScript"

</script>
<template>
    <div class="md:max-w-screen-md flex flex-col items-center">
        
        <section id="shipping">
        <div class="#">
            <h1 class='#'> Contact </h1>
            <Input  id="#"
                type="text"
                placeholder="email    ex: arthur@gmail.com"
                class="pl-10"/>

        </div>
            <h1 class='#'> Livraison </h1>
            <Input list="country" name="#" id="#" placeholder="France"/>
            <datalist id="country">
                <option value="Espagne"/>
                <option value="Portugal"/>
                <option value="Italie"/>
                <option value="Londres"/>
                <option value="Belgique"/>
            </datalist>
            <div class="flex">
                <Input placeholder="nom prénom      ex: MACRON emmanuelle" />
            </div>
            <Input
            id="#"
            type="text"
            placeholder="Adresse    ex: 101 avenue de la république"
            class="#"
            />
            <div class="flex">
                <Input placeholder="Code Postal     ex: 75016 "/> <Input placeholder="ville         ex: Paris" />
            </div>
            <Input
            id="#"
            type="text"
            placeholder="Téléphone          ex: 0654841238"
            class="#"
            />
            <div>
                <h1> Mode D'expedition </h1>
                <fieldset>
                    <div class="flex items-center ps-4 border border-gray-200 rounded dark:border-gray-700">
                        <Input  id="bordered-radio-1" type="radio" value="" name="bordered-radio" class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"/>
                        <label for="bordered-radio-1" class="w-full py-4 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"> Livraison Colissimo </label>
                    </div>
                    <div class="flex items-center ps-4 border border-gray-200 rounded dark:border-gray-700">
                        <Input checked id="bordered-radio-2" type="radio" value="" name="bordered-radio" class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
                        <label for="bordered-radio-2" class="w-full py-4 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300" > Livraison en point de retrait Mondial Relay (choix du point relais après paiement) </label>
                    </div>
                </fieldset>
            </div>
            <div>
                <h1> Paiement </h1>
                <fieldset>
                    <div class=" items-center ps-4 border border-gray-200 rounded dark:border-gray-700">
                        <Input @click="displayCredForm" id="bordered-radio-3" type="radio" value="" name="bordered-radio-payment" class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"/>
                        <label for="bordered-radio-3" class="w-full py-4 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"> Carte de Credit</label>
                        <div class="flex-auto" id="carteDeCreditForm" v-bind:style="dispCred">
                                    <Input type="text" placeholder="Numéro de carte"/>
                                    <Input type="text" placeholder="Date d'expiration"/>
                                    <Input type="text" placeholder="Code de sécurité"/>
                        </div>
                    </div>
                    <div @click="displayPayPalForm" class="items-center ps-4 border border-gray-200 rounded dark:border-gray-700">
                        <Input checked id="bordered-radio-4" type="radio" value="" name="bordered-radio-payment" class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"/>
                        <label for="bordered-radio-4" class="w-full py-4 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300" > PayPal </label>
                      <div id="paypalForm" v-bind:style="dispPayPal">
                        <p> Après avoir cliqué sur "Payer avec PayPal" Vous serez redirigé(e) vers PayPal pour finaliser votre achat de façon sécurisée </p>
                      </div>

                    </div>
                </fieldset>
                    
            </div>

            <div v-if="disPayPalButt" class="#">
                  <Button class="bg-blue-900"> Payer avec PayPal </Button>
            </div>

            <div v-else>
              <Button class="#">
                Payer Maintenant
              </Button>
            </div>
        </section>

    </div>
  </template>
