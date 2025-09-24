<template>
  <div class="space-y-6">
    <!-- Page Header -->
    <div class="flex items-center justify-between">
      <div class="flex items-center space-x-4">
        <button 
          @click="$router.push({ name: 'OrderManager' })"
          class="btn-secondary text-sm"
        >
          <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
          Back to Orders
        </button>
        
        <div>
          <h1 class="text-2xl font-bold text-gray-900">Order Details</h1>
          <p class="text-gray-600 mt-1">Order ID: {{ orderId }}</p>
        </div>
      </div>
    </div>

    <!-- Content -->
    <div class="card p-6">
      <h2 class="text-lg font-semibold text-gray-900 mb-4">Order Information</h2>
      <p class="text-gray-600 mb-6">Order details view for order {{ orderId }} will be implemented here.</p>
      
      <!-- Mock Order Data -->
      <div class="bg-gray-50 rounded-lg p-4 mb-6">
        <h3 class="font-medium text-gray-900 mb-2">Order Summary</h3>
        <div class="space-y-1 text-sm text-gray-600">
          <p><strong>Order ID:</strong> {{ orderId }}</p>
          <p><strong>Status:</strong> <span class="text-yellow-600">Pending</span></p>
          <p><strong>Customer:</strong> John Doe</p>
          <p><strong>Total:</strong> ₱450.00</p>
        </div>
      </div>
      
      <!-- Test Navigation -->
      <div class="space-x-4">
        <button 
          @click="$router.push({ name: 'OrderManager' })"
          class="btn-secondary"
        >
          Back to Orders
        </button>
        <button 
          @click="$router.push({ name: 'CreateOrder' })"
          class="btn-secondary"
        >
          Create New Order
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

// Props from router
const props = defineProps<{
  id: string
}>()

const orderId = computed(() => props.id)

// Order Detail page - will be implemented in later phases
console.log('OrderDetail view loaded for order:', orderId.value)
</script>