<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <div class="bg-white border-b border-gray-200 px-6 py-4">
      <div class="flex items-center justify-between">
        <div class="flex items-center space-x-4">
          <BaseButton
            variant="secondary"
            size="sm"
            @click="router.go(-1)"
            :left-icon="ArrowLeftIcon"
          >
            Back to Orders
          </BaseButton>
          
          <div>
            <h1 class="text-2xl font-bold text-gray-900">Create Order</h1>
            <p class="text-sm text-gray-500 mt-1">Add products and customer information</p>
          </div>
        </div>
        
        <!-- Cart Summary Badge -->
        <div class="flex items-center space-x-4">
          <div class="bg-primary-50 text-primary-700 px-3 py-1 rounded-full text-sm font-medium">
            {{ cartStore.totalItems }} items • {{ formatPrice(cartStore.totalCents) }}
          </div>
          
          <!-- Order Type Toggle -->
          <div class="flex items-center space-x-2">
            <span class="text-sm text-gray-600">Order Type:</span>
            <select 
              v-model="cartStore.isOnlineOrder"
              class="text-sm border border-gray-300 rounded-md px-2 py-1 focus:outline-none focus:ring-1 focus:ring-primary-500"
            >
              <option :value="true">Online</option>
              <option :value="false">In-Store</option>
            </select>
          </div>
        </div>
      </div>
    </div>

    <!-- Tab Navigation -->
    <div class="bg-white border-b border-gray-200">
      <div class="px-6">
        <nav class="-mb-px flex space-x-8">
          <button
            v-for="tab in tabs"
            :key="tab.key"
            @click="activeTab = tab.key"
            :class="[
              'py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200',
              activeTab === tab.key
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            ]"
            :disabled="tab.disabled"
          >
            <component :is="tab.icon" class="w-5 h-5 inline-block mr-2" />
            {{ tab.label }}
            
            <!-- Tab Badge -->
            <span v-if="tab.badge" class="ml-2 bg-gray-100 text-gray-600 py-1 px-2 rounded-full text-xs">
              {{ tab.badge }}
            </span>
            
            <!-- Validation Indicator -->
            <CheckCircleIcon 
              v-if="tab.validated" 
              class="w-4 h-4 inline-block ml-1 text-green-500" 
            />
            <ExclamationCircleIcon 
              v-else-if="tab.hasErrors" 
              class="w-4 h-4 inline-block ml-1 text-red-500" 
            />
          </button>
        </nav>
      </div>
    </div>

    <!-- Main Content -->
    <div class="flex flex-1 overflow-hidden">
      <!-- Left Content Area -->
      <div class="flex-1 overflow-y-auto">
        <div class="p-6">
          <!-- Products Tab -->
          <div v-show="activeTab === 'products'">
            <div class="space-y-6">
              <!-- Quick Actions -->
              <div class="bg-white rounded-lg border border-gray-200 p-4">
                <div class="flex items-center justify-between">
                  <h3 class="text-lg font-semibold text-gray-900">Product Catalog</h3>
                  <div class="flex items-center space-x-2">
                    <!-- Cart Quick Summary -->
                    <div v-if="!cartStore.isEmpty" class="text-sm text-gray-600">
                      {{ cartStore.totalItems }} items in cart
                    </div>
                  </div>
                </div>
              </div>
              
              <!-- Product Catalog -->
              <ProductCatalog 
                @product-click="handleProductClick" 
                @create-product="handleCreateProduct"
              />
            </div>
          </div>
          
          <!-- Customer Tab -->
          <div v-show="activeTab === 'customer'">
            <div class="space-y-6">
              <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 class="text-lg font-semibold text-gray-900 mb-6">Customer Information</h3>
                <CustomerSearchForm 
                  @customer-selected="handleCustomerSelected"
                  @customer-created="handleCustomerCreated"
                />
              </div>
            </div>
          </div>
          
          <!-- Delivery Tab -->
          <div v-show="activeTab === 'delivery'">
            <div class="space-y-6">
              <!-- Delivery Address Section -->
              <div v-if="cartStore.isOnlineOrder && hasPhysicalProducts" class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 class="text-lg font-semibold text-gray-900 mb-6">Delivery Address</h3>
                <DeliveryAddressForm 
                  :initial-address="cartStore.deliveryAddress"
                  @address-updated="handleAddressUpdated"
                  @address-cleared="handleAddressCleared"
                />
              </div>
              
              <!-- Shipping Method Section -->
              <div v-if="cartStore.isOnlineOrder && hasPhysicalProducts && cartStore.deliveryAddress" class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 class="text-lg font-semibold text-gray-900 mb-6">Shipping Method</h3>
                <ShippingMethodSelector 
                  :delivery-address="cartStore.deliveryAddress"
                  @method-selected="handleShippingMethodSelected"
                  @navigate-to-payment="handleNavigateToPayment"
                />
              </div>
              
              <!-- No Delivery Needed Message -->
              <div v-if="!cartStore.isOnlineOrder || !hasPhysicalProducts" class="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <div class="flex items-center">
                  <InformationCircleIcon class="h-6 w-6 text-blue-500 mr-3" />
                  <div>
                    <h3 class="text-lg font-semibold text-blue-900">No Delivery Required</h3>
                    <p class="text-blue-700 mt-1">
                      {{ !cartStore.isOnlineOrder 
                        ? 'This is an in-store order - customer will pick up items.'
                        : 'Your cart contains only digital products - no shipping required.'
                      }}
                    </p>
                  </div>
                </div>
                
              </div>
            </div>
          </div>
          
          <!-- Payment Tab -->
          <div v-show="activeTab === 'payment'">
            <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 class="text-lg font-semibold text-gray-900 mb-6">Payment Method</h3>
              <PaymentMethodSelector 
                @method-selected="handlePaymentMethodSelected"
              />
            </div>
          </div>
          
          <!-- Review Tab -->
          <div v-show="activeTab === 'review'">
            <div class="space-y-6">
              <!-- Order Summary -->
              <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 class="text-lg font-semibold text-gray-900 mb-6">Order Summary</h3>
                
                <!-- Customer Info -->
                <div class="mb-6">
                  <h4 class="font-medium text-gray-900 mb-3">Customer</h4>
                  <div v-if="cartStore.customer" class="text-sm text-gray-600">
                    <div><strong>Name:</strong> {{ cartStore.customer.fullName }}</div>
                    <div><strong>Email:</strong> {{ cartStore.customer.email }}</div>
                    <div><strong>Phone:</strong> {{ cartStore.customer.phone }}</div>
                  </div>
                </div>
                
                <!-- Delivery Info -->
                <div v-if="cartStore.deliveryAddress" class="mb-6">
                  <h4 class="font-medium text-gray-900 mb-3">Delivery Address</h4>
                  <div class="text-sm text-gray-600">
                    <div v-if="cartStore.deliveryAddress.unitFloorBuilding">
                      {{ cartStore.deliveryAddress.unitFloorBuilding }}
                    </div>
                    <div>{{ formatDisplayAddress(cartStore.deliveryAddress) }}</div>
                  </div>
                </div>
                
                <!-- Payment & Shipping Methods -->
                <div class="mb-6">
                  <h4 class="font-medium text-gray-900 mb-3">Payment & Delivery Methods</h4>
                  <div class="text-sm text-gray-600 space-y-2">
                    <div>
                      <strong>Payment Method:</strong> {{ cartStore.paymentMethod ? getPaymentMethodLabel() : 'Not selected' }}
                    </div>
                    <div v-if="cartStore.isOnlineOrder && hasPhysicalProducts">
                      <strong>Shipping Method:</strong> {{ cartStore.shippingMethod ? getShippingMethodLabel() : 'Not selected' }}
                    </div>
                    <div v-else-if="!cartStore.isOnlineOrder">
                      <strong>Fulfillment:</strong> In-Store Pickup
                    </div>
                  </div>
                </div>
                
                <!-- Order Items -->
                <div class="mb-6">
                  <h4 class="font-medium text-gray-900 mb-3">Items ({{ cartStore.totalItems }})</h4>
                  <div class="space-y-2">
                    <div 
                      v-for="item in cartStore.items" 
                      :key="item.productId"
                      class="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0"
                    >
                      <div class="flex-1">
                        <div class="font-medium text-gray-900">{{ item.name }}</div>
                        <div class="text-sm text-gray-500">{{ item.quantity }} x {{ formatPrice(item.priceCents) }}</div>
                      </div>
                      <div class="font-medium text-gray-900">
                        {{ formatPrice(item.priceCents * item.quantity) }}
                      </div>
                    </div>
                  </div>
                </div>
                
                <!-- Pricing Breakdown -->
                <div class="border-t border-gray-200 pt-4">
                  <div class="space-y-2">
                    <div class="flex items-center justify-between text-sm">
                      <span class="text-gray-600">Subtotal</span>
                      <span class="font-medium">{{ formatPrice(cartStore.subtotalCents) }}</span>
                    </div>
                    
                    <div v-if="cartStore.shippingFeeCents > 0" class="flex items-center justify-between text-sm">
                      <span class="text-gray-600">Shipping Fee</span>
                      <span class="font-medium">{{ formatPrice(cartStore.shippingFeeCents) }}</span>
                    </div>
                    
                    <div v-if="cartStore.convenienceFeeCents > 0" class="flex items-center justify-between text-sm">
                      <span class="text-gray-600">Convenience Fee</span>
                      <span class="font-medium">{{ formatPrice(cartStore.convenienceFeeCents) }}</span>
                    </div>
                    
                    <div v-if="cartStore.voucherDiscount > 0" class="flex items-center justify-between text-sm text-green-600">
                      <span>Voucher Discount ({{ cartStore.voucherCode }})</span>
                      <span class="font-medium">-{{ formatPrice(cartStore.voucherDiscount) }}</span>
                    </div>
                    
                    <div class="border-t border-gray-200 pt-2 mt-3">
                      <div class="flex items-center justify-between text-lg font-semibold">
                        <span class="text-gray-900">Total</span>
                        <span class="text-primary-600">{{ formatPrice(cartStore.totalCents) }}</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <!-- Place Order Button -->
                <div class="mt-8">
                  <div class="flex items-center justify-between">
                    <div>
                      <p class="text-sm text-gray-600 mb-2">
                        Review your order details and click "Place Order" to confirm.
                      </p>
                      <div v-if="validationErrors.length > 0" class="space-y-1">
                        <p v-for="error in validationErrors" :key="error" class="text-sm text-red-600">
                          • {{ error }}
                        </p>
                      </div>
                    </div>
                    
                    <BaseButton
                      size="lg"
                      @click="handlePlaceOrder"
                      :disabled="!canPlaceOrder"
                      :loading="placingOrder"
                    >
                      Place Order
                    </BaseButton>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Right Sidebar - Cart -->
      <div class="w-96 bg-white border-l border-gray-200 overflow-y-auto">
        <ShoppingCart :show-checkout-button="false" />
      </div>
    </div>

    <!-- Product Detail Modal -->
    <ProductDetailModal
      v-if="selectedProduct"
      :product="selectedProduct"
      @close="selectedProduct = null"
      @add-to-cart="handleAddToCart"
    />
    
    
    <!-- Always visible emergency close for grey screen -->
    <div v-if="showSuccessModal" class="fixed inset-0 bg-gray-500 bg-opacity-75 z-50" @click="handleEmergencyClose">
      <!-- Emergency Close Button (always visible) -->
      <button 
        @click="handleEmergencyClose" 
        class="absolute top-4 right-4 bg-white hover:bg-gray-100 text-gray-800 w-12 h-12 rounded-full shadow-lg flex items-center justify-center z-[60] transition-colors"
        title="Close"
      >
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
        </svg>
      </button>
      
      <!-- Modal Content Area -->
      <div class="flex items-center justify-center min-h-screen p-4">
        <!-- Success Modal Content -->
        <div v-if="successOrder" class="bg-white rounded-lg max-w-2xl w-full mx-4 p-6" @click.stop>
          <!-- This will be the OrderSuccessModal content inline -->
          <div class="text-center mb-6">
            <div class="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
              <CheckCircleIcon class="h-6 w-6 text-green-600" aria-hidden="true" />
            </div>
            <h3 class="text-2xl font-bold text-gray-900 mb-2">Order Placed Successfully</h3>
            <p class="text-lg text-green-600 font-semibold">Order Reference Number: {{ successOrder.reference || 'N/A' }}</p>
          </div>
          
          <div class="text-center">
            <div class="flex flex-col sm:flex-row gap-3 justify-center">
              <button @click="handleViewOrderFromModal(successOrder.id)" class="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg font-medium transition-colors">
                View Order Details
              </button>
              <button @click="handleCreateNewOrderFromModal" class="bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-3 rounded-lg font-medium transition-colors">
                Create New Order
              </button>
              <button @click="handleEmergencyClose" class="border border-gray-300 hover:bg-gray-50 text-gray-700 px-6 py-3 rounded-lg font-medium transition-colors">
                Close
              </button>
            </div>
          </div>
        </div>
        
        <!-- Fallback Modal (when no order data) -->
        <div v-else class="bg-white rounded-lg max-w-md w-full mx-4 p-6" @click.stop>
          <div class="text-center">
            <div class="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
              <CheckCircleIcon class="h-6 w-6 text-green-600" aria-hidden="true" />
            </div>
            <h3 class="text-xl font-bold text-gray-900 mb-4">Order Placed Successfully!</h3>
            <p class="text-gray-600 mb-6">Your order has been created successfully.</p>
            <div class="flex flex-col gap-3">
              <button @click="router.push({ name: 'OrderManager' })" class="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg font-medium transition-colors">
                View Orders
              </button>
              <button @click="handleEmergencyClose" class="bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-3 rounded-lg font-medium transition-colors">
                Create New Order
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { 
  ArrowLeftIcon, 
  CubeIcon, 
  UserIcon,
  TruckIcon,
  CreditCardIcon,
  ClipboardDocumentCheckIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
  InformationCircleIcon
} from '@heroicons/vue/24/outline'
import { useCartStore } from '../stores/cart'
import { useGlobalStore } from '../stores/global'
import { formatPrice } from '../composables/useProducts'
import BaseButton from '../components/BaseButton.vue'
import ProductCatalog from '../components/ProductCatalog.vue'
import ShoppingCart from '../components/ShoppingCart.vue'
import CustomerSearchForm from '../components/CustomerSearchForm.vue'
import ProductDetailModal from '../components/ProductDetailModal.vue'
import DeliveryAddressForm from '../components/DeliveryAddressForm.vue'
import ShippingMethodSelector from '../components/ShippingMethodSelector.vue'
import PaymentMethodSelector from '../components/PaymentMethodSelector.vue'
import type { Product, Customer, Address, CreateOrderInput, Order } from '../types'
import useOrderCreation from '../composables/useCreateOrder'

