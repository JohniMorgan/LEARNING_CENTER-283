import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import Router from './routes/router'
createApp(App).use(createPinia()).use(Router).mount('#app')
