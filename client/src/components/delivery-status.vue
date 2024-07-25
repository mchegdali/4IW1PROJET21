<script setup lang="ts">
import { computed } from 'vue';
import { RouterLink } from 'vue-router';
import { Truck } from 'lucide-vue-next';

const props = defineProps({
  status: String,
  itemCount: Number,
  createdAt: String,
  orderNumber: String,
});

const title = computed(() => {
  switch (props.status) {
    case 'Shipped': return 'VOTRE COMMANDE A ÉTÉ EXPÉDIÉE !';
    case 'Delivered': return 'VOTRE COMMANDE A ÉTÉ LIVRÉE !';
    case 'Cancelled': return 'VOTRE COMMANDE A ÉTÉ ANNULÉE !';
    case 'Pending': return 'VOTRE COMMANDE EST EN COURS DE TRAITEMENT !';
    default: return '';
  }
});

const dateLabel = computed(() => {
  switch (props.status) {
    case 'Shipped':
    case 'Pending': return 'DATE PRÉVUE DE LIVRAISON';
    case 'Delivered': return 'LIVRAISON LE';
    case 'Cancelled': return "DATE D'ANNULATION";
    default: return '';
  }
});

const formattedDate = computed(() => {
  const date = new Date(props.createdAt);
  if (props.status !== 'Cancelled') {
    date.setDate(date.getDate() + 3);
  }
  return date.toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
});

const showTracking = computed(() => ['Shipped', 'Delivered'].includes(props.status));

const trackingLabel = computed(() => 
  props.status === 'Shipped' ? 'Suivre le colis' : 'Infos de la livraison'
);

const progressWidth = computed(() => {
  switch (props.status) {
    case 'Shipped': return '75%';
    case 'Delivered': return '100%';
    case 'Pending': return '15%';
    default: return null;
  }
});

const message = computed(() => {
  switch (props.status) {
    case 'Shipped':
    case 'Pending':
      return 'Votre colis est en cours de livraison. Merci de votre patience et nous espérons que vous apprécierez votre commande lorsqu\'elle arrivera !';
    case 'Delivered':
      return 'Ca y est : votre colis a été livré. Nous espérons que vous aimerez votre commande !';
    case 'Cancelled':
      return 'Votre commande a été annulée.';
    default:
      return '';
  }
});
</script>

<template>
    <div class="flex flex-col gap-2 p-2 sm:p-4">
      <div class="flex justify-between items-center text-xs">
        <p class="font-bold text-sm sm:text-lg">{{ title }}</p>
        <p class="text-gray-700 sm:text-lg">{{ itemCount }} <span>Produits</span></p>
      </div>
      <div class="sm:flex w-full items-center justify-between">
        <p class="text-sm font-bold text-gray-700 sm:text-sm">
          {{ dateLabel }}:
          {{ formattedDate }}
        </p>
        <div v-if="showTracking" class="bg-white py-2 text-sm flex items-center gap-2">
          <Truck />
          <RouterLink
            :to="{ name: 'tracking', params: { id: orderNumber } }"
            class="text-tea-600 sm:text-lg"
          >
            {{ trackingLabel }}
          </RouterLink>
        </div>
      </div>
      <div class="w-full h-3 bg-gray-200 overflow-hidden rounded-xl">
        <div v-if="progressWidth" class="h-full bg-tea-600" :style="{ width: progressWidth }"></div>
      </div>
      <p class="text-xs sm:text-sm">{{ message }}</p>
    </div>
  </template>