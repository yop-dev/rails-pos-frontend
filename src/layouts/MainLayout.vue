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
            <!-- Cart Dropdown -->
            <CartDropdown />

            <!-- User Profile Dropdown -->
            <UserProfileDropdown v-if="authStore.isLoggedIn" />

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

      <!-- Enhanced Mobile Menu -->
      <Transition
        enter-active-class="transition duration-200 ease-out"
        enter-from-class="opacity-0 scale-95"
        enter-to-class="opacity-100 scale-100"
        leave-active-class="transition duration-150 ease-in"
        leave-from-class="opacity-100 scale-100"
        leave-to-class="opacity-0 scale-95"
      >
        <div v-show="mobileMenuOpen" class="md:hidden border-t border-gray-200 bg-white shadow-lg">
          <div class="px-2 pt-2 pb-3 space-y-1">

            <!-- Navigation Routes -->
            <div class="mb-4">
              <h3 class="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                Navigation
              </h3>
              <router-link
                v-for="route in navigationRoutes"
                :key="route.name"
                :to="{ name: route.name }"
                :class="[
                  'flex items-center px-3 py-3 rounded-md text-base font-medium transition-colors duration-200',
                  isActiveRoute(route.name)
                    ? 'bg-primary-100 text-primary-700 border-l-4 border-primary-500'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                ]"
                @click="mobileMenuOpen = false"
              >
                <component :is="route.icon" class="w-5 h-5 mr-3" />
                <span>{{ route.label }}</span>
                <ChevronRightIcon class="w-4 h-4 ml-auto text-gray-400" />
              </router-link>
            </div>

            <!-- Cart Summary -->
            <div class="border-t border-gray-200 pt-4 mb-4">
              <div class="px-3 py-2 bg-gray-50 rounded-lg mx-3">
                <div class="flex items-center justify-between mb-2">
                  <span class="text-sm font-medium text-gray-700">Shopping Cart</span>
                  <span class="text-sm font-semibold text-primary-600">
                    {{ cartStore.totalItems }} items
                  </span>
                </div>
                
                <div v-if="!cartStore.isEmpty" class="space-y-1">
                  <div class="flex justify-between text-xs text-gray-600">
                    <span>Subtotal</span>
                    <span>₱{{ formatPrice(cartStore.subtotalCents) }}</span>
                  </div>
                  <div class="flex justify-between text-sm font-semibold text-gray-900">
                    <span>Total</span>
                    <span class="text-primary-600">₱{{ formatPrice(cartStore.totalCents) }}</span>
                  </div>
                  <BaseButton
                    @click="handleMobileCheckout"
                    size="sm"
                    class="w-full mt-2"
                  >
                    Proceed to Checkout
                  </BaseButton>
                </div>
                
                <div v-else class="text-xs text-gray-500 text-center py-2">
                  Your cart is empty
                </div>
              </div>
            </div>

            <!-- User Profile Section -->
            <div v-if="authStore.isLoggedIn" class="border-t border-gray-200 pt-4">
              <div class="px-3">
                <div class="flex items-center space-x-3 mb-3">
                  <div class="w-10 h-10 bg-primary-600 rounded-full flex items-center justify-center">
                    <span class="text-sm font-semibold text-white">
                      {{ getUserInitials() }}
                    </span>
                  </div>
                  <div class="flex-1">
                    <div class="text-sm font-medium text-gray-900">{{ authStore.userName }}</div>
                    <div class="text-xs text-gray-500">{{ authStore.user?.email }}</div>
                    <span class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 mt-1">
                      {{ authStore.userRole }}
                    </span>
                  </div>
                </div>
                
                <div class="grid grid-cols-2 gap-2">
                  <BaseButton
                    @click="handleMobileProfile"
                    variant="secondary"
                    size="sm"
                    class="text-xs"
                  >
                    <UserIcon class="w-4 h-4 mr-1" />
                    Profile
                  </BaseButton>
                  
                  <BaseButton
                    @click="handleMobileLogout"
                    variant="danger"
                    size="sm"
                    class="text-xs"
                  >
                    <ArrowRightOnRectangleIcon class="w-4 h-4 mr-1" />
                    Logout
                  </BaseButton>
                </div>
              </div>
            </div>

            <!-- App Info Footer -->
            <div class="border-t border-gray-200 pt-4 mt-4">
              <div class="px-3 text-center">
                <p class="text-xs text-gray-400">Rails POS v1.0</p>
                <div class="flex items-center justify-center space-x-2 mt-1">
                  <div class="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span class="text-xs text-gray-500">System Online</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </nav>

    <!-- Main Content -->
    <main class="flex-1">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <!-- Breadcrumb Navigation -->
        <div class="mb-6">
          <BreadcrumbNavigation />
        </div>
        
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
  ClipboardDocumentListIcon,
  CubeIcon,
  ChevronRightIcon,
  UserIcon,
  ArrowRightOnRectangleIcon
} from '@heroicons/vue/24/outline'
import { useCartStore } from '../stores/cart'
import { useAuthStore } from '../stores/auth'
import { useGlobalStore } from '../stores/global'
import LoadingOverlay from '../components/LoadingOverlay.vue'
import UserProfileDropdown from '../components/UserProfileDropdown.vue'
import CartDropdown from '../components/CartDropdown.vue'
import BreadcrumbNavigation from '../components/BreadcrumbNavigation.vue'
import BaseButton from '../components/BaseButton.vue'