// Composables
const router = useRouter()
const route = useRoute()
const cartStore = useCartStore()
const globalStore = useGlobalStore()
const { createOrder, loading: placingOrder } = useOrderCreation()

// State
const activeTab = ref('products')
const selectedProduct = ref<Product | null>(null)
const validationErrors = ref<string[]>([])
const showSuccessModal = ref(false)
const successOrder = ref<Order | null>(null)

// Computed
const hasPhysicalProducts = computed(() => 
  cartStore.items.some(item => item.productType === 'PHYSICAL')
)

const canPlaceOrder = computed(() => {
  validationErrors.value = []
  
  if (cartStore.isEmpty) {
    validationErrors.value.push('Cart is empty')
    return false
  }
  
  if (!cartStore.customer) {
    validationErrors.value.push('Customer information is required')
  }
  
  if (cartStore.isOnlineOrder && hasPhysicalProducts.value && !cartStore.deliveryAddress) {
    validationErrors.value.push('Delivery address is required for online orders with physical products')
  }
  
  if (cartStore.isOnlineOrder && hasPhysicalProducts.value && !cartStore.shippingMethod) {
    validationErrors.value.push('Shipping method is required')
  }
  
  if (!cartStore.paymentMethod) {
    validationErrors.value.push('Payment method is required')
  }
  
  return validationErrors.value.length === 0
})

