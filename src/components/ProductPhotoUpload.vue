<template>
  <div class="space-y-4">
    <label class="block text-sm font-medium text-gray-700">
      Product Photo
    </label>
    
    <!-- Upload Area -->
    <div
      @drop.prevent="handleDrop"
      @dragover.prevent="handleDragOver"
      @dragleave.prevent="handleDragLeave"
      @click="selectFile"
      :class="[
        'border-2 border-dashed rounded-lg p-6 text-center transition-all duration-200 cursor-pointer',
        isDragging 
          ? 'border-primary-500 bg-primary-50 scale-105' 
          : 'border-gray-300 hover:border-gray-400',
        hasFile 
          ? 'border-green-500 bg-green-50 hover:border-green-600' 
          : ''
      ]"
    >
      <!-- File Preview -->
      <div v-if="previewUrl" class="space-y-4">
        <div style="text-align: center; display: flex; justify-content: center; align-items: center;">
          <!-- Simple image with inline styles only -->
          <img 
            :src="previewUrl" 
            alt="Product preview"
            @error="handleImageError"
            @load="handleImageLoad"
            style="width: 200px; height: 200px; object-fit: contain; background: white; border: 2px solid #ccc; display: block; margin: 0 auto;"
          />
        </div>
        
        <div class="space-y-2">
          <p class="text-sm font-medium text-gray-900">{{ selectedFile?.name }}</p>
          <p class="text-xs text-gray-500">{{ formatFileSize(selectedFile?.size || 0) }}</p>
        </div>
        
        <div class="flex justify-center space-x-2">
          <BaseButton 
            size="sm" 
            variant="secondary" 
            @click.stop="removeFile"
            :left-icon="XMarkIcon"
          >
            Remove
          </BaseButton>
          <BaseButton 
            size="sm" 
            variant="secondary" 
            @click.stop="selectFile"
            :left-icon="ArrowPathIcon"
          >
            Replace
          </BaseButton>
        </div>
      </div>
      
      <!-- Upload Prompt -->
      <div v-else class="space-y-4">
        <div class="mx-auto">
          <PhotoIcon 
            :class="[
              'mx-auto h-12 w-12 transition-colors',
              isDragging ? 'text-primary-500' : 'text-gray-400'
            ]" 
          />
        </div>
        
        <div class="space-y-2">
          <p class="text-sm text-gray-600">
            <span class="font-medium text-primary-600 hover:text-primary-500">
              Click to upload
            </span>
            or drag and drop
          </p>
          <p class="text-xs text-gray-500">
            PNG, JPG, WebP up to 5MB
          </p>
        </div>
        
        <div v-if="isDragging" class="text-sm font-medium text-primary-600">
          Drop your image here!
        </div>
      </div>
    </div>
    
    <!-- Hidden File Input -->
    <input
      ref="fileInput"
      type="file"
      accept="image/*"
      @change="handleFileSelect"
      class="hidden"
    />
    
    <!-- Error Message -->
    <div v-if="error" class="rounded-md bg-red-50 p-4">
      <div class="flex">
        <ExclamationCircleIcon class="h-5 w-5 text-red-400" />
        <div class="ml-3">
          <p class="text-sm text-red-800">{{ error }}</p>
        </div>
      </div>
    </div>
    
    <!-- File Info -->
    <div v-if="selectedFile && !error" class="text-xs text-gray-500">
      Ready to upload: {{ selectedFile.name }} ({{ formatFileSize(selectedFile.size) }})
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { 
  PhotoIcon, 
  XMarkIcon, 
  ArrowPathIcon,
  ExclamationCircleIcon 
} from '@heroicons/vue/24/outline'
import BaseButton from './BaseButton.vue'
import { validateImageFile } from '../utils/validation'

interface Props {
  modelValue?: File | null
  maxSize?: number
  acceptedTypes?: string[]
  disabled?: boolean
}

interface Emits {
  (e: 'update:modelValue', file: File | null): void
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: null,
  maxSize: 5 * 1024 * 1024, // 5MB
  acceptedTypes: () => ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'],
  disabled: false
})

const emit = defineEmits<Emits>()

// State
const isDragging = ref(false)
const error = ref<string>('')
const fileInput = ref<HTMLInputElement>()
const previewUrl = ref<string>('')
const selectedFile = ref<File | null>(props.modelValue)
const imageLoadError = ref(false)

// Computed
const hasFile = computed(() => !!selectedFile.value)

// Methods
function selectFile() {
  if (props.disabled) return
  fileInput.value?.click()
}

function handleFileSelect(event: Event) {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  
  if (file) {
    processFile(file)
  }
}

function handleDrop(event: DragEvent) {
  if (props.disabled) return
  
  isDragging.value = false
  const files = event.dataTransfer?.files
  
  if (files && files.length > 0) {
    processFile(files[0])
  }
}

function handleDragOver(event: DragEvent) {
  if (props.disabled) return
  
  isDragging.value = true
  event.dataTransfer!.dropEffect = 'copy'
}

function handleDragLeave() {
  if (props.disabled) return
  
  isDragging.value = false
}

function processFile(file: File) {
  error.value = ''
  
  // Validate file
  const validation = validateImageFile(file)
  if (!validation.valid) {
    error.value = validation.error || 'Invalid file'
    return
  }
  
  // Set file and create preview
  selectedFile.value = file
  createPreview(file)
  emit('update:modelValue', file)
}

function createPreview(file: File) {
  // Try using URL.createObjectURL first as it's more reliable
  try {
    const objectUrl = URL.createObjectURL(file)
    previewUrl.value = objectUrl
    imageLoadError.value = false
  } catch (error) {
    // Fallback to FileReader
    const reader = new FileReader()
    
    reader.onload = (e) => {
      const result = e.target?.result as string
      previewUrl.value = result
      imageLoadError.value = false
    }
    
    reader.onerror = (e) => {
      error.value = 'Failed to read file'
      imageLoadError.value = true
    }
    
    reader.readAsDataURL(file)
  }
}

function handleImageLoad(event: Event) {
  imageLoadError.value = false
}

function handleImageError(event: Event) {
  imageLoadError.value = true
  error.value = 'Failed to display image preview'
}

function removeFile() {
  // Clean up object URL to prevent memory leaks
  if (previewUrl.value && previewUrl.value.startsWith('blob:')) {
    URL.revokeObjectURL(previewUrl.value)
  }
  
  selectedFile.value = null
  previewUrl.value = ''
  error.value = ''
  imageLoadError.value = false
  
  if (fileInput.value) {
    fileInput.value.value = ''
  }
  
  emit('update:modelValue', null)
}

function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B'
  
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(1024))
  
  return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${sizes[i]}`
}

// Initialize preview if modelValue exists
if (props.modelValue) {
  selectedFile.value = props.modelValue
  createPreview(props.modelValue)
}
</script>

<style scoped>
.upload-area {
  transition: all 0.2s ease-in-out;
}

.upload-area:hover {
  transform: translateY(-1px);
}
</style>