<template>
  <div class="space-y-6">
    <!-- Page Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Order Manager</h1>
        <p class="text-gray-600 mt-1">Manage all customer orders</p>
      </div>
      
      <BaseButton
        @click="router.push({ name: 'CreateOrder' })"
        size="lg"
        :left-icon="PlusIcon"
      >
        Create Order
      </BaseButton>
    </div>

    <!-- Order Status Tabs -->
    <div class="bg-white rounded-lg shadow-sm border border-gray-200">
      <div class="border-b border-gray-200">
        <nav class="-mb-px flex space-x-8 px-6">
          <button
            v-for="tab in statusTabs"
            :key="tab.status"
            @click="activeStatus = tab.status"
            :class="[
              'py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200',
              activeStatus === tab.status
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            ]"
          >
            {{ tab.label }}
            <span 
              v-if="tab.count > 0"
              :class="[
                'ml-2 py-1 px-2 rounded-full text-xs font-medium',
                activeStatus === tab.status
                  ? 'bg-primary-100 text-primary-700'
                  : 'bg-gray-100 text-gray-600'
              ]"
            >
              {{ tab.count }}
            </span>
          </button>
        </nav>
      </div>

      <!-- Orders List -->
      <div class="p-6">
        <!-- Loading State -->
        <div v-if="ordersLoading" class="text-center py-12">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p class="text-gray-500">Loading orders...</p>
        </div>

        <!-- Empty State -->
        <div v-else-if="filteredOrders.length === 0" class="text-center py-12">
          <ClipboardDocumentListIcon class="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 class="text-lg font-medium text-gray-900 mb-2">
            No {{ activeStatus.toLowerCase() }} orders
          </h3>
          <p class="text-gray-500 mb-6">
            {{ activeStatus === 'PENDING' 
              ? 'Create your first order to get started' 
              : `No orders with ${activeStatus.toLowerCase()} status` 
            }}
          </p>
          
          <BaseButton
            v-if="activeStatus === 'PENDING'"
            @click="router.push({ name: 'CreateOrder' })"
          >
            Create First Order
          </BaseButton>
        </div>

        <!-- Orders List -->
        <div v-else class="overflow-hidden">
          <div class="space-y-4">
            <OrderCard
              v-for="order in filteredOrders"
              :key="order.id"
              :order="order"
              :is-confirming="confirmingOrderId === order.id"
              :is-completing="completingOrderId === order.id"
              @view="handleViewOrder"
              @confirm="handleConfirmOrder"
              @complete="handleCompleteOrder"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { PlusIcon, ClipboardDocumentListIcon } from '@heroicons/vue/24/outline'
import { useOrders, useOrderActions } from '../composables/useOrders'
import BaseButton from '../components/BaseButton.vue'
import OrderCard from '../components/OrderCard.vue'
import type { Order, OrderStatus } from '../types'

// Composables
const router = useRouter()
const { orders, loading: ordersLoading, refetch } = useOrders()
const { confirmOrder, completeOrder } = useOrderActions()

// State
const activeStatus = ref<OrderStatus>('PENDING')
const confirmingOrderId = ref<string | null>(null)
const completingOrderId = ref<string | null>(null)

// Computed
const statusTabs = computed(() => [
  {
    status: 'PENDING' as OrderStatus,
    label: 'Pending',
    count: orders.value.filter((o: Order) => o.status === 'PENDING').length
  },
  {
    status: 'CONFIRMED' as OrderStatus,
    label: 'Confirmed', 
    count: orders.value.filter((o: Order) => o.status === 'CONFIRMED').length
  },
  {
    status: 'COMPLETED' as OrderStatus,
    label: 'Completed',
    count: orders.value.filter((o: Order) => o.status === 'COMPLETED').length
  }
])

const filteredOrders = computed(() => 
  orders.value.filter((order: Order) => order.status === activeStatus.value)
)

// Methods
function handleViewOrder(order: Order) {
  router.push({ name: 'OrderDetail', params: { id: order.id } })
}

async function handleConfirmOrder(order: Order) {
  confirmingOrderId.value = order.id
  
  try {
    const result = await confirmOrder({ orderId: order.id })
    if (result.success) {
      // Refresh orders list
      refetch()
      
      // Show success message (you can integrate with notification system)
      console.log('Order confirmed successfully')
    } else {
      // Handle error
      console.error('Failed to confirm order:', result.errors)
    }
  } catch (error) {
    console.error('Error confirming order:', error)
  } finally {
    confirmingOrderId.value = null
  }
}

async function handleCompleteOrder(order: Order) {
  completingOrderId.value = order.id
  
  try {
    const result = await completeOrder({ orderId: order.id })
    if (result.success) {
      // Refresh orders list
      refetch()
      
      // Show success message
      console.log('Order completed successfully')
    } else {
      // Handle error
      console.error('Failed to complete order:', result.errors)
    }
  } catch (error) {
    console.error('Error completing order:', error)
  } finally {
    completingOrderId.value = null
  }
}

// Lifecycle
onMounted(() => {
  // Set default active tab based on what has orders
  if (orders.value.filter((o: Order) => o.status === 'PENDING').length === 0) {
    if (orders.value.filter((o: Order) => o.status === 'CONFIRMED').length > 0) {
      activeStatus.value = 'CONFIRMED'
    } else if (orders.value.filter((o: Order) => o.status === 'COMPLETED').length > 0) {
      activeStatus.value = 'COMPLETED'
    }
  }
})
</script>
