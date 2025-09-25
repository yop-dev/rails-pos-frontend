import { useQuery, useLazyQuery, useMutation } from '@vue/apollo-composable'
import { gql } from '@apollo/client/core'
import { computed, ref, type Ref } from 'vue'
import type { Order, OrderStatus, ApiError } from '../types'

// GraphQL Queries - simplified to match backend schema
const GET_ORDERS = gql`
  query GetOrders {
    orders {
      id
      reference
      status
      source
      subtotal {
        formatted
      }
      shippingFee {
        formatted
      }
      convenienceFee {
        formatted
      }
      total {
        formatted
      }
      shippingMethodLabel
      paymentMethodLabel
      createdAt
      confirmedAt
      completedAt
      customer {
        id
        firstName
        lastName
        fullName
        email
        phone
      }
      deliveryAddress {
        id
        street
        unitFloorBuilding
        barangay
        city
        province
        postalCode
      }
      items {
        id
        quantity
        unitPrice {
          formatted
        }
        totalPrice {
          formatted
        }
        productName
        product {
          id
          name
          photoUrl
        }
      }
    }
  }
`

const GET_ORDER = gql`
  query GetOrder($id: ID!) {
    order(id: $id) {
      id
      reference
      status
      source
      subtotal {
        formatted
      }
      shippingFee {
        formatted
      }
      convenienceFee {
        formatted
      }
      total {
        formatted
      }
      shippingMethodLabel
      paymentMethodLabel
      createdAt
      confirmedAt
      completedAt
      customer {
        id
        firstName
        lastName
        fullName
        email
        phone
      }
      deliveryAddress {
        id
        street
        unitFloorBuilding
        barangay
        city
        province
        postalCode
      }
      items {
        id
        quantity
        unitPrice {
          formatted
        }
        totalPrice {
          formatted
        }
        productName
        product {
          id
          name
          photoUrl
          productType
        }
      }
    }
  }
`

// GraphQL Mutations
const CONFIRM_ORDER = gql`
  mutation ConfirmOrder($input: ConfirmOrderInput!) {
    confirmOrder(input: $input) {
      order {
        id
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
        status
        completedAt
      }
      errors {
        message
      }
    }
  }
`

const CREATE_ORDER = gql`
  mutation CreateOrder($input: CreateOrderInput!) {
    createOrder(input: $input) {
      order {
        id
        reference
        status
        source
        customer {
          fullName
          email
        }
        deliveryAddress {
          street
          city
          province
        }
        items {
          productName
          quantity
          unitPrice {
            formatted
          }
          totalPrice {
            formatted
          }
        }
        subtotal {
          formatted
        }
        shippingFee {
          formatted
        }
        convenienceFee {
          formatted
        }
        total {
          formatted
        }
        shippingMethodLabel
        paymentMethodLabel
      }
      paymentLink
      errors {
        message
        path
      }
    }
  }
`

// Composables
export function useOrders() {
  const { result, loading, error, refetch } = useQuery(GET_ORDERS, null, {
    notifyOnNetworkStatusChange: true
  })

  const orders = computed(() => result.value?.orders ?? [])
  
  return {
    orders,
    loading,
    error,
    refetch
  }
}

export function useOrder(id: Ref<string>) {
  const { result, loading, error, refetch } = useQuery(GET_ORDER, () => ({
    id: id.value
  }), {
    notifyOnNetworkStatusChange: true
  })

  const order = computed(() => result.value?.order ?? null)
  
  return {
    order,
    loading,
    error,
    refetch
  }
}

export function useOrderActions() {
  const { mutate: confirmOrderMutation, loading: confirmLoading } = useMutation(CONFIRM_ORDER)
  const { mutate: completeOrderMutation, loading: completeLoading } = useMutation(COMPLETE_ORDER)

  const confirmOrder = async (variables: { orderId: string }): Promise<{ success: boolean; order?: Order; errors?: ApiError[] }> => {
    try {
      const result = await confirmOrderMutation({
        input: {
          id: variables.orderId
        }
      })
      
      if (result?.data?.confirmOrder?.errors?.length && result.data.confirmOrder.errors.length > 0) {
        return {
          success: false,
          errors: result.data.confirmOrder.errors
        }
      }
      
      return {
        success: true,
        order: result?.data?.confirmOrder?.order
      }
    } catch (err) {
      return {
        success: false,
        errors: [{ message: 'An unexpected error occurred while confirming the order' }]
      }
    }
  }

  const completeOrder = async (variables: { orderId: string }): Promise<{ success: boolean; order?: Order; errors?: ApiError[] }> => {
    try {
      const result = await completeOrderMutation({
        input: {
          id: variables.orderId
        }
      })
      
      if (result?.data?.completeOrder?.errors?.length && result.data.completeOrder.errors.length > 0) {
        return {
          success: false,
          errors: result.data.completeOrder.errors
        }
      }
      
      return {
        success: true,
        order: result?.data?.completeOrder?.order
      }
    } catch (err) {
      return {
        success: false,
        errors: [{ message: 'An unexpected error occurred while completing the order' }]
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

export function useCreateOrder() {
  const { mutate: createOrderMutation, loading, error } = useMutation(CREATE_ORDER)
  
  const createOrder = async (orderInput: any): Promise<{ success: boolean; order?: Order; paymentLink?: string; errors?: ApiError[] }> => {
    try {
      const result = await createOrderMutation({
        input: orderInput
      })
      
      if (result?.data?.createOrder?.errors?.length && result.data.createOrder.errors.length > 0) {
        return {
          success: false,
          errors: result.data.createOrder.errors
        }
      }
      
      return {
        success: true,
        order: result?.data?.createOrder?.order,
        paymentLink: result?.data?.createOrder?.paymentLink
      }
    } catch (err) {
      return {
        success: false,
        errors: [{ message: 'An unexpected error occurred while creating the order' }]
      }
    }
  }
  
  return {
    createOrder,
    loading,
    error
  }
}