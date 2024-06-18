<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import ordersData from '@/api/order.json';
import { Input } from './ui/input';
import { Badge } from '@/components/ui/badge';

const orders = ref<Array<any>>(ordersData.orders);
const searchQuery = ref('');
const selectedStatus = ref('');
const selectedDate = ref('');
const selectedStartDate = ref('');
const selectedEndDate = ref('');
const isMobile = ref(false);

const checkScreenSize = () => {
  isMobile.value = window.innerWidth < 640;
};

onMounted(() => {
  checkScreenSize();
  window.addEventListener('resize', checkScreenSize);
});

onUnmounted(() => {
  window.removeEventListener('resize', checkScreenSize);
});

const filteredOrders = computed(() => {
  return orders.value.filter((order) => {
    const matchesSearchQuery = searchQuery.value
      ? order.orderNumber.toLowerCase().includes(searchQuery.value.toLowerCase())
      : true;
    const matchesStatus = selectedStatus.value
      ? selectedStatus.value === 'livré'
        ? order.deliveryStatus === true
        : order.deliveryStatus === false
      : true;
    const matchesDate = selectedDate.value ? order.orderDate === selectedDate.value : true;
    const matchesDateRange =
      selectedStartDate.value && selectedEndDate.value
        ? new Date(order.orderDate) >= new Date(selectedStartDate.value) &&
          new Date(order.orderDate) <= new Date(selectedEndDate.value)
        : true;
    return matchesSearchQuery && matchesStatus && matchesDate && matchesDateRange;
  });
});
</script>

