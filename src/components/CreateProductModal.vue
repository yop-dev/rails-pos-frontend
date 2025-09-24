<template>
  <BaseModal
    v-model="isOpen"
    title="Add New Product"
    size="lg"
    @close="handleClose"
  >
    <form @submit.prevent="handleSubmit" class="space-y-6">
      <!-- Product Photo Upload -->
      <ProductPhotoUpload 
        v-model="form.photo" 
        :disabled="isSubmitting"
      />
      
      <!-- Basic Information -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <BaseInput
          v-model="form.name"
          label="Product Name"
          placeholder="e.g., House Blend Coffee"
          required
          :error="getFieldError('name')"
          :disabled="isSubmitting"
          @blur="validateFieldOnBlur('name')"
        />
        
        <BaseSelect
          v-model="form.categoryId"
          label="Category"
          placeholder="Select a category"
          required
          :options="categoryOptions"
          :error="getFieldError('categoryId')"
          :disabled="isSubmitting || categoriesLoading"
          @change="validateFieldOnBlur('categoryId')"
        />
      </div>
      
      <!-- Product Type Selection -->
      <div class="space-y-3">
        <label class="block text-sm font-medium text-gray-700">
          Product Type
          <span class="text-red-500 ml-1">*</span>
        </label>
        
        <div class="flex space-x-6">
          <div class="flex items-center">
            <input
              id="product-type-physical"
              v-model="form.productType"
              type="radio"
              value="PHYSICAL"
              name="productType"
              :disabled="isSubmitting"
              class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
              @change="validateFieldOnBlur('productType')"
            />
            <label for="product-type-physical" class="ml-3 block text-sm font-medium text-gray-700">
              <div class="flex items-center">
                <CubeIcon class="h-5 w-5 text-gray-500 mr-2" />
                Physical Product
              </div>
              <p class="text-xs text-gray-500 mt-1">Requires shipping and inventory management</p>
            </label>
          </div>
          
          <div class="flex items-center">
            <input
              id="product-type-digital"
              v-model="form.productType"
              type="radio"
              value="DIGITAL"
              name="productType"
              :disabled="isSubmitting"
              class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
              @change="validateFieldOnBlur('productType')"
            />
            <label for="product-type-digital" class="ml-3 block text-sm font-medium text-gray-700">
              <div class="flex items-center">
                <CloudIcon class="h-5 w-5 text-gray-500 mr-2" />
                Digital Product
              </div>
              <p class="text-xs text-gray-500 mt-1">Delivered electronically, no shipping required</p>
            </label>
          </div>
        </div>
        
        <p v-if="getFieldError('productType')" class="text-sm text-red-600">
          {{ getFieldError('productType') }}
        </p>
      </div>
      
      <!-- Price Input -->
      <div class="space-y-2">
        <label class="block text-sm font-medium text-gray-700">
          Price
          <span class="text-red-500 ml-1">*</span>
        </label>
        
        <div class="relative rounded-md shadow-sm">
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <span class="text-gray-500 sm:text-sm">₱</span>
          </div>
          <input
            v-model="priceInput"
            type="number"
            step="0.01"
            min="0.01"
            max="1000000"
            placeholder="0.00"
            :disabled="isSubmitting"
            :class="[
              'block w-full pl-7 pr-12 border rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 sm:text-sm',
              getFieldError('priceCents')
                ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                : 'border-gray-300 focus:border-primary-500 focus:ring-primary-500'
            ]"
            @blur="handlePriceBlur"
            @input="handlePriceInput"
          />
          <div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <span class="text-gray-500 sm:text-sm">PHP</span>
          </div>
        </div>
        
        <p v-if="getFieldError('priceCents')" class="text-sm text-red-600">
          {{ getFieldError('priceCents') }}
        </p>
        <p v-else class="text-xs text-gray-500">
          Enter the price in Philippine Pesos (₱)
        </p>
      </div>
      
      <!-- Description -->
      <BaseTextarea
        v-model="form.description"
        label="Description"
        placeholder="Optional product description..."
        :maxlength="500"
        :show-char-count="true"
        :error="getFieldError('description')"
        :disabled="isSubmitting"
          :rows="4"
        @blur="validateFieldOnBlur('description')"
      />
      
      <!-- Note: Active status is managed by the backend and defaults to true -->
      
      <!-- Form Summary -->
      <div v-if="formSummary" class="bg-gray-50 rounded-md p-4">
        <h4 class="text-sm font-medium text-gray-900 mb-2">Product Preview</h4>
        <div class="text-xs text-gray-600 space-y-1">
          <p><strong>Name:</strong> {{ form.name || 'Not specified' }}</p>
          <p><strong>Category:</strong> {{ selectedCategoryName || 'Not selected' }}</p>
          <p><strong>Type:</strong> {{ form.productType || 'Not selected' }}</p>
          <p><strong>Price:</strong> {{ priceDisplay || 'Not specified' }}</p>
          <p v-if="form.description"><strong>Description:</strong> {{ form.description.substring(0, 50) }}{{ form.description.length > 50 ? '...' : '' }}</p>
        </div>
      </div>
    </form>
    
    <!-- Footer Actions -->
    <template #footer>
      <div class="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-3">
        <BaseButton
          variant="secondary"
          @click="handleClose"
          :disabled="isSubmitting"
          class="mt-3 w-full sm:mt-0 sm:w-auto"
        >
          Cancel
        </BaseButton>
        <BaseButton
          @click="handleSubmit"
          variant="primary"
          :loading="isSubmitting"
          :disabled="!isFormValid || isSubmitting"
          class="w-full sm:w-auto"
        >
          {{ isSubmitting ? 'Creating Product...' : 'Create Product' }}
        </BaseButton>
      </div>
    </template>
  </BaseModal>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { CubeIcon, CloudIcon } from '@heroicons/vue/24/outline'
