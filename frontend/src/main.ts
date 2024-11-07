import './assets/main.css';
import 'vue-toastification/dist/index.css';
import Toast from 'vue-toastification';

import { createApp } from 'vue';
import { createPinia } from 'pinia';

import App from './App.vue';
import router from '@/router/Router';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

const app = createApp(App);

app.use(createPinia());
app.use(router);
app.use(Toast);

app.component('font-awesome-icon', FontAwesomeIcon);

app.mount('#app');
