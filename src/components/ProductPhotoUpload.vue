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
        <div class="relative inline-block">
          <img 
            :src="previewUrl" 
            alt="Product preview"
            class="mx-auto h-32 w-32 object-cover rounded-lg shadow-md"
          />
          <div class="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-20 transition-opacity rounded-lg flex items-center justify-center">
            <PencilIcon class="h-6 w-6 text-white opacity-0 hover:opacity-100 transition-opacity" />
          </div>
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
  PencilIcon,
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
  const reader = new FileReader()
  
  reader.onload = (e) => {
    previewUrl.value = e.target?.result as string
  }
  
  reader.readAsDataURL(file)
}

function removeFile() {
  selectedFile.value = null
  previewUrl.value = ''
  error.value = ''
  
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