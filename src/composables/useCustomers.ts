import { ref, computed } from 'vue'
import { useQuery, useLazyQuery, useMutation } from '@vue/apollo-composable'
import { gql } from '@apollo/client/core'
import type { Customer, CustomerForm, ApiError, MutationResponse } from '../types'

// GraphQL Queries and Mutations
// Remove duplicate queries - now using unified SEARCH_CUSTOMERS query


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

// Note: We now use client-side filtering instead of server-side search for better UX

// Customer Search Composable - Using client-side filtering like OrderManager
export function useCustomerSearch() {
  // Fetch all customers once
  const {
    result: allCustomersResult,
    loading: allCustomersLoading,
    error: allCustomersError,
    refetch: refetchAllCustomers
  } = useQuery(GET_ALL_CUSTOMERS)
  
  const allCustomers = computed(() => allCustomersResult.value?.customers ?? [])
  
  // Search state
  const emailSearchQuery = ref('')
  const phoneSearchQuery = ref('')
  
  // Client-side filtered results
  const emailResults = computed(() => {
    if (!emailSearchQuery.value || emailSearchQuery.value.length < 3) {
      return []
    }
    
    const query = emailSearchQuery.value.toLowerCase().trim()
    console.log(`🔍 Filtering customers by email:`, query)
    
    const results = allCustomers.value.filter((customer: Customer) => 
      customer.email.toLowerCase().includes(query)
    )
    
    console.log(`✅ Email filter results:`, results.length, 'customers found')
    return results
  })
  
  const phoneResults = computed(() => {
    if (!phoneSearchQuery.value || phoneSearchQuery.value.length < 4) {
      return []
    }
    
    const query = phoneSearchQuery.value.toLowerCase().trim()
    console.log(`🔍 Filtering customers by phone:`, query)
    
    const results = allCustomers.value.filter((customer: Customer) => 
      customer.phone.toLowerCase().includes(query)
    )
    
    console.log(`✅ Phone filter results:`, results.length, 'customers found')
    return results
  })
  
  // Search functions that update the query strings
  function searchByEmail(email: string) {
    console.log(`📧 Setting email search query:`, email)
    emailSearchQuery.value = email
    // Clear phone search when searching by email
    phoneSearchQuery.value = ''
  }
  
  function searchByPhone(phone: string) {
    console.log(`📱 Setting phone search query:`, phone)
    phoneSearchQuery.value = phone
    // Clear email search when searching by phone
    emailSearchQuery.value = ''
  }
  
  // Clear all search results
  function clearAllResults() {
    emailSearchQuery.value = ''
    phoneSearchQuery.value = ''
  }
  
  return {
    searchByEmail,
    searchByPhone,
    emailResults,
    phoneResults,
    emailLoading: allCustomersLoading, // Use the main loading state
    phoneLoading: allCustomersLoading, // Use the main loading state
    emailError: allCustomersError,
    phoneError: allCustomersError,
    // Search utilities
    clearAllResults,
    // Debug data
    allCustomers,
    allCustomersLoading,
    allCustomersError,
    refetchAllCustomers
  }
}

// GraphQL Mutation for Customer Creation
const CREATE_CUSTOMER = gql`
  mutation CreateCustomer($firstName: String!, $lastName: String!, $email: String!, $phone: String) {
    createCustomer(firstName: $firstName, lastName: $lastName, email: $email, phone: $phone) {
      customer {
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
      errors {
        message
        path
      }
    }
  }
`

// Customer Creation Composable
export function useCreateCustomer() {
  const { mutate: createCustomerMutation, loading, error } = useMutation(CREATE_CUSTOMER)
  
  const createCustomer = async (customerData: CustomerForm): Promise<MutationResponse<Customer>> => {
    try {
      const result = await createCustomerMutation({
        firstName: customerData.firstName.trim(),
        lastName: customerData.lastName.trim(),
        email: customerData.email.trim().toLowerCase(),
        phone: customerData.phone?.trim() || null
      })
      
      const { customer, errors: gqlErrors } = result?.data?.createCustomer || {}
      
      if (gqlErrors && gqlErrors.length > 0) {
        const errors = gqlErrors.map((err: any) => ({
          field: err.path?.[0] || 'general',
          message: err.message
        }))
        
        return {
          success: false,
          errors,
          message: 'Please correct the errors and try again'
        }
      }
      
      if (customer) {
        return {
          success: true,
          data: customer,
          message: 'Customer created successfully'
        }
      }
      
      return {
        success: false,
        errors: [{ message: 'Unknown error occurred' }],
        message: 'Failed to create customer'
      }
      
    } catch (err) {
      console.error('Error creating customer:', err)
      
      // Handle GraphQL errors
      if (err && typeof err === 'object' && 'graphQLErrors' in err) {
        const graphQLErrors = (err as any).graphQLErrors
        if (graphQLErrors && graphQLErrors.length > 0) {
          const errors = graphQLErrors.map((error: any) => ({
            field: 'general',
            message: error.message
          }))
          
          return {
            success: false,
            errors,
            message: 'Failed to create customer'
          }
        }
      }
      
      return {
        success: false,
        errors: [{ message: 'An unexpected error occurred' }],
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