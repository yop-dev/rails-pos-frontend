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
                  <div class="flex items-center space-x-4">
                    <!-- Cart Quick Summary -->
                    <div v-if="!cartStore.isEmpty" class="text-sm text-gray-600">
                      {{ cartStore.totalItems }} items in cart • {{ formatPrice(cartStore.totalCents) }}
                    </div>
                    
                    <!-- Next Button -->
                    <BaseButton
                      v-if="!cartStore.isEmpty"
                      @click="activeTab = 'customer'"
                      size="sm"
                      :right-icon="ChevronRightIcon"
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
              <!-- Customer Search Section -->
              <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 class="text-lg font-semibold text-gray-900 mb-6">Customer Information</h3>
                <CustomerSearchForm 
                  ref="customerSearchFormRef"
                  @customer-selected="handleCustomerSelected"
                  @customer-created="handleCustomerCreated"
                />
              </div>
              
              <!-- Selected Customer Display + Next Button -->
              <div v-if="cartStore.customer" class="bg-green-50 rounded-lg shadow-sm border border-green-200 p-6">
                <div class="flex items-center justify-between">
                  <div>
                    <h4 class="text-lg font-semibold text-green-900 mb-3">✓ Customer Selected</h4>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <span class="font-medium text-green-700">Name:</span>
                        <span class="ml-2 text-green-900">{{ cartStore.customer.fullName }}</span>
                      </div>
                      <div>
                        <span class="font-medium text-green-700">Email:</span>
                        <span class="ml-2 text-green-900">{{ cartStore.customer.email }}</span>
                      </div>
                      <div>
                        <span class="font-medium text-green-700">Phone:</span>
                        <span class="ml-2 text-green-900">{{ cartStore.customer.phone }}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div class="flex items-center space-x-3">
                    <BaseButton
                      @click="handleChangeCustomer"
                      variant="secondary"
                      size="sm"
                    >
                      Change Customer
                    </BaseButton>
                    
                    <BaseButton
                      @click="activeTab = 'delivery'"
                      size="sm"
                      :right-icon="ChevronRightIcon"
                    >
                      Continue to Delivery
                    </BaseButton>
                  </div>
                </div>
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
                <div class="flex items-center justify-between">
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
                  
                  <!-- Next Button for non-delivery orders -->
                  <BaseButton
                    @click="activeTab = 'payment'"
                    size="sm"
                    :right-icon="ChevronRightIcon"
                  >
                    Continue to Payment
                  </BaseButton>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Payment Tab -->
          <div v-show="activeTab === 'payment'">
            <div class="space-y-6">
              <!-- Payment Method Selection -->
              <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 class="text-lg font-semibold text-gray-900 mb-6">Payment Method</h3>
                <PaymentMethodSelector 
                  @method-selected="handlePaymentMethodSelected"
                />
              </div>
              
              <!-- Order Items Summary -->
              <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h4 class="text-lg font-semibold text-gray-900 mb-4">Order Items ({{ cartStore.totalItems }})</h4>
                <div class="space-y-3">
                  <div 
                    v-for="item in cartStore.items" 
                    :key="item.productId"
                    class="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0"
                  >
                    <div class="flex-1">
                      <div class="font-medium text-gray-900">{{ item.name }}</div>
                      <div class="text-sm text-gray-600">{{ item.quantity }} x {{ formatPrice(item.priceCents) }}</div>
                    </div>
                    <div class="font-semibold text-gray-900">
                      {{ formatPrice(item.priceCents * item.quantity) }}
                    </div>
                  </div>
                </div>
              </div>
              
              <!-- Voucher Section -->
              <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h4 class="text-lg font-semibold text-gray-900 mb-4">Voucher Code</h4>
                <div class="space-y-3">
                  <div class="flex items-center space-x-3">
                    <BaseInput
                      v-model="voucherCode"
                      placeholder="Enter voucher code"
                      class="flex-1"
                    />
                    <BaseButton
                      size="sm"
                      @click="applyVoucher"
                      :disabled="!voucherCode || voucherApplied"
                      :loading="applyingVoucher"
                    >
                      Apply
                    </BaseButton>
                  </div>
                  
                  <div v-if="cartStore.voucherCode" class="flex items-center justify-between text-sm">
                    <span class="text-green-600 font-medium">Voucher Applied: {{ cartStore.voucherCode }}</span>
                    <button @click="removeVoucher" class="text-red-600 hover:text-red-800">
                      Remove
                    </button>
                  </div>
                </div>
              </div>
              
              <!-- Payment Summary + Next Button -->
              <div class="bg-green-50 rounded-lg shadow-sm border border-green-200 p-6">
                <div class="flex items-center justify-between">
                  <div>
                    <h4 class="text-lg font-semibold text-green-900 mb-3">Payment Summary</h4>
                    <div class="space-y-2">
                      <div class="flex items-center justify-between text-sm">
                        <span class="text-green-700">Subtotal:</span>
                        <span class="font-medium text-green-900">{{ formatPrice(cartStore.subtotalCents) }}</span>
                      </div>
                      
                      <div v-if="cartStore.shippingFeeCents > 0" class="flex items-center justify-between text-sm">
                        <span class="text-green-700">Shipping Fee:</span>
                        <span class="font-medium text-green-900">{{ formatPrice(cartStore.shippingFeeCents) }}</span>
                      </div>
                      
                      <div v-if="cartStore.convenienceFeeCents > 0" class="flex items-center justify-between text-sm">
                        <span class="text-green-700">Convenience Fee:</span>
                        <span class="font-medium text-green-900">{{ formatPrice(cartStore.convenienceFeeCents) }}</span>
                      </div>
                      
                      <div v-if="cartStore.voucherDiscount > 0" class="flex items-center justify-between text-sm text-green-600">
                        <span>Voucher Discount:</span>
                        <span class="font-medium">-{{ formatPrice(cartStore.voucherDiscount) }}</span>
                      </div>
                      
                      <div class="border-t border-green-300 pt-2 mt-3">
                        <div class="flex items-center justify-between text-lg font-bold">
                          <span class="text-green-900">Total:</span>
                          <span class="text-green-600">{{ formatPrice(cartStore.totalCents) }}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <!-- Next Button -->
                  <div v-if="cartStore.paymentMethod" class="ml-6">
                    <BaseButton
                      @click="activeTab = 'review'"
                      size="lg"
                      :right-icon="ChevronRightIcon"
                    >
                      Review Order
                    </BaseButton>
                  </div>
                </div>
              </div>
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
        <ShoppingCart :show-checkout-button="false" :show-voucher="false" />
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
        <div v-if="successOrder" class="bg-white rounded-lg max-w-4xl w-full mx-4 p-0 max-h-[95vh] overflow-hidden flex flex-col" @click.stop>
          <!-- Header -->
          <div class="text-center px-6 py-4 bg-green-50 border-b border-green-200 flex-shrink-0">
            <div class="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-3">
              <CheckCircleIcon class="h-6 w-6 text-green-600" aria-hidden="true" />
            </div>
            <h3 class="text-2xl font-bold text-gray-900 mb-2">Order Placed Successfully</h3>
            <p class="text-lg text-green-600 font-semibold">Order Reference Number: {{ successOrder.reference || 'N/A' }}</p>
          </div>
          
          <!-- Scrollable Content -->
          <div class="overflow-y-auto flex-1 px-6 py-4">
            <div class="space-y-6">
              <!-- Customer Information -->
              <div class="bg-gray-50 rounded-lg p-4">
                <h4 class="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                  <UserIcon class="w-5 h-5 mr-2 text-gray-600" />
                  Customer Information
                </h4>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span class="font-medium text-gray-700">Full Name:</span>
                    <span class="ml-2 text-gray-900">{{ successOrder.customer?.fullName || 'N/A' }}</span>
                  </div>
                  <div>
                    <span class="font-medium text-gray-700">Email Address:</span>
                    <span class="ml-2 text-gray-900">{{ successOrder.customer?.email || 'N/A' }}</span>
                  </div>
                  <div class="md:col-span-1">
                    <span class="font-medium text-gray-700">Mobile Number:</span>
                    <span class="ml-2 text-gray-900">{{ successOrder.customer?.phone || 'N/A' }}</span>
                  </div>
                </div>
              </div>
              
              <!-- Delivery Address (if applicable) -->
              <div v-if="successOrder.deliveryAddress" class="bg-gray-50 rounded-lg p-4">
                <h4 class="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                  <TruckIcon class="w-5 h-5 mr-2 text-gray-600" />
                  Delivery Address
                </h4>
                <div class="text-sm text-gray-900">
                  <div v-if="successOrder.deliveryAddress.unitFloorBuilding" class="mb-1">
                    {{ successOrder.deliveryAddress.unitFloorBuilding }}
                  </div>
                  <div>
                    {{ formatFullAddress(successOrder.deliveryAddress) }}
                  </div>
                </div>
              </div>
              
              <!-- Shipping & Payment Methods -->
              <div class="bg-gray-50 rounded-lg p-4">
                <h4 class="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                  <CreditCardIcon class="w-5 h-5 mr-2 text-gray-600" />
                  Shipping & Payment
                </h4>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span class="font-medium text-gray-700">Shipping Method:</span>
                    <span class="ml-2 text-gray-900">
                      {{ getShippingMethodDisplay(successOrder) }}
                    </span>
                  </div>
                  <div>
                    <span class="font-medium text-gray-700">Payment Method:</span>
                    <span class="ml-2 text-gray-900">
                      {{ getPaymentMethodDisplay(successOrder) }}
                    </span>
                  </div>
                </div>
              </div>
              
              <!-- Order Items -->
              <div class="bg-gray-50 rounded-lg p-4">
                <h4 class="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                  <CubeIcon class="w-5 h-5 mr-2 text-gray-600" />
                  Order Items ({{ successOrder.items?.length || 0 }})
                </h4>
                <div class="space-y-2">
                  <div 
                    v-for="item in successOrder.items" 
                    :key="item.id"
                    class="flex items-center justify-between py-2 border-b border-gray-200 last:border-b-0"
                  >
                    <div class="flex-1">
                      <div class="font-medium text-gray-900">{{ item.productName }}</div>
                      <div class="text-sm text-gray-600">{{ item.quantity }} x {{ formatItemPrice(item.unitPriceCents) }}</div>
                    </div>
                    <div class="font-semibold text-gray-900">
                      {{ formatItemPrice(item.totalPriceCents) }}
                    </div>
                  </div>
                </div>
              </div>
              
              <!-- Order Summary -->
              <div class="bg-green-50 rounded-lg p-4 border border-green-200">
                <h4 class="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                  <ClipboardDocumentCheckIcon class="w-5 h-5 mr-2 text-green-600" />
                  Order Summary
                </h4>
                <div class="space-y-2">
                  <div class="flex items-center justify-between text-sm">
                    <span class="text-gray-700">Subtotal:</span>
                    <span class="font-medium text-gray-900">{{ formatOrderPrice(successOrder.subtotalCents) }}</span>
                  </div>
                  
                  <div v-if="shouldShowShippingFee(successOrder)" class="flex items-center justify-between text-sm">
                    <span class="text-gray-700">Shipping Fee:</span>
                    <span class="font-medium text-gray-900">{{ formatOrderPrice(successOrder.shippingFeeCents) }}</span>
                  </div>
                  
                  <div v-if="shouldShowConvenienceFee(successOrder)" class="flex items-center justify-between text-sm">
                    <span class="text-gray-700">Convenience Fee:</span>
                    <span class="font-medium text-gray-900">{{ formatOrderPrice(successOrder.convenienceFeeCents) }}</span>
                  </div>
                  
                  <div v-if="hasDiscount(successOrder)" class="flex items-center justify-between text-sm text-green-600">
                    <span>Discount:</span>
                    <span class="font-medium">-{{ formatOrderPrice(successOrder.discountCents) }}</span>
                  </div>
                  
                  <div class="border-t border-green-300 pt-2 mt-3">
                    <div class="flex items-center justify-between text-lg font-bold">
                      <span class="text-gray-900">Grand Total:</span>
                      <span class="text-green-600">{{ formatOrderPrice(successOrder.totalCents) }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Footer Actions -->
          <div class="px-6 py-4 bg-gray-50 border-t border-gray-200 flex-shrink-0">
            <div class="flex flex-col sm:flex-row gap-3 justify-center">
              <button @click="handleViewOrderFromModal(successOrder.id)" class="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center justify-center">
                <ClipboardDocumentListIcon class="w-4 h-4 mr-2" />
                View Order Details
              </button>
              <button @click="handleCreateNewOrderFromModal" class="bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-3 rounded-lg font-medium transition-colors flex items-center justify-center">
                <PlusIcon class="w-4 h-4 mr-2" />
                Create New Order
              </button>
              <button @click="handleEmergencyClose" class="border border-gray-300 hover:bg-gray-50 text-gray-700 px-6 py-3 rounded-lg font-medium transition-colors flex items-center justify-center">
                <XMarkIcon class="w-4 h-4 mr-2" />
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
  InformationCircleIcon,
  ClipboardDocumentListIcon,
  PlusIcon,
  XMarkIcon,
  ChevronRightIcon
} from '@heroicons/vue/24/outline'
import { useCartStore } from '../stores/cart'
import { useGlobalStore } from '../stores/global'
import { formatPrice } from '../composables/useProducts'
import BaseButton from '../components/BaseButton.vue'
import BaseInput from '../components/BaseInput.vue'
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

