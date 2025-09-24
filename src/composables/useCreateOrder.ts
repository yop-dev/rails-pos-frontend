import { ref } from 'vue'
import { useMutation } from '@vue/apollo-composable'
import { gql } from '@apollo/client/core'
import type { Order, CreateOrderInput, ApiError, MutationResponse } from '../types'

// GraphQL Mutation
const CREATE_ORDER = gql`
  mutation CreateOrder($input: CreateOrderInput!) {
    createOrder(input: $input) {
      order {
        id
        reference
        status
        source
        subtotalCents
        shippingFeeCents
        convenienceFeeCents
        discountCents
        totalCents
        shippingMethodLabel
        paymentMethodLabel
        createdAt
        confirmedAt
        completedAt
        customer {
          id
          firstName
          lastName
          email
          phone
          fullName
        }
        deliveryAddress {
          id
          unitFloorBuilding
          street
          barangay
          city
          province
          postalCode
          landmark
          remarks
        }
        items {
          id
          quantity
          unitPriceCents
          totalPriceCents
          productName
          product {
            id
            name
            description
            price {
              cents
              currency
              formatted
            }
            productType
            photoUrl
            category {
              id
              name
            }
          }
        }
      }
      errors {
        message
        field
      }
    }
  }
`

const CONFIRM_ORDER = gql`
  mutation ConfirmOrder($input: ConfirmOrderInput!) {
    confirmOrder(input: $input) {
      order {
        id
        reference
        status
        confirmedAt
      }
      errors {
        message
      }
    }
  }
`

const COMPLETE_ORDER = gql`
  mutation CompleteOrder($input: CompleteOrderInput!) {
    completeOrder(input: $input) {
      order {
        id
        reference
        status
        completedAt
      }
      errors {
        message
      }
    }
  }
`

// Composable
export function useCreateOrder() {
  const { mutate: createOrderMutation, loading } = useMutation(CREATE_ORDER)
  
  const createOrder = async (orderInput: CreateOrderInput): Promise<MutationResponse<Order>> => {
    try {
      console.log('Creating order with input:', orderInput)
      
      const result = await createOrderMutation({
        input: {
          input: orderInput
        }
      })
      
      if (result?.data?.createOrder?.errors?.length > 0) {
        return {
          success: false,
          errors: result.data.createOrder.errors,
          message: 'Order creation failed with validation errors'
        }
      }
      
      if (result?.data?.createOrder?.order) {
        return {
          success: true,
          data: result.data.createOrder.order,
          message: 'Order created successfully'
        }
      }
      
      return {
        success: false,
        errors: [{ message: 'Unknown error occurred during order creation' }],
        message: 'Order creation failed'
      }
      
    } catch (error) {
      console.error('Error creating order:', error)
      return {
        success: false,
        errors: [{ message: 'Network error or server unavailable' }],
        message: 'Failed to create order'
      }
    }
  }
  
  return {
    createOrder,
    loading
  }
}

export function useOrderActions() {
  const { mutate: confirmOrderMutation, loading: confirmLoading } = useMutation(CONFIRM_ORDER)
  const { mutate: completeOrderMutation, loading: completeLoading } = useMutation(COMPLETE_ORDER)
  
  const confirmOrder = async (input: { orderId: string }): Promise<MutationResponse<Order>> => {
    try {
      const result = await confirmOrderMutation({
        input: { orderId: input.orderId }
      })
      
      if (result?.data?.confirmOrder?.errors?.length > 0) {
        return {
          success: false,
          errors: result.data.confirmOrder.errors,
          message: 'Order confirmation failed'
        }
      }
      
      return {
        success: true,
        data: result.data.confirmOrder.order,
        message: 'Order confirmed successfully'
      }
      
    } catch (error) {
      console.error('Error confirming order:', error)
      return {
        success: false,
        errors: [{ message: 'Failed to confirm order' }],
        message: 'Order confirmation failed'
      }
    }
  }
  
  const completeOrder = async (input: { orderId: string }): Promise<MutationResponse<Order>> => {
    try {
      const result = await completeOrderMutation({
        input: { orderId: input.orderId }
      })
      
      if (result?.data?.completeOrder?.errors?.length > 0) {
        return {
          success: false,
          errors: result.data.completeOrder.errors,
          message: 'Order completion failed'
        }
      }
      
      return {
        success: true,
        data: result.data.completeOrder.order,
        message: 'Order completed successfully'
      }
      
    } catch (error) {
      console.error('Error completing order:', error)
      return {
        success: false,
        errors: [{ message: 'Failed to complete order' }],
        message: 'Order completion failed'
      }
    }
  }
  
  return {
    confirmOrder,
    completeOrder,
    confirmLoading,
    completeLoading
  }
}

