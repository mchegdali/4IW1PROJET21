<script setup lang="ts">
import { useSearchStore } from '@/stores/search';
import { Search } from 'lucide-vue-next';
import Input from '@/components/ui/input/Input.vue';
import { useForm } from '@/composables/form';
import { z } from 'zod';
import { useRouter } from 'vue-router';
import { useDebounceFn } from '@vueuse/core';

const searchSchema = z.object({
  text: z.string().optional()
});

const searchStore = useSearchStore();
const router = useRouter();

const { handleSubmit, defineField } = useForm({
  validationSchema: searchSchema,
  defaultValues: { text: searchStore.text }
});

const [, textField] = defineField('text');

const submitHandler = handleSubmit((data) => {
  const text = data.text && data.text.length > 0 ? data.text : undefined;
  router.push({
    name: 'products',
    query: { text, page: 1, pageSize: 10 }
  });
});

const handleInput = useDebounceFn((event: InputEvent) => {
  const target = event.target as HTMLInputElement;
  textField.onInput(event);

  searchStore.text = target.value;
}, 150);
</script>

<template>
  <form class="relative w-full" @submit.prevent="submitHandler">
    <Input
      id="text"
      type="search"
      placeholder="Rechercher votre thé sur Fanthesie"
      class="pl-10"
      v-model="searchStore.text"
      @input="handleInput"
    />
    <span class="absolute start-0 inset-y-0 flex items-center justify-center px-2">
      <Search class="size-6 text-muted-foreground" />
    </span>
  </form>
</template>
