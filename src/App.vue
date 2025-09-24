<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useCartStore } from './stores/cart'
import { useGlobalStore } from './stores/global'
import { useAuthStore } from './stores/auth'
import BaseButton from './components/BaseButton.vue'
import BaseInput from './components/BaseInput.vue'

const route = useRoute()
const showTests = ref(false)
const testInput = ref('')

// Pinia stores
const cartStore = useCartStore()
const globalStore = useGlobalStore()
const authStore = useAuthStore()

// Helper methods
function formatPrice(cents: number): string {
  return (cents / 100).toFixed(2)
}

// Test auth login
async function testLogin() {
  const result = await authStore.login({
    email: 'test@example.com',
    password: 'test123'
  })
  
  if (result.success) {
    globalStore.showSuccess('Login Successful', `Welcome back, ${authStore.userName}!`)
  } else {
    globalStore.showError('Login Failed', result.error)
  }
}

// Check connection on mount
onMounted(() => {
  console.log('Vue Router setup complete. Current route:', route.name)
  console.log('Pinia stores initialized:')
  console.log('- Cart store:', cartStore)
  console.log('- Global store:', globalStore)
  console.log('- Auth store:', authStore)
  
  // Initialize auth from localStorage
  authStore.initializeAuth()
  
  // Initialize theme
  globalStore.initializeTheme()
})
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Main Router View - MainLayout handles the navigation -->
    <router-view />
    
    <!-- Development Tests Toggle -->
    <div class="fixed bottom-4 right-4 z-40">
      <button 
        @click="showTests = !showTests"
        class="bg-gray-800 hover:bg-gray-700 text-white text-sm px-4 py-2 rounded-full shadow-lg transition-colors duration-200"
      >
        {{ showTests ? 'Hide' : 'Show' }} Dev Tests
      </button>
    </div>
    
    <!-- Development Tests Overlay -->
    <div v-if="showTests" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-lg max-w-4xl w-full max-h-screen overflow-y-auto">
        <div class="p-6">
          <div class="flex items-center justify-between mb-6">
            <h2 class="text-xl font-semibold text-gray-900">Development Tests</h2>
            <button 
              @click="showTests = false"
              class="text-gray-400 hover:text-gray-600"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <!-- Router Navigation Test -->
          <div class="card p-6 mb-6">
            <h3 class="text-md font-semibold text-gray-900 mb-4">Vue Router Navigation Test</h3>
            <div class="space-y-3">
              <p class="text-sm text-gray-600">Current Route: <strong>{{ route.name || 'Unknown' }}</strong></p>
              <p class="text-sm text-gray-600">Path: <strong>{{ route.path }}</strong></p>
              
              <div class="flex flex-wrap gap-2">
                <BaseButton size="sm" @click="$router.push({ name: 'OrderManager' })">
                  Go to Orders
                </BaseButton>
                <BaseButton size="sm" variant="secondary" @click="$router.push({ name: 'CreateOrder' })">
                  Create Order
                </BaseButton>
                <BaseButton size="sm" variant="secondary" @click="$router.push({ name: 'ProductManager' })">
                  Products
                </BaseButton>
                <BaseButton size="sm" variant="secondary" @click="$router.push({ name: 'OrderDetail', params: { id: 'test-123' } })">
                  Order Detail
                </BaseButton>
              </div>
            </div>
          </div>
          
          <!-- Pinia Stores Test -->
          <div class="card p-6 mb-6">
            <h3 class="text-md font-semibold text-gray-900 mb-4">Pinia Stores Test</h3>
            
            <!-- Cart Store Test -->
            <div class="mb-6">
              <h4 class="text-sm font-medium text-gray-800 mb-3">Cart Store</h4>
              <div class="space-y-2 text-sm">
                <p><strong>Items in Cart:</strong> {{ cartStore.totalItems }}</p>
                <p><strong>Subtotal:</strong> ₱{{ formatPrice(cartStore.subtotalCents) }}</p>
                <p><strong>Total:</strong> ₱{{ formatPrice(cartStore.totalCents) }}</p>
                <p><strong>Order Type:</strong> {{ cartStore.isOnlineOrder ? 'Online' : 'In-Store' }}</p>
              </div>
              <div class="mt-3 flex flex-wrap gap-2">
                <BaseButton size="xs" variant="secondary" @click="cartStore.setOrderType(!cartStore.isOnlineOrder)">
                  Toggle Order Type
                </BaseButton>
                <BaseButton size="xs" variant="danger" @click="cartStore.clearCart()">
                  Clear Cart
                </BaseButton>
              </div>
            </div>
            
            <!-- Global Store Test -->
            <div class="mb-6">
              <h4 class="text-sm font-medium text-gray-800 mb-3">Global Store & Notifications</h4>
              <div class="space-y-2 text-sm mb-3">
                <p><strong>Active Notifications:</strong> {{ globalStore.notifications.length }}</p>
                <p><strong>Theme:</strong> {{ globalStore.theme }}</p>
              </div>
              <div class="flex flex-wrap gap-2">
                <BaseButton size="xs" variant="success" @click="globalStore.showSuccess('Test Success', 'This is a test success message')">
                  Show Success
                </BaseButton>
                <BaseButton size="xs" variant="danger" @click="globalStore.showError('Test Error', 'This is a test error message')">
                  Show Error
                </BaseButton>
                <BaseButton size="xs" variant="warning" @click="globalStore.showWarning('Test Warning', 'This is a test warning message')">
                  Show Warning
                </BaseButton>
                <BaseButton size="xs" variant="secondary" @click="globalStore.clearAllNotifications()">
                  Clear All
                </BaseButton>
              </div>
            </div>
            
            <!-- Auth Store Test -->
            <div>
              <h4 class="text-sm font-medium text-gray-800 mb-3">Auth Store</h4>
              <div class="space-y-2 text-sm mb-3">
                <p><strong>Logged In:</strong> {{ authStore.isLoggedIn ? 'Yes' : 'No' }}</p>
                <p v-if="authStore.isLoggedIn"><strong>User:</strong> {{ authStore.userName }}</p>
                <p v-if="authStore.isLoggedIn"><strong>Role:</strong> {{ authStore.userRole }}</p>
              </div>
              <div class="flex gap-2">
                <BaseButton v-if="!authStore.isLoggedIn" size="xs" @click="testLogin" :loading="authStore.isLoading">
                  Test Login
                </BaseButton>
                <BaseButton v-else size="xs" variant="secondary" @click="authStore.logout()">
                  Logout
                </BaseButton>
              </div>
            </div>
          </div>
          
          <!-- Component Test -->
          <div class="card p-6 mb-6">
            <h3 class="text-md font-semibold text-gray-900 mb-4">Component Test</h3>
            <div class="space-y-4">
              <div>
                <h4 class="text-sm font-medium text-gray-800 mb-2">BaseButton Variants</h4>
                <div class="flex flex-wrap gap-2">
                  <BaseButton>Primary</BaseButton>
                  <BaseButton variant="secondary">Secondary</BaseButton>
                  <BaseButton variant="danger">Danger</BaseButton>
                  <BaseButton variant="success">Success</BaseButton>
                  <BaseButton variant="warning">Warning</BaseButton>
                  <BaseButton :loading="true">Loading</BaseButton>
                </div>
              </div>
              
              <div>
                <h4 class="text-sm font-medium text-gray-800 mb-2">BaseInput</h4>
                <div class="max-w-md space-y-2">
                  <BaseInput v-model="testInput" label="Test Input" placeholder="Enter some text" />
                  <BaseInput v-model="testInput" label="With Error" error="This field has an error" />
                  <BaseInput v-model="testInput" label="Disabled" :disabled="true" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Notification System -->
    <div class="fixed top-4 right-4 z-50 space-y-2">
      <div
        v-for="notification in globalStore.notifications"
        :key="notification.id"
        :class="[
          'max-w-sm w-full bg-white shadow-lg rounded-lg pointer-events-auto ring-1 ring-black ring-opacity-5 overflow-hidden transform transition-all duration-300',
          'animate-fade-in'
        ]"
      >
        <div class="p-4">
          <div class="flex items-start">
            <div class="flex-shrink-0">
              <!-- Success Icon -->
              <svg v-if="notification.type === 'success'" class="h-6 w-6 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <!-- Error Icon -->
              <svg v-else-if="notification.type === 'error'" class="h-6 w-6 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              <!-- Warning Icon -->
              <svg v-else-if="notification.type === 'warning'" class="h-6 w-6 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              <!-- Info Icon -->
              <svg v-else class="h-6 w-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div class="ml-3 w-0 flex-1 pt-0.5">
              <p :class="[
                'text-sm font-medium',
                notification.type === 'success' ? 'text-gray-900' :
                notification.type === 'error' ? 'text-gray-900' :
                notification.type === 'warning' ? 'text-gray-900' :
                'text-gray-900'
              ]">
                {{ notification.title }}
              </p>
              <p v-if="notification.message" class="mt-1 text-sm text-gray-500">
                {{ notification.message }}
              </p>
            </div>
            <div class="ml-4 flex-shrink-0 flex">
              <button
                @click="globalStore.removeNotification(notification.id)"
                class="bg-white rounded-md inline-flex text-gray-400 hover:text-gray-600 focus:outline-none"
              >
                <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
