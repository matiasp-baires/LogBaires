import { createApp } from 'vue'
import { createPinia } from 'pinia'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min'
import 'bootstrap-icons/font/bootstrap-icons.css'

import App from './App.vue'
import router from './router'

const app = createApp(App)

const pinia = createPinia()
app.use(pinia)
app.use(router)

// initialize auth before mounting to avoid top-level async in components
import { useAuthStore } from './stores/auth'
;(async () => {
  const auth = useAuthStore()
  // First, restore from localStorage if available
  auth.initializeFromStorage()
  try {
    await auth.fetchUser()
    if (auth.user) await auth.fetchRoles()
    auth.listenToAuth()
  } catch (err) {
    // keep app resilient if auth initialization fails
    console.error('Auth initialization error', err)
  }

  app.mount('#app')
})()
