<script setup lang="ts">
import { onMounted } from 'vue'
import { useProductCategories, useProducts } from './composables/useProducts'

// Test Apollo GraphQL connection
const { categories, loading: categoriesLoading, error: categoriesError } = useProductCategories()
const { products, loading: productsLoading, error: productsError } = useProducts()

// Check connection on mount
onMounted(() => {
  console.log('Testing Apollo GraphQL connection...')
})
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Test Header -->
    <header class="bg-white shadow-sm border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <div class="flex items-center space-x-4">
            <h1 class="text-xl font-bold text-gray-900">Rails POS - Tailwind CSS Test</h1>
          </div>
        </div>
      </div>
    </header>

    <!-- Test Content -->
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="space-y-6">
        <!-- Test Cards -->
        <div class="card p-6">
          <h2 class="text-lg font-semibold text-gray-900 mb-4">Tailwind CSS Test Card</h2>
          <p class="text-gray-600 mb-4">This card uses the custom `.card` class defined in our CSS.</p>
          
          <!-- Test Buttons -->
          <div class="flex space-x-4">
            <button class="btn-primary">
              Primary Button
            </button>
            
            <button class="btn-secondary">
              Secondary Button
            </button>
          </div>
        </div>

        <!-- Test Form -->
        <div class="card p-6">
          <h2 class="text-lg font-semibold text-gray-900 mb-4">Form Elements Test</h2>
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Test Input Field</label>
              <input type="text" placeholder="Test placeholder" class="input-field" />
            </div>
          </div>
        </div>

        <!-- Test Colors -->
        <div class="card p-6">
          <h2 class="text-lg font-semibold text-gray-900 mb-4">Custom Colors Test</h2>
          <div class="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div class="text-center">
              <div class="w-16 h-16 bg-primary-50 rounded-lg mb-2 mx-auto border"></div>
              <span class="text-xs text-gray-600">primary-50</span>
            </div>
            <div class="text-center">
              <div class="w-16 h-16 bg-primary-500 rounded-lg mb-2 mx-auto"></div>
              <span class="text-xs text-gray-600">primary-500</span>
            </div>
            <div class="text-center">
              <div class="w-16 h-16 bg-primary-600 rounded-lg mb-2 mx-auto"></div>
              <span class="text-xs text-gray-600">primary-600</span>
            </div>
            <div class="text-center">
              <div class="w-16 h-16 bg-primary-700 rounded-lg mb-2 mx-auto"></div>
              <span class="text-xs text-gray-600">primary-700</span>
            </div>
            <div class="text-center">
              <div class="w-16 h-16 bg-primary-900 rounded-lg mb-2 mx-auto"></div>
              <span class="text-xs text-gray-600">primary-900</span>
            </div>
          </div>
        </div>

        <!-- Animation Test -->
        <div class="card p-6">
          <h2 class="text-lg font-semibold text-gray-900 mb-4">Animation Test</h2>
          <div class="space-y-4">
            <div class="w-32 h-8 bg-primary-600 rounded animate-fade-in"></div>
            <p class="text-sm text-gray-600">This element should fade in with the custom animation.</p>
          </div>
        </div>

        <!-- Apollo GraphQL Connection Test -->
        <div class="card p-6">
          <h2 class="text-lg font-semibold text-gray-900 mb-4">Apollo GraphQL Connection Test</h2>
          
          <!-- Categories Test -->
          <div class="mb-6">
            <h3 class="text-md font-medium text-gray-800 mb-3">Product Categories</h3>
            
            <div v-if="categoriesLoading" class="text-blue-600">
              <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 inline-block mr-2"></div>
              Loading categories...
            </div>
            
            <div v-else-if="categoriesError" class="text-red-600">
              <p><strong>Error:</strong> {{ categoriesError.message }}</p>
              <p class="text-sm mt-1">Make sure the Rails backend is running on localhost:3000</p>
            </div>
            
            <div v-else-if="categories.length > 0" class="text-green-600">
              <p><strong>✓ Connected!</strong> Found {{ categories.length }} categories:</p>
              <ul class="mt-2 text-sm text-gray-600">
                <li v-for="category in categories" :key="category.id" class="ml-4">
                  • {{ category.name }}
                </li>
              </ul>
            </div>
            
            <div v-else class="text-yellow-600">
              ✓ Connected, but no categories found. Run `rails db:seed` in the backend.
            </div>
          </div>
          
          <!-- Products Test -->
          <div>
            <h3 class="text-md font-medium text-gray-800 mb-3">Products</h3>
            
            <div v-if="productsLoading" class="text-blue-600">
              <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 inline-block mr-2"></div>
              Loading products...
            </div>
            
            <div v-else-if="productsError" class="text-red-600">
              <p><strong>Error:</strong> {{ productsError.message }}</p>
            </div>
            
            <div v-else-if="products.length > 0" class="text-green-600">
              <p><strong>✓ Connected!</strong> Found {{ products.length }} products:</p>
              <div class="mt-2 grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600">
                <div v-for="product in products.slice(0, 4)" :key="product.id" class="border border-gray-200 rounded p-2">
                  <div class="font-medium">{{ product.name }}</div>
                  <div class="text-xs">₱{{ (product.priceCents / 100).toFixed(2) }} • {{ product.category.name }}</div>
                </div>
              </div>
              <p v-if="products.length > 4" class="text-xs text-gray-500 mt-2">
                ... and {{ products.length - 4 }} more products
              </p>
            </div>
            
            <div v-else class="text-yellow-600">
              ✓ Connected, but no products found. Run `rails db:seed` in the backend.
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>
