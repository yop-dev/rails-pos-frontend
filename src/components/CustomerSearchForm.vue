<template>
  <div class="space-y-6">
    <!-- Search Section -->
    <div class="space-y-4">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <!-- Email Search -->
        <div class="relative">
          <BaseInput
            v-model="emailSearch"
            label="Search by Email"
            type="email"
            placeholder="customer@example.com"
            @input="handleEmailSearch"
            :right-icon="emailSearchLoading ? SpinnerIcon : MagnifyingGlassIcon"
          />
          
          <!-- Email Search Results Dropdown -->
          <div 
            v-if="emailSearchResults.length > 0"
            class="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto"
          >
            <button
              v-for="customer in emailSearchResults"
              :key="customer.id"
              @click="selectCustomer(customer)"
              class="w-full text-left px-4 py-3 hover:bg-gray-50 border-b border-gray-100 last:border-b-0 transition-colors focus:outline-none focus:bg-primary-50"
            >
              <div class="font-medium text-gray-900">{{ customer.fullName }}</div>
              <div class="text-sm text-gray-600">{{ customer.email }}</div>
              <div class="text-xs text-gray-500">{{ formatPhoneNumber(customer.phone) }}</div>
            </button>
          </div>
        </div>

        <!-- Phone Search -->
        <div class="relative">
          <BaseInput
            v-model="phoneSearch"
            label="Search by Phone"
            type="tel"
            placeholder="+639171234567"
            @input="handlePhoneSearch"
            :right-icon="phoneSearchLoading ? SpinnerIcon : MagnifyingGlassIcon"
          />
          
          <!-- Phone Search Results Dropdown -->
          <div 
            v-if="phoneSearchResults.length > 0"
            class="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto"
          >
            <button
              v-for="customer in phoneSearchResults"
              :key="customer.id"
              @click="selectCustomer(customer)"
              class="w-full text-left px-4 py-3 hover:bg-gray-50 border-b border-gray-100 last:border-b-0 transition-colors focus:outline-none focus:bg-primary-50"
            >
              <div class="font-medium text-gray-900">{{ customer.fullName }}</div>
              <div class="text-sm text-gray-600">{{ formatPhoneNumber(customer.phone) }}</div>
              <div class="text-xs text-gray-500">{{ customer.email }}</div>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Selected Customer Display -->
    <div v-if="selectedCustomer" class="bg-green-50 border border-green-200 rounded-lg p-4">
      <div class="flex items-start justify-between">
        <div>
          <h4 class="font-medium text-green-900">Selected Customer</h4>
          <div class="mt-2 space-y-1 text-sm text-green-800">
            <div><strong>Name:</strong> {{ selectedCustomer.fullName }}</div>
            <div><strong>Email:</strong> {{ selectedCustomer.email }}</div>
            <div><strong>Phone:</strong> {{ selectedCustomer.phone }}</div>
          </div>
        </div>
        
        <button
          @click="clearSelection"
          class="text-green-600 hover:text-green-800 transition-colors"
        >
          <XMarkIcon class="w-5 h-5" />
        </button>
      </div>
    </div>

    <!-- Create New Customer Form -->
    <div v-if="!selectedCustomer" class="border-t border-gray-200 pt-6">
      <div class="flex items-center justify-between mb-4">
        <h4 class="font-medium text-gray-900">Create New Customer</h4>
        <button
          @click="showCreateForm = !showCreateForm"
          class="text-sm text-primary-600 hover:text-primary-800 transition-colors"
        >
          {{ showCreateForm ? 'Hide Form' : 'Show Form' }}
        </button>
      </div>

      <form v-if="showCreateForm" @submit.prevent="handleCreateCustomer" class="space-y-4">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <BaseInput
            v-model="newCustomerForm.firstName"
            label="First Name"
            required
            :error="formErrors.firstName"
          />
          
          <BaseInput
            v-model="newCustomerForm.lastName"
            label="Last Name"
            required
            :error="formErrors.lastName"
          />
        </div>
        
        <BaseInput
          v-model="newCustomerForm.email"
          label="Email"
          type="email"
          required
          :error="formErrors.email"
          placeholder="john@example.com"
        />
        
        <BaseInput
          v-model="newCustomerForm.phone"
          label="Phone"
          type="tel"
          required
          :error="formErrors.phone"
          placeholder="+639171234567"
          hint="Format: +639XXXXXXXXX or 09XXXXXXXXX"
        />

        <div class="flex items-center space-x-3">
          <BaseButton
            type="submit"
            :loading="creatingCustomer"
            :disabled="!isFormValid"
          >
            Create Customer
          </BaseButton>
          
          <BaseButton
            type="button"
            variant="secondary"
            @click="resetForm"
          >
            Reset Form
          </BaseButton>
        </div>
      </form>
    </div>
    
    <!-- Debug Section - Real Backend Data -->
    <div class="mt-8 border-t border-gray-200 pt-6">
      <div class="flex items-center justify-between mb-4">
        <h4 class="font-medium text-gray-900">Backend Customers (Debug)</h4>
        <button
          @click="showDebug = !showDebug"
          class="text-sm text-primary-600 hover:text-primary-800 transition-colors"
        >
          {{ showDebug ? 'Hide' : 'Show' }} Debug
        </button>
      </div>
      
      <div v-if="showDebug" class="space-y-3">
        <!-- Loading State -->
        <div v-if="allCustomersLoading" class="text-sm text-blue-600">
          🔄 Loading customers from backend...
        </div>
        
        <!-- Error State -->
        <div v-if="allCustomersError" class="text-sm text-red-600 p-3 bg-red-50 rounded-lg">
          ❌ Error loading customers: {{ allCustomersError.message }}
          <div class="mt-2">
            <BaseButton size="sm" variant="secondary" @click="refetchAllCustomers()">
              Retry
            </BaseButton>
          </div>
        </div>
        
        <!-- Success State -->
        <div v-else-if="!allCustomersLoading">
          <p class="text-sm text-gray-600 mb-3">
            ✅ Found {{ allCustomers.length }} customer(s) in backend:
          </p>
          
          <div v-if="allCustomers.length === 0" class="text-sm text-yellow-600 p-3 bg-yellow-50 rounded-lg">
            ⚠️ No customers found in database. Try creating a new customer or check if the backend has sample data.
          </div>
          
          <div v-else class="grid grid-cols-1 gap-2">
            <div 
              v-for="customer in allCustomers" 
              :key="customer.id"
              class="bg-blue-50 p-3 rounded-lg text-sm border border-blue-200 cursor-pointer hover:bg-blue-100 transition-colors"
              @click="selectCustomer(customer)"
            >
              <div class="font-medium text-blue-900">{{ customer.fullName }}</div>
              <div class="text-blue-700">Email: {{ customer.email }}</div>
              <div class="text-blue-700">Phone: {{ formatPhoneNumber(customer.phone) }}</div>
              <div class="text-xs text-blue-600 mt-1">Click to select this customer</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Demo Section -->
    <div class="mt-8 border-t border-gray-200 pt-6">
      <div class="flex items-center justify-between mb-4">
        <h4 class="font-medium text-gray-900">Demo Customers</h4>
        <button
          @click="showDemo = !showDemo"
          class="text-sm text-primary-600 hover:text-primary-800 transition-colors"
        >
          {{ showDemo ? 'Hide' : 'Show' }} Demo
        </button>
      </div>
      
      <div v-if="showDemo" class="space-y-3">
        <p class="text-sm text-gray-600 mb-3">Try searching for these demo customers:</p>
        <div class="grid grid-cols-1 gap-2">
          <div 
            v-for="customer in demoCustomers" 
            :key="customer.id"
            class="bg-gray-50 p-3 rounded-lg text-sm"
          >
            <div class="font-medium text-gray-900">{{ customer.fullName }}</div>
            <div class="text-gray-600">Email: {{ customer.email }}</div>
            <div class="text-gray-600">Phone: {{ formatPhoneNumber(customer.phone) }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive } from 'vue'
