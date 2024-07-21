<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useRoute } from 'vue-router';
import config from '@/config';
import { Calendar, MapPin, Package2, Truck } from 'lucide-vue-next';

const route = useRoute();
const trackingId = route.params.id;

const orderData = ref<{
  idShip: string;
  event: { date: string; label: string; code: string }[];
  timeline: {
    id: string;
    shortLabel: string;
    longLabel: string;
    status: boolean;
    type: number;
    date: string;
    country: string;
  }[];
}>({
  idShip: '',
  event: [],
  timeline: []
});

const formatDate = (dateString: string) => {
  return format(new Date(dateString), 'PPPpp', { locale: fr });
};

onMounted(async () => {
  try {
    const response = await fetch(`${config.apiBaseUrl}/v1/tracking?tracking_number=${trackingId}`);
    if (!response.ok) throw new Error('Failed to fetch tracking data');

    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      throw new Error("La réponse n'est pas au format JSON");
    }

    const data = await response.json();
    orderData.value = {
      idShip: data.tracking_number,
      timeline: data.events.map((event: any) => ({
        id: event.event_code,
        shortLabel: event.description,
        longLabel:
          event.event_code === 'DELIVERED'
            ? `Votre colis a été livré à ${event.city_locality}, ${event.state_province}, ${event.country_code}.`
            : event.event_code === 'RECEIVED' || event.event_code === 'SHIPPED'
              ? `${event.city_locality}, ${event.state_province}, ${event.country_code}`
              : `Votre colis est arrivé à ${event.city_locality}, ${event.state_province}, ${event.country_code}.`,
        status: true,
        type: -1,
        date: event.occurred_at,
        country: event.country_code
      })),
      event: data.events.map((event: any) => ({
        date: event.occurred_at,
        label:
          event.event_code === 'DELIVERED'
            ? 'Votre colis a été livré.'
            : event.event_code === 'RECEIVED' || event.event_code === 'SHIPPED'
              ? `${event.city_locality}, ${event.state_province}, ${event.country_code}`
              : data.status_description,
        code: event.event_code
      }))
    };
  } catch (error) {
    console.error('Erreur lors de la récupération des données de suivi:', error.message);
  }
});
</script>

<template>
  <div class="flex flex-col gap-6 p-6">
    <!-- Section Informations de commande -->
    <div class="flex gap-4 text-lg items-center sm:text-lg">
      <Package2 />
      N° de suivi: <span class="font-bold">{{ orderData.idShip }}</span>
    </div>

    <!-- Section Événements de livraison -->
    <div v-if="orderData.event.length > 0" class="">
      <h3 class="text-xl font-semibold flex gap-4"><Truck />Événements de livraison</h3>
      <time class="mb-1 text-sm font-normal leading-none text-gray-400 dark:text-gray-500 flex gap-2 items-center">
        <Calendar class="w-4"/>{{ formatDate(orderData.event[orderData.event.length - 1].date) }}
      </time>
      <p class="text-base font-normal text-gray-500 dark:text-gray-400 flex gap-2 items-center">
        <MapPin class="w-4"/>{{ orderData.event[orderData.event.length - 1].label }}
      </p>
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
            <time class="mb-1 text-sm font-normal leading-none text-gray-400 dark:text-gray-500 flex gap-2 items-center">
              <Calendar class="w-4"/> {{ formatDate(item.date) }}
            </time>
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
              {{ item.shortLabel }}
            </h3>
            <p class="mb-2 text-base font-normal text-gray-500 dark:text-gray-400 flex gap-2 items-center">
              <MapPin class="w-4"/> {{ item.longLabel }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
