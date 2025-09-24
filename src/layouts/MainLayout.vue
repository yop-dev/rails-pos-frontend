<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Top Navigation -->
    <nav class="bg-white shadow-sm border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <!-- Logo/Brand -->
          <div class="flex items-center space-x-4">
            <div class="flex-shrink-0">
              <router-link to="/" class="text-xl font-bold text-gray-900">
                Rails POS
              </router-link>
            </div>
          </div>
          
          <!-- Navigation Links -->
          <div class="hidden md:block">
            <div class="ml-10 flex items-baseline space-x-4">
              <router-link
                v-for="route in navigationRoutes"
                :key="route.name"
                :to="{ name: route.name }"
                :class="[
                  'px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200',
                  isActiveRoute(route.name) 
                    ? 'bg-primary-100 text-primary-700' 
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                ]"
              >
                <component :is="route.icon" class="w-4 h-4 inline-block mr-1" />
                {{ route.label }}
              </router-link>
            </div>
          </div>

          <!-- Right Section -->
          <div class="flex items-center space-x-4">
            <!-- Cart Summary -->
            <div class="relative">
              <button class="flex items-center space-x-2 px-3 py-2 rounded-md hover:bg-gray-100 transition-colors">
                <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.68 4.92c-.07.2-.09.41 0 .62A1 1 0 006.24 19H19M9 19h10m-10 0a2 2 0 114 0m-10 0a2 2 0 004 0m10 0a2 2 0 11-4 0m4 0a2 2 0 01-4 0" />
                </svg>
                <span class="text-sm font-medium text-gray-700 hidden sm:block">
                  Cart ({{ cartStore.totalItems }})
                </span>
                <span v-if="!cartStore.isEmpty" class="text-sm text-primary-600 font-semibold hidden sm:block">
                  ₱{{ formatPrice(cartStore.totalCents) }}
                </span>
              </button>
              <div v-if="cartStore.totalItems > 0" class="absolute -top-2 -right-2 bg-primary-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {{ cartStore.totalItems }}
              </div>
            </div>

            <!-- User Info & Logout -->
            <div v-if="authStore.isLoggedIn" class="flex items-center space-x-3">
              <span class="text-sm text-gray-600 hidden sm:block">
                {{ authStore.userName }}
              </span>
              <button 
                @click="handleLogout"
                class="text-sm px-3 py-1.5 rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
              >
                Logout
              </button>
            </div>

            <!-- Mobile Menu Button -->
            <div class="md:hidden">
              <button
                @click="mobileMenuOpen = !mobileMenuOpen"
                class="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              >
                <Bars3Icon v-if="!mobileMenuOpen" class="w-6 h-6" />
                <XMarkIcon v-else class="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Mobile Menu -->
      <div v-show="mobileMenuOpen" class="md:hidden border-t border-gray-200">
        <div class="px-2 pt-2 pb-3 space-y-1 bg-white">
          <router-link
            v-for="route in navigationRoutes"
            :key="route.name"
            :to="{ name: route.name }"
            :class="[
              'block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200',
              isActiveRoute(route.name)
                ? 'bg-primary-100 text-primary-700'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            ]"
            @click="mobileMenuOpen = false"
          >
            <component :is="route.icon" class="w-5 h-5 inline-block mr-2" />
            {{ route.label }}
          </router-link>

          <!-- Mobile Cart Info -->
          <div class="px-3 py-2 border-t border-gray-200 mt-2">
            <div class="flex items-center justify-between">
              <span class="text-sm font-medium text-gray-700">
                Cart: {{ cartStore.totalItems }} items
              </span>
              <span v-if="!cartStore.isEmpty" class="text-sm text-primary-600 font-semibold">
                ₱{{ formatPrice(cartStore.totalCents) }}
              </span>
            </div>
          </div>

          <!-- Mobile User Info -->
          <div v-if="authStore.isLoggedIn" class="px-3 py-2 border-t border-gray-200">
            <div class="flex items-center justify-between">
              <span class="text-sm text-gray-600">{{ authStore.userName }}</span>
              <button 
                @click="handleLogout"
                class="text-sm px-3 py-1 rounded bg-gray-100 text-gray-700"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>

    <!-- Main Content -->
    <main class="flex-1">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <router-view />
      </div>
    </main>

    <!-- Loading Overlay -->
    <LoadingOverlay v-if="globalStore.isLoading" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { 
  Bars3Icon, 
  XMarkIcon,
  ShoppingCartIcon,
  ClipboardDocumentListIcon,
  CubeIcon 
} from '@heroicons/vue/24/outline'
import { useCartStore } from '../stores/cart'
import { useAuthStore } from '../stores/auth'
import { useGlobalStore } from '../stores/global'
import LoadingOverlay from '../components/LoadingOverlay.vue'

// Composables
const route = useRoute()
const router = useRouter()
const cartStore = useCartStore()
const authStore = useAuthStore()
const globalStore = useGlobalStore()

// State
const mobileMenuOpen = ref(false)

// Navigation routes
const navigationRoutes = [
  {
    name: 'OrderManager',
    label: 'Orders',
    icon: ClipboardDocumentListIcon
  },
  {
    name: 'ProductManager', 
    label: 'Products',
    icon: CubeIcon
  }
]

// Methods
function isActiveRoute(routeName: string): boolean {
  return route.name === routeName
}

function formatPrice(cents: number): string {
  return (cents / 100).toFixed(2)
}

function handleLogout() {
  authStore.logout()
  globalStore.showInfo('Logged Out', 'You have been successfully logged out')
  router.push({ name: 'OrderManager' })
}
</script>