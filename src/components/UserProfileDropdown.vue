<template>
  <div class="relative">
    <!-- Profile Button -->
    <button
      @click="dropdownOpen = !dropdownOpen"
      class="flex items-center space-x-2 px-3 py-2 rounded-md hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500"
      :class="{ 'bg-gray-100': dropdownOpen }"
    >
      <!-- User Avatar -->
      <div class="flex-shrink-0">
        <div class="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center">
          <span class="text-xs font-semibold text-white">
            {{ userInitials }}
          </span>
        </div>
      </div>
      
      <!-- User Info (Desktop) -->
      <div class="hidden sm:block text-left">
        <div class="text-sm font-medium text-gray-900">{{ authStore.userName }}</div>
        <div class="text-xs text-gray-500">{{ userRoleDisplay }}</div>
      </div>
      
      <!-- Chevron Icon -->
      <ChevronDownIcon 
        class="w-4 h-4 text-gray-500 transition-transform duration-200"
        :class="{ 'rotate-180': dropdownOpen }"
      />
    </button>

    <!-- Dropdown Menu -->
    <Transition
      enter-active-class="transition ease-out duration-200"
      enter-from-class="opacity-0 scale-95"
      enter-to-class="opacity-100 scale-100"
      leave-active-class="transition ease-in duration-150"
      leave-from-class="opacity-100 scale-100"
      leave-to-class="opacity-0 scale-95"
    >
      <div
        v-if="dropdownOpen"
        @click.stop
        class="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50"
      >
        <!-- User Info Header -->
        <div class="px-4 py-3 border-b border-gray-100">
          <div class="flex items-center space-x-3">
            <div class="w-10 h-10 bg-primary-600 rounded-full flex items-center justify-center">
              <span class="text-sm font-semibold text-white">
                {{ userInitials }}
              </span>
            </div>
            <div class="flex-1">
              <div class="text-sm font-medium text-gray-900">{{ authStore.userName }}</div>
              <div class="text-xs text-gray-500">{{ authStore.user?.email }}</div>
              <div class="mt-1">
                <span 
                  class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium"
                  :class="roleColorClasses"
                >
                  {{ userRoleDisplay }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Menu Items -->
        <div class="py-2">
          <!-- Profile Settings -->
          <button
            @click="handleProfileClick"
            class="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
          >
            <UserIcon class="w-4 h-4 mr-3 text-gray-400" />
            Profile Settings
          </button>

          <!-- Preferences -->
          <button
            @click="handlePreferencesClick"
            class="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
          >
            <Cog6ToothIcon class="w-4 h-4 mr-3 text-gray-400" />
            Preferences
          </button>

          <!-- Help & Support -->
          <button
            @click="handleHelpClick"
            class="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
          >
            <QuestionMarkCircleIcon class="w-4 h-4 mr-3 text-gray-400" />
            Help & Support
          </button>

          <!-- Divider -->
          <div class="border-t border-gray-100 my-2"></div>

          <!-- Logout -->
          <button
            @click="handleLogout"
            :disabled="isLoggingOut"
            class="w-full flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50"
          >
            <ArrowRightOnRectangleIcon class="w-4 h-4 mr-3" />
            <span v-if="!isLoggingOut">Sign Out</span>
            <span v-else class="flex items-center">
              <svg class="animate-spin -ml-1 mr-2 h-3 w-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Signing out...
            </span>
          </button>
        </div>

        <!-- Footer Info -->
        <div class="px-4 py-2 border-t border-gray-100 text-xs text-gray-500">
          <div class="flex items-center justify-between">
            <span>Rails POS v1.0</span>
            <span>Session: {{ sessionTime }}</span>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Backdrop -->
    <div
      v-if="dropdownOpen"
      @click="dropdownOpen = false"
      class="fixed inset-0 z-40"
    ></div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import {
  ChevronDownIcon,
  UserIcon,
  Cog6ToothIcon,
  QuestionMarkCircleIcon,
  ArrowRightOnRectangleIcon
} from '@heroicons/vue/24/outline'
import { useAuthStore } from '../stores/auth'
import { useGlobalStore } from '../stores/global'

// Composables
const router = useRouter()
const authStore = useAuthStore()
const globalStore = useGlobalStore()

// State
const dropdownOpen = ref(false)
const isLoggingOut = ref(false)
const sessionTime = ref('')

// Computed
const userInitials = computed(() => {
  if (!authStore.user) return 'U'
  const firstName = authStore.user.firstName || ''
  const lastName = authStore.user.lastName || ''
  return (firstName.charAt(0) + lastName.charAt(0)).toUpperCase()
})

const userRoleDisplay = computed(() => {
  const role = authStore.userRole.toLowerCase()
  return role.charAt(0).toUpperCase() + role.slice(1)
})

const roleColorClasses = computed(() => {
  const role = authStore.userRole.toLowerCase()
  switch (role) {
    case 'admin':
      return 'bg-purple-100 text-purple-800'
    case 'staff':
      return 'bg-blue-100 text-blue-800'
    case 'manager':
      return 'bg-green-100 text-green-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
})

// Methods
function updateSessionTime() {
  const now = new Date()
  sessionTime.value = now.toLocaleTimeString('en-US', {
    hour12: false,
    hour: '2-digit',
    minute: '2-digit'
  })
}

async function handleLogout() {
  dropdownOpen.value = false
  isLoggingOut.value = true
  
  try {
    await authStore.logout()
    globalStore.showInfo('Logged Out', 'You have been successfully logged out')
    router.push({ name: 'Login' })
  } catch (error) {
    console.error('Logout error:', error)
    globalStore.showError('Logout Failed', 'An error occurred during logout')
    router.push({ name: 'Login' })
  } finally {
    isLoggingOut.value = false
  }
}

function handleProfileClick() {
  dropdownOpen.value = false
  globalStore.showInfo('Profile', 'Profile settings coming soon!')
  // TODO: Navigate to profile page when implemented
}

function handlePreferencesClick() {
  dropdownOpen.value = false
  globalStore.showInfo('Preferences', 'User preferences coming soon!')
  // TODO: Navigate to preferences page when implemented
}

function handleHelpClick() {
  dropdownOpen.value = false
  globalStore.showInfo('Help', 'Help & support documentation coming soon!')
  // TODO: Navigate to help page or open help modal
}

// Lifecycle
let sessionInterval: number

onMounted(() => {
  updateSessionTime()
  sessionInterval = window.setInterval(updateSessionTime, 1000)
})

onUnmounted(() => {
  if (sessionInterval) {
    clearInterval(sessionInterval)
  }
})
</script>