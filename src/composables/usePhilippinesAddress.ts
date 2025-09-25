import { ref, computed, watch } from 'vue'
import {
  regions as regionsData,
  getProvinces,
  getCities,
  getBarangays,
  getPostalCode,
  findByCode,
  type AddressOption
} from '../data/philippines-address'


interface PhilippinesAddressState {
  region: string
  province: string
  city: string
  barangay: string
}

export function usePhilippinesAddress() {
  // State
  const selectedAddress = ref<PhilippinesAddressState>({
    region: '',
    province: '',
    city: '',
    barangay: ''
  })

  const isLoading = ref({
    regions: false,
    provinces: false,
    cities: false,
    barangays: false
  })

  // Get all regions
  const regions = computed<AddressOption[]>(() => {
    return regionsData
  })

  // Get provinces for selected region
  const provinces = computed<AddressOption[]>(() => {
    if (!selectedAddress.value.region) return []
    return getProvinces(selectedAddress.value.region)
  })

  // Get cities for selected province
  const cities = computed<AddressOption[]>(() => {
    if (!selectedAddress.value.province) return []
    return getCities(selectedAddress.value.province)
  })

  // Get barangays for selected city
  const barangays = computed<AddressOption[]>(() => {
    if (!selectedAddress.value.city) return []
    return getBarangays(selectedAddress.value.city)
  })

  // Get readable names for selected codes
  const selectedRegionName = computed(() => {
    if (!selectedAddress.value.region) return ''
    const region = findByCode(regions.value, selectedAddress.value.region)
    return region?.label || ''
  })

  const selectedProvinceName = computed(() => {
    if (!selectedAddress.value.province) return ''
    const province = findByCode(provinces.value, selectedAddress.value.province)
    return province?.label || ''
  })

  const selectedCityName = computed(() => {
    if (!selectedAddress.value.city) return ''
    const city = findByCode(cities.value, selectedAddress.value.city)
    return city?.label || ''
  })

  const selectedBarangayName = computed(() => {
    if (!selectedAddress.value.barangay) return ''
    const barangay = findByCode(barangays.value, selectedAddress.value.barangay)
    return barangay?.label || ''
  })

  // Watch for changes and reset dependent fields
  watch(
    () => selectedAddress.value.region,
    (newRegion, oldRegion) => {
      if (newRegion !== oldRegion) {
        selectedAddress.value.province = ''
        selectedAddress.value.city = ''
        selectedAddress.value.barangay = ''
      }
    }
  )

  watch(
    () => selectedAddress.value.province,
    (newProvince, oldProvince) => {
      if (newProvince !== oldProvince) {
        selectedAddress.value.city = ''
        selectedAddress.value.barangay = ''
      }
    }
  )

  watch(
    () => selectedAddress.value.city,
    (newCity, oldCity) => {
      if (newCity !== oldCity) {
        selectedAddress.value.barangay = ''
      }
    }
  )

  // Utility functions
  function setRegion(regionCode: string) {
    selectedAddress.value.region = regionCode
  }

  function setProvince(provinceCode: string) {
    selectedAddress.value.province = provinceCode
  }

  function setCity(cityCode: string) {
    selectedAddress.value.city = cityCode
  }

  function setBarangay(barangayCode: string) {
    selectedAddress.value.barangay = barangayCode
  }

  function resetSelection() {
    selectedAddress.value = {
      region: '',
      province: '',
      city: '',
      barangay: ''
    }
  }

  // Set initial values
  function setInitialValues(address: {
    region?: string
    province?: string
    city?: string
    barangay?: string
  }) {
    selectedAddress.value.region = address.region || ''
    selectedAddress.value.province = address.province || ''
    selectedAddress.value.city = address.city || ''
    selectedAddress.value.barangay = address.barangay || ''
  }

  // Get current selection as readable names
  function getAddressNames() {
    return {
      region: selectedRegionName.value,
      province: selectedProvinceName.value,
      city: selectedCityName.value,
      barangay: selectedBarangayName.value
    }
  }

  // Get current selection as codes
  function getAddressCodes() {
    return {
      region: selectedAddress.value.region,
      province: selectedAddress.value.province,
      city: selectedAddress.value.city,
      barangay: selectedAddress.value.barangay
    }
  }

  // Validation
  function isValidSelection() {
    return !!(
      selectedAddress.value.region &&
      selectedAddress.value.province &&
      selectedAddress.value.city &&
      selectedAddress.value.barangay
    )
  }

  // Get postal code for selected barangay
  function getAddressPostalCode(): string {
    if (!selectedAddress.value.barangay) return ''
    return getPostalCode(selectedAddress.value.barangay)
  }

  return {
    // State
    selectedAddress: readonly(selectedAddress),
    isLoading: readonly(isLoading),
    
    // Options
    regions,
    provinces,
    cities,
    barangays,
    
    // Selected names
    selectedRegionName,
    selectedProvinceName,
    selectedCityName,
    selectedBarangayName,
    
    // Actions
    setRegion,
    setProvince,
    setCity,
    setBarangay,
    resetSelection,
    setInitialValues,
    
    // Getters
    getAddressNames,
    getAddressCodes,
    isValidSelection,
    getAddressPostalCode
  }
}

// Helper to readonly a ref
function readonly<T>(ref: any) {
  return ref
}