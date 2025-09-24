import { ref, computed, readonly, type Ref } from 'vue'

export interface ValidationRule {
  required?: boolean
  minLength?: number
  maxLength?: number
  min?: number
  max?: number
  pattern?: RegExp
  custom?: (value: any) => boolean | string
}

export interface ValidationRules {
  [field: string]: ValidationRule[]
}

export function useFormValidation<T extends Record<string, any>>(
  formData: Ref<T>, 
  rules: ValidationRules
) {
  const errors = ref<Record<string, string>>({})
  const touched = ref<Record<string, boolean>>({})
  
  const validateField = (field: string, value: any): boolean => {
    const fieldRules = rules[field] || []
    
    for (const rule of fieldRules) {
      if (rule.required && (value === null || value === undefined || value === '')) {
        errors.value[field] = 'This field is required'
        return false
      }
      
      if (rule.minLength && value && value.toString().length < rule.minLength) {
        errors.value[field] = `Minimum ${rule.minLength} characters required`
        return false
      }
      
      if (rule.maxLength && value && value.toString().length > rule.maxLength) {
        errors.value[field] = `Maximum ${rule.maxLength} characters allowed`
        return false
      }
      
      if (rule.min && value !== null && value !== undefined && Number(value) < rule.min) {
        errors.value[field] = `Minimum value is ${rule.min}`
        return false
      }
      
      if (rule.max && value !== null && value !== undefined && Number(value) > rule.max) {
        errors.value[field] = `Maximum value is ${rule.max}`
        return false
      }
      
      if (rule.pattern && value && !rule.pattern.test(value.toString())) {
        errors.value[field] = 'Invalid format'
        return false
      }
      
      if (rule.custom) {
        const result = rule.custom(value)
        if (result !== true) {
          errors.value[field] = typeof result === 'string' ? result : 'Invalid value'
          return false
        }
      }
    }
    
    delete errors.value[field]
    return true
  }
  
  const validateForm = (): boolean => {
    let isValid = true
    
    // Mark all fields as touched
    for (const field in rules) {
      touched.value[field] = true
      const fieldValue = formData.value[field]
      if (!validateField(field, fieldValue)) {
        isValid = false
      }
    }
    
    return isValid
  }
  
  const validateFieldOnBlur = (field: string) => {
    touched.value[field] = true
    const fieldValue = formData.value[field]
    return validateField(field, fieldValue)
  }
  
  const clearErrors = () => {
    errors.value = {}
    touched.value = {}
  }
  
  const clearFieldError = (field: string) => {
    delete errors.value[field]
  }
  
  const getFieldError = (field: string): string | undefined => {
    return touched.value[field] ? errors.value[field] : undefined
  }
  
  const hasFieldError = (field: string): boolean => {
    return touched.value[field] && !!errors.value[field]
  }
  
  const isFormValid = computed(() => {
    // Check if all required fields are valid
    for (const field in rules) {
      const fieldValue = formData.value[field]
      if (!validateField(field, fieldValue)) {
        return false
      }
    }
    return Object.keys(errors.value).length === 0
  })
  
  const hasErrors = computed(() => Object.keys(errors.value).length > 0)
  
  return {
    errors: readonly(errors),
    touched: readonly(touched),
    validateField,
    validateForm,
    validateFieldOnBlur,
    clearErrors,
    clearFieldError,
    getFieldError,
    hasFieldError,
    isFormValid,
    hasErrors
  }
}