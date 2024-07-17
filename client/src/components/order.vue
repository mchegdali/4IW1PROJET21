<script setup lang="ts">
import { ref } from 'vue';
import { useRoute } from 'vue-router';
import ordersData from '@/api/order.json';
import { Calendar, Package2, Truck } from 'lucide-vue-next';

const route = useRoute();
const orderId = route.params.id;

const order = ref(ordersData.orders.find((o) => o.orderId === orderId));

const calculateTotalPrice = (items: Array<any>): string => {
  const total = items.reduce((total, item) => total + item.price, 0);
  return total.toFixed(2);
};
</script>

<template>
  <div class="items-center flex justify-center flex-col">
    <div v-if="order" class="sm:w-2/3 sm:flex flex-row justify-center md:w-full">
      <div>
        <!-- premiere infos -->
        <div class="p-2 flex flex-col gap-2 mt-2 sm:p-4">
          <div class="flex gap-4 text-sm items-center sm:text-lg">
            <Package2 />
            N° de commande: <span class="font-bold">{{ order.orderNumber }}</span>
          </div>

          <div class="flex gap-4 text-sm items-center sm:text-lg">
            <Calendar />
            <p>
              Date de commande:
              <span class="font-bold">{{
                new Date(order.shippingDate).toLocaleDateString('fr-FR', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric'
                })
              }}</span>
            </p>
          </div>
        </div>

        <!-- deuximeme infos -->
        <h6 class="font-bold text-sm p-2 text-gray-700 sm:text-lg sm:p-4">
          INFORMATION SUR LA LIVRAISON
        </h6>
        <div class="p-2 sm:p-4">
          <h1 class="text-xs font-bold text-gray-700 sm:text-sm">ADRESSE DE COLLECTE</h1>
          <div class="text-sm p-2 sm:text-sm border-b">
            <p>{{ order.shippingAddress.street }}</p>
            <p>{{ order.shippingAddress.postalCode }} {{ order.shippingAddress.city }}</p>
            <p>{{ order.shippingAddress.country }}</p>
          </div>

          <h1 class="text-xs font-bold text-gray-700 mt-2 sm:text-sm">VOS COORDONNÉES</h1>
          <div class="text-sm p-2 sm:text-sm">
            <p>{{ order.contactDetails.name }}</p>
            <p>{{ order.contactDetails.phoneNumber }}</p>
          </div>
        </div>

        <!-- troisieme infos -->
        <div class="flex flex-col gap-2 p-2 sm:p-4" v-if="order.deliveryStatus === false">
          <div class="flex justify-between items-center text-xs">
            <p class="font-bold text-sm sm:text-lg">VOTRE COMMANDE EST EN COURS !</p>
            <p class="text-gray-700 sm:text-lg">{{ order.items.length }} <span>Produits</span></p>
          </div>

          <div class="sm:flex w-full items-center justify-between">
            <p class="text-sm font-bold text-gray-700 sm:text-sm">
              DATE PRÉVUE DE LIVRAISON :
              {{
                new Date(order.shippingDate).toLocaleDateString('fr-FR', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric'
                })
              }}
            </p>

            <div
              v-if="order.deliveryStatus === false"
              class="bg-white py-2 text-sm flex items-center gap-2"
            >
              <Truck />
              <RouterLink
                :to="{ name: 'tracking', params: { id: order.orderId } }"
                class="text-tea-600 sm:text-lg"
              >
                Suivre le colis
              </RouterLink>
            </div>
          </div>

          <div class="w-full h-3 bg-gray-200 overflow-hidden rounded-xl">
            <div class="h-full bg-tea-600" style="width: 45%"></div>
          </div>

          <p class="text-xs sm:text-sm">
            Votre colis est en cours de livraison. Merci de votre patience et nous espérons que vous
            apprécierez votre commande lorsqu'elle arrivera !
          </p>
        </div>

        <div class="flex flex-col gap-2 p-2 sm:p-4" v-if="order.deliveryStatus === true">
          <div class="flex justify-between items-center text-xs">
            <p class="font-bold text-sm sm:text-lg">VOTRE COMMANDE A ÉTÉ LIVRÉE !</p>
            <p class="text-gray-700 sm:text-lg">{{ order.items.length }} <span>Produits</span></p>
          </div>

          <p class="text-sm font-bold text-gray-700 sm:text-lg">
            LIVRAISON LE :
            {{
              new Date(order.shippingDate).toLocaleDateString('fr-FR', {
                day: 'numeric',
                month: 'short',
                year: 'numeric'
              })
            }}
          </p>

          <div class="w-full h-3 bg-tea-600 rounded-xl"></div>

          <p class="text-xs sm:text-sm">
            Ca y est : votre colis a été livré. Nous espérons que vous aimerez votre commande !
          </p>
        </div>

        <!-- quatrieme infos -->
        <div class="flex flex-col w-full gap-2 px-2 sm:px-4 pb-2">
          <div
            v-for="(item, index) in order.items"
            :key="item.id"
            :class="[
              'h-28 flex w-full gap-8 pb-2',
              index !== order.items.length - 1 ? 'border-b border-gray-300' : ''
            ]"
          >
            <img class="min-w-24 h-full bg-slate-400" :src="item.image" alt="" />
            <div class="flex flex-col text-sm gap-2">
              <p class="font-bold">{{ item.title }}</p>

              <p class="font-bold">{{ item.price }} €</p>

              <p>Quantité: {{ item.quantity }}</p>
            </div>
          </div>
        </div>
      </div>

      <div class="md:border md:flex md:flex-col md:rounded md:h-fit">
        <!-- cinquieme infos -->
        <h6 class="font-bold text-sm p-2 sm:text-lg sm:p-4 text-gray-700">
          INFORMATION DE PAIEMENT
        </h6>
        <div class="flex gap-4 items-center p-2 sm:p-4 text-xs">
          <span v-if="order.typePayement == 'pp'" class="flex gap-4 items-center">
            <img
              class="w-9 px-2 py-1"
              src="https://upload.wikimedia.org/wikipedia/commons/a/a4/Paypal_2014_logo.png"
              alt=""
            />
            <h1 class="px-2 text-sm sm:text-lg">Paypal</h1>
          </span>

          <span v-if="order.typePayement == 'cb'" class="flex gap-4 items-center">
            <img
              class="w-9 px-2 py-1 sm:w-12"
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/b7/MasterCard_Logo.svg/300px-MasterCard_Logo.svg.png"
              alt=""
            />
            <h1 class="px-2 text-sm sm:text-lg">Carte bancaire</h1>
          </span>
        </div>

        <!-- sixieme infos -->
        <h6 class="font-bold text-sm p-2 sm:text-lg sm:p-4 text-gray-700">TOTAL DE COMMANDE</h6>
        <div class="p-2 mb-4 sm:p-4">
          <p class="flex justify-between text-sm sm:text-lg">
            Sous-total <span>{{ calculateTotalPrice(order.items) }} €</span>
          </p>
          <p class="flex justify-between text-sm py-1 sm:text-lg">
            Livraison: <span>GRATUIT</span>
          </p>
          <p class="flex justify-between text-sm py-1 sm:text-lg">Remise: <span>0 €</span></p>
          <p class="font-bold flex justify-between text-sm sm:text-lg">
            Total: <span class="font-bold">{{ calculateTotalPrice(order.items) }} €</span>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
