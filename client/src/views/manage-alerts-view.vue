<script setup lang="ts">
import { ArrowLeftIcon } from 'lucide-vue-next';
import { useForm } from '@/composables/form';
import { z } from 'zod';
import Button from '@/components/ui/button/Button.vue';
import Checkbox from '@/components/ui/checkbox/Checkbox.vue';
import Label from '@/components/ui/label/Label.vue';
import { useUserStore } from '@/stores/user';
import { computed, onBeforeMount, reactive, ref } from 'vue';
import useAuthFetch from '@/composables/use-auth-fetch';

const userStore = useUserStore();

const alertSchema = z.object({
  newProductAlert: z.boolean(),
  restockAlert: z.boolean(),
  priceChangeAlert: z.boolean(),
  newsletterAlert: z.boolean()
});

const defaultValues = ref({
  newProductAlert: !!userStore.user?.newProductAlert,
  restockAlert: !!userStore.user?.restockAlert,
  priceChangeAlert: !!userStore.user?.priceChangeAlert,
  newsletterAlert: !!userStore.user?.newsletterAlert
});

const { handleSubmit, defineField, isDirty } = useForm({
  validationSchema: alertSchema,
  defaultValues
});

const [newProductAlert, newProductAlertField] = defineField('newProductAlert');
const [restockAlert, restockAlertField] = defineField('restockAlert');
const [priceChangeAlert, priceChangeAlertField] = defineField('priceChangeAlert');
const [newsletterAlert, newsletterAlertField] = defineField('newsletterAlert');

const submitHandler = handleSubmit(async (data) => {
  try {
    // Ici, vous devrez implémenter la logique pour sauvegarder les préférences d'alerte de l'utilisateur
    await userStore.updateAlertPreferences(data);
    // Exemple : await userStore.updateAlertPreferences(data);
  } catch (error) {
    console.error('Erreur lors de la mise à jour des alertes:', error);
  }
});


onBeforeMount(async () => {
  const { data } = await useAuthFetch(`/users/${userStore.user?.id}/alerts`).json<{ newProductAlert: boolean, restockAlert: boolean, priceChangeAlert: boolean, newsletterAlert: boolean }>();
  if (data.value && userStore.user) {
    defaultValues.value = data.value
  }
})

userStore.$subscribe((mutation, state) => {

});
</script>

<template>
  <main class="grow lg:container">
    <header class="flex items-center w-full relative align mb-6">
      <div class="block lg:hidden">
        <RouterLink :to="{ name: 'account' }">
          <ArrowLeftIcon />
        </RouterLink>
      </div>
      <h1 class="font-bold text-lg text-center w-full sm:text-3xl">Gérer vos alertes</h1>
    </header>
    <form @submit.prevent="submitHandler" class="px-2 mt-6 space-y-6">
      <div class="space-y-2">
        <div class="flex items-center space-x-2">
          <Checkbox id="newProductAlert" :default-checked="newProductAlert"
            @update:checked="newProductAlertField.onInput" />
          <Label for="newProductAlert">Nouveaux produits d'une catégorie</Label>
        </div>
        <div class="flex items-center space-x-2">
          <Checkbox id="restockAlert" :default-checked="restockAlert" @update:checked="restockAlertField.onInput" />
          <Label for="restockAlert">Réapprovisionnement d'un produit</Label>
        </div>
        <div class="flex items-center space-x-2">
          <Checkbox id="priceChangeAlert" :default-checked="priceChangeAlert"
            @update:checked="priceChangeAlertField.onInput" />
          <Label for="priceChangeAlert">Changements de prix</Label>
        </div>
        <div class="flex items-center space-x-2">
          <Checkbox id="newsletterAlert" :default-checked="newsletterAlert"
            @update:checked="newsletterAlertField.onInput" />
          <Label for="newsletterAlert">Inscription à la newsletter</Label>
        </div>
      </div>
      <Button type="submit" :disabled="!isDirty">Enregistrer les préférences</Button>
    </form>
  </main>
</template>
