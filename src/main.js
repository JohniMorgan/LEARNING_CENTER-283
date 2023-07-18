import { createApp } from 'vue'
import { createPinia } from 'pinia'
import piniaPluginPersistedState from "pinia-plugin-persistedstate"

import App from './App.vue'
import Router from './routes/router'
createApp(App).use(createPinia().use(piniaPluginPersistedState)).use(Router).mount('#app')
