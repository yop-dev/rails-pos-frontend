<template>
  <div class="fixed inset-0 z-50 overflow-y-auto">
    <div class="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
      <!-- Background overlay -->
      <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" @click="$emit('close')"></div>
      
      <!-- Modal panel -->
      <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
        <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
          <!-- Header -->
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg leading-6 font-medium text-gray-900">
              Product Details
            </h3>
            <button
              @click="$emit('close')"
              class="text-gray-400 hover:text-gray-600"
            >
              <XMarkIcon class="h-6 w-6" />
            </button>
          </div>
          
          <!-- Product Info -->
          <div class="space-y-4">
            <!-- Product Image -->
            <div class="w-full h-48 bg-gray-200 rounded-lg overflow-hidden">
              <img
                v-if="product.photoUrl"
                :src="product.photoUrl"
                :alt="product.name"
                class="w-full h-full object-cover"
              />
              <div v-else class="w-full h-full flex items-center justify-center">
                <CubeIcon class="h-12 w-12 text-gray-400" />
              </div>
            </div>
            
            <!-- Product Details -->
            <div>
              <h4 class="text-lg font-semibold text-gray-900">{{ product.name }}</h4>
              <p class="text-sm text-gray-600 mt-1">{{ product.category.name }}</p>
              
              <div class="mt-2">
                <span class="text-2xl font-bold text-primary-600">{{ product.price.formatted }}</span>
              </div>
              
              <div class="mt-2">
                <span :class="[
                  'inline-flex items-center px-2 py-1 rounded-full text-xs font-medium',
                  product.productType === 'DIGITAL' 
                    ? 'bg-blue-100 text-blue-800' 
                    : 'bg-green-100 text-green-800'
                ]">
                  {{ product.productType === 'DIGITAL' ? 'Digital Product' : 'Physical Product' }}
                </span>
              </div>
              
              <p v-if="product.description" class="text-sm text-gray-700 mt-4">
                {{ product.description }}
              </p>
            </div>
            
            <!-- Quantity Selection -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Quantity</label>
              <div class="flex items-center space-x-3">
                <button
                  @click="decreaseQuantity"
                  :disabled="quantity <= 1"
                  class="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <MinusIcon class="w-4 h-4" />
                </button>
                
                <input
                  v-model.number="quantity"
                  type="number"
                  min="1"
                  class="w-16 text-center border border-gray-300 rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-primary-500"
                />
                
                <button
                  @click="increaseQuantity"
                  class="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-50"
                >
                  <PlusIcon class="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Footer -->
        <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
          <BaseButton
            @click="handleAddToCart"
            :loading="isAdding"
            class="w-full sm:ml-3 sm:w-auto"
          >
            Add to Cart
          </BaseButton>
          <BaseButton
            variant="secondary"
            @click="$emit('close')"
            class="mt-3 w-full sm:mt-0 sm:w-auto"
          >
            Cancel
          </BaseButton>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { XMarkIcon, CubeIcon, MinusIcon, PlusIcon } from '@heroicons/vue/24/outline'
import BaseButton from './BaseButton.vue'
import type { Product } from '../types'

// Props & Emits
const props = defineProps<{
  product: Product
}>()

const emit = defineEmits<{
  close: []
  'add-to-cart': [product: Product, quantity: number]
}>()

// State
const quantity = ref(1)
const isAdding = ref(false)

// Methods
function increaseQuantity() {
  quantity.value++
}

function decreaseQuantity() {
  if (quantity.value > 1) {
    quantity.value--
  }
}

async function handleAddToCart() {
  isAdding.value = true
  
  // Simulate adding delay for UX
  await new Promise(resolve => setTimeout(resolve, 300))
  
  emit('add-to-cart', props.product, quantity.value)
  isAdding.value = false
}
</script>