<script setup>
import { ref, computed, onMounted } from 'vue';

const orders = ref([]);
const itemDetails = ref({});
const searchQuery = ref('');
const selectedStatus = ref('');
const selectedDate = ref('');
const selectedStartDate = ref('');
const selectedEndDate = ref('');

const isMobile = ref(window.innerWidth < 640);

function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

function statusClass(status) {
  switch (status) {
    case 'Delivered':
      return 'text-green-600';
    case 'Pending':
      return 'text-orange-600';
    case 'Cancelled':
      return 'text-red-600';
    default:
      return 'text-gray-600';
  }
}

const filteredOrders = computed(() => {
  return orders.value.filter(order => {
    const matchesQuery = searchQuery.value ? order.id.includes(searchQuery.value) : true;
    const matchesStatus = selectedStatus.value ? order.status.label === selectedStatus.value : true;
    const matchesDate = selectedDate.value ? new Date(order.createdAt).toISOString().split('T')[0] === selectedDate.value : true;
    const matchesStartDate = selectedStartDate.value ? new Date(order.createdAt) >= new Date(selectedStartDate.value) : true;
    const matchesEndDate = selectedEndDate.value ? new Date(order.createdAt) <= new Date(selectedEndDate.value) : true;
    return matchesQuery && matchesStatus && matchesDate && matchesStartDate && matchesEndDate;
  });
});

async function fetchOrders() {
  try {
    const response = await fetch('http://localhost:3000/orders'); // URL de votre API
    if (!response.ok) throw new Error('Network response was not ok');
    const data = await response.json();
    orders.value = data;
    await fetchProductDetails(data);
  } catch (error) {
    console.error('Error fetching orders:', error);
  }
}

async function fetchProductDetails(orders) {
  const productIds = new Set();
  orders.forEach(order => {
    order.items.forEach(item => {
      if (item._id) productIds.add(item._id);
    });
  });

  for (const productId of productIds) {
    try {
      const response = await fetch(`http://localhost:3000/products/${productId}`);
      if (!response.ok) throw new Error('Network response was not ok');
      const product = await response.json();
      itemDetails.value = { ...itemDetails.value, [product.id]: product };
    } catch (error) {
      console.error('Error fetching product details for ID', productId, ':', error);
    }
  }
}

onMounted(fetchOrders);

window.addEventListener('resize', () => {
  isMobile.value = window.innerWidth < 640;
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
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Nº commande : 78524263"
          class="w-full p-2 border border-gray-300 rounded mb-4"
        />
        <label for="status" class="block text-gray-700 font-semibold mb-2">
          Statut de la commande
          <select
            id="status"
            v-model="selectedStatus"
            class="w-full p-2 border border-gray-300 rounded mb-4"
          >
            <option value="">Tous</option>
            <option value="Delivered">Livré</option>
            <option value="Pending">En cours</option>
          </select>
        </label>
        <label for="date" class="block text-gray-700 font-semibold mb-2">
          Date de commande
          <input
            type="date"
            id="date"
            v-model="selectedDate"
            class="w-full p-2 border border-gray-300 rounded mb-4"
          />
        </label>
        <div class="flex gap-4">
          <label for="startDate" class="block text-gray-700 font-semibold mb-2">
            Date de début
            <input
              type="date"
              id="startDate"
              v-model="selectedStartDate"
              class="w-full p-2 border border-gray-300 rounded mb-4"
            />
          </label>
          <label for="endDate" class="block text-gray-700 font-semibold mb-2">
            Date de fin
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
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Nº commande : 78524263"
          class="w-full p-2 border border-gray-300 rounded mb-4"
        />
        <label for="status" class="block font-semibold mb-2 text-gray-700">
          Statut de la commande
          <select
            id="status"
            v-model="selectedStatus"
            class="w-full p-2 border border-gray-300 rounded mb-4 bg-white"
          >
            <option value="">Tous</option>
            <option value="Delivered">Livré</option>
            <option value="Pending">En cours</option>
          </select>
        </label>
        <label for="date" class="block text-gray-700 font-semibold mb-2">
          Date de commande
          <input
            type="date"
            id="date"
            v-model="selectedDate"
            class="w-full p-2 border border-gray-300 rounded mb-4"
          />
        </label>
        <div class="flex gap-4">
          <label for="startDate" class="block text-gray-700 font-semibold mb-2">
            Date de début
            <input
              type="date"
              id="startDate"
              v-model="selectedStartDate"
              class="w-full p-2 border border-gray-300 rounded mb-4"
            />
          </label>
          <label for="endDate" class="block text-gray-700 font-semibold mb-2">
            Date de fin
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
      <div v-for="order in filteredOrders" :key="order.id" class="rounded-lg p-5 shadow-lg flex flex-col gap-4 mb-4 bg-white w-full sm:w-full">
        <div :class="order.status.label ? 'flex justify-between items-center' : 'flex flex-col lg:flex-row sm:justify-between lg:items-center'">
          <h1 class="font-bold text-lg">
            Commande du {{ formatDate(order.createdAt) }}
          </h1>
          <span :class="statusClass(order.status.label)">
            {{ order.status.label }}
          </span>
        </div>

        <div :class="order.items.length < 3 ? 'flex justify-start gap-4' : 'flex justify-between sm:justify-start sm:gap-4 w-full'">
          <div v-for="(item, index) in order.items.slice(0, 3)" :key="item._id" class="relative w-24 h-24">
            <img class="min-w-24 h-full bg-slate-400" :src="itemDetails[item._id]?.image" alt="" />
            <div v-if="index === 2 && order.items.length > 3" class="extra-items-count w-full h-full flex justify-center items-center font-bold text-2xl top-0 right-0 text-white absolute bg-black bg-opacity-55">
              +{{ order.items.length - 3 }}
            </div>
          </div>
        </div>
        <div class="border-b border-t border-gray-200 py-2" v-if="!order.status.label === 'Delivered'">
          <router-link :to="{ name: 'tracking', params: { id: order.id } }" class="w-1/2 text-tea-600">Suivre le colis</router-link>
        </div>
        <div>
          <p>
            N° de commande: <span class="font-bold">{{ order.id }}</span>
          </p>
          <p>
            Date d'expédition:
            <span class="font-bold">{{ formatDate(order.shippingDate) }}</span>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
