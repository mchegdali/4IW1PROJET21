<script setup lang="ts">
import { ref } from 'vue';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useRoute } from 'vue-router';
import ordersData from '@/api/order.json';

const route = useRoute();
const trakingId = route.params.id;

const order = ref(ordersData.orders.find((o) => o.orderId === trakingId));

const formatDate = (dateString: string) => {
  return format(new Date(dateString), 'PPPpp', { locale: fr });
};

const orderData = ref({
  idShip: '1B34567890123',
  timeline: [
    {
      id: 1,
      shortLabel: 'En cours de traitement',
      longLabel: 'Votre colis est en train de voyager dans un train.',
      status: true,
      type: -1,
      date: '2020-12-07T00:00:00+01:00',
      country: 'DE'
    },
    {
      id: 2,
      shortLabel: 'Pris en charge par le transporteur',
      longLabel: 'Votre colis a été pris en charge par le transporteur.',
      status: true,
      type: 0,
      date: '2020-12-06T10:00:00+01:00',
      country: 'DE'
    },
    {
      id: 3,
      shortLabel: 'Arrivé au centre de tri',
      longLabel: 'Votre colis est arrivé au centre de tri.',
      status: true,
      type: 1,
      date: '2020-12-05T12:30:00+01:00',
      country: 'DE'
    },
    {
      id: 4,
      shortLabel: 'En cours de livraison',
      longLabel: 'Votre colis est en cours de livraison.',
      status: true,
      type: 2,
      date: '2020-12-04T08:00:00+01:00',
      country: 'DE'
    },
    {
      id: 5,
      shortLabel: 'Livré',
      longLabel: 'Votre colis a été livré.',
      status: true,
      type: 3,
      date: '2020-12-03T15:32:00+01:00',
      country: 'DE'
    }
  ],
  event: [
    {
      date: '2020-12-07T00:00:00+01:00',
      label: 'Votre colis est en cours de distribution',
      code: 'ET2'
    }
  ],
  product: 'Lettre Recommandée',
  entryDate: '2017-12-01T09:14:00+02:00',
  estimDate: '2017-12-02T09:11:00+02:00',
  deliveryDate: '2020-12-03T15:32:00+02:00'
});
</script>

<template>
  <div class="flex flex-col gap-6 p-6">
    <!-- Section Informations de commande -->
    <div class="flex gap-4 text-lg items-center sm:text-lg">
      N° de commande: <span class="font-bold">{{ order?.orderNumber }}</span>
    </div>

    <!-- Section Evénements de livraison -->
    <div v-for="event in orderData.event" :key="event.date" class="">
      <h3 class="text-xl font-semibold">Evénements de livraison</h3>
      <time class="mb-1 text-sm font-normal leading-none text-gray-400 dark:text-gray-500">{{
        formatDate(event.date)
      }}</time>
      <p class="text-base font-normal text-gray-500 dark:text-gray-400">{{ event.label }}</p>
    </div>

    <!-- Section Ligne de temps -->
    <div class="container mx-auto p-6">
      <div class="relative border-l-4 border-tea-400 dark:border-gray-700">
        <div v-for="item in orderData.timeline" :key="item.id" class="mb-10 ml-6">
          <span
            class="flex absolute -left-3 justify-center items-center w-6 h-6 bg-tea-100 rounded-full ring-8 ring-white dark:ring-gray-900 dark:bg-tea-900"
          >
            <svg
              aria-hidden="true"
              class="w-3 h-3 text-tea-600 dark:text-tea-300"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill-rule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 001 1h3a1 1 0 100-2h-2V6z"
                clip-rule="evenodd"
              ></path>
            </svg>
          </span>
          <div
            class="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm"
          >
            <time class="mb-1 text-sm font-normal leading-none text-gray-400 dark:text-gray-500">{{
              formatDate(item.date)
            }}</time>
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
              {{ item.shortLabel }}
            </h3>
            <p class="mb-2 text-base font-normal text-gray-500 dark:text-gray-400">
              {{ item.longLabel }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
