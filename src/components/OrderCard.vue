<template>
  <div class="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200">
    <!-- Order Header -->
    <div class="px-6 py-4 border-b border-gray-200">
      <div class="flex items-center justify-between">
        <div class="flex items-center space-x-4">
          <!-- Order Reference -->
          <div>
            <h3 class="text-lg font-semibold text-gray-900">{{ order.reference }}</h3>
            <p class="text-sm text-gray-500">{{ formatDate(order.createdAt) }}</p>
          </div>
          
          <!-- Order Status Badge -->
          <span 
            :class="[
              'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
              getStatusClasses(order.status)
            ]"
          >
            {{ getStatusLabel(order.status) }}
          </span>
          
          <!-- Order Source Badge -->
          <span 
            :class="[
              'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
              order.source === 'ONLINE' 
                ? 'bg-blue-100 text-blue-800' 
                : 'bg-green-100 text-green-800'
            ]"
          >
            {{ order.source === 'ONLINE' ? 'Online' : 'In-Store' }}
          </span>
        </div>

        <!-- Order Total -->
        <div class="text-right">
          <div class="text-xl font-bold text-gray-900">{{ order.total.formatted }}</div>
          <div class="text-sm text-gray-500">{{ order.items?.length || 0 }} items</div>
        </div>
      </div>
    </div>

    <!-- Order Details -->
    <div class="px-6 py-4">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Customer Information -->
        <div>
          <h4 class="text-sm font-medium text-gray-900 mb-2">Customer</h4>
          <div class="space-y-1 text-sm text-gray-600">
            <div class="font-medium">{{ order.customer.fullName }}</div>
            <div>{{ order.customer.email }}</div>
            <div v-if="order.customer.phone">{{ order.customer.phone }}</div>
          </div>
        </div>

        <!-- Delivery Information -->
        <div v-if="order.deliveryAddress">
          <h4 class="text-sm font-medium text-gray-900 mb-2">Delivery Address</h4>
          <div class="text-sm text-gray-600">
            <div v-if="order.deliveryAddress.unitFloorBuilding">
              {{ order.deliveryAddress.unitFloorBuilding }}
            </div>
            <div>{{ order.deliveryAddress.street }}</div>
            <div>
              {{ order.deliveryAddress.barangay }}, {{ order.deliveryAddress.city }}
            </div>
            <div>{{ order.deliveryAddress.province }}</div>
          </div>
        </div>

        <!-- Order Items Preview -->
        <div class="md:col-span-2">
          <h4 class="text-sm font-medium text-gray-900 mb-2">Items</h4>
          <div class="space-y-2">
            <div 
              v-for="item in order.items?.slice(0, 3)" 
              :key="item.id"
              class="flex items-center justify-between text-sm"
            >
              <div class="flex items-center space-x-2">
                <div class="w-8 h-8 bg-gray-100 rounded-md flex-shrink-0">
                  <img 
                    v-if="item.product?.photoUrl"
                    :src="item.product.photoUrl"
                    :alt="item.productName"
                    class="w-full h-full object-cover rounded-md"
                  />
                  <div v-else class="w-full h-full flex items-center justify-center">
                    <CubeIcon class="w-4 h-4 text-gray-400" />
                  </div>
                </div>
                <span class="text-gray-900">{{ item.productName }}</span>
                <span class="text-gray-500">×{{ item.quantity }}</span>
              </div>
              <span class="font-medium text-gray-900">{{ item.totalPrice.formatted }}</span>
            </div>
            
            <div v-if="(order.items?.length || 0) > 3" class="text-sm text-gray-500">
              ... and {{ (order.items?.length || 0) - 3 }} more items
            </div>
          </div>
        </div>

        <!-- Payment & Shipping Methods -->
        <div class="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-gray-200">
          <div v-if="order.paymentMethodLabel">
            <h5 class="text-xs font-medium text-gray-700 uppercase tracking-wide">Payment Method</h5>
            <p class="mt-1 text-sm text-gray-900">{{ order.paymentMethodLabel }}</p>
          </div>
          
          <div v-if="order.shippingMethodLabel">
            <h5 class="text-xs font-medium text-gray-700 uppercase tracking-wide">Shipping Method</h5>
            <p class="mt-1 text-sm text-gray-900">{{ order.shippingMethodLabel }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Order Actions -->
    <div class="px-6 py-4 bg-gray-50 border-t border-gray-200 rounded-b-lg">
      <div class="flex items-center justify-between">
        <!-- Status Timestamps -->
        <div class="text-xs text-gray-500 space-y-1">
          <div v-if="order.confirmedAt">
            Confirmed: {{ formatDateTime(order.confirmedAt) }}
          </div>
          <div v-if="order.completedAt">
            Completed: {{ formatDateTime(order.completedAt) }}
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="flex items-center space-x-2">
          <!-- View Details Button -->
          <BaseButton
            variant="secondary"
            size="sm"
            @click="$emit('view', order)"
            :left-icon="EyeIcon"
          >
            View Details
          </BaseButton>

          <!-- Status Action Buttons -->
          <BaseButton
            v-if="order.status === 'PENDING'"
            variant="primary"
            size="sm"
            @click="$emit('confirm', order)"
            :loading="isConfirming"
            :left-icon="CheckIcon"
          >
            Confirm Order
          </BaseButton>

          <BaseButton
            v-else-if="order.status === 'CONFIRMED'"
            variant="success"
            size="sm"
            @click="$emit('complete', order)"
            :loading="isCompleting"
            :left-icon="CheckCircleIcon"
          >
            Mark Complete
          </BaseButton>

          <span
            v-else-if="order.status === 'COMPLETED'"
            class="inline-flex items-center px-2.5 py-1.5 text-xs font-medium text-green-800 bg-green-100 rounded-md"
          >
            <CheckCircleIcon class="w-4 h-4 mr-1" />
            Completed
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { 
  CubeIcon, 
  EyeIcon, 
  CheckIcon, 
  CheckCircleIcon 
} from '@heroicons/vue/24/outline'
import BaseButton from './BaseButton.vue'
import type { Order, OrderStatus } from '../types'

// Props & Emits
const props = defineProps<{
  order: Order
  isConfirming?: boolean
  isCompleting?: boolean
}>()

const emit = defineEmits<{
  view: [order: Order]
  confirm: [order: Order]
  complete: [order: Order]
}>()

// Methods
function getStatusClasses(status: OrderStatus): string {
  switch (status) {
    case 'PENDING':
      return 'bg-yellow-100 text-yellow-800'
    case 'CONFIRMED':
      return 'bg-blue-100 text-blue-800'
    case 'COMPLETED':
      return 'bg-green-100 text-green-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

function getStatusLabel(status: OrderStatus): string {
  switch (status) {
    case 'PENDING':
      return 'Pending'
    case 'CONFIRMED':
      return 'Confirmed'
    case 'COMPLETED':
      return 'Completed'
    default:
      return status
  }
}

function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

function formatDateTime(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}
</script>