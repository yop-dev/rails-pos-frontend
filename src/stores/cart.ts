import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Product, Customer, Address, CartItem } from '../types'

export const useCartStore = defineStore('cart', () => {
  // State
  const items = ref<CartItem[]>([])
  const customer = ref<Customer | null>(null)
  const deliveryAddress = ref<Address | null>(null)
  const paymentMethod = ref<string>('')
  const shippingMethod = ref<string>('')
  const isOnlineOrder = ref(true)
  const voucherCode = ref('')
  const voucherDiscount = ref(0)

  // Getters
  const subtotalCents = computed(() => 
    items.value.reduce((sum, item) => sum + (item.priceCents * item.quantity), 0)
  )

  const shippingFeeCents = computed(() => {
    return isOnlineOrder.value ? 500 : 0 // 5 PHP for online orders
  })

  const convenienceFeeCents = computed(() => {
    return paymentMethod.value === 'online' ? 100 : 0 // 1 PHP for online payments
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
        priceCents: product.priceCents,
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

  function setDeliveryAddress(address: Address) {
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
  }

  // Custom reset function for Setup Stores
  function $reset() {
    clearCart()
  }

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