// Composables
const route = useRoute()
const router = useRouter()
const cartStore = useCartStore()
const authStore = useAuthStore()
const globalStore = useGlobalStore()

// State
const mobileMenuOpen = ref(false)

// Role-based navigation routes
const navigationRoutes = computed(() => {
  const baseRoutes = [
    {
      name: 'OrderManager',
      label: 'Orders',
      icon: ClipboardDocumentListIcon,
      roles: ['admin', 'staff'] // Available to all roles
    },
    {
      name: 'ProductManager', 
      label: 'Products',
      icon: CubeIcon,
      roles: ['admin', 'staff'] // Available to all roles
    }
  ]
  
  // Admin-only routes
  const adminRoutes = [
    // Add admin-specific routes here when implemented
    // {
    //   name: 'UserManager',
    //   label: 'Users',
    //   icon: UsersIcon,
    //   roles: ['admin']
    // },
    // {
    //   name: 'Reports',
    //   label: 'Reports',
    //   icon: ChartBarIcon,
    //   roles: ['admin']
    // }
  ]
  
  const userRole = authStore.userRole.toLowerCase()
  const allRoutes = [...baseRoutes, ...adminRoutes]
  
  // Filter routes based on user role
  return allRoutes.filter(route => 
    route.roles.includes(userRole) || route.roles.includes('all')
  )
})

// Methods
function isActiveRoute(routeName: string): boolean {
  return route.name === routeName
}

function formatPrice(cents: number): string {
  return (cents / 100).toFixed(2)
}

function getUserInitials(): string {
  if (!authStore.user) return 'U'
  const firstName = authStore.user.firstName || ''
  const lastName = authStore.user.lastName || ''
  return (firstName.charAt(0) + lastName.charAt(0)).toUpperCase()
}

// Mobile-specific handlers
function handleMobileCheckout() {
  mobileMenuOpen.value = false
  router.push({ name: 'CreateOrder' })
}

function handleMobileProfile() {
  mobileMenuOpen.value = false
  globalStore.showInfo('Profile', 'Profile settings coming soon!')
}

async function handleMobileLogout() {
  mobileMenuOpen.value = false
  
  try {
    await authStore.logout()
    globalStore.showInfo('Logged Out', 'You have been successfully logged out')
    router.push({ name: 'Login' })
  } catch (error) {
    console.error('Mobile logout error:', error)
    globalStore.showError('Logout Failed', 'An error occurred during logout')
    router.push({ name: 'Login' })
  }
}

async function handleLogout() {
  try {
    await authStore.logout()
    globalStore.showInfo('Logged Out', 'You have been successfully logged out')
    
    // Redirect to login page after logout
    router.push({ name: 'Login' })
  } catch (error) {
    console.error('Logout error:', error)
    globalStore.showError('Logout Failed', 'An error occurred during logout')
    
    // Even if logout fails on server, redirect to login
    router.push({ name: 'Login' })
  }
}
</script>