const tabs = computed(() => [
  {
    key: 'products',
    label: 'Products',
    icon: CubeIcon,
    badge: cartStore.isEmpty ? null : cartStore.totalItems.toString(),
    validated: !cartStore.isEmpty,
    hasErrors: false,
    disabled: false
  },
  {
    key: 'customer',
    label: 'Customer',
    icon: UserIcon,
    badge: null,
    validated: !!cartStore.customer,
    hasErrors: !cartStore.isEmpty && !cartStore.customer,
    disabled: cartStore.isEmpty
  },
  {
    key: 'delivery',
    label: 'Delivery',
    icon: TruckIcon,
    badge: null,
    validated: !cartStore.isOnlineOrder || !!cartStore.deliveryAddress,
    hasErrors: false,
    disabled: cartStore.isEmpty || !cartStore.customer
  },
  {
    key: 'payment',
    label: 'Payment',
    icon: CreditCardIcon,
    badge: null,
    validated: !!cartStore.paymentMethod,
    hasErrors: false,
    disabled: cartStore.isEmpty || !cartStore.customer
  },
  {
    key: 'review',
    label: 'Review',
    icon: ClipboardDocumentCheckIcon,
    badge: null,
    validated: false,
    hasErrors: false,
    disabled: cartStore.isEmpty || !cartStore.customer
  }
])

