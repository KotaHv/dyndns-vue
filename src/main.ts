import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import { useDynDNS } from '@/stores/dyndns'

const pinia = createPinia()
const app = createApp(App)
;(async () => {
  app.use(pinia)
  const store = useDynDNS()
  await store.getDynDNS()

  app.use(router)
  app.mount('#app')
})()