import BaseModal from './BaseModal.vue'
import BaseInput from './BaseInput.vue'
import BaseSelect from './BaseSelect.vue'
import BaseTextarea from './BaseTextarea.vue'
import BaseButton from './BaseButton.vue'
import ProductPhotoUpload from './ProductPhotoUpload.vue'
import { useFormValidation } from '../composables/useFormValidation'
import { useProductCategories, useCreateProduct, useCreateProductWithPhoto } from '../composables/useProducts'
import { productValidationRules } from '../utils/validation'
import { pesosTocents, parsePesoInput, formatPesos } from '../utils/currency'
import type { Product } from '../types'

interface Props {
  modelValue: boolean
}

interface Emits {
  (e: 'update:modelValue', value: boolean): void
  (e: 'success', product: Product): void
  (e: 'error', error: string): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

// Composables
const { categories, loading: categoriesLoading } = useProductCategories()
const { createProduct, loading: createLoading } = useCreateProduct()
const { createProductWithPhoto, loading: createPhotoLoading } = useCreateProductWithPhoto()

// Form state
const form = ref({
  name: '',
  description: '',
  categoryId: '',
  productType: '',
  priceCents: 0,
  photo: null as File | null
})

const priceInput = ref<string>('')
const isSubmitting = computed(() => createLoading.value || createPhotoLoading.value)
const formSummary = ref(false)

// Form validation
const { 
  errors,
  touched,
  getFieldError, 
  hasFieldError, 
  validateFieldOnBlur, 
  validateForm, 
  isFormValid, 
  clearErrors 
} = useFormValidation(form, productValidationRules)

// Computed
const isOpen = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

const categoryOptions = computed(() => {
  return categories.value.map(category => ({
    value: category.id,
    label: `${category.name} (${category.productsCount} products)`
  }))
})

const selectedCategoryName = computed(() => {
  const category = categories.value.find(c => c.id === form.value.categoryId)
  return category?.name
})

const priceDisplay = computed(() => {
  if (form.value.priceCents > 0) {
    return formatPesos(form.value.priceCents / 100)
  }
  return null
})

// Methods
function handlePriceInput(event: Event) {
  const target = event.target as HTMLInputElement
  const value = target.value
  
  // Parse the peso input and convert to cents
  const pesos = parsePesoInput(value)
  if (pesos !== null) {
    form.value.priceCents = pesosTocents(pesos)
  } else {
    form.value.priceCents = 0
  }
}

function handlePriceBlur() {
  // Format the price display
  if (form.value.priceCents > 0) {
    const pesos = form.value.priceCents / 100
    priceInput.value = pesos.toString()
  }
  
  validateFieldOnBlur('priceCents')
}

async function handleSubmit() {
  console.log('=== FORM SUBMIT START ===')
  console.log('Form data:', form.value)
  console.log('isFormValid:', isFormValid.value)
  
  // Temporary: bypass validation for debugging
  // if (!validateForm()) {
  //   console.log('Form validation failed')
  //   return
  // }
  
  console.log('Proceeding with product creation...')
  
  try {
    const productData = {
      name: form.value.name,
      description: form.value.description || undefined,
      categoryId: form.value.categoryId,
      productType: form.value.productType,
      priceCents: form.value.priceCents
      // Note: 'active' field is not supported by backend ProductInput
    }
    
    console.log('Product data to send:', productData)
    
    let result
    
    if (form.value.photo) {
      console.log('Creating product with photo...')
      result = await createProductWithPhoto(productData, form.value.photo)
    } else {
      console.log('Creating product without photo...')
      result = await createProduct(productData)
    }
    
    console.log('Product creation result:', result)
    
    if (result.success && result.product) {
      console.log('SUCCESS: Product created!', result.product)
      emit('success', result.product)
      handleClose()
      resetForm()
    } else {
      console.log('ERROR: Product creation failed', result.errors)
      const errorMessage = result.errors?.[0]?.message || 'Failed to create product'
      emit('error', errorMessage)
    }
  } catch (error) {
    console.error('Error creating product:', error)
    emit('error', 'An unexpected error occurred while creating the product')
  }
}

function handleClose() {
  emit('update:modelValue', false)
}

function resetForm() {
  form.value = {
    name: '',
    description: '',
    categoryId: '',
    productType: '',
    priceCents: 0,
    photo: null
  }
  priceInput.value = ''
  formSummary.value = false
  clearErrors()
}

// Watch for form changes to show summary
watch(form, () => {
  formSummary.value = !!(form.value.name && form.value.categoryId && form.value.productType && form.value.priceCents > 0)
}, { deep: true })

// Reset form when modal closes
watch(isOpen, (newValue) => {
  if (!newValue) {
    resetForm()
  }
})

</script>