<template>
  <div class="flex flex-col sm:flex-row sm:items-start sm:justify-center">
    <!-- Filtres -->
    <details
      v-if="isMobile"
      class="mb-4 w-full flex flex-col gap-4 sm:w-1/4 sm:mr-4 p-2 rounded-lg border border-tea-600"
    >
      <summary class="font-semibold text-gray-700 cursor-pointer">Filtrer</summary>
      <div class="mt-4 p-2">
        <Input
          v-model="searchQuery"
          type="text"
          placeholder="Nº commande : 78524263"
          class="w-full p-2 border border-gray-300 rounded mb-4"
        />
        <label for="status" class="block text-gray-700 font-semibold mb-2"
          >Statut de la commande
          <select
            id="status"
            v-model="selectedStatus"
            class="w-full p-2 border border-gray-300 rounded mb-4"
          >
            <option value="">Tous</option>
            <option value="livré">Livré</option>
            <option value="en cours">En cours</option>
          </select>
        </label>
        <label for="date" class="block text-gray-700 font-semibold mb-2"
          >Date de commande
          <input
            type="date"
            id="date"
            v-model="selectedDate"
            class="w-full p-2 border border-gray-300 rounded mb-4"
          />
        </label>
        <div class="flex gap-4">
          <label for="startDate" class="block text-gray-700 font-semibold mb-2"
            >Date de début
            <input
              type="date"
              id="startDate"
              v-model="selectedStartDate"
              class="w-full p-2 border border-gray-300 rounded mb-4"
            />
          </label>
          <label for="endDate" class="block text-gray-700 font-semibold mb-2"
            >Date de fin
            <input
              type="date"
              id="endDate"
              v-model="selectedEndDate"
              class="w-full p-2 border border-gray-300 rounded mb-4"
            />
          </label>
        </div>
      </div>
    </details>

    <div v-else class="shadow-lg mb-4 w-full flex flex-col gap-4 sm:w-1/4 sm:mr-4 rounded-lg">
      <div class="font-semibold text-white p-4 text-2xl bg-tea-600 rounded-t-lg">
        Filtrer les commandes
      </div>
      <div class="p-6">
        <Input
          v-model="searchQuery"
          type="text"
          placeholder="Nº commande : 78524263"
          class="w-full p-2 border border-gray-300 rounded mb-4"
        />
        <label for="status" class="block font-semibold mb-2 text-gray-700"
          >Statut de la commande
          <select
            id="status"
            v-model="selectedStatus"
            class="w-full p-2 border border-gray-300 rounded mb-4 bg-white"
          >
            <option value="">Tous</option>
            <option value="livré">Livré</option>
            <option value="en cours">En cours</option>
          </select>
        </label>
        <label for="date" class="block text-gray-700 font-semibold mb-2"
          >Date de commande
          <input
            type="date"
            id="date"
            v-model="selectedDate"
            class="w-full p-2 border border-gray-300 rounded mb-4"
          />
        </label>

        <div class="flex gap-4">
          <label for="startDate" class="block text-gray-700 font-semibold mb-2"
            >Date de début
            <input
              type="date"
              id="startDate"
              v-model="selectedStartDate"
              class="w-full p-2 border border-gray-300 rounded mb-4"
            />
          </label>
          <label for="endDate" class="block text-gray-700 font-semibold mb-2"
            >Date de fin
            <input
              type="date"
              id="endDate"
              v-model="selectedEndDate"
              class="w-full p-2 border border-gray-300 rounded mb-4"
            />
          </label>
        </div>
      </div>
    </div>

    <!-- Commandes -->
    <div class="flex flex-col items-center w-full sm:w-3/4">
      <RouterLink
        v-for="order in filteredOrders"
        :key="order.orderId"
        class="rounded-lg p-5 shadow-lg flex flex-col gap-4 mb-4 bg-white w-full sm:w-full"
        :to="{ name: 'order', params: { id: order.orderId } }"
      >
        <div
          :class="
            order.deliveryStatus
              ? 'flex justify-between items-center'
              : 'flex flex-col lg:flex-row sm:justify-between lg:items-center'
          "
        >
          <h1 class="font-bold text-lg">
            Commande du
            {{
              new Date(order.orderDate).toLocaleDateString('fr-FR', {
                day: 'numeric',
                month: 'short',
                year: 'numeric'
              })
            }}
          </h1>

          <Badge
            variant="outline"
            class="border-tea-600 text-tea-600"
            v-if="order.deliveryStatus === true"
            >Livré</Badge
          >

          <Badge variant="outline" class="border-tea-600 text-tea-600 w-fit" v-else
            >Livraison prévue le
            {{
              new Date(order.shippingDate).toLocaleDateString('fr-FR', {
                day: 'numeric',
                month: 'short',
                year: 'numeric'
              })
            }}</Badge
          >
        </div>

        <div
          :class="
            order.items.length < 3
              ? 'flex justify-start gap-4'
              : 'flex justify-between sm:justify-start sm:gap-4 w-full'
          "
        >
          <div
            v-for="(item, index) in order.items.slice(0, 3)"
            :key="item.id"
            class="relative w-24 h-24"
          >
            <img class="min-w-24 h-full bg-slate-400" :src="item.image" alt="" />
            <div
              v-if="index === 2 && order.items.length > 3"
              class="extra-items-count w-full h-full flex justify-center items-center font-bold text-2xl top-0 right-0 text-white absolute bg-black bg-opacity-55"
            >
              +{{ order.items.length - 3 }}
            </div>
          </div>
        </div>
        <div class="border-b border-t border-gray-200 py-2" v-if="order.deliveryStatus === false">
          <RouterLink
            :to="{ name: 'tracking', params: { id: order.orderId } }"
            class="w-1/2 text-tea-600"
          >
            Suivre le colis
          </RouterLink>
        </div>
        <div>
          <p>
            N° de commande: <span class="font-bold">{{ order.orderNumber }}</span>
          </p>
          <p>
            Date d'expédition:
            <span class="font-bold">{{
              new Date(order.shippingDate).toLocaleDateString('fr-FR', {
                day: 'numeric',
                month: 'short',
                year: 'numeric'
              })
            }}</span>
          </p>
        </div>
      </RouterLink>
    </div>
  </div>
</template>
