<template>
    <div
      class="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50"
      @click.self="close"
    >
      <div class="bg-white rounded-lg shadow-lg w-full max-w-md mx-4 p-6 space-y-4">
        <div class="text-lg font-semibold border-b pb-3">Demamde de confirmation</div>
        <div class="text-gray-700">
          <p>{{ message }}</p>
          <p v-if="isLoading" class="text-yellow-600">Suppression en cours...</p>
          <p v-if="errorMessage" class="text-red-500">{{ errorMessage }}</p>
        </div>
        <div class="flex justify-end space-x-4 mt-4">
          <button
            @click="close"
            :disabled="isLoading"
            class="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded"
          >
            Annuler
          </button>
          <button
            @click="confirm"
            :disabled="isLoading"
            class="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded"
          >
            Confirmer
          </button>
        </div>
      </div>
    </div>
  </template>
  
  <script lang="ts">
  import { defineComponent, ref } from 'vue';
  
  export default defineComponent({
    props: {
      show: {
        type: Boolean,
        required: true
      },
      message: {
        type: String,
        default: 'Êtes-vous sûr de vouloir supprimer cet élément ?'
      }
    },
    emits: ['close', 'confirm'],
    setup(props, { emit }) {
      const isLoading = ref(false);
      const errorMessage = ref<string | null>(null);
  
      const close = () => {
        emit('close');
      };
  
      const confirm = async () => {
        isLoading.value = true;
        errorMessage.value = null;
  
        try {
          await emit('confirm');
        } catch (error) {
          errorMessage.value = 'Échec de la suppression.';
        } finally {
          isLoading.value = false;
        }
      };
  
      return {
        isLoading,
        errorMessage,
        close,
        confirm
      };
    }
  });
  </script>