import { MagnifyingGlassIcon, XMarkIcon } from '@heroicons/vue/24/outline'
import { useCustomerSearch, useCreateCustomer, useCustomerUtils } from '../composables/useCustomers'
import { useGlobalStore } from '../stores/global'
import BaseInput from './BaseInput.vue'
import BaseButton from './BaseButton.vue'
import type { Customer, CustomerForm } from '../types'

// Emits
const emit = defineEmits<{
  'customer-selected': [customer: Customer]
  'customer-created': [customer: Customer]
}>()

// State
const emailSearch = ref('')
const phoneSearch = ref('')
const selectedCustomer = ref<Customer | null>(null)
const showCreateForm = ref(false)
const showDemo = ref(false)
const showDebug = ref(false) // Keep debug hidden by default, but accessible

const newCustomerForm = reactive<CustomerForm>({
  firstName: '',
  lastName: '',
  email: '',
  phone: ''
})

const formErrors = reactive({
  firstName: '',
  lastName: '',
  email: '',
  phone: ''
})

// Composables
const {
  searchByEmail,
  searchByPhone,
  emailResults: emailSearchResults,
  phoneResults: phoneSearchResults,
  emailLoading: emailSearchLoading,
  phoneLoading: phoneSearchLoading,
  emailError,
  phoneError,
  // Debug data
  allCustomers,
  allCustomersLoading,
  allCustomersError,
  refetchAllCustomers
} = useCustomerSearch()

