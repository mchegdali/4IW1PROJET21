<script setup lang="ts">
import { RouterLink } from 'vue-router';
import Appbar from '@/components/app-bar.vue';

import logo from '@/assets/images/fanthesie.png';
</script>

<template>
  <footer class="sticky bottom-0 lg:relative">
    <div class="hidden lg:block mx-auto px-4 bg-tea-600 text-white py-8 border-t border-tea-50/50">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
        <div class="flex flex-col items-center md:items-start">
          <img :src="logo" alt="Fanthesie" class="w-32 mb-4" width="128" height="42" />
          <p class="text-sm text-center md:text-left">
            Votre destination en ligne pour des thés et infusions de qualité.
          </p>
        </div>

        <div>
          <h3 class="font-semibold text-lg mb-4">Navigation</h3>
          <ul class="space-y-2">
            <li><RouterLink :to="{ name: 'home' }" class="hover:underline">Accueil</RouterLink></li>
            <li>
              <RouterLink :to="{ name: 'products' }" class="hover:underline">Produits</RouterLink>
            </li>
            <li>
              <RouterLink :to="{ name: 'basket' }" class="hover:underline">Panier</RouterLink>
            </li>
            <li>
              <RouterLink :to="{ name: 'account' }" class="hover:underline">Mon compte</RouterLink>
            </li>
          </ul>
        </div>

        <div>
          <h3 class="font-semibold text-lg mb-4">Informations</h3>
          <ul class="space-y-2">
            <li>
              <RouterLink :to="{ name: 'conditions' }" class="hover:underline"
                >Conditions de vente</RouterLink
              >
            </li>
            <li>
              <RouterLink :to="{ name: 'confidentiality-declaration' }" class="hover:underline"
                >Déclaration de confidentialité</RouterLink
              >
            </li>
            <li>
              <RouterLink :to="{ name: 'cookie-policy' }" class="hover:underline"
                >Politique des cookies</RouterLink
              >
            </li>
          </ul>
        </div>

        <div>
          <h3 class="font-semibold text-lg mb-4">Contact</h3>
          <ul class="space-y-2">
            <li>Email: contact@fanthesie.fr</li>
            <li>Téléphone: 01 23 45 67 89</li>
            <li>Adresse: 123 Rue du Thé, 75001 Paris</li>
          </ul>
        </div>
      </div>

      <div class="mt-8 pt-8 border-t border-tea-500 text-center">
        <p>&copy; {{ new Date().getFullYear() }} Fanthésie. Tous droits réservés.</p>
      </div>
    </div>
    <Appbar class="lg:hidden" />
  </footer>
</template>
