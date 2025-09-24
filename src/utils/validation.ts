import type { ValidationRules } from '../composables/useFormValidation'

// Product-specific validation rules
export const productValidationRules: ValidationRules = {
  name: [
    { required: true },
    { minLength: 2 },
    { maxLength: 100 }
  ],
  description: [
    { maxLength: 500 }
  ],
  categoryId: [
    { required: true }
  ],
  productType: [
    { required: true }
  ],
  priceCents: [
    { required: true },
    { 
      custom: (value) => {
        if (!value || value < 1) {
          return 'Price must be greater than ₱0.01'
        }
        if (value > 100000000) { // ₱1,000,000.00 in cents
          return 'Price must be less than ₱1,000,000.00'
        }
        return true
      }
    }
  ]
}

// File validation utilities
export const validateImageFile = (file: File): { valid: boolean; error?: string } => {
  const maxSize = 5 * 1024 * 1024 // 5MB in bytes
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg']
  
  if (!allowedTypes.includes(file.type)) {
    return {
      valid: false,
      error: 'Please select a valid image file (JPEG, PNG, or WebP)'
    }
  }
  
  if (file.size > maxSize) {
    return {
      valid: false,
      error: 'File size must be less than 5MB'
    }
  }
  
  return { valid: true }
}

// Email validation
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// Phone validation (Philippine format)
export const isValidPhoneNumber = (phone: string): boolean => {
  const phoneRegex = /^(\+63|63|0)?[89]\d{9}$/
  return phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''))
}

// Price validation
export const isValidPrice = (price: number): boolean => {
  return price > 0 && price <= 1000000 && Number.isFinite(price)
}