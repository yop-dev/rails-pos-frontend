<template>
  <div class="h-full flex flex-col">
    <!-- Cart Header -->
    <div class="flex-shrink-0 px-6 py-4 border-b border-gray-200">
      <div class="flex items-center justify-between">
        <h3 class="text-lg font-semibold text-gray-900">Shopping Cart</h3>
        <button
          v-if="!cartStore.isEmpty"
          @click="cartStore.clearCart"
          class="text-sm text-red-600 hover:text-red-800 transition-colors"
        >
          Clear All
        </button>
      </div>
      
      <div class="mt-2 flex items-center justify-between text-sm text-gray-500">
        <span>{{ cartStore.totalItems }} items</span>
        <span>{{ formatPrice(cartStore.subtotalCents) }}</span>
      </div>
    </div>

    <!-- Cart Items -->
    <div class="flex-1 overflow-y-auto">
      <!-- Empty Cart State -->
      <div v-if="cartStore.isEmpty" class="flex flex-col items-center justify-center h-full p-6 text-center">
        <ShoppingCartIcon class="h-16 w-16 text-gray-300 mb-4" />
        <h3 class="text-lg font-medium text-gray-900 mb-2">Your cart is empty</h3>
        <p class="text-gray-500 text-sm">Add some products to get started</p>
      </div>

      <!-- Cart Items List -->
      <div v-else class="p-4 space-y-4">
        <CartItem
          v-for="item in cartStore.items"
          :key="item.productId"
          :item="item"
          @update-quantity="cartStore.updateQuantity"
          @remove="cartStore.removeFromCart"
        />
      </div>
    </div>

    <!-- Voucher Section -->
    <div v-if="!cartStore.isEmpty" class="flex-shrink-0 px-6 py-4 border-t border-gray-200">
      <div class="space-y-3">
        <div class="flex items-center space-x-3">
          <BaseInput
            v-model="voucherCode"
            placeholder="Enter voucher code"
            class="flex-1"
          />
          <BaseButton
            size="sm"
            @click="applyVoucher"
            :disabled="!voucherCode || voucherApplied"
            :loading="applyingVoucher"
          >
            Apply
          </BaseButton>
        </div>
        
        <div v-if="cartStore.voucherCode" class="flex items-center justify-between text-sm">
          <span class="text-green-600 font-medium">Voucher Applied: {{ cartStore.voucherCode }}</span>
          <button @click="removeVoucher" class="text-red-600 hover:text-red-800">
            Remove
          </button>
        </div>
      </div>
    </div>

    <!-- Order Summary -->
    <div v-if="!cartStore.isEmpty" class="flex-shrink-0 px-6 py-4 bg-gray-50 border-t border-gray-200">
      <div class="space-y-2">
        <div class="flex items-center justify-between text-sm">
          <span class="text-gray-600">Subtotal</span>
          <span class="font-medium">{{ formatPrice(cartStore.subtotalCents) }}</span>
        </div>
        
        <div v-if="cartStore.shippingFeeCents > 0" class="flex items-center justify-between text-sm">
          <span class="text-gray-600">Shipping Fee</span>
          <span class="font-medium">{{ formatPrice(cartStore.shippingFeeCents) }}</span>
        </div>
        
        <div v-if="cartStore.convenienceFeeCents > 0" class="flex items-center justify-between text-sm">
          <span class="text-gray-600">Convenience Fee</span>
          <span class="font-medium">{{ formatPrice(cartStore.convenienceFeeCents) }}</span>
        </div>
        
        <div v-if="cartStore.voucherDiscount > 0" class="flex items-center justify-between text-sm text-green-600">
          <span>Voucher Discount</span>
          <span class="font-medium">-{{ formatPrice(cartStore.voucherDiscount) }}</span>
        </div>
        
        <div class="border-t border-gray-200 pt-2 mt-3">
          <div class="flex items-center justify-between">
            <span class="text-lg font-semibold text-gray-900">Total</span>
            <span class="text-lg font-bold text-primary-600">{{ formatPrice(cartStore.totalCents) }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Action Buttons -->
    <div v-if="!cartStore.isEmpty" class="flex-shrink-0 px-6 py-4 space-y-3">
      <BaseButton
        class="w-full"
        @click="$emit('continue-checkout')"
        :disabled="cartStore.isEmpty"
        size="lg"
      >
        Continue to Checkout
      </BaseButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { ShoppingCartIcon } from '@heroicons/vue/24/outline'
import { useCartStore } from '../stores/cart'
import { useGlobalStore } from '../stores/global'
import { formatPrice } from '../composables/useProducts'
import BaseButton from './BaseButton.vue'
import BaseInput from './BaseInput.vue'
import CartItem from './CartItem.vue'

// Emits
const emit = defineEmits<{
  'continue-checkout': []
}>()

// State
const voucherCode = ref('')
const applyingVoucher = ref(false)

// Composables
const cartStore = useCartStore()
const globalStore = useGlobalStore()

// Computed
const voucherApplied = computed(() => !!cartStore.voucherCode)

// Methods
async function applyVoucher() {
  if (!voucherCode.value) return
  
  applyingVoucher.value = true
  
  try {
    // Simulate voucher validation (replace with actual API call)
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Mock voucher logic - simplified version matching the spec
    if (voucherCode.value.toUpperCase() === 'SAVE10') {
      const discount = Math.floor(cartStore.subtotalCents * 0.1)
      cartStore.applyVoucher(voucherCode.value, discount)
      voucherCode.value = ''
      globalStore.showSuccess('Voucher Applied', `Discount of ${formatPrice(discount)} has been applied`)
    } else {
      globalStore.showError('Invalid Voucher', 'Please check your voucher code and try again')
    }
  } catch (error) {
    console.error('Error applying voucher:', error)
    globalStore.showError('Error', 'Failed to apply voucher. Please try again.')
  } finally {
    applyingVoucher.value = false
  }
}

function removeVoucher() {
  cartStore.applyVoucher('', 0)
  globalStore.showInfo('Voucher Removed', 'Voucher discount has been removed')
}
</script>