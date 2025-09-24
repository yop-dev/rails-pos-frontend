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
            v-if="emailSearchResults.length > 0 || emailSearchLoading || emailError"
            class="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto"
          >
            <!-- Loading State -->
            <div v-if="emailSearchLoading" class="px-4 py-3 text-center text-gray-500">
              <div class="flex items-center justify-center space-x-2">
                <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-600"></div>
                <span class="text-sm">Searching customers...</span>
              </div>
            </div>
            
            <!-- Error State -->
            <div v-else-if="emailError" class="px-4 py-3 text-center">
              <div class="text-sm text-red-600 mb-2">Search failed</div>
              <button 
                @click="handleEmailSearch()"
                class="text-xs text-primary-600 hover:text-primary-800 underline"
              >
                Try again
              </button>
            </div>
            
            <!-- Results -->
            <template v-else-if="emailSearchResults.length > 0">
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
            </template>
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
            v-if="phoneSearchResults.length > 0 || phoneSearchLoading || phoneError"
            class="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto"
          >
            <!-- Loading State -->
            <div v-if="phoneSearchLoading" class="px-4 py-3 text-center text-gray-500">
              <div class="flex items-center justify-center space-x-2">
                <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-600"></div>
                <span class="text-sm">Searching customers...</span>
              </div>
            </div>
            
            <!-- Error State -->
            <div v-else-if="phoneError" class="px-4 py-3 text-center">
              <div class="text-sm text-red-600 mb-2">Search failed</div>
              <button 
                @click="handlePhoneSearch()"
                class="text-xs text-primary-600 hover:text-primary-800 underline"
              >
                Try again
              </button>
            </div>
            
            <!-- Results -->
            <template v-else-if="phoneSearchResults.length > 0">
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
            </template>
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
          class="flex items-center justify-center w-8 h-8 rounded-full bg-primary-100 text-primary-600 hover:bg-primary-200 hover:text-primary-800 transition-colors"
          :title="showCreateForm ? 'Hide Form' : 'Show Form'"
        >
          <PlusIcon v-if="!showCreateForm" class="w-4 h-4" />
          <XMarkIcon v-else class="w-4 h-4" />
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
  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive, onUnmounted } from 'vue'
import { MagnifyingGlassIcon, XMarkIcon, PlusIcon } from '@heroicons/vue/24/outline'
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
  clearAllResults
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


// Methods with improved debouncing
let emailSearchTimeout: NodeJS.Timeout | null = null
function handleEmailSearch() {
  // Clear existing timeout
  if (emailSearchTimeout) {
    clearTimeout(emailSearchTimeout)
  }
  
  // The computed properties will automatically handle clearing when too short
  // No need to manually clear results here anymore
  
  // Debounce with longer timeout for better UX
  emailSearchTimeout = setTimeout(async () => {
    try {
      await searchByEmail(emailSearch.value)
    } catch (error) {
      console.error('Email search failed:', error)
      globalStore.showError('Search Failed', 'Unable to search customers. Please try again.')
    }
  }, 600) // Increased from 300ms to 600ms
}

let phoneSearchTimeout: NodeJS.Timeout | null = null
function handlePhoneSearch() {
  // Clear existing timeout
  if (phoneSearchTimeout) {
    clearTimeout(phoneSearchTimeout)
  }
  
  // The computed properties will automatically handle clearing when too short
  // No need to manually clear results here anymore
  
  // Debounce with longer timeout for better UX
  phoneSearchTimeout = setTimeout(async () => {
    try {
      await searchByPhone(phoneSearch.value)
    } catch (error) {
      console.error('Phone search failed:', error)
      globalStore.showError('Search Failed', 'Unable to search customers. Please try again.')
    }
  }, 600) // Increased from 300ms to 600ms
}

function selectCustomer(customer: Customer) {
  selectedCustomer.value = customer
  emailSearch.value = ''
  phoneSearch.value = ''
  // Clear search results using the composable function
  clearAllResults()
  
  emit('customer-selected', customer)
  globalStore.showSuccess('Customer Selected', `Selected ${customer.fullName}`)
}

function clearSelection() {
  selectedCustomer.value = null
}

// Expose method for parent components to clear the selection
function clearCustomerSelection() {
  selectedCustomer.value = null
  emailSearch.value = ''
  phoneSearch.value = ''
  clearAllResults()
  showCreateForm.value = false
  resetForm()
}

// Expose the clear function to parent components
defineExpose({
  clearCustomerSelection
})

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

// Cleanup timeouts on component unmount
onUnmounted(() => {
  if (emailSearchTimeout) {
    clearTimeout(emailSearchTimeout)
  }
  if (phoneSearchTimeout) {
    clearTimeout(phoneSearchTimeout)
  }
})

// Icons for loading states
const SpinnerIcon = {
  template: '<div class="animate-spin rounded-full h-5 w-5 border-b-2 border-current"></div>'
}
</script>