<template>
  <teleport to="body">
    <transition
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
      @before-enter="beforeEnter"
      @after-leave="afterLeave"
    >
      <div
        v-if="modelValue"
        class="fixed inset-0 z-50 overflow-y-auto"
        @click="handleBackdropClick"
      >
        <!-- Backdrop -->
        <div 
          class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          aria-hidden="true"
        ></div>
        
        <!-- Modal Container -->
        <div class="flex min-h-screen items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <transition
            enter-active-class="transition duration-300 ease-out transform"
            enter-from-class="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enter-to-class="opacity-100 translate-y-0 sm:scale-100"
            leave-active-class="transition duration-200 ease-in transform"
            leave-from-class="opacity-100 translate-y-0 sm:scale-100"
            leave-to-class="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          >
            <div
              v-if="modelValue"
              :class="[
                'relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:p-6',
                sizeClasses
              ]"
              role="dialog"
              aria-modal="true"
              :aria-labelledby="titleId"
            >
              <!-- Header -->
              <div v-if="showHeader" class="flex items-center justify-between mb-4">
                <h3 
                  :id="titleId"
                  class="text-lg font-semibold leading-6 text-gray-900"
                >
                  {{ title }}
                </h3>
                
                <button
                  v-if="showClose"
                  @click="close"
                  type="button"
                  class="rounded-md bg-white text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                >
                  <span class="sr-only">Close</span>
                  <XMarkIcon class="h-6 w-6" />
                </button>
              </div>
              
              <!-- Content -->
              <div>
                <slot></slot>
              </div>
              
              <!-- Footer -->
              <div v-if="hasFooter" class="mt-5 sm:mt-6">
                <slot name="footer"></slot>
              </div>
            </div>
          </transition>
        </div>
      </div>
    </transition>
  </teleport>
</template>

<script setup lang="ts">
import { computed, useId, useSlots, nextTick } from 'vue'
import { XMarkIcon } from '@heroicons/vue/24/outline'

interface Props {
  modelValue: boolean
  title?: string
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
  persistent?: boolean
  showClose?: boolean
  showHeader?: boolean
}

interface Emits {
  (e: 'update:modelValue', value: boolean): void
  (e: 'close'): void
  (e: 'opened'): void
  (e: 'closed'): void
}

const props = withDefaults(defineProps<Props>(), {
  title: '',
  size: 'md',
  persistent: false,
  showClose: true,
  showHeader: true
})

const emit = defineEmits<Emits>()

const slots = useSlots()
const titleId = useId()

const sizeClasses = computed(() => {
  switch (props.size) {
    case 'sm':
      return 'sm:max-w-sm sm:w-full'
    case 'md':
      return 'sm:max-w-md sm:w-full'
    case 'lg':
      return 'sm:max-w-lg sm:w-full'
    case 'xl':
      return 'sm:max-w-xl sm:w-full'
    case 'full':
      return 'sm:max-w-full sm:w-full sm:h-full'
    default:
      return 'sm:max-w-md sm:w-full'
  }
})

const hasFooter = computed(() => !!slots.footer)

function close() {
  emit('update:modelValue', false)
  emit('close')
}

function handleBackdropClick(event: MouseEvent) {
  // Only close if clicking on the backdrop itself, not the modal content
  if (event.target === event.currentTarget && !props.persistent) {
    close()
  }
}

function beforeEnter() {
  // Lock body scroll when modal opens
  document.body.style.overflow = 'hidden'
  
  nextTick(() => {
    emit('opened')
  })
}

function afterLeave() {
  // Restore body scroll when modal closes
  document.body.style.overflow = ''
  emit('closed')
}

// Handle escape key
function handleEscape(event: KeyboardEvent) {
  if (event.key === 'Escape' && props.modelValue && !props.persistent) {
    close()
  }
}

// Add keyboard event listener when modal is open
if (typeof window !== 'undefined') {
  window.addEventListener('keydown', handleEscape)
}
</script>