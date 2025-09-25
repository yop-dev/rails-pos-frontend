<template>
  <div class="space-y-6">
    <!-- Address Form -->
    <form @submit.prevent="handleSubmit" class="space-y-4">
      <!-- Region (Required) -->
      <SearchableDropdown
        v-model="regionCode"
        :options="regions"
        label="Region"
        placeholder="Select or search region"
        required
        :searchable="true"
        :error="formErrors.region"
        option-value="value"
        option-label="label"
        @option-selected="handleRegionSelected"
        @custom-value-used="handleCustomRegionUsed"
      />
      
      <!-- Province (Required) -->
      <SearchableDropdown
        v-model="provinceCode"
        :options="provinces"
        label="Province"
        placeholder="Select or search province"
        required
        :searchable="true"
        :disabled="!regionCode"
        :error="formErrors.province"
        option-value="value"
        option-label="label"
        @option-selected="handleProvinceSelected"
        @custom-value-used="handleCustomProvinceUsed"
      />
      
      <!-- City/Municipality (Required) -->
      <SearchableDropdown
        v-model="cityCode"
        :options="cities"
        label="City/Municipality"
        placeholder="Select or search city or municipality"
        required
        :searchable="true"
        :disabled="!provinceCode"
        :error="formErrors.city"
        option-value="value"
        option-label="label"
        @option-selected="handleCitySelected"
        @custom-value-used="handleCustomCityUsed"
      />
      
      <!-- Barangay (Optional) -->
      <SearchableDropdown
        v-model="barangayCode"
        :options="barangays"
        label="Barangay"
        placeholder="Select or search barangay (optional if street address is detailed)"
        :searchable="true"
        :disabled="!cityCode"
        :error="formErrors.barangay"
        option-value="value"
        option-label="label"
        @option-selected="handleBarangaySelected"
        @custom-value-used="handleCustomBarangayUsed"
      />
      
      <!-- Street Address (Required) -->
      <BaseInput
        v-model="form.street"
        label="Street Address"
        placeholder="e.g., 123 Main Street, Subdivision Name"
        required
        :error="formErrors.street"
        hint="Include street name, block/lot, subdivision, or landmark"
      />
      
      <!-- Unit/Floor/Building (Optional) -->
      <BaseInput
        v-model="form.unitFloorBuilding"
        label="Unit/Floor/Building"
        placeholder="e.g., Unit 2B, 3rd Floor, ABC Building"
        hint="Optional: Apartment number, floor, or building name"
      />
      
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
import { usePhilippinesAddress } from '../composables/usePhilippinesAddress'
import BaseInput from './BaseInput.vue'
import BaseButton from './BaseButton.vue'
import SearchableDropdown from './SearchableDropdown.vue'
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

const form = reactive({
  unitFloorBuilding: '',
  street: '',
  barangay: '',
  city: '',
  province: '',
  postalCode: ''
})

const formErrors = reactive({
  street: '',
  region: '',
  barangay: '',
  city: '',
  province: '',
  postalCode: ''
})

// Composables
const globalStore = useGlobalStore()
const {
  regions,
  provinces,
  cities,
  barangays,
  setRegion,
  setProvince,
  setCity,
  setBarangay,
  resetSelection,
  setInitialValues,
  getAddressNames,
  getAddressCodes,
  isValidSelection
} = usePhilippinesAddress()

// Debug regions data
console.log('Regions loaded:', regions.value?.length, regions.value?.slice(0, 3))

// Philippines address codes
const regionCode = ref('')
const provinceCode = ref('')
const cityCode = ref('')
const barangayCode = ref('')

// Sample addresses for demo purposes
const sampleAddresses = [
  {
    label: 'Manila Sample (NCR)',
    preview: '123 Rizal Ave, Sta. Cruz, Manila, National Capital Region',
    data: {
      unitFloorBuilding: '2nd Floor, Corner Shop',
      street: '123 Rizal Avenue',
      postalCode: '1003',
      regionCode: 'NCR',
      provinceCode: 'MNL',
      cityCode: 'MNL_CITY',
      barangayCode: 'MNL_STACRUZ'
    }
  },
  {
    label: 'Quezon City Sample (NCR)',
    preview: '456 Commonwealth Ave, Diliman, Quezon City, National Capital Region',
    data: {
      unitFloorBuilding: 'Unit 5A, Tower B',
      street: '456 Commonwealth Avenue',
      postalCode: '1101',
      regionCode: 'NCR',
      provinceCode: 'QC',
      cityCode: 'QC_CITY',
      barangayCode: 'QC_DILIMAN'
    }
  },
  {
    label: 'Makati Sample (NCR)',
    preview: '789 Ayala Ave, Poblacion, Makati, National Capital Region',
    data: {
      unitFloorBuilding: '',
      street: '789 Ayala Avenue',
      postalCode: '1229',
      regionCode: 'NCR',
      provinceCode: 'MKT',
      cityCode: 'MKT_CITY',
      barangayCode: 'MKT_POBLACION'
    }
  }
]

// Computed
const isFormValid = computed(() => {
  // Basic requirements: street and region must be filled
  const hasBasicInfo = form.street && regionCode.value
  
  // Address hierarchy: we need at least region -> province -> city
  // Barangay can be optional if user provides detailed street address
  const hasMinimumAddress = regionCode.value && provinceCode.value && cityCode.value
  
  // Allow form to be valid if we have the minimum required fields
  // This is more flexible than requiring all 4 levels
  return hasBasicInfo && hasMinimumAddress
})

const addressPreview = computed(() => {
  if (!isFormValid.value) return ''
  
  const addressNames = getAddressNames()
  const parts = [
    form.street,
    addressNames.barangay,
    addressNames.city,
    addressNames.province,
    addressNames.region
  ]
  return parts.filter(Boolean).join(', ')
})

