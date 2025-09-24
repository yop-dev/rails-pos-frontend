<template>
  <div class="space-y-6">
    <!-- Page Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Order Manager</h1>
        <p class="text-gray-600 mt-1">Manage all customer orders</p>
      </div>
      
      <button 
        @click="$router.push({ name: 'CreateOrder' })"
        class="btn-primary"
      >
        <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
        Create Order
      </button>
    </div>

    <!-- Content -->
    <div class="card p-6">
      <h2 class="text-lg font-semibold text-gray-900 mb-4">Orders Dashboard</h2>
      <p class="text-gray-600">Order management functionality will be implemented here.</p>
      
      <!-- Test Navigation -->
      <div class="mt-6 space-x-4">
        <button 
          @click="$router.push({ name: 'CreateOrder' })"
          class="btn-secondary"
        >
          Go to Create Order
        </button>
        <button 
          @click="$router.push({ name: 'ProductManager' })"
          class="btn-secondary"
        >
          Go to Products
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Order Manager page - will be implemented in later phases
console.log('OrderManager view loaded')
</script>