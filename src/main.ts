import './style.css'

import { createApp, provide, h } from 'vue'
import { createPinia } from 'pinia'
import { DefaultApolloClient } from '@vue/apollo-composable'
import { apolloClient } from './apollo/client'
import { router } from './router'
import { useAuthStore } from './stores/auth'
import App from './App.vue'

const app = createApp({
  setup() {
    // Provide Apollo Client to all components
    provide(DefaultApolloClient, apolloClient)
  },
  render: () => h(App),
})

// Install Pinia for state management
const pinia = createPinia()
app.use(pinia)

// Install Vue Router
app.use(router)

// Initialize authentication before mounting
// This ensures auth state is restored from localStorage before first navigation
const authStore = useAuthStore()
authStore.initializeAuth().then(() => {
  console.log('Authentication initialized')
}).catch((error) => {
  console.error('Failed to initialize authentication:', error)
})

app.mount('#app')
