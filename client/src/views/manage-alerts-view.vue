<script setup lang="ts">
import { ArrowLeftIcon } from 'lucide-vue-next';
import { useForm } from '@/composables/form';
import { z } from 'zod';
import Button from '@/components/ui/button/Button.vue';
import Checkbox from '@/components/ui/checkbox/Checkbox.vue';
import Label from '@/components/ui/label/Label.vue';
import { useUserStore } from '@/stores/user';

const userStore = useUserStore();

const alertSchema = z.object({
  newProductAlert: z.boolean(),
  restockAlert: z.boolean(),
  priceChangeAlert: z.boolean(),
  newsletterAlert: z.boolean()
});

const { handleSubmit, defineField, isDirty } = useForm({
  validationSchema: alertSchema,
  defaultValues: {
    newProductAlert: false,
    restockAlert: false,
    priceChangeAlert: false,
    newsletterAlert: false
  }
});

const [newProductAlert, newProductAlertField] = defineField('newProductAlert');
const [restockAlert, restockAlertField] = defineField('restockAlert');
const [priceChangeAlert, priceChangeAlertField] = defineField('priceChangeAlert');
const [newsletterAlert, newsletterAlertField] = defineField('newsletterAlert');

const submitHandler = handleSubmit(async (data) => {
  try {
    // Ici, vous devrez implémenter la logique pour sauvegarder les préférences d'alerte de l'utilisateur
    console.log('Alertes mises à jour:', data);
    // Exemple : await userStore.updateAlertPreferences(data);
  } catch (error) {
    console.error('Erreur lors de la mise à jour des alertes:', error);
  }
});
</script>

<template>
  <main class="grow lg:container">
    <header class="flex items-center w-full relative align mb-6">
      <div class="block lg:hidden">
        <RouterLink :to="{ name: 'account' }"><ArrowLeftIcon /></RouterLink>
      </div>
      <h1 class="font-bold text-lg text-center w-full sm:text-3xl">Gérer vos alertes</h1>
    </header>
    <form @submit.prevent="submitHandler" class="px-2 mt-6 space-y-6">
      <div class="space-y-2">
        <div class="flex items-center space-x-2">
          <Checkbox
            id="newProductAlert"
            v-model="newProductAlert"
            @update:checked="newProductAlertField.onInput"
          />
          <Label for="newProductAlert">Nouveaux produits d'une catégorie</Label>
        </div>
        <div class="flex items-center space-x-2">
          <Checkbox
            id="restockAlert"
            v-model="restockAlert"
            @update:checked="restockAlertField.onInput"
          />
          <Label for="restockAlert">Réapprovisionnement d'un produit</Label>
        </div>
        <div class="flex items-center space-x-2">
          <Checkbox
            id="priceChangeAlert"
            v-model="priceChangeAlert"
            @update:checked="priceChangeAlertField.onInput"
          />
          <Label for="priceChangeAlert">Changements de prix</Label>
        </div>
        <div class="flex items-center space-x-2">
          <Checkbox
            id="newsletterAlert"
            v-model="newsletterAlert"
            @update:checked="newsletterAlertField.onInput"
          />
          <Label for="newsletterAlert">Inscription à la newsletter</Label>
        </div>
      </div>
      <Button type="submit" :disabled="!isDirty">Enregistrer les préférences</Button>
    </form>
  </main>
</template>
