<script setup lang="ts">
import { type ProductCategory, type Product } from '@/api/products.api';
import { FilterIcon, XIcon } from 'lucide-vue-next';
import Label from '@/components/ui/label/Label.vue';
import config from '@/config';
import { computed, onBeforeMount, ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useDebounceFn } from '@vueuse/core';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import Button from '@/components/ui/button/Button.vue';
import {
  Pagination,
  PaginationEllipsis,
  PaginationList,
  PaginationListItem,
  PaginationNext,
  PaginationPrev
} from '@/components/ui/pagination';
import ProductCard from '@/components/products/product-card.vue';
import {
  NumberField,
  NumberFieldContent,
  NumberFieldDecrement,
  NumberFieldIncrement,
  NumberFieldInput
} from '@/components/ui/number-field';
import { useSearchStore } from '@/stores/search';

const router = useRouter();
const searchStore = useSearchStore();

const categories = ref<ProductCategory[]>([]);

const products = ref<Product[]>([]);
const metadata = ref({
  total: 0,
  totalPages: 0
});
const isFilterMenuOpen = ref(false);

const page = computed(() => {
  const page = Number.parseInt(router.currentRoute.value.query.page as string);
  return !Number.isNaN(page) ? page : 1;
});

const pageSize = computed(() => {
  const pageSize = Number.parseInt(router.currentRoute.value.query.pageSize as string);

  return !Number.isNaN(pageSize) ? pageSize : 10;
});

const firstElementIndexInCurrentPage = computed(() => {
  if (products.value.length === 0) return 0;
  return Math.ceil((page.value - 1) * pageSize.value) + 1;
});

const currentPageCount = computed(() => {
  if (products.value.length === 0) return 0;
  return page.value < metadata.value.totalPages
    ? pageSize.value
    : metadata.value.total % pageSize.value;
});

const minPrice = computed(() => {
  return router.currentRoute.value.query.minPrice
    ? parseFloat(router.currentRoute.value.query.minPrice as string)
    : undefined;
});

const maxPrice = computed(() => {
  return router.currentRoute.value.query.maxPrice
    ? parseFloat(router.currentRoute.value.query.maxPrice as string)
    : undefined;
});

function resetSearch() {
  searchStore.resetQuery();
  router.push({
    name: 'products'
  });
}

function onUpdateCategory(value: string) {
  router.push({
    name: 'products',
    query: {
      ...router.currentRoute.value.query,
      category: value === 'all' ? undefined : value,
      page: 1
    }
  });
}

const debouncedUpdateMinPrice = useDebounceFn((value: number) => {
  const valueString = value === 0 || Number.isNaN(value) ? '0' : value.toString();

  router.push({
    name: 'products',
    query: {
      ...router.currentRoute.value.query,
      minPrice: valueString
    }
  });
}, 300);

const debouncedUpdateMaxPrice = useDebounceFn((value: number) => {
  router.push({
    name: 'products',
    query: {
      ...router.currentRoute.value.query,
      maxPrice: value === 0 || Number.isNaN(value) ? undefined : value.toString()
    }
  });
}, 300);

function onUpdateMinPrice(value: number) {
  debouncedUpdateMinPrice(value);
}

function onUpdateMaxPrice(value: number) {
  debouncedUpdateMaxPrice(value);
}

function onUpdatePage(page: number) {
  router.push({
    name: 'products',
    query: {
      ...router.currentRoute.value.query,
      page
    }
  });
}

function handleOpenFilterMenu() {
  isFilterMenuOpen.value = !isFilterMenuOpen.value;
}

watch(
  () => router.currentRoute.value.query,
  async (query) => {
    let url: URL;

    if (query.category && query.category !== 'all') {
      url = new URL(`categories/${query.category}/products`, config.apiBaseUrl);
    } else {
      url = new URL('/products', config.apiBaseUrl);
    }

    if (typeof query.text === 'string') {
      url.searchParams.set('text', query.text);
    }

    if (query.page) {
      url.searchParams.set('page', query.page.toString());
    }

    if (query.minPrice) {
      url.searchParams.set('minPrice', query.minPrice.toString());
    }

    if (query.maxPrice) {
      url.searchParams.set('maxPrice', query.maxPrice.toString());
    }

    const response = await fetch(url);
    if (!response.ok) {
      products.value = [];
    }

    const data: {
      metadata: {
        total: number;
        page: number;
        totalPages: number;
        pageSize: number;
      };
      data: Product[];
    } = await response.json();
    products.value = data.data;
    metadata.value = data.metadata;
  },
  {
    immediate: true
  }
);

onBeforeMount(async () => {
  const response = await fetch(`${config.apiBaseUrl}/categories`);
  if (!response.ok) {
    return;
  }

  const data: ProductCategory[] = await response.json();
  categories.value = data;
});

searchStore.$subscribe((mutation, state) => {
  router.push({
    name: 'products',
    query: {
      ...router.currentRoute.value.query,
      text: typeof state.text === 'string' && state.text.length > 0 ? state.text : undefined
    }
  });
});
</script>

