<template>
  <div class="flex items-center space-x-2">
    <!-- Create Order -->
    <BaseButton
      @click="handleCreateOrder"
      size="sm"
      class="hidden xl:flex"
      :left-icon="PlusIcon"
    >
      Create Order
    </BaseButton>
    
    <!-- Quick Create (Icon only for smaller screens) -->
    <BaseButton
      @click="handleCreateOrder"
      size="sm"
      class="xl:hidden"
      variant="primary"
      :left-icon="PlusIcon"
      title="Create Order"
    />
    
    <!-- Global Search -->
    <div class="relative">
      <button
        @click="searchOpen = !searchOpen"
        class="flex items-center space-x-2 px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500"
        :class="{ 'bg-gray-200': searchOpen }"
        title="Global Search (Ctrl+K)"
      >
        <MagnifyingGlassIcon class="w-4 h-4 text-gray-600" />
        <span class="hidden lg:block text-gray-600">Search...</span>
        <kbd class="hidden lg:block ml-2 px-2 py-0.5 text-xs bg-white border border-gray-300 rounded">
          ⌘K
        </kbd>
      </button>
    </div>
    
    <!-- Notifications -->
    <button
      @click="handleNotifications"
      class="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500"
      title="Notifications"
    >
      <BellIcon class="w-5 h-5" />
      <!-- Notification Badge -->
      <div 
        v-if="notificationCount > 0"
        class="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center font-semibold"
      >
        {{ notificationCount > 9 ? '9+' : notificationCount }}
      </div>
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import {
  PlusIcon,
  MagnifyingGlassIcon,
  BellIcon
} from '@heroicons/vue/24/outline'
import { useGlobalStore } from '../stores/global'
import BaseButton from './BaseButton.vue'

// Composables
const router = useRouter()
const globalStore = useGlobalStore()

// State
const searchOpen = ref(false)
const notificationCount = ref(3) // Mock notification count

// Methods
function handleCreateOrder() {
  router.push({ name: 'CreateOrder' })
  globalStore.showInfo('Create Order', 'Redirecting to order creation...')
}

function handleNotifications() {
  globalStore.showInfo('Notifications', 'Notifications panel coming soon!')
  // TODO: Open notifications panel
}
</script>
