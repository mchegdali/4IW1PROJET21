<template>
  <section class="flex-1 ml-80">
    <h1 class="text-2xl font-bold text-green-900 mb-10 p-5">Utilisateurs</h1>
    <UtilisateurTable
      :clients="clients"
      :selected-client-ids="selectedClientIds"
      @sort="handleSort"
      @select-all="handleSelectAll"
      @update-selection="handleUpdateSelection"
      @search="handleSearch"
      @view-client="handleViewClient"
    />
    <DialogUtilisateur
      v-if="isDialogOpen"
      :client="selectedClient"
      :modelValue="isDialogOpen"
      @update:modelValue="isDialogOpen = $event"
      @save="saveClient"
    />
    <div class="mt-4 flex items-center justify-center">
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
import UtilisateurTable from '../UtilisateurTable.vue';
import DialogUtilisateur from '../DialogUtilisateur.vue';
import { useUserStore } from '@/stores/user';

interface Client {
  _id: string;
  fullname: string;
  email: string;
  city: string;
  role: string;
  addresses: Array<{ city: string }>;
}

export default defineComponent({
  name: 'Utilisateur',
  components: {
    UtilisateurTable,
    DialogUtilisateur
  },
  setup() {
    const clients = ref<Client[]>([]);
    const selectedClientIds = ref<string[]>([]);
    const selectedClient = ref<Client | null>(null);
    const isDialogOpen = ref(false);
    const allClientIds = ref<string[]>([]);
    const page = ref(1);
    const totalPages = ref(1);
    const sortField = ref('id');
    const sortOrder = ref<'asc' | 'desc'>('asc');
    const searchText = ref('');

    const fetchClients = async (page: number, sortField: string, sortOrder: 'asc' | 'desc', text: string = '') => {
      const userStore = useUserStore();
      await userStore.refreshAccessToken();
      const accessToken = userStore.accessToken;
      try {
        const searchParam = text.length >= 3 ? `&text=${text}` : '';
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/users?page=${page}&sortField=${sortField}&sortOrder=${sortOrder}${searchParam}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`
          }
        });
        const data = await response.json();
        clients.value = data.items.map((item: any) => ({
          _id: item._id,
          fullname: item.fullname,
          email: item.email,
          city: item.addresses[0]?.city || 'N/A',
          role: item.role,
          addresses: item.addresses
        }));
        totalPages.value = data.metadata.totalPages;
      } catch (error) {
        console.error('Error fetching clients:', error);
      }
    };

    const fetchClientDetails = async (clientId: string) => {
      const userStore = useUserStore();
      await userStore.refreshAccessToken();
      const accessToken = userStore.accessToken;
      try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/users/${clientId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`
          }
        });
        if (response.ok) {
          const client = await response.json();
          client.city = client.addresses.length > 0 ? client.addresses[0].city : 'N/A';
          selectedClient.value = client;
          isDialogOpen.value = true;
        } else {
          console.error('Failed to fetch client details');
        }
      } catch (error) {
        console.error('Error fetching client details:', error);
      }
    };

    const fetchAllClientIds = async () => {
      const userStore = useUserStore();
      await userStore.refreshAccessToken();
      const accessToken = userStore.accessToken;
      try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/users/ids`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`
          }
        });
        const data = await response.json();
        allClientIds.value = data.items.map((item: any) => item.id);
      } catch (error) {
        console.error('Error fetching client ids:', error);
      }
    };

    const nextPage = () => {
      if (page.value < totalPages.value) {
        page.value += 1;
        fetchClients(page.value, sortField.value, sortOrder.value, searchText.value);
      }
    };

    const previousPage = () => {
      if (page.value > 1) {
        page.value -= 1;
        fetchClients(page.value, sortField.value, sortOrder.value, searchText.value);
      }
    };

    const handleSort = (field: string) => {
      if (sortField.value === field) {
        sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc';
      } else {
        sortField.value = field;
        sortOrder.value = 'asc';
      }
      fetchClients(page.value, sortField.value, sortOrder.value, searchText.value);
    };

    const handleSelectAll = async (isChecked: boolean) => {
      if (isChecked) {
        await fetchAllClientIds();
        selectedClientIds.value = allClientIds.value;
      } else {
        selectedClientIds.value = [];
      }
    };

    const handleUpdateSelection = ({ clientId, isChecked }: { clientId: string, isChecked: boolean }) => {
      if (isChecked) {
        if (!selectedClientIds.value.includes(clientId)) {
          selectedClientIds.value.push(clientId);
        }
      } else {
        selectedClientIds.value = selectedClientIds.value.filter(id => id !== clientId);
      }
    };

    const handleSearch = (text: string) => {
      searchText.value = text;
      fetchClients(page.value, sortField.value, sortOrder.value, searchText.value);
    };

    const handleViewClient = (clientId: string) => {
      fetchClientDetails(clientId);
    };

    const saveClient = (client: Client) => {
      // Logique pour enregistrer le client modifié
      console.log('Saving client:', client);
    };

    onMounted(() => {
      fetchClients(page.value, sortField.value, sortOrder.value);
    });

    watch(selectedClientIds, (newVal) => {

    });

    return {
      clients,
      selectedClientIds,
      selectedClient,
      isDialogOpen,
      page,
      totalPages,
      nextPage,
      previousPage,
      handleSort,
      handleSelectAll,
      handleUpdateSelection,
      handleSearch,
      handleViewClient,
      saveClient
    };
  }
});
</script>

<style lang="scss" scoped></style>
