<template>
  <section class="flex-1 ml-80">
    <h1 class="text-2xl font-bold text-green-900 mb-10 p-5">Commandes</h1>
    <OrderTable :orders="orders" @sort="handleSort" />
    
    <div class="mt-4 flex items-center justify-center mb-10">
      <button
        @click="previousPage"
        :disabled="page === 1"
        class="px-4 py-2 bg-gray-200 rounded-l disabled:opacity-50"
      >
        Précédent
      </button>
      <span class="px-4 py-2">{{ page }} / {{ totalPages }}</span>
      <button
        @click="nextPage"
        :disabled="page === totalPages"
        class="px-4 py-2 bg-gray-200 rounded-r disabled:opacity-50"
      >
        Suivant
      </button>
    </div>
  </section>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, watch } from 'vue';
import OrderTable from '../OrderTable.vue';
import { useUserStore } from '@/stores/user';

interface Order {
  _id: string;
  customerName: string;
  customerEmail: string;
  createdAt: string;
  status: string;
  shippingAddress: string;
  items: string;
  totalPrice: string;
}

export default defineComponent({
  name: 'Commandes',
  components: {
    OrderTable,
  },
  setup() {
    const orders = ref<Order[]>([]);
    const page = ref(1);
    const totalPages = ref(1);
    const sortField = ref('id');
    const sortOrder = ref<'asc' | 'desc'>('asc');
    const searchText = ref('');

    const fetchOrders = async (page: number, sortField: string, sortOrder: 'asc' | 'desc', text: string = '') => {
      const userStore = useUserStore();
      await userStore.refreshAccessToken();
      const accessToken = userStore.accessToken;
      
      try {
        const searchParam = text.length >= 3 ? `&text=${text}` : '';
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/orders?page=${page}&sortField=${sortField}&sortOrder=${sortOrder}${searchParam}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`
          }
        });
        const data = await response.json();
        orders.value = data.items.map((item: any) => ({
          _id: item._id,
          customerName: item.user.fullname,
          customerEmail: item.user.email,
          createdAt: item.createdAt,
          status: item.status.label,
          shippingAddress: item.shipping 
            ? `${item.shipping.street ?? 'N/A'}, ${item.shipping.city ?? 'N/A'}, ${item.shipping.zipCode ?? 'N/A'}` 
            : 'N/A',
          items: item.items.map((orderItem: any) => orderItem.name).join(', '),
          totalPrice: item.items.reduce((total: number, orderItem: any) => total + parseFloat(orderItem.price.$numberDecimal), 0).toFixed(2)
        }));
        totalPages.value = data.metadata.totalPages;
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
    };

    const nextPage = () => {
      if (page.value < totalPages.value) {
        page.value += 1;
        fetchOrders(page.value, sortField.value, sortOrder.value, searchText.value);
      }
    };

    const previousPage = () => {
      if (page.value > 1) {
        page.value -= 1;
        fetchOrders(page.value, sortField.value, sortOrder.value, searchText.value);
      }
    };

    const handleSort = (field: string) => {
      if (sortField.value === field) {
        sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc';
      } else {
        sortField.value = field;
        sortOrder.value = 'asc';
      }
      fetchOrders(page.value, sortField.value, sortOrder.value, searchText.value);
    };

    onMounted(() => {
      fetchOrders(page.value, sortField.value, sortOrder.value);
    });

    return {
      orders,
      page,
      totalPages,
      nextPage,
      previousPage,
      handleSort,
    };
  }
});
</script>

<style lang="scss" scoped></style>
