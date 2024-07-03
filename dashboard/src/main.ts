import { createApp } from 'vue'
import App from './App.vue'
import './assets/tailwind.css'
import router from './router';
import VueApexCharts from 'vue3-apexcharts';


const app = createApp(App);

app.use(VueApexCharts);
app.use(router);
app.mount('#app');
