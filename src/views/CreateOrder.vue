<template>
  <div class="space-y-6">
    <!-- Page Header -->
    <div class="flex items-center justify-between">
      <div class="flex items-center space-x-4">
        <button 
          @click="$router.go(-1)"
          class="btn-secondary text-sm"
        >
          <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </button>
        
        <div>
          <h1 class="text-2xl font-bold text-gray-900">Create Order</h1>
          <p class="text-gray-600 mt-1">Add products and customer information</p>
        </div>
      </div>
    </div>

    <!-- Content -->
    <div class="card p-6">
      <h2 class="text-lg font-semibold text-gray-900 mb-4">Order Creation Flow</h2>
      <p class="text-gray-600 mb-6">Create order functionality will be implemented here with products tab, customer info, and checkout flow.</p>
      
      <!-- Test Navigation -->
      <div class="space-x-4">
        <button 
          @click="$router.push({ name: 'OrderManager' })"
          class="btn-secondary"
        >
          Back to Orders
        </button>
        <button 
          @click="$router.push({ name: 'OrderDetail', params: { id: '123' } })"
          class="btn-secondary"
        >
          Test Order Detail
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Create Order page - will be implemented in later phases
console.log('CreateOrder view loaded')
</script>