<template>
  <div class="space-y-4">
    <!-- Shipping Methods List -->
    <div class="space-y-3">
      <label
        v-for="method in availableShippingMethods"
        :key="method.code"
        class="flex items-start p-4 border border-gray-200 rounded-lg cursor-pointer transition-all duration-200 hover:border-primary-300 hover:bg-primary-50"
        :class="[
          selectedMethod === method.code 
            ? 'border-primary-500 bg-primary-50 ring-1 ring-primary-500' 
            : 'border-gray-200'
        ]"
      >
        <input
          v-model="selectedMethod"
          :value="method.code"
          type="radio"
          name="shippingMethod"
          class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 mt-1"
          @change="handleMethodChange"
        />
        
        <div class="ml-3 flex-1">
          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-2">
              <!-- Method Icon -->
              <component 
                :is="method.icon" 
                class="h-5 w-5 text-gray-600"
              />
              
              <div>
                <h4 class="text-sm font-medium text-gray-900">
                  {{ method.label }}
                </h4>
                <p class="text-xs text-gray-500 mt-1">
                  {{ method.description }}
                </p>
              </div>
            </div>
            
            <!-- Price -->
            <div class="text-right">
              <div class="text-sm font-semibold text-gray-900">
                {{ method.feeCents === 0 ? 'Free' : formatPrice(method.feeCents) }}
              </div>
              <div v-if="method.estimatedDays" class="text-xs text-gray-500">
                {{ method.estimatedDays }}
              </div>
            </div>
          </div>
          
          <!-- Additional Info -->
          <div v-if="method.additionalInfo" class="mt-2 text-xs text-gray-600">
            {{ method.additionalInfo }}
          </div>
        </div>
      </label>
    </div>
    
    <!-- Selected Method Summary -->
    <div v-if="selectedMethodDetails" class="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
      <div class="flex items-center justify-between">
        <div>
          <h4 class="font-medium text-green-900">Selected Shipping Method</h4>
          <p class="text-sm text-green-800 mt-1">{{ selectedMethodDetails.label }}</p>
        </div>
        <div class="text-right">
          <div class="text-lg font-semibold text-green-900">
            {{ selectedMethodDetails.feeCents === 0 ? 'Free' : formatPrice(selectedMethodDetails.feeCents) }}
          </div>
          <div v-if="selectedMethodDetails.estimatedDays" class="text-xs text-green-700">
            {{ selectedMethodDetails.estimatedDays }}
          </div>
        </div>
      </div>
    </div>
    
    <!-- Delivery Address Info -->
    <div v-if="deliveryAddress" class="mt-4 p-3 bg-gray-50 border border-gray-200 rounded-lg">
      <h4 class="text-sm font-medium text-gray-900 mb-2">Delivering to:</h4>
      <div class="text-sm text-gray-700">
        <div v-if="deliveryAddress.unitFloorBuilding" class="mb-1">
          {{ deliveryAddress.unitFloorBuilding }}
        </div>
        <div>{{ formatAddressDisplay(deliveryAddress) }}</div>
      </div>
    </div>
    
    <!-- Shipping Notes -->
    <div class="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
      <h4 class="font-medium text-blue-900 mb-2">Shipping Information</h4>
      <div class="space-y-2 text-sm text-blue-800">
        <div class="flex items-start">
          <InformationCircleIcon class="h-4 w-4 text-blue-500 mt-0.5 mr-2 flex-shrink-0" />
          <span>Delivery times are estimates and may vary based on location and weather conditions.</span>
        </div>
        <div class="flex items-start">
          <InformationCircleIcon class="h-4 w-4 text-blue-500 mt-0.5 mr-2 flex-shrink-0" />
          <span>Free delivery applies to orders within Metro Manila only.</span>
        </div>
        <div class="flex items-start">
          <InformationCircleIcon class="h-4 w-4 text-blue-500 mt-0.5 mr-2 flex-shrink-0" />
          <span>Same-day delivery must be placed before 2:00 PM.</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { 
  TruckIcon, 
  ClockIcon, 
  BoltIcon,
  InformationCircleIcon 
} from '@heroicons/vue/24/outline'
import { useCartStore } from '../stores/cart'
import { useGlobalStore } from '../stores/global'
import { formatPrice } from '../composables/useProducts'
import type { Address, ShippingOption } from '../types'