// Watchers
watch(() => props.initialAddress, (newAddress) => {
  if (newAddress) {
    populateForm(newAddress)
  }
}, { immediate: true })

// Watch address code changes and update form
watch([regionCode, provinceCode, cityCode, barangayCode], () => {
  setRegion(regionCode.value)
  setProvince(provinceCode.value)
  setCity(cityCode.value)
  setBarangay(barangayCode.value)
  
  // Update form with readable names
  updateFormAddressNames()
})

// Function to update form with proper address names (including custom entries)
function updateFormAddressNames() {
  const names = getAddressNames()
  
  // Handle custom entries by extracting the label from the code
  form.province = names.province || extractCustomEntryLabel(provinceCode.value)
  form.city = names.city || extractCustomEntryLabel(cityCode.value) 
  form.barangay = names.barangay || extractCustomEntryLabel(barangayCode.value)
}

// Extract readable label from custom entry codes
function extractCustomEntryLabel(code: string): string {
  if (!code) return ''
  if (code.startsWith('CUSTOM_')) {
    // Extract the original text from custom codes like 'CUSTOM_1234_MY_CITY'
    const parts = code.split('_')
    if (parts.length >= 3) {
      return parts.slice(2).join(' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase())
    }
  }
  return ''
}

// Methods
function populateForm(address: Address) {
  form.unitFloorBuilding = address.unitFloorBuilding || ''
  form.street = address.street || ''
  form.barangay = address.barangay || ''
  form.city = address.city || ''
  form.province = address.province || ''
  form.postalCode = address.postalCode || ''
  
  // If address has codes, set them
  if ((address as any).regionCode) regionCode.value = (address as any).regionCode
  if ((address as any).provinceCode) provinceCode.value = (address as any).provinceCode
  if ((address as any).cityCode) cityCode.value = (address as any).cityCode
  if ((address as any).barangayCode) barangayCode.value = (address as any).barangayCode
}

function resetForm() {
  form.unitFloorBuilding = ''
  form.street = ''
  form.barangay = ''
  form.city = ''
  form.province = ''
  form.postalCode = ''
  
  // Reset address selections
  regionCode.value = ''
  provinceCode.value = ''
  cityCode.value = ''
  barangayCode.value = ''
  resetSelection()
  
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
  // Fill form fields
  form.unitFloorBuilding = sample.data.unitFloorBuilding || ''
  form.street = sample.data.street || ''
  form.postalCode = sample.data.postalCode || ''
  
  // Set address codes
  regionCode.value = sample.data.regionCode || ''
  provinceCode.value = sample.data.provinceCode || ''
  cityCode.value = sample.data.cityCode || ''
  barangayCode.value = sample.data.barangayCode || ''
  
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
  
  if (!regionCode.value) {
    formErrors.region = 'Region is required'
    hasErrors = true
  }
  
  if (!provinceCode.value) {
    formErrors.province = 'Province is required'
    hasErrors = true
  }
  
  if (!cityCode.value) {
    formErrors.city = 'City is required'
    hasErrors = true
  }
  
  // Make barangay optional if we have detailed street address
  // This provides more flexibility for areas where specific barangay info isn't available
  if (!barangayCode.value && !form.street.includes(',') && form.street.length < 20) {
    // Only require barangay if street address seems insufficient
    formErrors.barangay = 'Barangay is recommended for better delivery accuracy'
    // Don't set hasErrors = true here, just show a warning
  }
  
  if (hasErrors) {
    globalStore.showError('Validation Error', 'Please fill in all required fields')
    return
  }
  
  isSubmitting.value = true
  
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500))
    
    // Create address object with both readable names and codes
    // Handle both predefined and custom entries
    const addressNames = getAddressNames()
    const addressCodes = getAddressCodes()
    
    const address: Address = {
      id: props.initialAddress?.id || 'new-' + Date.now(),
      unitFloorBuilding: form.unitFloorBuilding || undefined,
      street: form.street,
      barangay: form.barangay || addressNames.barangay || 'N/A',
      city: form.city || addressNames.city,
      province: form.province || addressNames.province,
      postalCode: form.postalCode || '',
      // Store codes for future reference (including custom codes)
      regionCode: addressCodes.region,
      provinceCode: addressCodes.province,
      cityCode: addressCodes.city,
      barangayCode: addressCodes.barangay || 'N/A',
      region: addressNames.region
    } as any
    
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

// Philippines address handlers
function handleRegionSelected() {
  // Clear dependent fields when region changes
  provinceCode.value = ''
  cityCode.value = ''
  barangayCode.value = ''
}

function handleProvinceSelected() {
  // Clear dependent fields when province changes
  cityCode.value = ''
  barangayCode.value = ''
}

function handleCitySelected() {
  // Clear barangay when city changes
  barangayCode.value = ''
}

function handleBarangaySelected() {
  // Nothing to clear
}

// Custom value handlers
function handleCustomRegionUsed(value: string) {
  console.log('Custom region used:', value)
  // Clear dependent fields when region changes
  provinceCode.value = ''
  cityCode.value = ''
  barangayCode.value = ''
}

function handleCustomProvinceUsed(value: string) {
  console.log('Custom province used:', value)
  // Clear dependent fields when province changes
  cityCode.value = ''
  barangayCode.value = ''
}

function handleCustomCityUsed(value: string) {
  console.log('Custom city used:', value)
  // Clear barangay when city changes
  barangayCode.value = ''
}

function handleCustomBarangayUsed(value: string) {
  console.log('Custom barangay used:', value)
  // Nothing to clear
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