// Methods
function handleProductClick(product: Product) {
  selectedProduct.value = product
}

function handleCreateProduct() {
  globalStore.showInfo('Feature Coming Soon', 'Product creation will be available in the next update')
}

function handleAddToCart(product: Product, quantity: number) {
  cartStore.addToCart(product, quantity)
  selectedProduct.value = null
  globalStore.showSuccess(
    'Added to Cart',
    `${product.name} has been added to your cart`
  )
}

function handleCustomerSelected(customer: Customer) {
  cartStore.setCustomer(customer)
  globalStore.showSuccess('Customer Selected', `Customer ${customer.fullName} has been selected`)
  
  // Auto-advance to next tab
  activeTab.value = 'delivery'
}

function handleCustomerCreated(customer: Customer) {
  cartStore.setCustomer(customer)
  globalStore.showSuccess('Customer Created', `New customer ${customer.fullName} has been created`)
  
  // Auto-advance to next tab
  activeTab.value = 'delivery'
}


function handleAddressUpdated(address: Address) {
  cartStore.setDeliveryAddress(address)
  globalStore.showSuccess('Address Updated', 'Delivery address has been saved')
  
  // Scroll is handled by DeliveryAddressForm component
}

function handleAddressCleared() {
  cartStore.setDeliveryAddress(null)
  cartStore.setShippingMethod('')
}

