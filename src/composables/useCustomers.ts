import { ref, computed } from 'vue'
import { useQuery, useLazyQuery, useMutation } from '@vue/apollo-composable'
import { gql } from '@apollo/client/core'
import type { Customer, CustomerForm, ApiError, MutationResponse } from '../types'

// GraphQL Queries and Mutations
const SEARCH_CUSTOMERS_BY_EMAIL = gql`
  query SearchCustomersByEmail($search: CustomersSearchInput!) {
    customers(search: $search) {
      id
      firstName
      lastName
      email
      phone
      fullName
      lastCheckoutAddress {
        id
        street
        unitFloorBuilding
        barangay
        city
        province
        postalCode
        landmark
        remarks
      }
    }
  }
`

const SEARCH_CUSTOMERS_BY_PHONE = gql`
  query SearchCustomersByPhone($search: CustomersSearchInput!) {
    customers(search: $search) {
      id
      firstName
      lastName
      email
      phone
      fullName
      lastCheckoutAddress {
        id
        street
        unitFloorBuilding
        barangay
        city
        province
        postalCode
        landmark
        remarks
      }
    }
  }
`

const CREATE_CUSTOMER = gql`
  mutation CreateCustomer($input: CustomerInput!) {
    createCustomer(input: $input) {
      customer {
        id
        firstName
        lastName
        email
        phone
        fullName
      }
      errors {
        message
        field
      }
    }
  }
`

// Test query to get all customers - for debugging
const GET_ALL_CUSTOMERS = gql`
  query GetAllCustomers {
    customers(search: { term: "" }) {
      id
      firstName
      lastName
      email
      phone
      fullName
    }
  }
`

// Customer Search Composable
export function useCustomerSearch() {
  // Test query for all customers
  const {
    result: allCustomersResult,
    loading: allCustomersLoading,
    error: allCustomersError,
    refetch: refetchAllCustomers
  } = useQuery(GET_ALL_CUSTOMERS)
  
  // Email search
  const {
    load: loadEmailSearch,
    result: emailResult,
    loading: emailLoading,
    error: emailError
  } = useLazyQuery(SEARCH_CUSTOMERS_BY_EMAIL)
  
  // Phone search
  const {
    load: loadPhoneSearch,
    result: phoneResult,
    loading: phoneLoading,
    error: phoneError
  } = useLazyQuery(SEARCH_CUSTOMERS_BY_PHONE)
  
  // Results
  const emailResults = ref<Customer[]>([])
  const phoneResults = ref<Customer[]>([])
  const allCustomers = computed(() => allCustomersResult.value?.customers ?? [])
  
  // Search functions
  async function searchByEmail(email: string) {
    if (!email || email.length < 3) {
      emailResults.value = []
      return
    }
    
    try {
      const result = await loadEmailSearch(SEARCH_CUSTOMERS_BY_EMAIL, { search: { email } })
      emailResults.value = emailResult.value?.customers || []
    } catch (error) {
      console.error('Error searching customers by email:', error)
      emailResults.value = []
    }
  }
  
  async function searchByPhone(phone: string) {
    if (!phone || phone.length < 4) {
      phoneResults.value = []
      return
    }
    
    try {
      const result = await loadPhoneSearch(SEARCH_CUSTOMERS_BY_PHONE, { search: { phone } })
      phoneResults.value = phoneResult.value?.customers || []
    } catch (error) {
      console.error('Error searching customers by phone:', error)
      phoneResults.value = []
    }
  }
  
  // Optional: Log debug info only if needed
  if (import.meta.env.DEV && allCustomersError.value) {
    console.log('❗ All customers error:', allCustomersError.value)
  }
  
  return {
    searchByEmail,
    searchByPhone,
    emailResults,
    phoneResults,
    emailLoading,
    phoneLoading,
    emailError,
    phoneError,
    // Debug data
    allCustomers,
    allCustomersLoading,
    allCustomersError,
    refetchAllCustomers
  }
}

// Customer Creation Composable
export function useCreateCustomer() {
  const { mutate: createCustomerMutation, loading } = useMutation(CREATE_CUSTOMER)
  
  const createCustomer = async (customerData: CustomerForm): Promise<MutationResponse<Customer>> => {
    try {
      const result = await createCustomerMutation({
        input: customerData
      })
      
      if (result?.data?.createCustomer?.errors?.length > 0) {
        return {
          success: false,
          errors: result.data.createCustomer.errors,
          message: 'Customer creation failed with validation errors'
        }
      }
      
      if (result?.data?.createCustomer?.customer) {
        return {
          success: true,
          data: result.data.createCustomer.customer,
          message: 'Customer created successfully'
        }
      }
      
      return {
        success: false,
        errors: [{ message: 'Unknown error occurred during customer creation' }],
        message: 'Customer creation failed'
      }
      
    } catch (error) {
      console.error('Error creating customer:', error)
      return {
        success: false,
        errors: [{ message: 'Network error or server unavailable' }],
        message: 'Failed to create customer'
      }
    }
  }
  
  return {
    createCustomer,
    loading
  }
}

// General customer utilities
export function useCustomerUtils() {
  function formatPhoneNumber(phone: string): string {
    // Format Philippine phone numbers
    if (phone.startsWith('+639')) {
      return phone.replace(/(\+639)(\d{2})(\d{3})(\d{4})/, '$1 $2 $3 $4')
    }
    if (phone.startsWith('09')) {
      return phone.replace(/(\d{4})(\d{3})(\d{4})/, '$1 $2 $3')
    }
    return phone
  }
  
  function validateEmail(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  }
  
  function validatePhoneNumber(phone: string): boolean {
    // Philippine mobile number validation
    return /^(\+639|09)\d{9}$/.test(phone)
  }
  
  return {
    formatPhoneNumber,
    validateEmail,
    validatePhoneNumber
  }
}