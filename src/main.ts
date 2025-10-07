import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from '@/App.vue'
import router from '@/router'
import { useDynDNS } from '@/stores/dyndns'
import { useAuth } from '@/stores/auth'

const app = createApp(App)
const pinia = createPinia()
app.use(pinia)

const auth = useAuth()
if (auth.isAuthenticated) {
  const dynDns = useDynDNS()
  await dynDns.getDynDNS()
}

app.use(router)

app.mount('#app')
