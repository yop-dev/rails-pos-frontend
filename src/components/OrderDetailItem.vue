<template>
  <div class="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow duration-200">
    <div class="flex items-start space-x-4">
      <!-- Product Image -->
      <div class="flex-shrink-0">
        <div class="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden">
          <img
            v-if="item.product?.photoUrl"
            :src="item.product.photoUrl"
            :alt="item.productName"
            class="w-full h-full object-cover"
            @error="handleImageError"
          />
          <div v-else class="w-full h-full flex items-center justify-center">
            <CubeIcon class="w-8 h-8 text-gray-400" />
          </div>
        </div>
      </div>

      <!-- Product Details -->
      <div class="flex-1 min-w-0">
        <div class="flex items-start justify-between">
          <div class="flex-1">
            <h4 class="text-base font-medium text-gray-900">
              {{ item.productName }}
            </h4>
            
            <!-- Product Type Badge -->
            <div class="mt-1 flex items-center space-x-2">
              <span 
                :class="[
                  'inline-flex items-center px-2 py-0.5 rounded text-xs font-medium',
                  item.product?.productType === 'DIGITAL'
                    ? 'bg-purple-100 text-purple-800'
                    : 'bg-gray-100 text-gray-800'
                ]"
              >
                {{ item.product?.productType === 'DIGITAL' ? 'Digital' : 'Physical' }}
              </span>
            </div>

            <!-- Quantity and Price Info -->
            <div class="mt-3 flex items-center space-x-4 text-sm text-gray-600">
              <div class="flex items-center">
                <span class="font-medium text-gray-900">Qty:</span>
                <span class="ml-1">{{ item.quantity }}</span>
              </div>
              <div class="flex items-center">
                <span class="font-medium text-gray-900">Unit Price:</span>
                <span class="ml-1">{{ item.unitPrice.formatted }}</span>
              </div>
            </div>
          </div>

          <!-- Total Price -->
          <div class="text-right">
            <div class="text-lg font-semibold text-gray-900">
              {{ item.totalPrice.formatted }}
            </div>
            <div v-if="item.quantity > 1" class="text-xs text-gray-500">
              {{ item.unitPrice.formatted }} × {{ item.quantity }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Product Details Expand (Optional) -->
    <div v-if="showDetails" class="mt-4 pt-4 border-t border-gray-200">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
        <div v-if="item.product?.id">
          <span class="font-medium text-gray-700">Product ID:</span>
          <span class="ml-1 text-gray-900">{{ item.product.id }}</span>
        </div>
        <div>
          <span class="font-medium text-gray-700">Item Total:</span>
          <span class="ml-1 text-gray-900 font-medium">{{ item.totalPrice.formatted }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { CubeIcon } from '@heroicons/vue/24/outline'
import type { OrderItem } from '../types'

const props = defineProps<{
  item: OrderItem
  showDetails?: boolean
}>()

const imageError = ref(false)

function handleImageError() {
  imageError.value = true
}
</script>