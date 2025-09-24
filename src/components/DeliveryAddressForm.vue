<template>
  <div class="space-y-6">
    <!-- Address Form -->
    <form @submit.prevent="handleSubmit" class="space-y-4">
      <!-- Unit/Floor/Building (Optional) -->
      <BaseInput
        v-model="form.unitFloorBuilding"
        label="Unit/Floor/Building"
        placeholder="e.g., Unit 2B, 3rd Floor, ABC Building"
        hint="Optional: Apartment number, floor, or building name"
      />
      
      <!-- Street Address (Required) -->
      <BaseInput
        v-model="form.street"
        label="Street Address"
        placeholder="123 Main Street"
        required
        :error="formErrors.street"
      />
      
      <!-- Barangay (Required) -->
      <BaseInput
        v-model="form.barangay"
        label="Barangay"
        placeholder="Barangay Name"
        required
        :error="formErrors.barangay"
      />
      
      <!-- City and Province -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <BaseInput
          v-model="form.city"
          label="City"
          placeholder="City Name"
          required
          :error="formErrors.city"
        />
        
        <BaseInput
          v-model="form.province"
          label="Province"
          placeholder="Province Name"
          required
          :error="formErrors.province"
        />
      </div>
      
      <!-- Postal Code -->
      <BaseInput
        v-model="form.postalCode"
        label="Postal Code"
        placeholder="1234"
        type="text"
        :error="formErrors.postalCode"
        hint="Optional: Philippine postal code"
      />
      
      <!-- Action Buttons -->
      <div class="flex items-center space-x-3 pt-4">
        <BaseButton
          type="submit"
          :loading="isSubmitting"
          :disabled="!isFormValid"
        >
          Save Address
        </BaseButton>
        
        <BaseButton
          type="button"
          variant="secondary"
          @click="resetForm"
        >
          Reset
        </BaseButton>
        
        <!-- Clear Address Button (if address exists) -->
        <BaseButton
          v-if="initialAddress"
          type="button"
          variant="danger"
          size="sm"
          @click="clearAddress"
        >
          Clear Address
        </BaseButton>
      </div>
    </form>
    
    <!-- Address Preview -->
    <div v-if="addressPreview" class="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
      <h4 class="font-medium text-blue-900 mb-2">Address Preview</h4>
      <div class="text-sm text-blue-800">
        <div v-if="form.unitFloorBuilding" class="mb-1">{{ form.unitFloorBuilding }}</div>
        <div>{{ addressPreview }}</div>
      </div>
    </div>
    
    <!-- Sample Addresses for Testing -->
    <div class="mt-8 border-t border-gray-200 pt-6">
      <div class="flex items-center justify-between mb-4">
        <h4 class="font-medium text-gray-900">Quick Fill (Demo)</h4>
        <button
          @click="showSampleAddresses = !showSampleAddresses"
          class="text-sm text-primary-600 hover:text-primary-800 transition-colors"
        >
          {{ showSampleAddresses ? 'Hide' : 'Show' }} Sample Addresses
        </button>
      </div>
      
      <div v-if="showSampleAddresses" class="grid grid-cols-1 gap-3">
        <button
          v-for="sample in sampleAddresses"
          :key="sample.label"
          @click="fillSampleAddress(sample)"
          class="text-left p-3 bg-gray-50 hover:bg-gray-100 rounded-lg border border-gray-200 transition-colors"
        >
          <div class="font-medium text-gray-900">{{ sample.label }}</div>
          <div class="text-sm text-gray-600">{{ sample.preview }}</div>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch } from 'vue'
import { useGlobalStore } from '../stores/global'
import BaseInput from './BaseInput.vue'
import BaseButton from './BaseButton.vue'
import type { Address, AddressForm } from '../types'

// Props & Emits
const props = defineProps<{
  initialAddress?: Address | null
}>()

const emit = defineEmits<{
  'address-updated': [address: Address]
  'address-cleared': []
}>()

// State
const isSubmitting = ref(false)
const showSampleAddresses = ref(false)

const form = reactive<AddressForm>({
  unitFloorBuilding: '',
  street: '',
  barangay: '',
  city: '',
  province: '',
  postalCode: ''
})

const formErrors = reactive({
  street: '',
  barangay: '',
  city: '',
  province: '',
  postalCode: ''
})

// Composables
const globalStore = useGlobalStore()

