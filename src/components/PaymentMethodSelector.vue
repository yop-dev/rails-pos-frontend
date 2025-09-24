<template>
  <div class="space-y-4">
    <!-- Payment Methods List -->
    <div class="space-y-3">
      <label
        v-for="method in availablePaymentMethods"
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
          name="paymentMethod"
          class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 mt-1"
          @change="handleMethodChange"
        />
        
        <div class="ml-3 flex-1">
          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-3">
              <!-- Method Icon -->
              <component 
                :is="method.icon" 
                class="h-6 w-6 text-gray-600"
              />
              
              <div>
                <h4 class="text-sm font-medium text-gray-900">
                  {{ method.label }}
                </h4>
                <p class="text-xs text-gray-500 mt-1">
                  {{ method.description }}
                </p>
                
                <!-- Supported Cards/Methods -->
                <div v-if="method.supportedMethods" class="flex items-center space-x-2 mt-2">
                  <span class="text-xs text-gray-400">Supports:</span>
                  <div class="flex items-center space-x-1">
                    <span 
                      v-for="supported in method.supportedMethods"
                      :key="supported"
                      class="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-600"
                    >
                      {{ supported }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Convenience Fee -->
            <div class="text-right">
              <div class="text-sm font-semibold text-gray-900">
                {{ method.convenienceFeeCents === 0 ? 'No Fee' : '+' + formatPrice(method.convenienceFeeCents) }}
              </div>
              <div class="text-xs text-gray-500">
                {{ method.convenienceFeeCents === 0 ? 'Free' : 'Convenience Fee' }}
              </div>
            </div>
          </div>
          
          <!-- Processing Time -->
          <div v-if="method.processingTime" class="mt-2 flex items-center text-xs text-gray-600">
            <ClockIcon class="h-3 w-3 mr-1" />
            {{ method.processingTime }}
          </div>
          
          <!-- Security Badge -->
          <div v-if="method.secure" class="mt-2 flex items-center text-xs text-green-600">
            <ShieldCheckIcon class="h-3 w-3 mr-1" />
            Secure payment processing
          </div>
        </div>
      </label>
    </div>
    
    <!-- Selected Method Summary -->
    <div v-if="selectedMethodDetails" class="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
      <div class="flex items-center justify-between">
        <div>
          <h4 class="font-medium text-green-900">Selected Payment Method</h4>
          <p class="text-sm text-green-800 mt-1">{{ selectedMethodDetails.label }}</p>
        </div>
        <div class="text-right">
          <div class="text-lg font-semibold text-green-900">
            {{ selectedMethodDetails.convenienceFeeCents === 0 ? 'No Fee' : '+' + formatPrice(selectedMethodDetails.convenienceFeeCents) }}
          </div>
          <div v-if="selectedMethodDetails.processingTime" class="text-xs text-green-700">
            {{ selectedMethodDetails.processingTime }}
          </div>
        </div>
      </div>
    </div>
    
    <!-- Payment Form (for card payments) -->
    <div v-if="selectedMethod === 'card' && showPaymentForm" class="mt-6 p-4 border border-gray-200 rounded-lg">
      <h4 class="font-medium text-gray-900 mb-4">Card Information</h4>
      <div class="space-y-4">
        <BaseInput
          v-model="cardForm.cardNumber"
          label="Card Number"
          placeholder="1234 5678 9012 3456"
          :error="cardErrors.cardNumber"
        />
        
        <div class="grid grid-cols-2 gap-4">
          <BaseInput
            v-model="cardForm.expiryDate"
            label="Expiry Date"
            placeholder="MM/YY"
            :error="cardErrors.expiryDate"
          />
          
          <BaseInput
            v-model="cardForm.cvv"
            label="CVV"
            placeholder="123"
            :error="cardErrors.cvv"
          />
        </div>
        
        <BaseInput
          v-model="cardForm.cardholderName"
          label="Cardholder Name"
          placeholder="John Doe"
          :error="cardErrors.cardholderName"
        />
        
        <div class="text-xs text-gray-500">
          <ShieldCheckIcon class="h-4 w-4 inline mr-1" />
          Your payment information is encrypted and secure
        </div>
      </div>
    </div>
    
    <!-- Payment Instructions -->
    <div v-if="selectedMethodDetails?.instructions" class="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
      <h4 class="font-medium text-blue-900 mb-2">Payment Instructions</h4>
      <div class="space-y-2 text-sm text-blue-800">
        <div 
          v-for="instruction in selectedMethodDetails.instructions"
          :key="instruction"
          class="flex items-start"
        >
          <InformationCircleIcon class="h-4 w-4 text-blue-500 mt-0.5 mr-2 flex-shrink-0" />
          <span>{{ instruction }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive } from 'vue'
import { 
  CreditCardIcon,
  BanknotesIcon,
  DevicePhoneMobileIcon,
  BuildingLibraryIcon,
  ClockIcon,
  ShieldCheckIcon,
  InformationCircleIcon 
} from '@heroicons/vue/24/outline'
import { useCartStore } from '../stores/cart'
import { useGlobalStore } from '../stores/global'
import { formatPrice } from '../composables/useProducts'
import BaseInput from './BaseInput.vue'
import type { PaymentOption } from '../types'

// Props & Emits
const emit = defineEmits<{
  'method-selected': [methodCode: string, methodLabel: string, convenienceFeeCents: number]
}>()

// State
const selectedMethod = ref('')
const showPaymentForm = ref(false)

const cardForm = reactive({
  cardNumber: '',
  expiryDate: '',
  cvv: '',
  cardholderName: ''
})

const cardErrors = reactive({
  cardNumber: '',
  expiryDate: '',
  cvv: '',
  cardholderName: ''
})

// Composables
const cartStore = useCartStore()
const globalStore = useGlobalStore()

// Predefined payment methods
const paymentMethods: Array<PaymentOption & { 
  icon: any,
  description: string,
  processingTime?: string,
  secure?: boolean,
  supportedMethods?: string[],
  instructions?: string[]
}> = [
  {
    code: 'cash',
    label: 'Cash on Delivery',
    convenienceFeeCents: 0,
    icon: BanknotesIcon,
    description: 'Pay with cash when your order arrives',
    processingTime: 'No processing time',
    secure: true,
    instructions: [
      'Prepare exact change if possible',
      'Payment is collected upon delivery',
      'No additional fees for cash payments'
    ]
  },
  {
    code: 'card',
    label: 'Credit/Debit Card',
    convenienceFeeCents: 100, // ₱1.00 processing fee
    icon: CreditCardIcon,
    description: 'Pay securely with your card',
    processingTime: 'Instant processing',
    secure: true,
    supportedMethods: ['Visa', 'Mastercard', 'American Express'],
    instructions: [
      'Enter your card details securely',
      'Payment is processed immediately',
      'Small convenience fee applies for card processing'
    ]
  },
  {
    code: 'gcash',
    label: 'GCash',
    convenienceFeeCents: 50, // ₱0.50 processing fee
    icon: DevicePhoneMobileIcon,
    description: 'Pay using GCash mobile wallet',
    processingTime: 'Instant processing',
    secure: true,
    instructions: [
      'You will be redirected to GCash app or website',
      'Login to your GCash account to complete payment',
      'Payment confirmation will be sent to your mobile'
    ]
  },
  {
    code: 'paymaya',
    label: 'PayMaya',
    convenienceFeeCents: 50, // ₱0.50 processing fee
    icon: DevicePhoneMobileIcon,
    description: 'Pay using PayMaya digital wallet',
    processingTime: 'Instant processing',
    secure: true,
    instructions: [
      'You will be redirected to PayMaya platform',
      'Login to your PayMaya account',
      'Confirm payment to complete your order'
    ]
  },
  {
    code: 'bank_transfer',
    label: 'Bank Transfer',
    convenienceFeeCents: 0,
    icon: BuildingLibraryIcon,
    description: 'Direct bank-to-bank transfer',
    processingTime: '1-3 business days',
    secure: true,
    instructions: [
      'Bank details will be provided after order confirmation',
      'Include your order reference in the transfer memo',
      'Upload receipt or screenshot of transfer confirmation',
      'Order will be processed after payment verification'
    ]
  }
]

// Computed
const availablePaymentMethods = computed(() => {
  // For in-store orders, only show cash option
  if (!cartStore.isOnlineOrder) {
    return paymentMethods.filter(method => method.code === 'cash')
  }
  
  // For online orders, show all methods
  return paymentMethods
})

const selectedMethodDetails = computed(() => {
  if (!selectedMethod.value) return null
  return availablePaymentMethods.value.find(method => method.code === selectedMethod.value)
})

// Methods
function handleMethodChange() {
  const method = selectedMethodDetails.value
  if (method) {
    // Show card form for card payments
    showPaymentForm.value = method.code === 'card'
    
    // Update cart store
    cartStore.setPaymentMethod(method.code)
    
    // Emit to parent
    emit('method-selected', method.code, method.label, method.convenienceFeeCents)
    
    globalStore.showSuccess(
      'Payment Method Selected', 
      `${method.label} selected${method.convenienceFeeCents > 0 ? ` (+${formatPrice(method.convenienceFeeCents)} fee)` : ''}`
    )
  }
}

function validateCardForm(): boolean {
  // Reset errors
  Object.keys(cardErrors).forEach(key => {
    cardErrors[key as keyof typeof cardErrors] = ''
  })
  
  let isValid = true
  
  // Basic card validation (you would use a proper card validation library in production)
  if (!cardForm.cardNumber || cardForm.cardNumber.length < 16) {
    cardErrors.cardNumber = 'Please enter a valid card number'
    isValid = false
  }
  
  if (!cardForm.expiryDate || !/^\d{2}\/\d{2}$/.test(cardForm.expiryDate)) {
    cardErrors.expiryDate = 'Please enter expiry date (MM/YY)'
    isValid = false
  }
  
  if (!cardForm.cvv || cardForm.cvv.length < 3) {
    cardErrors.cvv = 'Please enter CVV'
    isValid = false
  }
  
  if (!cardForm.cardholderName) {
    cardErrors.cardholderName = 'Please enter cardholder name'
    isValid = false
  }
  
  return isValid
}

// Auto-select cash for in-store orders
if (!cartStore.isOnlineOrder && availablePaymentMethods.value.length === 1) {
  selectedMethod.value = availablePaymentMethods.value[0].code
  handleMethodChange()
}

// Export card validation for parent components
defineExpose({
  validateCardForm,
  cardForm
})
</script>