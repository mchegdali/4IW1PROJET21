<template>
  <div class="container mx-auto mb-16">
    <div class="flex justify-between items-center w-full bg-gray-100 p-3 border-t border-l border-r border-gray-300">
      <h2 class="text-xl font-bold">Liste des commandes</h2>
      <div class="flex items-center ml-auto space-x-2">
      </div>
    </div>

    <table class="min-w-full bg-white border border-gray-300">
      <thead class="bg-gray-100">
        <tr class="h-16">
          <th class="py-2 px-4 w-1/6">
            ID
          </th>
          <th class="py-2 px-4 w-1/6">
            Nom client
          </th>
          <th class="py-2 px-4 w-1/6">
            Email
          </th>
          <th class="py-2 px-4 w-1/6">
            CreatedAt
          </th>
          <th class="py-2 px-4 w-1/6">
            Status
          </th>
          <th class="py-2 px-4 w-1/6">
            Prix total
          </th>
          <th class="py-2 px-4">Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="order in orders" :key="order._id" class="border-t hover:bg-gray-50">
          <td class="py-2 px-4 text-center w-1/6">{{ order._id }}</td>
          <td class="py-2 px-4 text-center w-1/6">{{ order.customerName }}</td>
          <td class="py-2 px-4 text-center w-1/6">{{ order.customerEmail }}</td>
          <td class="py-2 px-4 text-center w-1/6">{{ formatDate(order.createdAt) }}</td>
          <td class="py-2 px-4 text-center w-1/6">{{ order.status }}</td>
          <td class="py-2 px-4 text-center w-1/6">{{ order.totalPrice }} €</td>
          <td class="py-2 px-4 text-center w-1/6">
            <button
              class="mr-2 text-black rounded-lg text-sm px-5 py-2 bg-white border border-gray-300 transition-colors duration-300 hover:bg-gray-500 hover:text-white text-center mb-2"
            >
              Voir
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue';

interface Order {
  _id: string;
  customerName: string;
  customerEmail: string;
  createdAt: string;
  status: string;
  totalPrice: string;
}

export default defineComponent({
  name: 'OrderTable',
  components: {
  },
  props: {
    orders: {
      type: Array as () => Order[],
      required: true
    }
  },
  setup(props, { emit }) {

    const formatDate = (date: string) => {
      return new Date(date).toLocaleString();
    };

    return {
      formatDate,
    };
  }
});
</script>

<style scoped>
.container {
  max-width: 1500px;
}
.cursor-pointer {
  cursor: pointer;
}
.readonly-input {
  pointer-events: none;
  caret-color: transparent;
}
</style>