<template>
  <main class="grow">
    <div
      class="border-b border-gray-200 h-fit py-2 px-4 hidden lg:flex lg:items-center lg:sticky lg:top-0 lg:z-10 bg-background">
      <p>
        {{ firstElementIndexInCurrentPage }} - {{ currentPageCount }} sur {{ metadata.total }}
        <template v-if="searchStore.isSearching">
          pour
          <span class="font-bold text-primary">"{{ searchStore.text }}"</span>
        </template>
        <template v-if="router.currentRoute.value.query.category">
          dans la catégorie
          <span class="font-bold text-primary">{{
            categories.find((c) => c.slug === router.currentRoute.value.query.category)?.name
          }}</span>
        </template>
      </p>
    </div>
    <div class="flex flex-col lg:flex-row gap-4 w-full">
      <aside class="w-full lg:block lg:w-2/12 border border-gray-200 p-2 space-y-2"
        :class="{ hidden: !isFilterMenuOpen }">
        <header class="flex justify-between items-center pt-2">
          <h2 class="text-xl lg:text-lg font-black">Filtrer</h2>
          <Button variant="outline" @click="handleOpenFilterMenu" class="w-fit flex items-center gap-2 lg:hidden">
            <template v-if="!isFilterMenuOpen">
              <FilterIcon class="w-4 h-4" />Filtrer
            </template>
            <template v-else>
              <XIcon class="w-4 h-4" /> Fermer
            </template>
          </Button>
        </header>
        <fieldset>
          <Label for="category">Catégorie</Label>
          <Select v-if="!Array.isArray(router.currentRoute.value.query.category)" id="category" default-value="all"
            :model-value="router.currentRoute.value.query.category?.toString()" @update:model-value="onUpdateCategory">
            <SelectTrigger>
              <SelectValue placeholder="Toutes" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toutes</SelectItem>
              <SelectItem v-for="category in categories" :key="category.slug" :value="category.slug">
                {{ category.name }}
              </SelectItem>
            </SelectContent>
          </Select>
        </fieldset>
        <fieldset>
          <NumberField id="minPrice" :min="0" :default-value="0" :step="1" :model-value="minPrice"
            @update:model-value="onUpdateMinPrice" :format-options="{
              style: 'currency',
              currency: 'EUR',
              currencyDisplay: 'symbol',
              currencySign: 'accounting'
            }">
            <Label for="minPrice">Prix minimum</Label>
            <NumberFieldContent>
              <NumberFieldDecrement />
              <NumberFieldInput />
              <NumberFieldIncrement />
            </NumberFieldContent>
          </NumberField>
        </fieldset>
        <fieldset>
          <NumberField id="maxPrice" :min="0" :default-value="0" :step="1" :model-value="maxPrice || 0"
            @update:model-value="onUpdateMaxPrice" :format-options="{
              style: 'currency',
              currency: 'EUR',
              currencyDisplay: 'symbol',
              currencySign: 'accounting',
            }">
            <Label for="maxPrice">Prix maximum</Label>
            <NumberFieldContent>
              <NumberFieldDecrement />
              <NumberFieldInput />
              <NumberFieldIncrement />
            </NumberFieldContent>
          </NumberField>
        </fieldset>
        <Button variant="outline" @click="resetSearch" class="w-fit">Réinitialiser les filtres</Button>
      </aside>
      <div class="w-full lg:w-10/12 p-2" :class="{ hidden: isFilterMenuOpen }">
        <header class="w-full flex justify-between items-center pt-2">
          <h1 class="text-xl lg:text-2xl font-black">Résultats</h1>
          <Button variant="outline" @click="handleOpenFilterMenu" class="w-fit flex items-center gap-2 lg:hidden">
            <template v-if="!isFilterMenuOpen">
              <FilterIcon class="w-4 h-4" />Filtrer
            </template>
            <template v-else>
              <XIcon class="w-4 h-4" /> Fermer
            </template>
          </Button>
        </header>
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 p-2">
          <ProductCard v-for="product in products" :key="product._id" :product="product" class="col-span-1" />
        </div>
        <div class="col-span-12 flex justify-center py-2 w-full">
          <Pagination v-slot="{ page }" :total="metadata.total" :sibling-count="1" show-edges :default-page="1"
            :page="page" :items-per-page="pageSize" @update:page="onUpdatePage">
            <PaginationList v-slot="{ items }" class="flex items-center gap-1">
              <PaginationPrev />
              <template v-for="(item, index) in items">
                <PaginationListItem v-if="item.type === 'page'" :key="index" :value="item.value" as-child>
                  <Button class="w-10 h-10 p-0" :variant="item.value === page ? 'default' : 'outline'">
                    {{ item.value }}
                  </Button>
                </PaginationListItem>
                <PaginationEllipsis v-else :key="item.type" :index="index" />
              </template>
              <PaginationNext />
            </PaginationList>
          </Pagination>
        </div>
      </div>
    </div>
  </main>
</template>
