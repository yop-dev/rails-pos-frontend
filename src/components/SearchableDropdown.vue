<template>
  <div class="relative">
    <!-- Label -->
    <label v-if="label" class="block text-sm font-medium text-gray-700 mb-1">
      {{ label }}
      <span v-if="required" class="text-red-500 ml-1">*</span>
    </label>
    
    <!-- Input/Dropdown Trigger -->
    <div class="relative">
      <input
        ref="inputRef"
        v-model="searchQuery"
        :placeholder="placeholder"
        :disabled="disabled"
        :class="[
          'w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-1 transition-colors',
          error
            ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
            : 'border-gray-300 focus:border-primary-500 focus:ring-primary-500',
          disabled ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'
        ]"
        @focus="handleFocus"
        @blur="handleBlur"
        @input="handleInput"
        @keydown="handleKeydown"
        autocomplete="off"
      />
      
      <!-- Dropdown Icon -->
      <div class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
        <ChevronUpDownIcon class="h-4 w-4 text-gray-400" />
      </div>
    </div>
    
    <!-- Dropdown Menu -->
    <div
      v-if="showDropdown && (filteredOptions.length > 0 || searchQuery.trim() || props.options.length > 0)"
      class="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto"
    >
      <!-- Loading State -->
      <div v-if="loading" class="px-3 py-2 text-sm text-gray-500">
        Loading...
      </div>
      
      <!-- Options -->
      <template v-else-if="filteredOptions.length > 0">
        <button
          v-for="(option, index) in filteredOptions"
          :key="getOptionKey(option)"
          :class="[
            'w-full text-left px-3 py-2 text-sm transition-colors',
            index === highlightedIndex
              ? 'bg-primary-50 text-primary-700'
              : 'text-gray-700 hover:bg-gray-50'
          ]"
          @click="selectOption(option)"
          @mouseenter="highlightedIndex = index"
        >
          {{ getOptionLabel(option) }}
        </button>
      </template>
      
      <!-- No Results -->
      <div v-else-if="!loading && searchQuery.trim() && filteredOptions.length === 0" class="px-3 py-2 text-sm text-gray-500">
        No results found for "{{ searchQuery.trim() }}"
      </div>
      
      <!-- Empty State (no search, no options) -->
      <div v-else-if="!loading && !searchQuery.trim() && props.options.length === 0" class="px-3 py-2 text-sm text-gray-500">
        No options available
      </div>
    </div>
    
    <!-- Error Message -->
    <p v-if="error" class="mt-1 text-sm text-red-600">{{ error }}</p>
    
    <!-- Hint -->
    <p v-if="hint && !error" class="mt-1 text-sm text-gray-500">{{ hint }}</p>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick } from 'vue'
import { ChevronUpDownIcon } from '@heroicons/vue/24/outline'

// Props
interface Option {
  [key: string]: any
}

const props = defineProps<{
  modelValue?: string
  options: Option[]
  label?: string
  placeholder?: string
  required?: boolean
  disabled?: boolean
  error?: string
  hint?: string
  loading?: boolean
  optionValue?: string // Key to use for option value (default: 'value')
  optionLabel?: string // Key to use for option label (default: 'label')
  searchable?: boolean // Enable search functionality (default: true)
  clearable?: boolean // Allow clearing the selection (default: false)
}>()

// Emits
const emit = defineEmits<{
  'update:modelValue': [value: string]
  'option-selected': [option: Option]
  'search': [query: string]
}>()

// Refs
const inputRef = ref<HTMLInputElement>()
const searchQuery = ref('')
const showDropdown = ref(false)
const highlightedIndex = ref(-1)

// Computed
const searchable = computed(() => {
  const result = props.searchable !== false
  console.log('Searchable computed:', props.searchable, '->', result)
  return result
})

