<template>
  <button
    :type="type"
    :disabled="disabled || loading"
    :class="buttonClasses"
    @click="$emit('click', $event)"
  >
    <div v-if="loading" class="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div>
    <component v-if="leftIcon && !loading" :is="leftIcon" class="w-4 h-4 mr-2" />
    
    <slot />
    
    <component v-if="rightIcon" :is="rightIcon" class="w-4 h-4 ml-2" />
  </button>
</template>

<script setup lang="ts">
import { computed, type Component } from 'vue'
import type { ButtonVariant, ComponentSize } from '../types'

export interface Props {
  variant?: ButtonVariant
  size?: ComponentSize
  type?: 'button' | 'submit' | 'reset'
  disabled?: boolean
  loading?: boolean
  leftIcon?: Component
  rightIcon?: Component
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'primary',
  size: 'md',
  type: 'button',
  disabled: false,
  loading: false
})

defineEmits<{
  click: [event: MouseEvent]
}>()

const buttonClasses = computed(() => {
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2'
  
  const sizeClasses = {
    xs: 'px-2 py-1 text-xs',
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
    xl: 'px-8 py-4 text-lg'
  }
  
  const variantClasses = {
    primary: 'bg-primary-600 hover:bg-primary-700 focus:ring-primary-500 text-white disabled:bg-primary-300',
    secondary: 'bg-white hover:bg-gray-50 focus:ring-primary-500 text-gray-700 border border-gray-300 disabled:bg-gray-100',
    danger: 'bg-red-600 hover:bg-red-700 focus:ring-red-500 text-white disabled:bg-red-300',
    success: 'bg-green-600 hover:bg-green-700 focus:ring-green-500 text-white disabled:bg-green-300',
    warning: 'bg-yellow-600 hover:bg-yellow-700 focus:ring-yellow-500 text-white disabled:bg-yellow-300'
  }
  
  const disabledClasses = props.disabled || props.loading ? 'cursor-not-allowed opacity-75' : 'cursor-pointer'
  
  return [
    baseClasses,
    sizeClasses[props.size],
    variantClasses[props.variant],
    disabledClasses
  ].join(' ')
})
</script>