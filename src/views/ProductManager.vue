<template>
  <div class="space-y-6">
    <!-- Page Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Product Manager</h1>
        <p class="text-gray-600 mt-1">Manage your product catalog</p>
      </div>
      
      <button class="btn-primary">
        <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
        Add Product
      </button>
    </div>

    <!-- Products Display -->
    <div class="card p-6">
      <h2 class="text-lg font-semibold text-gray-900 mb-4">Product Catalog</h2>
      
      <!-- Loading State -->
      <div v-if="productsLoading" class="text-center py-8">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto mb-4"></div>
        <p class="text-gray-500">Loading products...</p>
      </div>
      
      <!-- Error State -->
      <div v-else-if="productsError" class="text-center py-8">
        <p class="text-red-600 mb-2">Error loading products</p>
        <p class="text-sm text-gray-500">{{ productsError.message }}</p>
      </div>
      
      <!-- Products Grid -->
      <div v-else-if="products.length > 0" class="space-y-6">
        <!-- Products by Category -->
        <div v-for="category in categoriesWithProducts" :key="category.id" class="space-y-3">
          <h3 class="text-md font-medium text-gray-800 border-b border-gray-200 pb-2">
            {{ category.name }} ({{ category.products.length }} products)
          </h3>
          
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div 
              v-for="product in category.products" 
              :key="product.id" 
              class="border border-gray-200 rounded-lg p-4 hover:border-primary-300 transition-colors"
            >
              <div class="flex justify-between items-start mb-2">
                <h4 class="font-medium text-gray-900">{{ product.name }}</h4>
                <span class="text-xs px-2 py-1 rounded-full" :class="[
                  product.productType === 'DIGITAL' 
                    ? 'bg-blue-100 text-blue-800' 
                    : 'bg-green-100 text-green-800'
                ]">
                  {{ product.productType }}
                </span>
              </div>
              
              <p v-if="product.description" class="text-sm text-gray-600 mb-3 line-clamp-2">
                {{ product.description }}
              </p>
              
              <div class="flex justify-between items-center">
                <span class="text-lg font-semibold text-primary-600">
                  ₱{{ (product.priceCents / 100).toFixed(2) }}
                </span>
                <button 
                  @click="addToCart(product)"
                  class="text-xs px-2 py-1 bg-primary-600 text-white rounded hover:bg-primary-700 transition-colors"
                >
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Empty State -->
      <div v-else class="text-center py-8">
        <svg class="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
        <h3 class="text-lg font-medium text-gray-900 mb-2">No products found</h3>
        <p class="text-gray-500">Get started by creating your first product.</p>
      </div>
      
      <!-- Test Navigation -->
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
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useProducts, useProductCategories } from '../composables/useProducts'
import { useCartStore } from '../stores/cart'
import { useGlobalStore } from '../stores/global'
import type { Product } from '../types'

// Fetch products and categories
const { products, loading: productsLoading, error: productsError } = useProducts()
const { categories } = useProductCategories()

// Pinia stores
const cartStore = useCartStore()
const globalStore = useGlobalStore()

// Group products by category
const categoriesWithProducts = computed(() => {
  return categories.value
    .map(category => ({
      ...category,
      products: products.value.filter(product => product.category.id === category.id)
    }))
    .filter(category => category.products.length > 0)
    .sort((a, b) => a.position - b.position)
})

// Cart actions
function addToCart(product: Product) {
  cartStore.addToCart(product, 1)
  globalStore.showSuccess(
    'Added to Cart',
    `${product.name} has been added to your cart`,
    3000
  )
}

// Product Manager page - showing real data from GraphQL
console.log('ProductManager view loaded')
</script>
