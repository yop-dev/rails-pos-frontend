<template>
  <div v-if="show" class="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
    <!-- Background overlay -->
    <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
      <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"></div>
      
      <!-- This element is to trick the browser into centering the modal contents. -->
      <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
      
      <!-- Modal panel -->
      <div class="relative inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full sm:p-6">
        <!-- Success Icon -->
        <div class="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
          <CheckCircleIcon class="h-6 w-6 text-green-600" aria-hidden="true" />
        </div>
        
        <!-- Modal content -->
        <div class="text-center mb-6">
          <h3 class="text-2xl font-bold text-gray-900 mb-2" id="modal-title">
            Order Placed Successfully
          </h3>
          <p class="text-lg text-green-600 font-semibold">
            Order Reference Number: {{ order.reference || 'N/A' }}
          </p>
        </div>
        
        <div class="bg-gray-50 rounded-lg p-4 mb-6 text-left">
          <!-- Customer Information -->
          <div class="mb-6">
            <h4 class="text-lg font-semibold text-gray-900 mb-3">Customer Information</h4>
            <div class="space-y-2 text-sm">
              <div><span class="font-medium">Full Name:</span> {{ customerFullName }}</div>
              <div><span class="font-medium">Email Address:</span> {{ order.customer?.email || 'N/A' }}</div>
              <div><span class="font-medium">Mobile Number:</span> {{ order.customer?.phone || 'N/A' }}</div>
            </div>
          </div>
          
          <!-- Delivery Information (only show if delivery address exists) -->
          <div v-if="order.deliveryAddress" class="mb-6">
            <h4 class="text-lg font-semibold text-gray-900 mb-3">Delivery Address</h4>
            <div class="text-sm text-gray-700">
              {{ formatFullAddress(order.deliveryAddress) }}
            </div>
          </div>
          
          <!-- Shipping & Payment Methods -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div v-if="shippingMethod">
              <h4 class="font-semibold text-gray-900 mb-2">Shipping Method</h4>
              <div class="text-sm text-gray-700">{{ shippingMethod }}</div>
            </div>
            <div>
              <h4 class="font-semibold text-gray-900 mb-2">Payment Method</h4>
              <div class="text-sm text-gray-700">{{ paymentMethod }}</div>
            </div>
          </div>
          
          <!-- Order Summary -->
          <div class="border-t border-gray-200 pt-4">
            <h4 class="text-lg font-semibold text-gray-900 mb-3">Order Summary</h4>
            
            <!-- Order Items -->
            <div class="space-y-2 mb-4">
              <div 
                v-for="item in (order.items || [])" 
                :key="item.id"
                class="flex justify-between text-sm"
              >
                <div class="flex-1">
                  <span class="font-medium">{{ item.productName || item.product?.name || 'Unknown Product' }}</span>
                  <span class="text-gray-500 ml-2">x{{ item.quantity }}</span>
                </div>
                <div class="font-medium">
                  {{ formatPrice(item.quantity * item.unitPriceCents) }}
                </div>
              </div>
              
              <!-- Empty state -->
              <div v-if="!order.items || order.items.length === 0" class="text-sm text-gray-500 italic">
                No items found
              </div>
            </div>
            
            <!-- Pricing Breakdown -->
            <div class="border-t border-gray-200 pt-3 space-y-2">
              <div class="flex justify-between text-sm">
                <span>Subtotal:</span>
                <span class="font-medium">{{ formatPrice(subtotal) }}</span>
              </div>
              
              <div v-if="shippingFee > 0" class="flex justify-between text-sm">
                <span>Shipping Fee:</span>
                <span class="font-medium">{{ formatPrice(shippingFee) }}</span>
              </div>
              
              <div v-if="convenienceFee > 0" class="flex justify-between text-sm">
                <span>Convenience Fee:</span>
                <span class="font-medium">{{ formatPrice(convenienceFee) }}</span>
              </div>
              
              
              <div class="border-t border-gray-200 pt-2 mt-2">
                <div class="flex justify-between text-lg font-bold">
                  <span>Grand Total:</span>
                  <span class="text-primary-600">{{ formatPrice(grandTotal) }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Action buttons -->
        <div class="flex flex-col sm:flex-row gap-3 justify-center">
          <BaseButton
            @click="handleViewOrder"
            variant="primary"
            size="lg"
          >
            View Order Details
          </BaseButton>
          
          <BaseButton
            @click="handleCreateNew"
            variant="secondary"
            size="lg"
          >
            Create New Order
          </BaseButton>
          
          <BaseButton
            @click="handleClose"
            variant="outline"
            size="lg"
          >
            Close
          </BaseButton>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { CheckCircleIcon } from '@heroicons/vue/24/outline'
import { formatPrice } from '../composables/useProducts'
import BaseButton from './BaseButton.vue'
import type { Order, Address } from '../types'

// Props & Emits
const props = defineProps<{
  show: boolean
  order: Order
  shippingMethod?: string
  paymentMethod?: string
  shippingFee?: number
  convenienceFee?: number
}>()

const emit = defineEmits<{
  'close': []
  'view-order': [orderId: string]
  'create-new': []
}>()

// Computed
const customerFullName = computed(() => {
  if (!props.order.customer) return 'N/A'
  return `${props.order.customer.firstName} ${props.order.customer.lastName}`
})

const subtotal = computed(() => {
  return props.order.items?.reduce((sum, item) => {
    return sum + (item.quantity * item.unitPriceCents)
  }, 0) || 0
})

const grandTotal = computed(() => {
  let total = subtotal.value
  if (props.shippingFee) total += props.shippingFee
  if (props.convenienceFee) total += props.convenienceFee
  return total
})

// Methods
function formatFullAddress(address: Address | null): string {
  if (!address) return 'N/A'
  
  const parts = [
    address.unitFloorBuilding,
    address.street,
    address.barangay,
    address.city,
    address.province
  ].filter(Boolean)
  
  return parts.join(', ')
}

function handleClose() {
  emit('close')
}

function handleViewOrder() {
  emit('view-order', props.order.id)
}

function handleCreateNew() {
  emit('create-new')
}
</script>

<style scoped>
/* Ensure modal appears above everything */
.fixed {
  z-index: 9999;
}
</style>