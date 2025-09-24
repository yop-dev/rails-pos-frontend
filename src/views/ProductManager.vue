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

    <!-- Product Catalog -->
    <ProductCatalog
      @product-click="handleProductClick"
      @create-product="handleCreateProduct"
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
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import ProductCatalog from '../components/ProductCatalog.vue'
import type { Product } from '../types'

// Composables
const router = useRouter()

// State
const selectedProduct = ref<Product | null>(null)
const showCreateProductModal = ref(false)

// Methods
function handleProductClick(product: Product) {
  selectedProduct.value = product
  console.log('Product clicked:', product)
  // TODO: Show product detail modal or navigate to edit page
}

function handleCreateProduct() {
  showCreateProductModal.value = true
  console.log('Create new product requested')
  // TODO: Show create product modal or navigate to create page
}

// Product Manager page - showing real data from GraphQL
console.log('ProductManager view loaded')
</script>