// Template refs
const customerSearchFormRef = ref()

// Voucher state
const voucherCode = ref('')
const applyingVoucher = ref(false)

// Computed
const hasPhysicalProducts = computed(() => 
  cartStore.items.some(item => item.productType === 'PHYSICAL')
)

const voucherApplied = computed(() => !!cartStore.voucherCode)

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
  
  // Don't auto-advance anymore, let user use the Next button
}

function handleCustomerCreated(customer: Customer) {
  cartStore.setCustomer(customer)
  globalStore.showSuccess('Customer Created', `New customer ${customer.fullName} has been created`)
  
  // Don't auto-advance anymore, let user use the Next button
}

function handleChangeCustomer() {
  // Clear customer from cart store
  cartStore.setCustomer(null)
  
  // Clear the customer search form's internal state
  if (customerSearchFormRef.value) {
    customerSearchFormRef.value.clearCustomerSelection()
  }
  
  globalStore.showInfo('Customer Cleared', 'You can now search for a different customer')
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

// Enhanced address formatter for success modal
function formatFullAddress(address: any): string {
  if (!address) return ''
  
  const parts = [
    address.street,
    address.barangay,
    address.city,
    address.province
  ].filter(Boolean)
  
  return parts.join(', ')
}

// Get shipping method display text
function getShippingMethodDisplay(order: any): string {
  if (!order) return 'N/A'
  
  // Check if it's an in-store order
  if (order.source === 'IN_STORE') {
    return 'In-Store Pickup'
  }
  
  // Use the shipping method label if available
  if (order.shippingMethodLabel) {
    return order.shippingMethodLabel
  }
  
  // Fallback to mapping shipping method codes
  const shippingMethods: Record<string, string> = {
    'standard': 'Standard Delivery',
    'express': 'Express Delivery', 
    'same_day': 'Same Day Delivery',
    'pickup': 'Store Pickup'
  }
  
  // Try to extract from any shipping method info in the order
  if (order.shippingMethod) {
    return shippingMethods[order.shippingMethod] || order.shippingMethod
  }
  
  return 'Standard Delivery'
}

// Get payment method display text
function getPaymentMethodDisplay(order: any): string {
  if (!order) return 'N/A'
  
  // Use the payment method label if available
  if (order.paymentMethodLabel) {
    return order.paymentMethodLabel
  }
  
  // Fallback to mapping payment method codes
  const paymentMethods: Record<string, string> = {
    'cash': 'Cash on Delivery',
    'card': 'Credit/Debit Card',
    'gcash': 'GCash',
    'paymaya': 'PayMaya',
    'bank_transfer': 'Bank Transfer'
  }
  
  // Try to extract from any payment method info in the order
  if (order.paymentMethod) {
    return paymentMethods[order.paymentMethod] || order.paymentMethod
  }
  
  return 'Cash on Delivery'
}

// Determine if shipping fee should be shown
function shouldShowShippingFee(order: any): boolean {
  if (!order) return false
  
  // Don't show shipping fee for in-store orders
  if (order.source === 'IN_STORE') {
    return false
  }
  
  // Show if there's a shipping fee amount (using cents field)
  return order.shippingFeeCents > 0
}

// Determine if convenience fee should be shown  
function shouldShowConvenienceFee(order: any): boolean {
  if (!order) return false
  return order.convenienceFeeCents > 0
}

// Format item prices (for individual order items)
function formatItemPrice(priceObj: any): string {
  // Handle direct cents value (most common case from GraphQL)
  if (typeof priceObj === 'number') {
    return `₱${(priceObj / 100).toFixed(2)}`
  }
  
  // Handle object with formatted property
  if (priceObj && priceObj.formatted) {
    return priceObj.formatted
  }
  
  // Handle object with cents property
  if (priceObj && priceObj.cents !== undefined) {
    return `₱${(priceObj.cents / 100).toFixed(2)}`
  }
  
  return '₱0.00'
}

// Format order-level prices using the cents fields from GraphQL
function formatOrderPrice(priceCents: number): string {
  if (typeof priceCents === 'number' && priceCents >= 0) {
    return `₱${(priceCents / 100).toFixed(2)}`
  }
  return '₱0.00'
}

// Check if order has discount
function hasDiscount(order: any): boolean {
  if (!order) return false
  return order.discountCents > 0
}

// Voucher methods
async function applyVoucher() {
  if (!voucherCode.value) return
  
  applyingVoucher.value = true
  
  try {
    // Simulate voucher validation (replace with actual API call)
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Mock voucher logic - simplified version
    if (voucherCode.value.toUpperCase() === 'SAVE10') {
      const discount = Math.floor(cartStore.subtotalCents * 0.1)
      cartStore.applyVoucher(voucherCode.value, discount)
      voucherCode.value = ''
      globalStore.showSuccess('Voucher Applied', `Discount of ${formatPrice(discount)} has been applied`)
    } else {
      globalStore.showError('Invalid Voucher', 'Please check your voucher code and try again')
    }
  } catch (error) {
    console.error('Error applying voucher:', error)
    globalStore.showError('Error', 'Failed to apply voucher. Please try again.')
  } finally {
    applyingVoucher.value = false
  }
}

function removeVoucher() {
  cartStore.applyVoucher('', 0)
  globalStore.showInfo('Voucher Removed', 'Voucher discount has been removed')
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
      console.log('=== ORDER DATA STRUCTURE FOR MODAL ===')
      console.log('Order object:', JSON.stringify(result.data, null, 2))
      console.log('Items:', result.data.items)
      console.log('Customer:', result.data.customer)
      console.log('Subtotal:', result.data.subtotal)
      console.log('Total:', result.data.total)
      console.log('=======================================')
      
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
