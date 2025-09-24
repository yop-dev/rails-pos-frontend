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

// Unified search query for better performance
const SEARCH_CUSTOMERS = gql`
  query SearchCustomers($search: CustomersSearchInput!) {
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

// Customer Search Composable
export function useCustomerSearch() {
  // Test query for all customers
  const {
    result: allCustomersResult,
    loading: allCustomersLoading,
    error: allCustomersError,
    refetch: refetchAllCustomers
  } = useQuery(GET_ALL_CUSTOMERS)
  
  // Unified search query
  const {
    load: loadSearch,
    result: searchResult,
    loading: searchLoading,
    error: searchError
  } = useLazyQuery(SEARCH_CUSTOMERS)
  
  // Results and caching
  const emailResults = ref<Customer[]>([])
  const phoneResults = ref<Customer[]>([])
  const allCustomers = computed(() => allCustomersResult.value?.customers ?? [])
  
  // Cache for search results (5 minute TTL)
  const searchCache = ref<Map<string, { results: Customer[], timestamp: number }>>(new Map())
  const CACHE_TTL = 5 * 60 * 1000 // 5 minutes
  
  // Debounced search with abort controller
  let currentSearchController: AbortController | null = null
  
  // Generic search function with caching and error handling
  async function performSearch(searchType: 'email' | 'phone', searchValue: string): Promise<Customer[]> {
    if (!searchValue || 
        (searchType === 'email' && searchValue.length < 3) || 
        (searchType === 'phone' && searchValue.length < 4)) {
      return []
    }
    
    // Check cache first
    const cacheKey = `${searchType}:${searchValue.toLowerCase()}`
    const cached = searchCache.value.get(cacheKey)
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      return cached.results
    }
    
    // Cancel previous search if still running
    if (currentSearchController) {
      currentSearchController.abort()
    }
    
    currentSearchController = new AbortController()
    
    try {
      const searchParams = searchType === 'email' 
        ? { email: searchValue }
        : { phone: searchValue }
        
      const result = await loadSearch(SEARCH_CUSTOMERS, 
        { search: searchParams },
        { context: { fetchOptions: { signal: currentSearchController.signal } } }
      )
      
      const customers = searchResult.value?.customers || []
      
      // Cache the results
      searchCache.value.set(cacheKey, {
        results: customers,
        timestamp: Date.now()
      })
      
      return customers
    } catch (error: any) {
      // Don't log aborted requests as errors
      if (error.name !== 'AbortError') {
        console.error(`Error searching customers by ${searchType}:`, error)
      }
      return []
    }
  }
  
  // Search functions with improved debouncing
  async function searchByEmail(email: string) {
    try {
      const results = await performSearch('email', email)
      emailResults.value = results
    } catch (error) {
      emailResults.value = []
    }
  }
  
  async function searchByPhone(phone: string) {
    try {
      const results = await performSearch('phone', phone)
      phoneResults.value = results
    } catch (error) {
      phoneResults.value = []
    }
  }
  
  // Optional: Log debug info only if needed
  if (import.meta.env.DEV && allCustomersError.value) {
    console.log('❗ All customers error:', allCustomersError.value)
  }
  
  // Clear cache periodically to prevent memory leaks
  const clearOldCache = () => {
    const now = Date.now()
    searchCache.value.forEach((value, key) => {
      if (now - value.timestamp > CACHE_TTL) {
        searchCache.value.delete(key)
      }
    })
  }
  
  // Clear cache every 10 minutes
  setInterval(clearOldCache, 10 * 60 * 1000)
  
  return {
    searchByEmail,
    searchByPhone,
    emailResults,
    phoneResults,
    emailLoading: searchLoading,
    phoneLoading: searchLoading, // Both use the same unified query
    emailError: searchError,
    phoneError: searchError, // Both use the same unified query
    // Search utilities
    clearCache: () => searchCache.value.clear(),
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