// Mock order creation for development/testing
export function useMockOrderCreation() {
  const loading = ref(false)
  
  const createOrder = async (orderInput: CreateOrderInput): Promise<MutationResponse<Order>> => {
    loading.value = true
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Mock successful order creation
      const mockOrder: Order = {
        id: 'order-' + Date.now(),
        reference: 'ORD-' + Math.random().toString(36).substr(2, 8).toUpperCase(),
        status: 'PENDING',
        source: orderInput.source,
        subtotalCents: orderInput.items.reduce((sum, item) => sum + (15000 * item.quantity), 0), // Mock price
        shippingFeeCents: orderInput.source === 'ONLINE' ? 500 : 0,
        convenienceFeeCents: orderInput.paymentMethodCode === 'card' ? 100 : 0,
        discountCents: 0,
        totalCents: 0, // Will be calculated
        shippingMethodLabel: orderInput.shippingMethodCode ? 'Standard Delivery' : undefined,
        paymentMethodLabel: getPaymentMethodLabel(orderInput.paymentMethodCode),
        createdAt: new Date().toISOString(),
        customer: {
          id: 'customer-' + Date.now(),
          firstName: orderInput.customer.firstName,
          lastName: orderInput.customer.lastName,
          email: orderInput.customer.email,
          phone: orderInput.customer.phone,
          fullName: `${orderInput.customer.firstName} ${orderInput.customer.lastName}`
        },
        deliveryAddress: orderInput.deliveryAddress ? {
          id: 'address-' + Date.now(),
          unitFloorBuilding: orderInput.deliveryAddress.line2,
          street: orderInput.deliveryAddress.line1,
          barangay: 'Unknown',
          city: orderInput.deliveryAddress.city,
          province: orderInput.deliveryAddress.state || 'Unknown',
          postalCode: orderInput.deliveryAddress.postalCode
        } : undefined,
        items: orderInput.items.map((item, index) => {
          const mockUnitPrice = 15000 // Mock price in cents
          return {
            id: 'item-' + index,
            quantity: item.quantity,
            unitPriceCents: mockUnitPrice,
            totalPriceCents: mockUnitPrice * item.quantity,
            productName: `Product ${item.productId}`,
          product: {
            id: item.productId,
            name: `Product ${item.productId}`,
            description: `Description for product ${item.productId}`,
            price: {
              cents: mockUnitPrice,
              currency: 'PHP',
              formatted: `₱${(mockUnitPrice / 100).toFixed(2)}`
            },
            productType: 'PHYSICAL' as const,
            photoUrl: null,
            active: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            category: {
              id: 'category-1',
              name: 'General',
              position: 1,
              productsCount: 10
            }
          }
          }
        })
      }
      
      // Calculate total
      mockOrder.totalCents = mockOrder.subtotalCents + mockOrder.shippingFeeCents + mockOrder.convenienceFeeCents - mockOrder.discountCents
      
      return {
        success: true,
        data: mockOrder,
        message: 'Order created successfully'
      }
      
    } catch (error) {
      return {
        success: false,
        errors: [{ message: 'Mock order creation failed' }],
        message: 'Failed to create order'
      }
    } finally {
      loading.value = false
    }
  }
  
  return {
    createOrder,
    loading
  }
}

// Helper function
function getPaymentMethodLabel(code: string): string {
  const labels: Record<string, string> = {
    cash: 'Cash on Delivery',
    card: 'Credit/Debit Card',
    gcash: 'GCash',
    paymaya: 'PayMaya',
    bank_transfer: 'Bank Transfer'
  }
  return labels[code] || 'Unknown Payment Method'
}

// Export default based on environment
export default function useOrderCreation() {
  // Always use real GraphQL - comment out mock for debugging
  console.log('Using real GraphQL order creation')
  return useCreateOrder()
}
