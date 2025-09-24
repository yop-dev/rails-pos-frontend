<template>
  <div class="space-y-2">
    <label 
      v-if="label" 
      :for="inputId" 
      class="block text-sm font-medium text-gray-700"
    >
      {{ label }}
      <span v-if="required" class="text-red-500 ml-1">*</span>
    </label>
    
    <textarea
      :id="inputId"
      :value="modelValue"
      @input="handleInput"
      @blur="handleBlur"
      @focus="handleFocus"
      :placeholder="placeholder"
      :rows="rows"
      :cols="cols"
      :disabled="disabled"
      :readonly="readonly"
      :required="required"
      :maxlength="maxlength"
      :class="[
        'block w-full rounded-md border shadow-sm transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 sm:text-sm',
        error 
          ? 'border-red-300 focus:border-red-500 focus:ring-red-500' 
          : 'border-gray-300 focus:border-primary-500 focus:ring-primary-500',
        disabled 
          ? 'bg-gray-50 text-gray-500 cursor-not-allowed' 
          : 'bg-white',
        readonly 
          ? 'bg-gray-50' 
          : ''
      ]"
    />
    
    <div v-if="error || helperText || showCharCount" class="flex justify-between items-start">
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
      
      <p 
        v-if="showCharCount && maxlength" 
        :class="[
          'text-xs ml-auto',
          characterCount > maxlength * 0.9 
            ? 'text-red-500' 
            : 'text-gray-500'
        ]"
      >
        {{ characterCount }}/{{ maxlength }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, useId } from 'vue'

interface Props {
  modelValue?: string
  label?: string
  placeholder?: string
  error?: string
  helperText?: string
  rows?: number
  cols?: number
  disabled?: boolean
  readonly?: boolean
  required?: boolean
  maxlength?: number
  showCharCount?: boolean
}

interface Emits {
  (e: 'update:modelValue', value: string): void
  (e: 'blur', event: FocusEvent): void
  (e: 'focus', event: FocusEvent): void
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
  rows: 3,
  disabled: false,
  readonly: false,
  required: false,
  showCharCount: false
})

const emit = defineEmits<Emits>()

const inputId = useId()

const characterCount = computed(() => {
  return props.modelValue?.length || 0
})

function handleInput(event: Event) {
  const target = event.target as HTMLTextAreaElement
  emit('update:modelValue', target.value)
}

function handleBlur(event: FocusEvent) {
  emit('blur', event)
}

function handleFocus(event: FocusEvent) {
  emit('focus', event)
}
</script>