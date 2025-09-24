<template>
  <div class="fixed inset-0 z-50 overflow-y-auto" @click.self="$emit('close')">
    <div class="flex items-center justify-center min-h-screen p-4" @click.self="$emit('close')">
      <!-- Background overlay -->
      <div class="fixed inset-0 backdrop-blur-md transition-opacity"></div>
      
      <!-- Modal panel -->
      <div class="relative bg-white rounded-lg shadow-xl max-w-md w-full mx-4 max-h-[90vh] overflow-hidden flex flex-col" @click.stop>
        <div class="flex-shrink-0 relative">
          <!-- Close Button -->
          <button
            @click="$emit('close')"
            class="absolute top-3 right-3 text-gray-400 hover:text-gray-600 z-10 bg-white rounded-full p-1 shadow-sm"
          >
            <XMarkIcon class="h-5 w-5" />
          </button>

          <!-- Product Image -->
          <div class="aspect-square bg-gray-100">
            <img
              v-if="product.photoUrl"
              :src="product.photoUrl"
              :alt="product.name"
              class="w-full h-full object-cover"
            />
            <div v-else class="w-full h-full flex items-center justify-center">
              <CubeIcon class="h-16 w-16 text-gray-400" />
            </div>
          </div>
        </div>

        <!-- Product Details -->
        <div class="flex-1 overflow-y-auto p-4">
          <h2 class="text-xl font-bold text-gray-900 mb-2">
            {{ product.name }}
          </h2>
          <p class="text-2xl font-bold text-primary-600 mb-3">
            {{ product.price.formatted }}
          </p>

          <div class="mb-3">
            <p class="text-sm text-gray-600 mb-2">{{ product.category.name }}</p>
            <span :class="[
              'inline-flex items-center px-2 py-1 rounded-full text-xs font-medium',
              product.productType === 'DIGITAL' 
                ? 'bg-blue-100 text-blue-800' 
                : 'bg-green-100 text-green-800'
            ]">
              {{ product.productType === 'DIGITAL' ? 'Digital' : 'Physical' }}
            </span>
          </div>

          <div v-if="product.description" class="mb-4">
            <h3 class="text-sm font-medium text-gray-900 mb-1">
              Description
            </h3>
            <p class="text-sm text-gray-700">{{ product.description }}</p>
          </div>

          <!-- Quantity Selector -->
          <div class="flex items-center justify-between mb-4">
            <span class="text-sm font-medium text-gray-700">Quantity:</span>
            <div class="flex items-center space-x-2">
              <button
                @click="decreaseQuantity"
                :disabled="quantity <= 1"
                class="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <MinusIcon class="h-4 w-4" />
              </button>
              <span class="text-lg font-medium w-8 text-center">{{ quantity }}</span>
              <button
                @click="increaseQuantity"
                class="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center"
              >
                <PlusIcon class="h-4 w-4" />
              </button>
            </div>
          </div>

          <!-- Add to Cart Button -->
          <div class="flex gap-2">
            <BaseButton
              @click="handleAddToCart"
              :loading="isAdding"
              size="lg"
              class="flex-1"
            >
              <PlusIcon class="h-5 w-5 mr-2" />
              Add to Cart
            </BaseButton>
          </div>
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