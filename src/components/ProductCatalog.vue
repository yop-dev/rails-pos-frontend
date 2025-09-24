<template>
  <div class="space-y-6">
    <!-- Search and Filters -->
    <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div class="space-y-4">
        <!-- Search Bar -->
        <div class="relative">
          <MagnifyingGlassIcon class="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            v-model="searchTerm"
            type="text"
            placeholder="Search products..."
            class="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>
        
        <!-- Category Filters -->
        <div class="flex flex-wrap gap-2">
          <button
            @click="selectedCategory = null"
            :class="[
              'px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200',
              selectedCategory === null
                ? 'bg-primary-100 text-primary-700 border border-primary-200'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200 border border-gray-200'
            ]"
          >
            All Products
          </button>
          
          <button
            v-for="category in categories"
            :key="category.id"
            @click="selectedCategory = category.id"
            :class="[
              'px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200',
              selectedCategory === category.id
                ? 'bg-primary-100 text-primary-700 border border-primary-200'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200 border border-gray-200'
            ]"
          >
            {{ category.name }}
            <span class="ml-1 text-xs opacity-75">({{ category.productsCount }})</span>
          </button>
        </div>

        <!-- Additional Filters -->
        <div class="flex items-center space-x-4">
          <label class="flex items-center cursor-pointer">
            <input
              v-model="activeOnly"
              type="checkbox"
              class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
            />
            <span class="ml-2 text-sm text-gray-700">Show active products only</span>
          </label>
        </div>
      </div>
    </div>

    <!-- Products Grid -->
    <div class="bg-white rounded-lg shadow-sm border border-gray-200">
      <!-- Loading State -->
      <div v-if="loading" class="p-8 text-center">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto mb-4"></div>
        <p class="text-gray-500">Loading products...</p>
      </div>
      
      <!-- Error State -->
      <div v-else-if="error" class="p-8 text-center">
        <ExclamationTriangleIcon class="h-12 w-12 text-red-400 mx-auto mb-4" />
        <h3 class="text-lg font-medium text-gray-900 mb-2">Error loading products</h3>
        <p class="text-sm text-gray-500 mb-4">{{ error.message }}</p>
        <BaseButton @click="() => refetch()" size="sm">
          Try Again
        </BaseButton>
      </div>
      
      <!-- Empty State -->
      <div v-else-if="products.length === 0" class="p-8 text-center">
        <CubeIcon class="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 class="text-lg font-medium text-gray-900 mb-2">No products found</h3>
        <p class="text-gray-500 mb-4">Try adjusting your search or filters.</p>
        <div class="flex justify-center space-x-2">
          <BaseButton @click="clearFilters" variant="secondary" size="sm">
            Clear Filters
          </BaseButton>
          <BaseButton @click="$emit('create-product')" size="sm">
            Add New Product
          </BaseButton>
        </div>
      </div>
      
      <!-- Products Grid -->
      <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-6">
        <ProductCard
          v-for="product in products"
          :key="product.id"
          :product="product"
          @add-to-cart="handleAddToCart"
          @click="handleProductClick(product)"
        />
      </div>

      <!-- Results Summary -->
      <div v-if="!loading && !error" class="border-t border-gray-200 px-6 py-3 bg-gray-50">
        <p class="text-sm text-gray-600 text-center">
          Showing {{ products.length }} 
          {{ products.length === 1 ? 'product' : 'products' }}
          {{ selectedCategory ? `in ${getCategoryName(selectedCategory)}` : '' }}
          {{ searchTerm ? `matching "${searchTerm}"` : '' }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { 
  MagnifyingGlassIcon, 
  CubeIcon, 
  ExclamationTriangleIcon 
} from '@heroicons/vue/24/outline'
import { useProductSearch, useProductCategories } from '../composables/useProducts'
import { useCartStore } from '../stores/cart'
import { useGlobalStore } from '../stores/global'
import ProductCard from './ProductCard.vue'
import BaseButton from './BaseButton.vue'
import type { Product, Category } from '../types'

// Props & Emits
const emit = defineEmits<{
  productClick: [product: Product]
  'create-product': []
}>()

// Composables
const { searchTerm, selectedCategory, activeOnly, products, loading, error, refetch } = useProductSearch()
const { categories } = useProductCategories()
const cartStore = useCartStore()
const globalStore = useGlobalStore()

// Computed
const getCategoryName = (categoryId: string | null) => {
  if (!categoryId) return ''
  const category = categories.value.find((cat: Category) => cat.id === categoryId)
  return category?.name || ''
}

// Methods
function handleAddToCart(product: Product, quantity = 1) {
  cartStore.addToCart(product, quantity)
  globalStore.showSuccess(
    'Added to Cart',
    `${product.name} has been added to your cart`,
    3000
  )
}

function handleProductClick(product: Product) {
  emit('productClick', product)
}

function clearFilters() {
  searchTerm.value = ''
  selectedCategory.value = null
  activeOnly.value = true
}
</script>