// Sample addresses for demo purposes
const sampleAddresses = [
  {
    label: 'Manila Sample',
    preview: '123 Rizal Ave, Sta. Cruz, Manila, Metro Manila',
    data: {
      unitFloorBuilding: '2nd Floor, Corner Shop',
      street: '123 Rizal Avenue',
      barangay: 'Sta. Cruz',
      city: 'Manila',
      province: 'Metro Manila',
      postalCode: '1003'
    }
  },
  {
    label: 'Quezon City Sample',
    preview: '456 Commonwealth Ave, Diliman, Quezon City, Metro Manila',
    data: {
      unitFloorBuilding: 'Unit 5A, Tower B',
      street: '456 Commonwealth Avenue',
      barangay: 'Diliman',
      city: 'Quezon City',
      province: 'Metro Manila',
      postalCode: '1101'
    }
  },
  {
    label: 'Makati Sample',
    preview: '789 Ayala Ave, Poblacion, Makati, Metro Manila',
    data: {
      unitFloorBuilding: '',
      street: '789 Ayala Avenue',
      barangay: 'Poblacion',
      city: 'Makati',
      province: 'Metro Manila',
      postalCode: '1229'
    }
  }
]

// Computed
const isFormValid = computed(() => 
  form.street && 
  form.barangay && 
  form.city && 
  form.province
)

const addressPreview = computed(() => {
  if (!isFormValid.value) return ''
  
  const parts = [form.street, form.barangay, form.city, form.province]
  return parts.filter(Boolean).join(', ')
})

// Watchers
watch(() => props.initialAddress, (newAddress) => {
  if (newAddress) {
    populateForm(newAddress)
  }
}, { immediate: true })

// Methods
function populateForm(address: Address) {
  form.unitFloorBuilding = address.unitFloorBuilding || ''
  form.street = address.street || ''
  form.barangay = address.barangay || ''
  form.city = address.city || ''
  form.province = address.province || ''
  form.postalCode = address.postalCode || ''
}

function resetForm() {
  form.unitFloorBuilding = ''
  form.street = ''
  form.barangay = ''
  form.city = ''
  form.province = ''
  form.postalCode = ''
  
  // Clear errors
  Object.keys(formErrors).forEach(key => {
    formErrors[key as keyof typeof formErrors] = ''
  })
}

function clearAddress() {
  resetForm()
  emit('address-cleared')
  globalStore.showInfo('Address Cleared', 'Delivery address has been removed')
}

function fillSampleAddress(sample: typeof sampleAddresses[0]) {
  Object.assign(form, sample.data)
  globalStore.showInfo('Sample Address', `Filled with ${sample.label}`)
}

async function handleSubmit() {
  // Reset errors
  Object.keys(formErrors).forEach(key => {
    formErrors[key as keyof typeof formErrors] = ''
  })
  
  // Basic validation
  let hasErrors = false
  
  if (!form.street) {
    formErrors.street = 'Street address is required'
    hasErrors = true
  }
  
  if (!form.barangay) {
    formErrors.barangay = 'Barangay is required'
    hasErrors = true
  }
  
  if (!form.city) {
    formErrors.city = 'City is required'
    hasErrors = true
  }
  
  if (!form.province) {
    formErrors.province = 'Province is required'
    hasErrors = true
  }
  
  if (hasErrors) {
    globalStore.showError('Validation Error', 'Please fill in all required fields')
    return
  }
  
  isSubmitting.value = true
  
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500))
    
    // Create address object
    const address: Address = {
      id: props.initialAddress?.id || 'new-' + Date.now(),
      unitFloorBuilding: form.unitFloorBuilding || undefined,
      street: form.street,
      barangay: form.barangay,
      city: form.city,
      province: form.province,
      postalCode: form.postalCode || ''
    }
    
    emit('address-updated', address)
    globalStore.showSuccess('Address Saved', 'Delivery address has been updated')
    
    // Scroll to shipping method section
    setTimeout(() => {
      scrollToShippingSection()
    }, 100)
    
  } catch (error) {
    console.error('Error saving address:', error)
    globalStore.showError('Error', 'Failed to save address. Please try again.')
  } finally {
    isSubmitting.value = false
  }
}

// Function to scroll to shipping method section
function scrollToShippingSection() {
  // Look for shipping method section by text content
  const headings = Array.from(document.querySelectorAll('h3'))
  const shippingSection = headings.find(h => h.textContent?.includes('Shipping Method'))
  
  if (shippingSection) {
    // Scroll to the shipping section
    shippingSection.closest('.bg-white')?.scrollIntoView({ 
      behavior: 'smooth', 
      block: 'start',
      inline: 'nearest'
    })
  } else {
    // Fallback: scroll down by a reasonable amount to reveal next section
    window.scrollBy({ 
      top: 500, 
      behavior: 'smooth' 
    })
  }
}

</script>
