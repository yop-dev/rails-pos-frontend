<script setup lang="ts">
import { onMounted } from 'vue'
import { useGlobalStore } from './stores/global'
import { useAuthStore } from './stores/auth'

// Pinia stores
const globalStore = useGlobalStore()
const authStore = useAuthStore()

// Initialize app on mount
onMounted(() => {
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
    
    
    <!-- Notification System -->
    <div class="fixed top-4 z-50 w-full flex justify-end pr-4"
         style="pointer-events: none;">
      <div class="space-y-2 w-80 max-w-sm notification-responsive"
           style="pointer-events: auto;">
      <div
        v-for="notification in globalStore.notifications"
        :key="notification.id"
        :data-notification-id="notification.id"
        :class="[
          'w-full bg-white shadow-lg rounded-lg pointer-events-auto ring-1 ring-black ring-opacity-5 overflow-hidden transform transition-all duration-300',
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
  </div>
</template>

<style scoped>
/* Notification animations */
@keyframes fade-in {
  from {
    opacity: 0;
    transform: translateX(100%);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes fade-out {
  from {
    opacity: 1;
    transform: translateX(0) scale(1);
  }
  to {
    opacity: 0;
    transform: translateX(100%) scale(0.95);
  }
}

.animate-fade-in {
  animation: fade-in 0.3s ease-out;
}

.animate-fade-out {
  animation: fade-out 0.25s ease-in;
}

/* Responsive notification adjustments */
@media (max-width: 640px) {
  .notification-responsive {
    width: calc(100vw - 2rem) !important;
    max-width: none !important;
  }
}
</style>
