<template>
  <div class="space-y-6">
    <!-- Page Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Product Manager</h1>
        <p class="text-gray-600 mt-1">Manage your product catalog</p>
      </div>
      
      <button @click="handleCreateProduct" class="btn-primary">
        <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
        Add Product
      </button>
    </div>

    <!-- Success/Error Notification -->
    <div
      v-if="notification"
      :class="[
        'rounded-md p-4 mb-6',
        notification.type === 'success' ? 'bg-green-50' : 'bg-red-50'
      ]"
    >
      <div class="flex">
        <div class="flex-shrink-0">
          <CheckCircleIcon 
            v-if="notification.type === 'success'"
            class="h-5 w-5 text-green-400" 
          />
          <XCircleIcon 
            v-else
            class="h-5 w-5 text-red-400" 
          />
        </div>
        <div class="ml-3">
          <p :class="[
            'text-sm font-medium',
            notification.type === 'success' ? 'text-green-800' : 'text-red-800'
          ]">
            {{ notification.message }}
          </p>
        </div>
        <div class="ml-auto pl-3">
          <button
            @click="dismissNotification"
            :class="[
              'inline-flex rounded-md p-1.5 focus:outline-none focus:ring-2 focus:ring-offset-2',
              notification.type === 'success'
                ? 'bg-green-50 text-green-500 hover:bg-green-100 focus:ring-green-600'
                : 'bg-red-50 text-red-500 hover:bg-red-100 focus:ring-red-600'
            ]"
          >
            <span class="sr-only">Dismiss</span>
            <XMarkIcon class="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>

    <!-- Product Catalog -->
    <ProductCatalog
      @product-click="handleProductClick"
      @create-product="handleCreateProduct"
      :key="catalogRefreshKey"
    />
    
    <!-- Navigation -->
    <div class="mt-8 pt-6 border-t border-gray-200 space-x-4">
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
        Create Order
      </button>
    </div>

    <!-- Create Product Modal -->
    <CreateProductModal
      v-model="showCreateProductModal"
      @success="handleProductCreated"
      @error="handleCreateError"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { CheckCircleIcon, XCircleIcon, XMarkIcon } from '@heroicons/vue/24/outline'
import ProductCatalog from '../components/ProductCatalog.vue'
import CreateProductModal from '../components/CreateProductModal.vue'
import type { Product } from '../types'

// Composables
const router = useRouter()

// State
const selectedProduct = ref<Product | null>(null)
const showCreateProductModal = ref(false)
const catalogRefreshKey = ref(0)
const notification = ref<{ type: 'success' | 'error'; message: string } | null>(null)

// Methods
function handleProductClick(product: Product) {
  selectedProduct.value = product
  console.log('Product clicked:', product)
  // TODO: Show product detail modal or navigate to edit page
}

function handleCreateProduct() {
  showCreateProductModal.value = true
}

function handleProductCreated(product: Product) {
  showCreateProductModal.value = false
  catalogRefreshKey.value++ // Force refresh ProductCatalog
  
  // Show success notification
  notification.value = {
    type: 'success',
    message: `Product "${product.name}" created successfully!`
  }
  
  // Auto-hide notification after 5 seconds
  setTimeout(() => {
    notification.value = null
  }, 5000)
  
  console.log('Product created successfully:', product)
}

function handleCreateError(error: string) {
  // Show error notification
  notification.value = {
    type: 'error',
    message: error
  }
  
  // Auto-hide notification after 5 seconds
  setTimeout(() => {
    notification.value = null
  }, 5000)
  
  console.error('Error creating product:', error)
}

function dismissNotification() {
  notification.value = null
}

// Product Manager page - showing real data from GraphQL
console.log('ProductManager view loaded')
</script>