const filteredOptions = computed(() => {
  console.log('Computing filtered options...')
  console.log('Props options:', props.options)
  console.log('Search query:', searchQuery.value)
  console.log('Searchable:', searchable.value)
  
  if (!searchable.value || !searchQuery.value.trim()) {
    console.log('Returning all options:', props.options.length)
    return props.options
  }
  
  const query = searchQuery.value.toLowerCase().trim()
  const filtered = props.options.filter(option => {
    const label = getOptionLabel(option).toLowerCase()
    const matches = label.includes(query)
    console.log(`Option "${getOptionLabel(option)}" matches "${query}":`, matches)
    return matches
  })
  
  console.log('Search query:', query, 'Options:', props.options.length, 'Filtered:', filtered.length)
  
  return filtered
})

const selectedOption = computed(() => {
  if (!props.modelValue) return null
  return props.options.find(option => getOptionValue(option) === props.modelValue) || null
})

// Watchers
watch(() => props.modelValue, (newValue) => {
  if (newValue && selectedOption.value) {
    searchQuery.value = getOptionLabel(selectedOption.value)
  } else if (!newValue) {
    searchQuery.value = ''
  }
}, { immediate: true })

watch(() => props.options, () => {
  // Reset highlighted index when options change
  highlightedIndex.value = -1
})

// Methods
function getOptionValue(option: Option): string {
  const key = props.optionValue || 'value'
  return option[key]?.toString() || ''
}

function getOptionLabel(option: Option): string {
  const key = props.optionLabel || 'label'
  return option[key]?.toString() || ''
}

function getOptionKey(option: Option): string {
  return getOptionValue(option) || getOptionLabel(option)
}

function handleFocus() {
  if (props.disabled) return
  console.log('Focus event - opening dropdown')
  showDropdown.value = true
  highlightedIndex.value = -1
  
  // Select all text for easy replacement
  nextTick(() => {
    inputRef.value?.select()
  })
}

function handleBlur() {
  // Delay hiding to allow option clicks
  setTimeout(() => {
    showDropdown.value = false
    
    // Only restore if we have a selected value
    if (props.modelValue && selectedOption.value) {
      searchQuery.value = getOptionLabel(selectedOption.value)
    }
  }, 150)
}

function handleInput(event: Event) {
  const value = (event.target as HTMLInputElement).value
  console.log('Input event fired:', value)
  searchQuery.value = value
  
  // Always show dropdown when typing
  if (!showDropdown.value) {
    showDropdown.value = true
    console.log('Dropdown opened by typing')
  }
  
  console.log('Searchable:', searchable.value, 'Query:', searchQuery.value, 'ShowDropdown:', showDropdown.value)
  
  if (searchable.value) {
    emit('search', value)
    
    // Reset selection if search doesn't match current selection
    if (selectedOption.value && getOptionLabel(selectedOption.value) !== value) {
      emit('update:modelValue', '')
    }
  }
}

function handleKeydown(event: KeyboardEvent) {
  if (props.disabled) return
  
  switch (event.key) {
    case 'ArrowDown':
      event.preventDefault()
      showDropdown.value = true
      highlightedIndex.value = Math.min(highlightedIndex.value + 1, filteredOptions.value.length - 1)
      break
      
    case 'ArrowUp':
      event.preventDefault()
      if (highlightedIndex.value > 0) {
        highlightedIndex.value = Math.max(highlightedIndex.value - 1, 0)
      }
      break
      
    case 'Enter':
      event.preventDefault()
      if (showDropdown.value && highlightedIndex.value >= 0) {
        selectOption(filteredOptions.value[highlightedIndex.value])
      }
      break
      
    case 'Escape':
      event.preventDefault()
      showDropdown.value = false
      inputRef.value?.blur()
      break
  }
}

function selectOption(option: Option) {
  const value = getOptionValue(option)
  const label = getOptionLabel(option)
  
  searchQuery.value = label
  showDropdown.value = false
  highlightedIndex.value = -1
  
  emit('update:modelValue', value)
  emit('option-selected', option)
  
  inputRef.value?.blur()
}

// Expose methods for parent components
defineExpose({
  focus: () => inputRef.value?.focus(),
  blur: () => inputRef.value?.blur(),
  clear: () => {
    searchQuery.value = ''
    emit('update:modelValue', '')
  }
})
</script>