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
          />
        </div>

        <!-- Phone Search -->
        <div class="relative">
          <BaseInput
            v-model="phoneSearch"
            label="Search by Phone"
            type="tel"
            placeholder="+1234567890"
            @input="handlePhoneSearch"
          />
        </div>
      </div>
    </div>

    <!-- Search Results -->
    <div v-if="searchResults.length > 0" class="space-y-2">
      <h4 class="text-sm font-medium text-gray-900">Search Results</h4>
      <div class="bg-white border border-gray-200 rounded-lg divide-y divide-gray-200">
        <button
          v-for="customer in searchResults"
          :key="customer.id"
          @click="selectCustomer(customer)"
          class="w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors"
        >
          <div class="font-medium text-gray-900">{{ customer.fullName }}</div>
          <div class="text-sm text-gray-600">{{ customer.email }}</div>
          <div class="text-xs text-gray-500">{{ customer.phone }}</div>
        </button>
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
          />
          
          <BaseInput
            v-model="newCustomerForm.lastName"
            label="Last Name"
            required
          />
        </div>
        
        <BaseInput
          v-model="newCustomerForm.email"
          label="Email"
          type="email"
          required
        />
        
        <BaseInput
          v-model="newCustomerForm.phone"
          label="Phone"
          type="tel"
          required
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
import { ref, computed, reactive } from 'vue'
import { XMarkIcon } from '@heroicons/vue/24/outline'
import { useGlobalStore } from '../stores/global'
import BaseInput from './BaseInput.vue'
import BaseButton from './BaseButton.vue'
import type { Customer } from '../types'

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
const creatingCustomer = ref(false)
const searchResults = ref<Customer[]>([])

const newCustomerForm = reactive({
  firstName: '',
  lastName: '',
  email: '',
  phone: ''
})

// Composables
const globalStore = useGlobalStore()

// Computed
const isFormValid = computed(() => 
  newCustomerForm.firstName && 
  newCustomerForm.lastName && 
  newCustomerForm.email && 
  newCustomerForm.phone
)

// Methods
let emailSearchTimeout: number
function handleEmailSearch() {
  clearTimeout(emailSearchTimeout)
  
  if (emailSearch.value.length > 2) {
    emailSearchTimeout = setTimeout(() => {
      searchCustomers('email', emailSearch.value)
    }, 300)
  } else {
    searchResults.value = []
  }
}

let phoneSearchTimeout: number
function handlePhoneSearch() {
  clearTimeout(phoneSearchTimeout)
  
  if (phoneSearch.value.length > 3) {
    phoneSearchTimeout = setTimeout(() => {
      searchCustomers('phone', phoneSearch.value)
    }, 300)
  } else {
    searchResults.value = []
  }
}

function searchCustomers(type: 'email' | 'phone', query: string) {
  // Mock customer data for demonstration
  const mockCustomers: Customer[] = [
    {
      id: '1',
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      phone: '+1234567890',
      fullName: 'John Doe'
    },
    {
      id: '2',
      firstName: 'Jane',
      lastName: 'Smith',
      email: 'jane@example.com',
      phone: '+1987654321',
      fullName: 'Jane Smith'
    },
    {
      id: '3',
      firstName: 'Bob',
      lastName: 'Johnson',
      email: 'bob@example.com',
      phone: '+1122334455',
      fullName: 'Bob Johnson'
    }
  ]
  
  // Simple mock filtering
  if (type === 'email') {
    searchResults.value = mockCustomers.filter(customer => 
      customer.email.toLowerCase().includes(query.toLowerCase())
    )
  } else {
    searchResults.value = mockCustomers.filter(customer => 
      customer.phone.includes(query)
    )
  }
}

function selectCustomer(customer: Customer) {
  selectedCustomer.value = customer
  emailSearch.value = ''
  phoneSearch.value = ''
  searchResults.value = []
  emit('customer-selected', customer)
}

function clearSelection() {
  selectedCustomer.value = null
}

async function handleCreateCustomer() {
  if (!isFormValid.value) return

  creatingCustomer.value = true
  
  try {
    // Simulate customer creation
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    const newCustomer: Customer = {
      id: 'new-' + Date.now(),
      ...newCustomerForm,
      fullName: `${newCustomerForm.firstName} ${newCustomerForm.lastName}`
    }
    
    selectedCustomer.value = newCustomer
    emit('customer-created', newCustomer)
    resetForm()
    showCreateForm.value = false
    
  } catch (error) {
    console.error('Error creating customer:', error)
    globalStore.showError('Error', 'Failed to create customer. Please try again.')
  } finally {
    creatingCustomer.value = false
  }
}

function resetForm() {
  newCustomerForm.firstName = ''
  newCustomerForm.lastName = ''
  newCustomerForm.email = ''
  newCustomerForm.phone = ''
}
</script>