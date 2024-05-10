<script>
import Input from '../components/ui/input/Input.vue';
import {ref} from 'vue';
export default {
  mounted() {
    
    
    let carteDeCreditRadio =document.getElementById('bordered-radio-3');
    let carteDeCreditForm = document.getElementById('carteDeCreditForm');
    // Fonction pour détecter le clic sur le bouton radio
    const handleClick = () => {
      // Vérifier si le bouton radio est coché
      if (carteDeCreditRadio.checked) {
        // Afficher un message dans la console
        console.log("Le bouton radio Carte de Crédit a été sélectionné.");
        // Afficher le formulaire de carte de crédit
        carteDeCreditForm.style.display = 'block';
      } else if(!(carteDeCreditRadio.checked)) {
        // Masquer le formulaire de carte de crédit si le bouton radio n'est pas sélectionné
        carteDeCreditForm.style.display = 'none';
      }
    };

    // Ajouter un écouteur d'événement pour le clic sur le bouton radio
    carteDeCreditRadio.addEventListener('click', handleClick);
  }
}
</script>
<template>
    <div class="md:max-w-screen-md flex flex-col items-center">
        
        <section id="shipping">
        <div class="#">
            <h1 class='#'> Contact </h1>
            <Input  id="#"
                type="text"
                placeholder="email"
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
                <Input placeholder="nom" /> <Input placeholder="prenom" />
            </div>
            <input
            id="#"
            type="text"
            placeholder="Adresse"
            class="#"
            />
            <div class="flex">
                <Input placeholder="Code Postal"/> <Input placeholder="ville" />
            </div>
            <Input
            id="#"
            type="text"
            placeholder="Téléphone"
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
                    <div class=" flex-col items-center ps-4 border border-gray-200 rounded dark:border-gray-700">
                        <Input  @click="deroulForm" id="bordered-radio-3" type="radio" value="" name="bordered-radio-payment" class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"/>
                        <label for="bordered-radio-3" class="w-full py-4 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"> Carte de Credit</label>
                        <div id="carteDeCreditForm" style="display: none;">
                                    <!-- Formulaire pour Carte de Crédit -->
                                    <!-- Ajoutez ici vos champs de formulaire pour la carte de crédit -->
                                    <!-- Par exemple : -->
                                    <input type="text" placeholder="Numéro de carte">
                                    <input type="text" placeholder="Date d'expiration"> 
                                    <input type="text" placeholder="Code de sécurité">
                        </div>
                    </div>
                    <div class="flex items-center ps-4 border border-gray-200 rounded dark:border-gray-700">
                        <Input checked id="bordered-radio-4" type="radio" value="" name="bordered-radio-payment" class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
                        <label for="bordered-radio-4" class="w-full py-4 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300" > PayPal </label>
                    </div>
                </fieldset>
                    
            </div>
            <div class="#">
                <Button> Payer Maintenant </Button>
            </div>
        </section>
        <section>

        </section>
    </div>
  </template>
