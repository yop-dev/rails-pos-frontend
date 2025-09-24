<template>
  <div class="space-y-6">
    <!-- Page Header -->
    <div class="flex items-center justify-between">
      <div class="flex items-center space-x-4">
        <BaseButton
          @click="router.push({ name: 'OrderManager' })"
          variant="secondary"
          size="sm"
          :left-icon="ArrowLeftIcon"
        >
          Back to Orders
        </BaseButton>
        
        <div v-if="order">
          <h1 class="text-2xl font-bold text-gray-900">{{ order.reference }}</h1>
          <div class="flex items-center space-x-4 mt-1">
            <p class="text-gray-600">{{ formatDate(order.createdAt) }}</p>
            <span 
              :class="[
                'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                getStatusClasses(order.status)
              ]"
            >
              {{ getStatusLabel(order.status) }}
            </span>
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
        </div>
        <div v-else class="h-16 flex items-center">
          <div class="animate-pulse">
            <div class="h-6 bg-gray-300 rounded w-48 mb-2"></div>
            <div class="h-4 bg-gray-300 rounded w-32"></div>
          </div>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="flex items-center space-x-3" v-if="order">
        <BaseButton
          @click="printReceipt"
          variant="secondary"
          size="sm"
          :left-icon="PrinterIcon"
        >
          Print Receipt
        </BaseButton>

        <!-- Status Action Buttons -->
        <BaseButton
          v-if="order.status === 'PENDING'"
          @click="handleConfirmOrder"
          variant="primary"
          size="sm"
          :loading="isConfirming"
          :left-icon="CheckIcon"
        >
          Confirm Order
        </BaseButton>

        <BaseButton
          v-else-if="order.status === 'CONFIRMED'"
          @click="handleCompleteOrder"
          variant="success"
          size="sm"
          :loading="isCompleting"
          :left-icon="CheckCircleIcon"
        >
          Mark Complete
        </BaseButton>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="text-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
      <p class="text-gray-500 text-lg">Loading order details...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="text-center py-12">
      <div class="text-red-500 mb-4">
        <ExclamationTriangleIcon class="h-12 w-12 mx-auto" />
      </div>
      <h3 class="text-lg font-medium text-gray-900 mb-2">Failed to load order</h3>
      <p class="text-gray-600 mb-6">{{ error.message }}</p>
      <BaseButton @click="refetch" variant="primary">Try Again</BaseButton>
    </div>

    <!-- Order Not Found -->
    <div v-else-if="!order && !loading" class="text-center py-12">
      <div class="text-gray-400 mb-4">
        <DocumentIcon class="h-12 w-12 mx-auto" />
      </div>
      <h3 class="text-lg font-medium text-gray-900 mb-2">Order not found</h3>
      <p class="text-gray-600 mb-6">The order you're looking for doesn't exist or has been removed.</p>
      <BaseButton @click="router.push({ name: 'OrderManager' })" variant="primary">
        Back to Orders
      </BaseButton>
    </div>

    <!-- Order Content -->
    <div v-else-if="order" class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Main Content -->
      <div class="lg:col-span-2 space-y-6">
        <!-- Order Timeline -->
        <div class="card p-6">
          <h2 class="text-lg font-semibold text-gray-900 mb-4">Order Timeline</h2>
          <OrderTimeline :order="order" />
        </div>

        <!-- Order Items -->
        <div class="card p-6">
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-lg font-semibold text-gray-900">Order Items</h2>
            <span class="text-sm text-gray-500">{{ order.items?.length || 0 }} items</span>
          </div>
          
          <div class="space-y-4">
            <OrderDetailItem
              v-for="item in order.items"
              :key="item.id"
              :item="item"
            />
          </div>
        </div>
      </div>

      <!-- Sidebar -->
      <div class="space-y-6">
        <!-- Customer Information -->
        <div class="card p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Customer Information</h3>
          <div class="space-y-3">
            <div>
              <div class="text-sm font-medium text-gray-700">Name</div>
              <div class="text-gray-900">{{ order.customer.fullName }}</div>
            </div>
            <div>
              <div class="text-sm font-medium text-gray-700">Email</div>
              <div class="text-gray-900">{{ order.customer.email }}</div>
            </div>
            <div v-if="order.customer.phone">
              <div class="text-sm font-medium text-gray-700">Phone</div>
              <div class="text-gray-900">{{ order.customer.phone }}</div>
            </div>
          </div>
        </div>

        <!-- Delivery Address -->
        <div v-if="order.deliveryAddress" class="card p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Delivery Address</h3>
          <div class="text-gray-900 space-y-1">
            <div v-if="order.deliveryAddress.unitFloorBuilding">
              {{ order.deliveryAddress.unitFloorBuilding }}
            </div>
            <div>{{ order.deliveryAddress.street }}</div>
            <div>
              {{ order.deliveryAddress.barangay }}, {{ order.deliveryAddress.city }}
            </div>
            <div>{{ order.deliveryAddress.province }} {{ order.deliveryAddress.postalCode }}</div>
          </div>
        </div>

        <!-- Order Summary -->
        <div class="card p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Order Summary</h3>
          <div class="space-y-3">
            <div class="flex justify-between text-sm">
              <span class="text-gray-600">Subtotal</span>
              <span class="text-gray-900">{{ order.subtotal.formatted }}</span>
            </div>
            <div class="flex justify-between text-sm" v-if="order.shippingFee">
              <span class="text-gray-600">{{ order.shippingMethodLabel || 'Shipping' }}</span>
              <span class="text-gray-900">{{ order.shippingFee.formatted }}</span>
            </div>
            <div class="flex justify-between text-sm" v-if="order.convenienceFee">
              <span class="text-gray-600">Convenience Fee</span>
              <span class="text-gray-900">{{ order.convenienceFee.formatted }}</span>
            </div>
            <div class="flex justify-between text-sm" v-if="order.discount">
              <span class="text-gray-600">Discount</span>
              <span class="text-red-600">-{{ order.discount.formatted }}</span>
            </div>
            <div v-if="order.voucherCode" class="text-xs text-gray-500">
              Voucher: {{ order.voucherCode }}
            </div>
            <div class="border-t border-gray-200 pt-3">
              <div class="flex justify-between font-semibold text-lg">
                <span class="text-gray-900">Total</span>
                <span class="text-gray-900">{{ order.total.formatted }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Payment & Shipping Methods -->
        <div class="card p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Payment & Delivery</h3>
          <div class="space-y-3">
            <div>
              <div class="text-sm font-medium text-gray-700">Payment Method</div>
              <div class="text-gray-900">{{ order.paymentMethodLabel || 'Not specified' }}</div>
            </div>
            <div v-if="order.source === 'ONLINE'">
              <div class="text-sm font-medium text-gray-700">Shipping Method</div>
              <div class="text-gray-900">{{ order.shippingMethodLabel || 'Not specified' }}</div>
            </div>
            <div v-else>
              <div class="text-sm font-medium text-gray-700">Fulfillment</div>
              <div class="text-gray-900">In-Store Pickup</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Print Receipt Component (Hidden) -->
    <PrintReceipt
      v-if="order"
      ref="printReceiptRef"
      :order="order"
      class="hidden"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { 
  ArrowLeftIcon,
  PrinterIcon,
  CheckIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  DocumentIcon
} from '@heroicons/vue/24/outline'
import { useOrder, useOrderActions } from '../composables/useOrders'
import BaseButton from '../components/BaseButton.vue'
import OrderTimeline from '../components/OrderTimeline.vue'
import OrderDetailItem from '../components/OrderDetailItem.vue'
import PrintReceipt from '../components/PrintReceipt.vue'
import type { OrderStatus } from '../types'

// Router & Props
const router = useRouter()
const props = defineProps<{
  id: string
}>()

const orderId = computed(() => props.id)

// Composables
const { order, loading, error, refetch } = useOrder(orderId)
const { confirmOrder, completeOrder } = useOrderActions()

// State
const isConfirming = ref(false)
const isCompleting = ref(false)
const printReceiptRef = ref()

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
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

function printReceipt() {
  if (printReceiptRef.value) {
    printReceiptRef.value.print()
  }
}

async function handleConfirmOrder() {
  if (!order.value) return
  
  isConfirming.value = true
  
  try {
    const result = await confirmOrder({ orderId: order.value.id })
    if (result.success) {
      // Refresh the order data
      refetch()
      console.log('Order confirmed successfully')
    } else {
      console.error('Failed to confirm order:', result.errors)
    }
  } catch (error) {
    console.error('Error confirming order:', error)
  } finally {
    isConfirming.value = false
  }
}

async function handleCompleteOrder() {
  if (!order.value) return
  
  isCompleting.value = true
  
  try {
    const result = await completeOrder({ orderId: order.value.id })
    if (result.success) {
      // Refresh the order data
      refetch()
      console.log('Order completed successfully')
    } else {
      console.error('Failed to complete order:', result.errors)
    }
  } catch (error) {
    console.error('Error completing order:', error)
  } finally {
    isCompleting.value = false
  }
}
</script>