function handleShippingMethodSelected(methodCode: string, methodLabel: string, feeCents: number) {
  console.log('Shipping method selected:', { methodCode, methodLabel, feeCents })
  cartStore.setShippingMethod(methodCode)
  console.log('Cart store shipping method after setting:', cartStore.shippingMethod)
  // The shipping fee will be automatically calculated by the cart store
  // based on the selected method and order type
}

function handleNavigateToPayment() {
  activeTab.value = 'payment'
  globalStore.showInfo('Continue to Payment', 'Proceed to select your payment method')
}

function getShippingMethodLabel(): string {
  // Map shipping method codes to labels
  const shippingMethods: Record<string, string> = {
    'standard': 'Standard Delivery',
    'express': 'Express Delivery',
    'same_day': 'Same Day Delivery',
    'pickup': 'Store Pickup'
  }
  
  return shippingMethods[cartStore.shippingMethod] || 'Unknown Shipping Method'
}

function getPaymentMethodLabel(): string {
  // Map payment method codes to labels
  const paymentMethods: Record<string, string> = {
    'cash': 'Cash on Delivery',
    'card': 'Credit/Debit Card',
    'gcash': 'GCash',
    'paymaya': 'PayMaya',
    'bank_transfer': 'Bank Transfer'
  }
  
  return paymentMethods[cartStore.paymentMethod] || 'Unknown Payment Method'
}

