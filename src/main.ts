import './style.css'

import { createApp, provide, h } from 'vue'
import { createPinia } from 'pinia'
import { DefaultApolloClient } from '@vue/apollo-composable'
import { apolloClient } from './apollo/client'
import { router } from './router'
import { useAuthStore } from './stores/auth'
import App from './App.vue'

// Create Pinia instance first
const pinia = createPinia()

const app = createApp({
  setup() {
    // Provide Apollo Client to all components
    provide(DefaultApolloClient, apolloClient)
  },
  render: () => h(App),
})

// Install Pinia for state management
app.use(pinia)

// Install Vue Router
app.use(router)

// Mount the app
app.mount('#app')

// Initialize authentication after app is mounted and Vue context is established
const authStore = useAuthStore()
authStore.initializeAuth().then(() => {
  console.log('Authentication initialized')
}).catch((error) => {
  console.error('Failed to initialize authentication:', error)
})
