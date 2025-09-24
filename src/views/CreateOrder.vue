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
                    <BaseButton 
                      v-if="!cartStore.isEmpty"
                      @click="activeTab = 'customer'" 
                      size="sm"
                    >
                      Continue to Customer
                    </BaseButton>
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
          
          <!-- Placeholder for other tabs -->
          <div v-show="activeTab === 'delivery'">
            <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 class="text-lg font-semibold text-gray-900 mb-6">Delivery Information</h3>
              <p class="text-gray-600">Delivery components will be implemented in the next phase.</p>
            </div>
          </div>
          
          <div v-show="activeTab === 'payment'">
            <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 class="text-lg font-semibold text-gray-900 mb-6">Payment Method</h3>
              <p class="text-gray-600">Payment components will be implemented in the next phase.</p>
            </div>
          </div>
          
          <div v-show="activeTab === 'review'">
            <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 class="text-lg font-semibold text-gray-900 mb-6">Order Review</h3>
              <p class="text-gray-600">Order review will be implemented in the next phase.</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Right Sidebar - Cart -->
      <div class="w-96 bg-white border-l border-gray-200 overflow-y-auto">
        <ShoppingCart 
          @continue-checkout="handleContinueCheckout"
        />
      </div>
    </div>

    <!-- Product Detail Modal -->
    <ProductDetailModal
      v-if="selectedProduct"
      :product="selectedProduct"
      @close="selectedProduct = null"
      @add-to-cart="handleAddToCart"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { 
  ArrowLeftIcon, 
  CubeIcon, 
  UserIcon,
  TruckIcon,
  CreditCardIcon,
  ClipboardDocumentCheckIcon,
  CheckCircleIcon,
  ExclamationCircleIcon
} from '@heroicons/vue/24/outline'
import { useCartStore } from '../stores/cart'
import { useGlobalStore } from '../stores/global'
import { formatPrice } from '../composables/useProducts'
import BaseButton from '../components/BaseButton.vue'
import ProductCatalog from '../components/ProductCatalog.vue'
import ShoppingCart from '../components/ShoppingCart.vue'
import CustomerSearchForm from '../components/CustomerSearchForm.vue'
import ProductDetailModal from '../components/ProductDetailModal.vue'
import type { Product, Customer } from '../types'

// Composables
const router = useRouter()
const cartStore = useCartStore()
const globalStore = useGlobalStore()

// State
const activeTab = ref('products')
const selectedProduct = ref<Product | null>(null)

// Computed
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

function handleContinueCheckout() {
  if (!cartStore.customer) {
    activeTab.value = 'customer'
  } else {
    activeTab.value = 'delivery'
  }
}

// Lifecycle
onMounted(() => {
  // Clear any existing cart when starting a new order
  cartStore.clearCart()
  console.log('Create Order view loaded')
  
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