function handleCloseSuccessModal() {
  showSuccessModal.value = false
  successOrder.value = null
  // Redirect to order manager
  router.push({ name: 'OrderManager' })
}

function handleViewOrderFromModal(orderId: string) {
  showSuccessModal.value = false
  successOrder.value = null
  // Redirect to order detail page
  router.push({ name: 'OrderDetail', params: { id: orderId } })
}

function handleCreateNewOrderFromModal() {
  showSuccessModal.value = false
  successOrder.value = null
  // Reset to products tab to start a new order
  activeTab.value = 'products'
  cartStore.clearCart()
  globalStore.showInfo('New Order', 'Ready to create a new order!')
}

function handleEmergencyClose() {
  console.log('Emergency close triggered')
  showSuccessModal.value = false
  successOrder.value = null
  // Default action: go back to order manager
  router.push({ name: 'OrderManager' })
}

function handlePaymentMethodSelected(methodCode: string, methodLabel: string, convenienceFeeCents: number) {
  cartStore.setPaymentMethod(methodCode)
  // The convenience fee will be automatically calculated by the cart store
  // based on the selected payment method
}

function formatDisplayAddress(address: Address | null): string {
  if (!address) return ''
  
  const parts = [
    address.street,
    address.barangay,
    address.city,
    address.province
  ].filter(Boolean)
  
  return parts.join(', ')
}

async function handlePlaceOrder() {
  if (!canPlaceOrder.value) {
    globalStore.showError('Validation Error', 'Please complete all required information before placing the order')
    return
  }

  try {
    const orderInput: CreateOrderInput = {
      source: cartStore.isOnlineOrder ? 'ONLINE' : 'IN_STORE',
      items: cartStore.items.map(item => ({
        productId: item.productId,
        quantity: item.quantity
      })),
      customer: {
        firstName: cartStore.customer!.firstName,
        lastName: cartStore.customer!.lastName,
        email: cartStore.customer!.email,
        phone: cartStore.customer!.phone
      },
      deliveryAddress: cartStore.deliveryAddress ? {
        line1: cartStore.deliveryAddress.street,
        line2: cartStore.deliveryAddress.unitFloorBuilding,
        city: cartStore.deliveryAddress.city,
        state: cartStore.deliveryAddress.province,
        postalCode: cartStore.deliveryAddress.postalCode || '',
        country: 'Philippines',
        barangay: cartStore.deliveryAddress.barangay
      } : undefined,
      paymentMethodCode: cartStore.paymentMethod,
      // Add shipping method for online orders
      shippingMethodCode: cartStore.isOnlineOrder && cartStore.shippingMethod ? cartStore.shippingMethod : undefined
    }

    console.log('=== ORDER CREATION DEBUG ===')
    console.log('Cart store shipping method:', cartStore.shippingMethod)
    console.log('Cart store isOnlineOrder:', cartStore.isOnlineOrder)
    console.log('hasPhysicalProducts:', hasPhysicalProducts.value)
    console.log('Calculated shippingMethodCode:', cartStore.isOnlineOrder && cartStore.shippingMethod ? cartStore.shippingMethod : undefined)
    console.log('Full cart store state:')
    console.log('- paymentMethod:', cartStore.paymentMethod)
    console.log('- shippingMethod:', cartStore.shippingMethod)
    console.log('- deliveryAddress:', cartStore.deliveryAddress)
    console.log('- isOnlineOrder:', cartStore.isOnlineOrder)
    console.log('Placing order with data:', orderInput)
    console.log('===============================')
    
    const result = await createOrder(orderInput)
    
    console.log('Order creation result:', result)
    
    if (result.success && result.data) {
      console.log('Order created successfully:', result.data)
      // Store the successful order data and show modal
      successOrder.value = result.data
      showSuccessModal.value = true
      console.log('Modal state set - showSuccessModal:', showSuccessModal.value, 'successOrder:', successOrder.value)
      
      // Clear cart (but don't redirect yet, let modal handle it)
      cartStore.clearCart()
      
      // Add a timeout to ensure modal renders, if not, fallback to old behavior
      setTimeout(() => {
        if (showSuccessModal.value && !successOrder.value) {
          console.error('Modal failed to render with order data, falling back to simple redirect')
          showSuccessModal.value = false
          globalStore.showSuccess('Order Placed Successfully!', `Your order has been created`)
          router.push({ name: 'OrderManager' })
        }
      }, 1000)
    } else {
      const errorMessage = result.errors?.[0]?.message || result.message || 'Failed to create order'
      globalStore.showError('Order Failed', errorMessage)
      
      if (result.errors) {
        validationErrors.value = result.errors.map(err => err.message)
      }
    }
  } catch (error) {
    console.error('Error placing order:', error)
    globalStore.showError('Order Failed', 'An unexpected error occurred while placing your order')
  }
}

