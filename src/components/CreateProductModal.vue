<template>
  <BaseModal
    v-model="isOpen"
    title="Add New Product"
    size="4xl"
    @close="handleClose"
  >
    <form @submit.prevent="handleSubmit" class="space-y-6">
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Left Column: Photo Upload -->
        <div class="lg:col-span-1">
          <div class="sticky top-0">
            <ProductPhotoUpload 
              v-model="form.photo" 
              :disabled="isSubmitting"
            />
            
            <!-- Form Summary Preview -->
            <div v-if="formSummary" class="mt-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-200">
              <div class="flex items-center mb-3">
                <div class="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                <h4 class="text-sm font-semibold text-blue-900">Product Preview</h4>
              </div>
              <div class="text-xs text-blue-800 space-y-2">
                <div class="flex justify-between">
                  <span class="font-medium">Name:</span>
                  <span class="text-right flex-1 ml-2 truncate">{{ form.name || 'Not specified' }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="font-medium">Category:</span>
                  <span class="text-right flex-1 ml-2 truncate">{{ selectedCategoryName || 'Not selected' }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="font-medium">Type:</span>
                  <span class="text-right flex-1 ml-2">{{ form.productType || 'Not selected' }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="font-medium">Price:</span>
                  <span class="text-right flex-1 ml-2 font-semibold text-blue-900">{{ priceDisplay || 'Not specified' }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Right Column: Form Fields -->
        <div class="lg:col-span-2 space-y-6">
          <!-- Product Information -->
          <div class="bg-gray-50 rounded-lg p-6">
            <h3 class="text-lg font-medium text-gray-900 mb-4 flex items-center">
              <CubeIcon class="w-5 h-5 text-gray-500 mr-2" />
              Product Information
            </h3>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <BaseInput
                v-model="form.name"
                label="Product Name"
                placeholder="e.g., House Blend Coffee"
                required
                :error="getFieldError('name')"
                :disabled="isSubmitting"
                @blur="validateFieldOnBlur('name')"
                class="md:col-span-2"
              />
              
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
              
              <!-- Product Type Selection -->
              <div class="space-y-3">
                <label class="block text-sm font-medium text-gray-700">
                  Product Type
                  <span class="text-red-500 ml-1">*</span>
                </label>
                
                <div class="space-y-3">
                  <div class="flex items-center p-3 border rounded-lg hover:bg-gray-50 transition-colors">
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
                    <label for="product-type-physical" class="ml-3 block text-sm flex-1">
                      <div class="flex items-center font-medium text-gray-700">
                        <CubeIcon class="h-4 w-4 text-gray-500 mr-2" />
                        Physical Product
                      </div>
                      <p class="text-xs text-gray-500 mt-1">Requires shipping and inventory</p>
                    </label>
                  </div>
                  
                  <div class="flex items-center p-3 border rounded-lg hover:bg-gray-50 transition-colors">
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
                    <label for="product-type-digital" class="ml-3 block text-sm flex-1">
                      <div class="flex items-center font-medium text-gray-700">
                        <CloudIcon class="h-4 w-4 text-gray-500 mr-2" />
                        Digital Product
                      </div>
                      <p class="text-xs text-gray-500 mt-1">Delivered electronically</p>
                    </label>
                  </div>
                </div>
                
                <p v-if="getFieldError('productType')" class="text-sm text-red-600">
                  {{ getFieldError('productType') }}
                </p>
              </div>
            </div>
          </div>
          
          <!-- Category Selection -->
          <div class="bg-gray-50 rounded-lg p-6">
            <h3 class="text-lg font-medium text-gray-900 mb-4 flex items-center">
              <svg class="w-5 h-5 text-gray-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"></path>
              </svg>
              Category
            </h3>
            
            <div class="space-y-4">
              <!-- Category Type Toggle -->
              <div class="flex space-x-6">
                <div class="flex items-center">
                  <input
                    id="category-existing"
                    v-model="categoryMode"
                    type="radio"
                    value="existing"
                    name="categoryMode"
                    :disabled="isSubmitting"
                    class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
                  />
                  <label for="category-existing" class="ml-2 block text-sm font-medium text-gray-700">
                    Select existing category
                  </label>
                </div>
                
                <div class="flex items-center">
                  <input
                    id="category-new"
                    v-model="categoryMode"
                    type="radio"
                    value="new"
                    name="categoryMode"
                    :disabled="isSubmitting"
                    class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
                  />
                  <label for="category-new" class="ml-2 block text-sm font-medium text-gray-700">
                    Create new category
                  </label>
                </div>
              </div>
              
              <!-- Existing Category Selection -->
              <div v-if="categoryMode === 'existing'">
                <BaseSelect
                  v-model="form.categoryId"
                  placeholder="Select a category"
                  :options="categoryOptions"
                  :error="getFieldError('categoryId')"
                  :disabled="isSubmitting || categoriesLoading"
                  @change="validateFieldOnBlur('categoryId')"
                />
              </div>
              
              <!-- New Category Creation -->
              <div v-else-if="categoryMode === 'new'" class="space-y-3">
                <BaseInput
                  v-model="newCategory.name"
                  label="New Category Name"
                  placeholder="e.g., Beverages, Pastries, Electronics"
                  :error="getFieldError('newCategoryName')"
                  :disabled="isSubmitting"
                  @blur="validateNewCategoryName"
                  @input="validateNewCategoryName"
                />
                <div class="flex items-center text-xs text-blue-600 bg-blue-50 p-2 rounded-md">
                  <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  This will create a new category and assign it to your product
                </div>
              </div>
              
              <p v-if="getFieldError('categoryId') || getFieldError('newCategoryName')" class="text-sm text-red-600">
                {{ getFieldError('categoryId') || getFieldError('newCategoryName') }}
              </p>
            </div>
          </div>
          
          <!-- Description -->
          <div class="bg-gray-50 rounded-lg p-6">
            <BaseTextarea
              v-model="form.description"
              label="Description (Optional)"
              placeholder="Describe your product features, benefits, or specifications..."
              :maxlength="500"
              :show-char-count="true"
              :error="getFieldError('description')"
              :disabled="isSubmitting"
              :rows="3"
              @blur="validateFieldOnBlur('description')"
            />
          </div>
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
import { useProductCategories, useCreateProduct, useCreateProductWithPhoto, useCreateProductCategory } from '../composables/useProducts'
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
const { categories, loading: categoriesLoading, refetch: refetchCategories } = useProductCategories()
const { createProduct, loading: createLoading } = useCreateProduct()
const { createProductWithPhoto, loading: createPhotoLoading } = useCreateProductWithPhoto()
const { createCategory, loading: createCategoryLoading } = useCreateProductCategory()

// Form state
const form = ref({
  name: '',
  description: '',
  categoryId: '',
  productType: '',
  priceCents: 0,
  photo: null as File | null
})

// Category creation state
const categoryMode = ref<'existing' | 'new'>('existing')
const newCategory = ref({
  name: ''
})

const priceInput = ref<string>('')
const isSubmitting = computed(() => createLoading.value || createPhotoLoading.value || createCategoryLoading.value)
const formSummary = ref(false)

// Form validation
const { 
  errors,
  touched,
  getFieldError, 
  hasFieldError, 
  validateFieldOnBlur, 
  validateForm, 
  isFormValid: baseIsFormValid, 
  clearErrors 
} = useFormValidation(form, productValidationRules)

// Custom form validation that handles category modes
const isFormValid = computed(() => {
  // Basic required fields
  const hasName = form.value.name && form.value.name.length >= 2
  const hasProductType = form.value.productType
  const hasPrice = form.value.priceCents > 0
  
  // Category validation based on mode
  let hasCategory = false
  if (categoryMode.value === 'existing') {
    hasCategory = !!form.value.categoryId
  } else if (categoryMode.value === 'new') {
    hasCategory = !!newCategory.value.name && newCategory.value.name.length >= 2
  }
  
  return hasName && hasProductType && hasPrice && hasCategory
})

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
  if (categoryMode.value === 'new') {
    return newCategory.value.name || 'New category'
  }
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

// Custom validation for new category name
function validateNewCategoryName() {
  if (categoryMode.value === 'new') {
    if (!newCategory.value.name || newCategory.value.name.length < 2) {
      errors.value.newCategoryName = 'Category name must be at least 2 characters long'
    } else {
      delete errors.value.newCategoryName
    }
  } else {
    delete errors.value.newCategoryName
  }
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
    let categoryId = form.value.categoryId
    
    // Create new category if needed
    if (categoryMode.value === 'new' && newCategory.value.name) {
      console.log('Creating new category:', newCategory.value.name)
      const categoryResult = await createCategory({
        name: newCategory.value.name
      })
      
      if (categoryResult.success && categoryResult.category) {
        categoryId = categoryResult.category.id
        console.log('New category created with ID:', categoryId)
        // Refresh categories list
        await refetchCategories()
      } else {
        console.log('ERROR: Category creation failed', categoryResult.errors)
        const errorMessage = categoryResult.errors?.[0]?.message || 'Failed to create category'
        emit('error', errorMessage)
        return
      }
    }
    
    const productData = {
      name: form.value.name,
      description: form.value.description || undefined,
      categoryId: categoryId,
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
  categoryMode.value = 'existing'
  newCategory.value = {
    name: ''
  }
  priceInput.value = ''
  formSummary.value = false
  clearErrors()
}

// Watch for form changes to show summary
watch([form, categoryMode, newCategory], () => {
  const hasCategory = categoryMode.value === 'existing' ? form.value.categoryId : newCategory.value.name
  formSummary.value = !!(form.value.name && hasCategory && form.value.productType && form.value.priceCents > 0)
}, { deep: true })

// Handle category mode changes
watch(categoryMode, () => {
  // Clear category-related errors when switching modes
  delete errors.value.categoryId
  delete errors.value.newCategoryName
  validateNewCategoryName()
})

// Reset form when modal closes
watch(isOpen, (newValue) => {
  if (!newValue) {
    resetForm()
  }
})

</script>