<template>
  <div class="relative">
    <!-- Cart Button -->
    <button
      @click="dropdownOpen = !dropdownOpen"
      class="flex items-center space-x-2 px-3 py-2 rounded-md hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500"
      :class="{ 'bg-gray-100': dropdownOpen }"
    >
      <div class="relative">
        <ShoppingCartIcon class="w-5 h-5 text-gray-600" />
        <!-- Cart Badge removed to avoid redundancy with text count -->
      </div>
      
      <div class="hidden sm:flex flex-col items-start">
        <span class="text-sm font-medium text-gray-700">
          Cart ({{ cartStore.totalItems }})
        </span>
        <span v-if="!cartStore.isEmpty" class="text-xs text-primary-600 font-semibold">
          {{ formatPrice(cartStore.totalCents) }}
        </span>
      </div>
    </button>

    <!-- Dropdown Menu -->
    <Transition
      enter-active-class="transition ease-out duration-200"
      enter-from-class="opacity-0 scale-95 translate-y-1"
      enter-to-class="opacity-100 scale-100 translate-y-0"
      leave-active-class="transition ease-in duration-150"
      leave-from-class="opacity-100 scale-100 translate-y-0"
      leave-to-class="opacity-0 scale-95 translate-y-1"
    >
      <div
        v-if="dropdownOpen"
        @click.stop
        class="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50"
      >
        <!-- Empty Cart State -->
        <div v-if="cartStore.isEmpty" class="p-6 text-center">
          <ShoppingCartIcon class="mx-auto h-12 w-12 text-gray-300 mb-4" />
          <h3 class="text-sm font-medium text-gray-900 mb-2">Your cart is empty</h3>
          <p class="text-xs text-gray-500 mb-4">Add some products to get started</p>
          <BaseButton
            size="sm"
            @click="handleBrowseProducts"
            class="w-full"
          >
            Browse Products
          </BaseButton>
        </div>

        <!-- Cart Items -->
        <div v-else>
          <!-- Header -->
          <div class="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
            <h3 class="text-sm font-semibold text-gray-900">Shopping Cart</h3>
            <button
              @click="handleClearCart"
              class="text-xs text-red-600 hover:text-red-800 transition-colors"
            >
              Clear All
            </button>
          </div>

          <!-- Items List -->
          <div class="max-h-64 overflow-y-auto">
            <div class="px-2 py-2 space-y-2">
              <div
                v-for="item in cartStore.items"
                :key="item.productId"
                class="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <!-- Product Image -->
                <div class="flex-shrink-0">
                  <div 
                    v-if="item.photoUrl"
                    class="w-10 h-10 rounded-md overflow-hidden"
                  >
                    <img 
                      :src="item.photoUrl" 
                      :alt="item.name"
                      class="w-full h-full object-cover"
                    />
                  </div>
                  <div 
                    v-else
                    class="w-10 h-10 bg-gray-200 rounded-md flex items-center justify-center"
                  >
                    <CubeIcon class="w-5 h-5 text-gray-400" />
                  </div>
                </div>

                <!-- Product Info -->
                <div class="flex-1 min-w-0">
                  <div class="text-sm font-medium text-gray-900 truncate">
                    {{ item.name }}
                  </div>
                  <div class="text-xs text-gray-500">
                    {{ formatPrice(item.priceCents) }} each
                  </div>
                  <div class="flex items-center space-x-2 mt-1">
                    <button
                      @click="decreaseQuantity(item.productId)"
                      class="w-5 h-5 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
                      :disabled="item.quantity <= 1"
                    >
                      <MinusIcon class="w-3 h-3 text-gray-600" />
                    </button>
                    <span class="text-xs font-medium text-gray-900 min-w-[20px] text-center">
                      {{ item.quantity }}
                    </span>
                    <button
                      @click="increaseQuantity(item.productId)"
                      class="w-5 h-5 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
                    >
                      <PlusIcon class="w-3 h-3 text-gray-600" />
                    </button>
                  </div>
                </div>

                <!-- Price & Remove -->
                <div class="flex flex-col items-end space-y-1">
                  <div class="text-sm font-semibold text-gray-900">
                    {{ formatPrice(item.priceCents * item.quantity) }}
                  </div>
                  <button
                    @click="removeItem(item.productId)"
                    class="text-xs text-red-600 hover:text-red-800 transition-colors"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Cart Summary -->
          <div class="px-4 py-3 border-t border-gray-100">
            <div class="space-y-1">
              <div class="flex justify-between text-sm">
                <span class="text-gray-600">Subtotal</span>
                <span class="font-medium">{{ formatPrice(cartStore.subtotalCents) }}</span>
              </div>
              
              <div v-if="cartStore.shippingFeeCents > 0" class="flex justify-between text-sm">
                <span class="text-gray-600">Shipping</span>
                <span class="font-medium">{{ formatPrice(cartStore.shippingFeeCents) }}</span>
              </div>
              
              <div v-if="cartStore.convenienceFeeCents > 0" class="flex justify-between text-sm">
                <span class="text-gray-600">Convenience Fee</span>
                <span class="font-medium">{{ formatPrice(cartStore.convenienceFeeCents) }}</span>
              </div>
              
              
              <div class="border-t border-gray-200 pt-1 mt-2">
                <div class="flex justify-between">
                  <span class="text-base font-semibold text-gray-900">Total</span>
                  <span class="text-base font-bold text-primary-600">
                    {{ formatPrice(cartStore.totalCents) }}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="px-4 py-3 bg-gray-50 rounded-b-lg">
            <BaseButton
              @click="handleCheckout"
              size="sm"
              class="w-full"
            >
              <CreditCardIcon class="w-4 h-4 mr-2" />
              Proceed to Checkout
            </BaseButton>
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
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import {
  ShoppingCartIcon,
  CubeIcon,
  MinusIcon,
  PlusIcon,
  CreditCardIcon
} from '@heroicons/vue/24/outline'
import { useCartStore } from '../stores/cart'
import { useGlobalStore } from '../stores/global'
import BaseButton from './BaseButton.vue'

// Composables
const router = useRouter()
const cartStore = useCartStore()
const globalStore = useGlobalStore()

// State
const dropdownOpen = ref(false)

// Methods
function formatPrice(cents: number): string {
  return `₱${(cents / 100).toFixed(2)}`
}

function increaseQuantity(productId: string) {
  const item = cartStore.items.find(item => item.productId === productId)
  if (item) {
    cartStore.updateQuantity(productId, item.quantity + 1)
  }
}

function decreaseQuantity(productId: string) {
  const item = cartStore.items.find(item => item.productId === productId)
  if (item && item.quantity > 1) {
    cartStore.updateQuantity(productId, item.quantity - 1)
  }
}

function removeItem(productId: string) {
  cartStore.removeFromCart(productId)
  globalStore.showInfo('Item Removed', 'Item has been removed from your cart')
}

function handleClearCart() {
  if (confirm('Are you sure you want to clear all items from your cart?')) {
    cartStore.clearCart()
    globalStore.showInfo('Cart Cleared', 'All items have been removed from your cart')
    dropdownOpen.value = false
  }
}

function handleBrowseProducts() {
  dropdownOpen.value = false
  router.push({ name: 'ProductManager' })
}

function handleCheckout() {
  dropdownOpen.value = false
  // If cart has items, go directly to customer section
  if (!cartStore.isEmpty) {
    router.push({ name: 'CreateOrder', query: { tab: 'customer' } })
  } else {
    router.push({ name: 'CreateOrder' })
  }
}
</script>