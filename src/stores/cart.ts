import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'
import type { Product, Customer, Address, CartItem } from '../types'

// Helper functions for localStorage persistence
const CART_STORAGE_KEY = 'pos_cart_data'

function saveToStorage(data: any) {
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(data))
  } catch (error) {
    console.warn('Failed to save cart to localStorage:', error)
  }
}

function loadFromStorage() {
  try {
    const stored = localStorage.getItem(CART_STORAGE_KEY)
    return stored ? JSON.parse(stored) : null
  } catch (error) {
    console.warn('Failed to load cart from localStorage:', error)
    return null
  }
}

export const useCartStore = defineStore('cart', () => {
  // Load initial data from localStorage
  const initialData = loadFromStorage() || {}
  
  // State
  const items = ref<CartItem[]>(initialData.items || [])
  const customer = ref<Customer | null>(initialData.customer || null)
  const deliveryAddress = ref<Address | null>(initialData.deliveryAddress || null)
  const paymentMethod = ref<string>(initialData.paymentMethod || '')
  const shippingMethod = ref<string>(initialData.shippingMethod || '')
  const isOnlineOrder = ref<boolean>(initialData.isOnlineOrder ?? true)
  const voucherCode = ref<string>(initialData.voucherCode || '')
  const voucherDiscount = ref<number>(initialData.voucherDiscount || 0)

  // Getters
  const subtotalCents = computed(() => 
    items.value.reduce((sum, item) => sum + (item.priceCents * item.quantity), 0)
  )

  const shippingFeeCents = computed(() => {
    if (!isOnlineOrder.value) return 0 // No shipping for in-store orders
    
    // Calculate shipping fee based on shipping method
    const fees: Record<string, number> = {
      standard: 500, // ₱5.00 for standard delivery
      express: 1500, // ₱15.00 for express delivery
      same_day: 3000, // ₱30.00 for same day delivery
      pickup: 0 // Free for pickup
    }
    
    return fees[shippingMethod.value] || 500 // Default to standard shipping
  })

  const convenienceFeeCents = computed(() => {
    // Calculate convenience fee based on payment method
    const fees: Record<string, number> = {
      cash: 0,
      card: 100, // ₱1.00 for card processing
      gcash: 50, // ₱0.50 for GCash
      paymaya: 50, // ₱0.50 for PayMaya
      bank_transfer: 0 // No fee for bank transfer
    }
    return fees[paymentMethod.value] || 0
  })

  const totalCents = computed(() => 
    subtotalCents.value + 
    shippingFeeCents.value + 
    convenienceFeeCents.value - 
    voucherDiscount.value
  )

  const totalItems = computed(() => 
    items.value.reduce((sum, item) => sum + item.quantity, 0)
  )

  const isEmpty = computed(() => items.value.length === 0)

  // Actions
  function addToCart(product: Product, quantity = 1) {
    const existingItem = items.value.find(item => item.productId === product.id)
    
    if (existingItem) {
      existingItem.quantity += quantity
    } else {
      items.value.push({
        productId: product.id,
        name: product.name,
        priceCents: product.price.cents,
        productType: product.productType,
        quantity,
        photoUrl: product.photoUrl || null
      })
    }
  }

  function removeFromCart(productId: string) {
    const index = items.value.findIndex(item => item.productId === productId)
    if (index > -1) {
      items.value.splice(index, 1)
    }
  }

  function updateQuantity(productId: string, quantity: number) {
    const item = items.value.find(item => item.productId === productId)
    if (item) {
      if (quantity <= 0) {
        removeFromCart(productId)
      } else {
        item.quantity = quantity
      }
    }
  }

  function setCustomer(customerData: Customer) {
    customer.value = customerData
  }

  function setDeliveryAddress(address: Address | null) {
    deliveryAddress.value = address
  }

  function setPaymentMethod(method: string) {
    paymentMethod.value = method
  }

  function setShippingMethod(method: string) {
    shippingMethod.value = method
  }

  function setOrderType(online: boolean) {
    isOnlineOrder.value = online
    if (!online) {
      deliveryAddress.value = null
      shippingMethod.value = ''
    }
  }

  function applyVoucher(code: string, discount: number) {
    voucherCode.value = code
    voucherDiscount.value = discount
  }

  function clearCart() {
    items.value = []
    customer.value = null
    deliveryAddress.value = null
    paymentMethod.value = ''
    shippingMethod.value = ''
    voucherCode.value = ''
    voucherDiscount.value = 0
    isOnlineOrder.value = true
    
    // Clear from localStorage as well
    try {
      localStorage.removeItem(CART_STORAGE_KEY)
    } catch (error) {
      console.warn('Failed to clear cart from localStorage:', error)
    }
  }

  // Custom reset function for Setup Stores
  function $reset() {
    clearCart()
  }

  // Watch for changes and persist to localStorage
  watch(
    () => ({
      items: items.value,
      customer: customer.value,
      deliveryAddress: deliveryAddress.value,
      paymentMethod: paymentMethod.value,
      shippingMethod: shippingMethod.value,
      isOnlineOrder: isOnlineOrder.value,
      voucherCode: voucherCode.value,
      voucherDiscount: voucherDiscount.value
    }),
    (newData) => {
      saveToStorage(newData)
    },
    { deep: true }
  )

  return {
    // State
    items,
    customer,
    deliveryAddress,
    paymentMethod,
    shippingMethod,
    isOnlineOrder,
    voucherCode,
    voucherDiscount,
    
    // Getters
    subtotalCents,
    shippingFeeCents,
    convenienceFeeCents,
    totalCents,
    totalItems,
    isEmpty,
    
    // Actions
    addToCart,
    removeFromCart,
    updateQuantity,
    setCustomer,
    setDeliveryAddress,
    setPaymentMethod,
    setShippingMethod,
    setOrderType,
    applyVoucher,
    clearCart,
    $reset
  }
})