// Props & Emits
const props = defineProps<{
  deliveryAddress?: Address | null
}>()

const emit = defineEmits<{
  'method-selected': [methodCode: string, methodLabel: string, feeCents: number]
}>()

// State
const selectedMethod = ref('')

// Composables
const cartStore = useCartStore()
const globalStore = useGlobalStore()

// Predefined shipping methods
const shippingMethods: Array<ShippingOption & { 
  icon: any,
  description: string,
  estimatedDays?: string,
  additionalInfo?: string
}> = [
  {
    code: 'standard',
    label: 'Standard Delivery',
    feeCents: 500, // ₱5.00
    icon: TruckIcon,
    description: 'Regular delivery within Metro Manila',
    estimatedDays: '2-3 business days',
    additionalInfo: 'Most popular option - reliable and affordable'
  },
  {
    code: 'express',
    label: 'Express Delivery',
    feeCents: 1500, // ₱15.00
    icon: BoltIcon,
    description: 'Faster delivery for urgent orders',
    estimatedDays: '1-2 business days',
    additionalInfo: 'Priority handling and faster processing'
  },
  {
    code: 'same_day',
    label: 'Same Day Delivery',
    feeCents: 3000, // ₱30.00
    icon: ClockIcon,
    description: 'Delivery within the same day',
    estimatedDays: 'Same day',
    additionalInfo: 'Available for orders placed before 2:00 PM'
  },
  {
    code: 'pickup',
    label: 'Store Pickup',
    feeCents: 0, // Free
    icon: TruckIcon,
    description: 'Pick up your order at our store',
    estimatedDays: 'Ready in 2-4 hours',
    additionalInfo: 'Free option - great for digital products'
  }
]

// Computed
const availableShippingMethods = computed(() => {
  if (!props.deliveryAddress) {
    // If no delivery address, only show pickup
    return shippingMethods.filter(method => method.code === 'pickup')
  }
  
  // Check if address is within Metro Manila for free/discounted shipping
  const isMetroManila = props.deliveryAddress.province?.toLowerCase().includes('metro manila')
  
  return shippingMethods.map(method => {
    // Apply free delivery logic for Metro Manila
    if (isMetroManila && method.code === 'standard' && cartStore.subtotalCents >= 100000) {
      // Free standard delivery for orders over ₱1000 in Metro Manila
      return {
        ...method,
        feeCents: 0,
        additionalInfo: 'Free delivery for orders over ₱1,000.00'
      }
    }
    
    return method
  })
})

const selectedMethodDetails = computed(() => {
  if (!selectedMethod.value) return null
  return availableShippingMethods.value.find(method => method.code === selectedMethod.value)
})

// Methods
function formatAddressDisplay(address: Address | null): string {
  if (!address) return ''
  
  const parts = [
    address.street,
    address.barangay,
    address.city,
    address.province
  ].filter(Boolean)
  
  return parts.join(', ')
}

function handleMethodChange() {
  const method = selectedMethodDetails.value
  if (method) {
    // Update cart store
    cartStore.setShippingMethod(method.code)
    
    // Emit to parent
    emit('method-selected', method.code, method.label, method.feeCents)
    
    globalStore.showSuccess(
      'Shipping Method Selected', 
      `${method.label} selected (${method.feeCents === 0 ? 'Free' : formatPrice(method.feeCents)})`
    )
  }
}

// Auto-select first available method if none selected
if (availableShippingMethods.value.length === 1) {
  selectedMethod.value = availableShippingMethods.value[0].code
  handleMethodChange()
}
</script>