// Lifecycle
onMounted(() => {
  console.log('Create Order view loaded')
  
  // TEMPORARY: Test modal immediately (remove this after fixing)
  // Uncomment the next 3 lines to test the modal and close button:
  // setTimeout(() => {
  //   showSuccessModal.value = true
  // }, 1000)
  
  // Check if we're coming from the product catalog with a tab parameter
  const tabParam = route.query.tab as string
  
  if (tabParam === 'customer') {
    if (!cartStore.isEmpty) {
      // Coming from cart dropdown with items - preserve cart and go to customer tab
      console.log('Coming from cart dropdown with items, starting at customer tab')
      activeTab.value = 'customer'
    } else {
      // Empty cart but customer tab requested - go to products first
      console.log('Customer tab requested but cart is empty, starting at products')
      activeTab.value = 'products'
    }
  } else {
    // Starting fresh from navigation - clear cart and start at products tab
    console.log('Starting fresh order, clearing cart')
    cartStore.clearCart()
    activeTab.value = 'products'
  }
  
  // Add some demo products to test the cart (remove this in production)
  // Uncomment the following lines to test with demo data:
  /*
  setTimeout(() => {
    // Demo products for cart testing
    const demoProducts = [
      {
        id: 'demo-1',
        name: 'Premium Coffee Beans',
        price: { cents: 25000, currency: 'PHP', formatted: '₱250.00' },
        productType: 'PHYSICAL' as const,
        photoUrl: null,
        active: true,
        createdAt: '',
        updatedAt: '',
        category: { id: '1', name: 'Coffee', position: 1, productsCount: 5 }
      },
      {
        id: 'demo-2', 
        name: 'Digital Recipe Book',
        price: { cents: 15000, currency: 'PHP', formatted: '₱150.00' },
        productType: 'DIGITAL' as const,
        photoUrl: null,
        active: true,
        createdAt: '',
        updatedAt: '',
        category: { id: '2', name: 'Digital', position: 2, productsCount: 3 }
      }
    ]
    
    demoProducts.forEach(product => {
      cartStore.addToCart(product, 2)
    })
    
    globalStore.showInfo('Demo Mode', 'Added demo products to test the cart functionality')
  }, 1000)
  */
})
</script>
