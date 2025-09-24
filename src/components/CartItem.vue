<template>
  <div class="bg-white rounded-lg border border-gray-200 p-4 space-y-3">
    <div class="flex items-start space-x-3">
      <!-- Product Image -->
      <div class="flex-shrink-0 w-16 h-16 bg-gray-100 rounded-lg overflow-hidden">
        <img
          v-if="item.photoUrl"
          :src="item.photoUrl"
          :alt="item.name"
          class="w-full h-full object-cover"
        />
        <div v-else class="w-full h-full flex items-center justify-center">
          <CubeIcon class="w-6 h-6 text-gray-400" />
        </div>
      </div>

      <!-- Product Info -->
      <div class="flex-1 min-w-0">
        <h4 class="text-sm font-medium text-gray-900 truncate">{{ item.name }}</h4>
        <p class="text-xs text-gray-500 mt-1">{{ item.productType }}</p>
        <div class="mt-2 flex items-center space-x-2">
          <span class="text-sm font-semibold text-primary-600">
            ₱{{ formatPrice(item.priceCents) }}
          </span>
          <span class="text-xs text-gray-400">each</span>
        </div>
      </div>

      <!-- Remove Button -->
      <button
        @click="$emit('remove', item.productId)"
        class="flex-shrink-0 text-gray-400 hover:text-red-500 transition-colors p-1"
        title="Remove item"
      >
        <TrashIcon class="w-4 h-4" />
      </button>
    </div>

    <!-- Quantity Controls -->
    <div class="flex items-center justify-between">
      <div class="flex items-center space-x-3">
        <label class="text-sm font-medium text-gray-700">Qty:</label>
        
        <div class="flex items-center space-x-1">
          <button
            @click="decreaseQuantity"
            :disabled="item.quantity <= 1"
            class="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <MinusIcon class="w-4 h-4" />
          </button>
          
          <input
            :value="item.quantity"
            @change="updateQuantityFromInput"
            type="number"
            min="1"
            class="w-16 text-center border border-gray-300 rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
          />
          
          <button
            @click="increaseQuantity"
            class="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-50 transition-colors"
          >
            <PlusIcon class="w-4 h-4" />
          </button>
        </div>
      </div>

      <!-- Item Total -->
      <div class="text-right">
        <div class="text-lg font-semibold text-gray-900">
          ₱{{ formatPrice(item.priceCents * item.quantity) }}
        </div>
        <div class="text-xs text-gray-500">
          {{ item.quantity }} × ₱{{ formatPrice(item.priceCents) }}
        </div>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { 
  CubeIcon, 
  TrashIcon, 
  MinusIcon, 
  PlusIcon 
} from '@heroicons/vue/24/outline'
import { formatPrice } from '../composables/useProducts'
import type { CartItem } from '../types'

// Props & Emits
const props = defineProps<{
  item: CartItem
}>()

const emit = defineEmits<{
  'update-quantity': [productId: string, quantity: number]
  'remove': [productId: string]
}>()


// Methods
function increaseQuantity() {
  emit('update-quantity', props.item.productId, props.item.quantity + 1)
}

function decreaseQuantity() {
  if (props.item.quantity > 1) {
    emit('update-quantity', props.item.productId, props.item.quantity - 1)
  }
}

function updateQuantityFromInput(event: Event) {
  const target = event.target as HTMLInputElement
  const quantity = parseInt(target.value) || 1
  
  if (quantity > 0) {
    emit('update-quantity', props.item.productId, quantity)
  }
}
</script>