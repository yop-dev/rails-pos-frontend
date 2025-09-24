<template>
  <div class="space-y-2">
    <label 
      v-if="label" 
      :for="selectId" 
      class="block text-sm font-medium text-gray-700"
    >
      {{ label }}
      <span v-if="required" class="text-red-500 ml-1">*</span>
    </label>
    
    <select
      :id="selectId"
      :value="modelValue"
      @change="handleChange"
      @blur="handleBlur"
      @focus="handleFocus"
      :disabled="disabled"
      :required="required"
      :class="[
        'block w-full rounded-md border shadow-sm transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 sm:text-sm',
        error 
          ? 'border-red-300 focus:border-red-500 focus:ring-red-500' 
          : 'border-gray-300 focus:border-primary-500 focus:ring-primary-500',
        disabled 
          ? 'bg-gray-50 text-gray-500 cursor-not-allowed' 
          : 'bg-white'
      ]"
    >
      <option 
        v-if="placeholder" 
        value="" 
        disabled 
        :hidden="!showPlaceholder"
      >
        {{ placeholder }}
      </option>
      
      <option
        v-for="option in options"
        :key="getOptionValue(option)"
        :value="getOptionValue(option)"
        :disabled="getOptionDisabled(option)"
      >
        {{ getOptionLabel(option) }}
      </option>
    </select>
    
    <p 
      v-if="error" 
      class="text-sm text-red-600"
    >
      {{ error }}
    </p>
    <p 
      v-else-if="helperText" 
      class="text-sm text-gray-500"
    >
      {{ helperText }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { computed, useId } from 'vue'

interface SelectOption {
  value: string | number
  label: string
  disabled?: boolean
}

interface Props {
  modelValue?: string | number
  label?: string
  placeholder?: string
  error?: string
  helperText?: string
  options: SelectOption[] | string[]
  disabled?: boolean
  required?: boolean
  showPlaceholder?: boolean
  valueKey?: string
  labelKey?: string
}

interface Emits {
  (e: 'update:modelValue', value: string | number): void
  (e: 'change', value: string | number): void
  (e: 'blur', event: FocusEvent): void
  (e: 'focus', event: FocusEvent): void
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
  disabled: false,
  required: false,
  showPlaceholder: true,
  valueKey: 'value',
  labelKey: 'label'
})

const emit = defineEmits<Emits>()

const selectId = useId()

function getOptionValue(option: SelectOption | string): string | number {
  if (typeof option === 'string') {
    return option
  }
  return option.value
}

function getOptionLabel(option: SelectOption | string): string {
  if (typeof option === 'string') {
    return option
  }
  return option.label
}

function getOptionDisabled(option: SelectOption | string): boolean {
  if (typeof option === 'string') {
    return false
  }
  return option.disabled || false
}

function handleChange(event: Event) {
  const target = event.target as HTMLSelectElement
  const value = target.value
  
  // Convert to number if the original option value was a number
  let convertedValue: string | number = value
  if (props.options.length > 0) {
    const firstOption = props.options[0]
    if (typeof firstOption === 'object' && typeof firstOption.value === 'number') {
      convertedValue = Number(value)
    }
  }
  
  emit('update:modelValue', convertedValue)
  emit('change', convertedValue)
}

function handleBlur(event: FocusEvent) {
  emit('blur', event)
}

function handleFocus(event: FocusEvent) {
  emit('focus', event)
}
</script>