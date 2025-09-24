import './style.css'

import { createApp, provide, h } from 'vue'
import { createPinia } from 'pinia'
import { DefaultApolloClient } from '@vue/apollo-composable'
import { apolloClient } from './apollo/client'
import { router } from './router'
import App from './App.vue'

const app = createApp({
  setup() {
    // Provide Apollo Client to all components
    provide(DefaultApolloClient, apolloClient)
  },
  render: () => h(App),
})

// Install Pinia for state management
app.use(createPinia())

// Install Vue Router
app.use(router)

app.mount('#app')
