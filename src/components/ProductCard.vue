<template>
  <div 
    class="group relative bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer"
    @click="$emit('click')"
  >
    <!-- Product Image -->
    <div class="aspect-w-1 aspect-h-1 bg-gray-200 overflow-hidden">
      <img
        v-if="product.photoUrl"
        :src="product.photoUrl"
        :alt="product.name"
        class="w-full h-48 object-cover object-center group-hover:scale-105 transition-transform duration-300"
      />
      <div v-else class="w-full h-48 bg-gray-100 flex items-center justify-center">
        <CubeIcon class="h-12 w-12 text-gray-400" />
      </div>
      
      <!-- Quick Actions Overlay -->
      <div class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
        <div class="space-x-2">
          <BaseButton
            size="sm"
            @click.stop="handleQuickAdd"
            :loading="isAdding"
          >
            Quick Add
          </BaseButton>
        </div>
      </div>
    </div>

    <!-- Product Info -->
    <div class="p-4 space-y-3">
      <div>
        <h3 class="text-sm font-medium text-gray-900 line-clamp-2 group-hover:text-primary-600 transition-colors">
          {{ product.name }}
        </h3>
        <p class="text-xs text-gray-500 mt-1">{{ product.category.name }}</p>
      </div>
      
      <!-- Description -->
      <p v-if="product.description" class="text-xs text-gray-600 line-clamp-2">
        {{ product.description }}
      </p>
      
      <!-- Price -->
      <div class="flex flex-col">
        <span class="text-lg font-semibold text-gray-900">
          {{ product.price.formatted }}
        </span>
        <span class="text-xs text-gray-500">{{ product.price.currency }}</span>
      </div>
    </div>

    <!-- Product Type Badge -->
    <div class="absolute top-3 left-3">
      <span 
        :class="[
          'inline-flex items-center px-2 py-1 rounded-full text-xs font-medium',
          product.productType === 'DIGITAL'
            ? 'bg-blue-100 text-blue-800'
            : 'bg-green-100 text-green-800'
        ]"
      >
        {{ product.productType === 'DIGITAL' ? 'Digital' : 'Physical' }}
      </span>
    </div>

    <!-- Active Status Badge -->
    <div v-if="!product.active" class="absolute top-3 right-3">
      <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
        Inactive
      </span>
    </div>


    <!-- Stock Status Indicator -->
    <div v-if="showStockStatus" class="absolute bottom-0 left-0 right-0">
      <div class="bg-gray-900 bg-opacity-75 text-white text-xs py-1 px-3">
        <div class="flex items-center justify-between">
          <span>Stock Status</span>
          <span class="font-medium">{{ stockStatus }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { 
  CubeIcon
} from '@heroicons/vue/24/outline'
import BaseButton from './BaseButton.vue'
import type { Product } from '../types'

// Props & Emits
const props = withDefaults(defineProps<{
  product: Product
  showStockStatus?: boolean
}>(), {
  showStockStatus: false
})

const emit = defineEmits<{
  click: []
  'add-to-cart': [product: Product, quantity: number]
}>()

// State
const isAdding = ref(false)

// Computed
const stockStatus = computed(() => {
  // This would be replaced with actual stock data from the backend
  return 'In Stock'
})

// Methods
async function handleQuickAdd() {
  isAdding.value = true
  
  try {
    // Simulate adding delay for UX
    await new Promise(resolve => setTimeout(resolve, 300))
    
    emit('add-to-cart', props.product, 1)
  } finally {
    isAdding.value = false
  }
}
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.aspect-w-1 {
  position: relative;
  width: 100%;
}

.aspect-h-1 {
  padding-bottom: 100%;
}

.aspect-w-1 > * {
  position: absolute;
  height: 100%;
  width: 100%;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
}
</style>