const { createCustomer, loading: creatingCustomer } = useCreateCustomer()
const { formatPhoneNumber } = useCustomerUtils()
const globalStore = useGlobalStore()

// Computed
const isFormValid = computed(() => 
  newCustomerForm.firstName && 
  newCustomerForm.lastName && 
  newCustomerForm.email && 
  newCustomerForm.phone
)

// Demo customers for testing
const demoCustomers: Customer[] = [
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
  }
]

// Methods
let emailSearchTimeout: number
function handleEmailSearch() {
  clearTimeout(emailSearchTimeout)
  
  if (emailSearch.value.length > 2) {
    emailSearchTimeout = setTimeout(() => {
      searchByEmail(emailSearch.value)
    }, 300)
  }
}

let phoneSearchTimeout: number
function handlePhoneSearch() {
  clearTimeout(phoneSearchTimeout)
  
  if (phoneSearch.value.length > 3) {
    phoneSearchTimeout = setTimeout(() => {
      searchByPhone(phoneSearch.value)
    }, 300)
  }
}

function selectCustomer(customer: Customer) {
  selectedCustomer.value = customer
  emailSearch.value = ''
  phoneSearch.value = ''
  // Clear search results
  emailSearchResults.value = []
  phoneSearchResults.value = []
  
  emit('customer-selected', customer)
  globalStore.showSuccess('Customer Selected', `Selected ${customer.fullName}`)
}

function clearSelection() {
  selectedCustomer.value = null
}

async function handleCreateCustomer() {
  if (!isFormValid.value) return
  
  // Reset form errors
  Object.keys(formErrors).forEach(key => {
    formErrors[key as keyof typeof formErrors] = ''
  })

  try {
    const result = await createCustomer(newCustomerForm)
    
    if (result.success && result.data) {
      selectedCustomer.value = result.data
      emit('customer-created', result.data)
      resetForm()
      showCreateForm.value = false
      globalStore.showSuccess('Customer Created', `${result.data.fullName} has been created successfully`)
    } else if (result.errors) {
      // Handle field-specific errors
      result.errors.forEach(error => {
        if (error.field && error.field in formErrors) {
          formErrors[error.field as keyof typeof formErrors] = error.message
        }
      })
      
      // Show general error if no field-specific errors
      if (!result.errors.some(error => error.field)) {
        globalStore.showError('Customer Creation Failed', result.message || 'Please check the form and try again')
      }
    }
  } catch (error) {
    console.error('Error creating customer:', error)
    globalStore.showError('Error', 'Failed to create customer. Please try again.')
  }
}

function resetForm() {
  newCustomerForm.firstName = ''
  newCustomerForm.lastName = ''
  newCustomerForm.email = ''
  newCustomerForm.phone = ''
  
  // Clear errors
  Object.keys(formErrors).forEach(key => {
    formErrors[key as keyof typeof formErrors] = ''
  })
}

// Icons for loading states
const SpinnerIcon = {
  template: '<div class="animate-spin rounded-full h-5 w-5 border-b-2 border-current"></div>'
}
</script>