<!-- Menu.vue -->
<template>
    <aside class="fixed top-0 left-0 z-40 w-80 h-screen bg-gray-50 border-r-2" aria-label="Sidebar">
        <div class="h-full px-3 py-4 overflow-y-auto">
            <ul class="space-y-2 font-medium">
                <!-- Homepage -->
                <li>
                    <router-link :to="{ name: 'Home' }" class="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
                        <span class="ms-3 text-2xl">Dashboard Fanthésie</span>
                    </router-link>
                </li>
                <!-- Ventes -->
                <li>
                    <router-link :to="{ name: 'Ventes' }" class="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
                        <svg class="w-5 h-5" viewBox="0 0 22 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M6.29977 5H21L19 12H7.37671M20 16H8L6 3H3M9 20C9 20.5523 8.55228 21 8 21C7.44772 21 7 20.5523 7 20C7 19.4477 7.44772 19 8 19C8.55228 19 9 19.4477 9 20ZM20 20C20 20.5523 19.5523 21 19 21C18.4477 21 18 20.5523 18 20C18 19.4477 18.4477 19 19 19C19.5523 19 20 19.4477 20 20Z" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                        <span class="ms-3">Ventes</span>
                    </router-link>
                </li>
                <!-- Utilisateurs -->
                <li>
                    <router-link :to="{ name: 'Utilisateurs' }" class="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
                        <svg class="w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 22 21">
                            <path d="M4 21C4 17.4735 6.60771 14.5561 10 14.0709M19.8726 15.2038C19.8044 15.2079 19.7357 15.21 19.6667 15.21C18.6422 15.21 17.7077 14.7524 17 14C16.2923 14.7524 15.3578 15.2099 14.3333 15.2099C14.2643 15.2099 14.1956 15.2078 14.1274 15.2037C14.0442 15.5853 14 15.9855 14 16.3979C14 18.6121 15.2748 20.4725 17 21C18.7252 20.4725 20 18.6121 20 16.3979C20 15.9855 19.9558 15.5853 19.8726 15.2038ZM15 7C15 9.20914 13.2091 11 11 11C8.79086 11 7 9.20914 7 7C7 4.79086 8.79086 3 11 3C13.2091 3 15 4.79086 15 7Z" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                        <span class="ms-3">Utilisateurs</span>
                    </router-link>
                </li>
                <!-- Produits -->
                <li>
                    <router-link :to="{ name: 'Produits' }" class="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
                        <svg class="w-5 h-5" viewBox="0 0 512 512" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
                            <title>product</title>
                            <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                                <g id="icon" fill="#000000" transform="translate(64.000000, 34.346667)">
                                    <path d="M192,7.10542736e-15 L384,110.851252 L384,332.553755 L192,443.405007 L1.42108547e-14,332.553755 L1.42108547e-14,110.851252 L192,7.10542736e-15 Z M127.999,206.918 L128,357.189 L170.666667,381.824 L170.666667,231.552 L127.999,206.918 Z M42.6666667,157.653333 L42.6666667,307.920144 L85.333,332.555 L85.333,182.286 L42.6666667,157.653333 Z M275.991,97.759 L150.413,170.595 L192,194.605531 L317.866667,121.936377 L275.991,97.759 Z M192,49.267223 L66.1333333,121.936377 L107.795,145.989 L233.374,73.154 L192,49.267223 Z" id="Combined-Shape"></path>
                                </g>
                            </g>
                        </svg>
                        <span class="ms-3">Produits</span>
                    </router-link>
                </li>
                <!-- Finances -->
                <li>
                    <router-link :to="{ name: 'Finances' }" class="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
                        <svg fill="#000000" class="w-5 h-5" viewBox="0 0 32 32" id="icon" xmlns="http://www.w3.org/2000/svg">
                            <path d="M27,11a1,1,0,0,0,1-1V7a1,1,0,0,0-.66-.94l-11-4a1,1,0,0,0-.68,0l-11,4A1,1,0,0,0,4,7v3a1,1,0,0,0,1,1H6V24H4v2H28V24H26V11ZM6,7.7,16,4.06,26,7.7V9H6ZM18,24H14V11h4ZM8,11h4V24H8ZM24,24H20V11h4Z" transform="translate(0 0)"/></svg>
                        <span class="ms-3">Finances</span>
                    </router-link>
                </li>
                <!-- Clients -->
                <li>
                    <router-link :to="{ name: 'Clients' }" class="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
                        <svg class="w-5 h-5" viewBox="0 0 1024 1024"  version="1.1" xmlns="http://www.w3.org/2000/svg"><path d="M795.4 749.7c17.2-21.8 27.5-49.3 27.5-79.3 0-70.7-57.3-128-128-128s-128 57.3-128 128c0 29.9 10.3 57.5 27.5 79.3-70.6 36.5-118.9 110.2-118.9 195h73.1c0-80.7 65.6-146.3 146.3-146.3S841.2 864 841.2 944.7h73.1c0-84.7-48.4-158.4-118.9-195zM694.9 615.6c30.2 0 54.9 24.6 54.9 54.9 0 30.2-24.6 54.9-54.9 54.9-30.2 0-54.9-24.6-54.9-54.9 0-30.3 24.6-54.9 54.9-54.9z" fill="#0F1F3C" /><path d="M109.7 73.1v877.8h329.2v-73.2h-256V146.3h658.3V512h73.1V73.1z" fill="#0F1F3C" /><path d="M256 256h512v73.1H256zM256 402.3h365.7v73.1H256zM256 548.6h219.4v73.1H256z" fill="#0F1F3C" /></svg>
                        <span class="ms-3">Clients</span>
                    </router-link>
                </li>
                <!-- Tendances et Prévisions -->
                <li>
                    <router-link :to="{ name: 'Tendances' }" class="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
                        <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M7 14L9.29289 11.7071C9.68342 11.3166 10.3166 11.3166 10.7071 11.7071L12.2929 13.2929C12.6834 13.6834 13.3166 13.6834 13.7071 13.2929L17 10M17 10V12.5M17 10H14.5" stroke="#1C274C" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                            <path d="M22 12C22 16.714 22 19.0711 20.5355 20.5355C19.0711 22 16.714 22 12 22C7.28595 22 4.92893 22 3.46447 20.5355C2 19.0711 2 16.714 2 12C2 7.28595 2 4.92893 3.46447 3.46447C4.92893 2 7.28595 2 12 2C16.714 2 19.0711 2 20.5355 3.46447C21.5093 4.43821 21.8356 5.80655 21.9449 8" stroke="#1C274C" stroke-width="1.5" stroke-linecap="round"/>
                        </svg>
                        <span class="ms-3">Tendances et Prévisions</span>
                    </router-link>
                </li>
            </ul>
        </div>
    </aside>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
    name: 'Menu',
    data() {
        return {};
    },
});
</script>
