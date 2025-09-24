import { ref } from 'vue'
import { useLazyQuery, useMutation } from '@vue/apollo-composable'
import { gql } from '@apollo/client/core'
import type { Customer, CustomerForm, ApiError, MutationResponse } from '../types'

// GraphQL Queries and Mutations
const SEARCH_CUSTOMERS_BY_EMAIL = gql`
  query SearchCustomersByEmail($email: String!) {
    customers(filter: { email: $email }) {
      id
      firstName
      lastName
      email
      phone
      fullName
    }
  }
`

const SEARCH_CUSTOMERS_BY_PHONE = gql`
  query SearchCustomersByPhone($phone: String!) {
    customers(filter: { phone: $phone }) {
      id
      firstName
      lastName
      email
      phone
      fullName
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

// Customer Search Composable
export function useCustomerSearch() {
  // Email search
  const {
    load: loadEmailSearch,
    result: emailResult,
    loading: emailLoading
  } = useLazyQuery(SEARCH_CUSTOMERS_BY_EMAIL)
  
  // Phone search
  const {
    load: loadPhoneSearch,
    result: phoneResult,
    loading: phoneLoading
  } = useLazyQuery(SEARCH_CUSTOMERS_BY_PHONE)
  
  // Results
  const emailResults = ref<Customer[]>([])
  const phoneResults = ref<Customer[]>([])
  
  // Search functions
  async function searchByEmail(email: string) {
    if (!email || email.length < 3) {
      emailResults.value = []
      return
    }
    
    try {
      // In development, use mock data
      if (import.meta.env.DEV) {
        searchCustomersMock('email', email)
        return
      }
      
      await loadEmailSearch(SEARCH_CUSTOMERS_BY_EMAIL, { email })
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
      // In development, use mock data
      if (import.meta.env.DEV) {
        searchCustomersMock('phone', phone)
        return
      }
      
      await loadPhoneSearch(SEARCH_CUSTOMERS_BY_PHONE, { phone })
      phoneResults.value = phoneResult.value?.customers || []
    } catch (error) {
      console.error('Error searching customers by phone:', error)
      phoneResults.value = []
    }
  }
  
  // Mock search for development
  function searchCustomersMock(type: 'email' | 'phone', query: string) {
    const mockCustomers: Customer[] = [
      {
        id: '1',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        phone: '+639171234567',
        fullName: 'John Doe'
      },
      {
        id: '2',
        firstName: 'Maria',
        lastName: 'Santos',
        email: 'maria.santos@gmail.com',
        phone: '+639171234568',
        fullName: 'Maria Santos'
      },
      {
        id: '3',
        firstName: 'Jose',
        lastName: 'Rizal',
        email: 'jose.rizal@email.com',
        phone: '+639171234569',
        fullName: 'Jose Rizal'
      },
      {
        id: '4',
        firstName: 'Ana',
        lastName: 'Cruz',
        email: 'ana.cruz@yahoo.com',
        phone: '+639171234570',
        fullName: 'Ana Cruz'
      },
      {
        id: '5',
        firstName: 'Miguel',
        lastName: 'Rodriguez',
        email: 'miguel.rodriguez@hotmail.com',
        phone: '+639171234571',
        fullName: 'Miguel Rodriguez'
      }
    ]
    
    // Filter based on search type and query
    let filtered: Customer[] = []
    
    if (type === 'email') {
      filtered = mockCustomers.filter(customer => 
        customer.email.toLowerCase().includes(query.toLowerCase()) ||
        customer.fullName.toLowerCase().includes(query.toLowerCase())
      )
      emailResults.value = filtered
    } else {
      filtered = mockCustomers.filter(customer => 
        customer.phone.includes(query) ||
        customer.fullName.toLowerCase().includes(query.toLowerCase())
      )
      phoneResults.value = filtered
    }
  }
  
  return {
    searchByEmail,
    searchByPhone,
    emailResults,
    phoneResults,
    emailLoading,
    phoneLoading
  }
}

// Customer Creation Composable
export function useCreateCustomer() {
  const { mutate: createCustomerMutation, loading } = useMutation(CREATE_CUSTOMER)
  
  const createCustomer = async (customerData: CustomerForm): Promise<MutationResponse<Customer>> => {
    try {
      // In development, use mock creation
      if (import.meta.env.DEV) {
        return createCustomerMock(customerData)
      }
      
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
  
  // Mock customer creation for development
  async function createCustomerMock(customerData: CustomerForm): Promise<MutationResponse<Customer>> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Basic validation
    const errors: ApiError[] = []
    
    if (!customerData.firstName) {
      errors.push({ field: 'firstName', message: 'First name is required' })
    }
    
    if (!customerData.lastName) {
      errors.push({ field: 'lastName', message: 'Last name is required' })
    }
    
    if (!customerData.email) {
      errors.push({ field: 'email', message: 'Email is required' })
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerData.email)) {
      errors.push({ field: 'email', message: 'Please enter a valid email address' })
    }
    
    if (!customerData.phone) {
      errors.push({ field: 'phone', message: 'Phone number is required' })
    } else if (!/^(\+639|09)\d{9}$/.test(customerData.phone)) {
      errors.push({ field: 'phone', message: 'Please enter a valid Philippine phone number' })
    }
    
    // Check for duplicate email (mock)
    if (customerData.email === 'duplicate@example.com') {
      errors.push({ field: 'email', message: 'A customer with this email already exists' })
    }
    
    if (errors.length > 0) {
      return {
        success: false,
        errors,
        message: 'Validation failed'
      }
    }
    
    // Create mock customer
    const newCustomer: Customer = {
      id: 'customer-' + Date.now(),
      firstName: customerData.firstName,
      lastName: customerData.lastName,
      email: customerData.email,
      phone: customerData.phone,
      fullName: `${customerData.firstName} ${customerData.lastName}`
    }
    
    return {
      success: true,
      data: newCustomer,
      message: 'Customer created successfully'
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