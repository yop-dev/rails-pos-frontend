<template>
  <div class="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
    <div class="sm:mx-auto sm:w-full sm:max-w-md">
      <!-- Logo/Brand -->
      <div class="text-center">
        <h1 class="text-3xl font-bold text-gray-900">Rails POS</h1>
        <p class="mt-2 text-sm text-gray-600">Point of Sale System</p>
      </div>

      <!-- Login Form Card -->
      <div class="mt-8 bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
        <div class="mb-6">
          <h2 class="text-center text-2xl font-bold text-gray-900">
            Sign in to your account
          </h2>
          <p class="mt-2 text-center text-sm text-gray-600">
            Enter your credentials to access the POS system
          </p>
        </div>

        <!-- Login Form -->
        <form @submit.prevent="handleSubmit" class="space-y-6">
          <!-- Email Field -->
          <BaseInput
            v-model="form.email"
            label="Email Address"
            type="email"
            placeholder="Enter your email address"
            required
            :error="formErrors.email"
            autocomplete="email"
          />

          <!-- Password Field -->
          <BaseInput
            v-model="form.password"
            label="Password"
            type="password"
            placeholder="Enter your password"
            required
            :error="formErrors.password"
            autocomplete="current-password"
          />

          <!-- Remember Me -->
          <div class="flex items-center justify-between">
            <div class="flex items-center">
              <input
                id="remember-me"
                v-model="form.rememberMe"
                type="checkbox"
                class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              <label for="remember-me" class="ml-2 block text-sm text-gray-900">
                Remember me
              </label>
            </div>

            <!-- Forgot Password Link (placeholder) -->
            <div class="text-sm">
              <a href="#" class="font-medium text-primary-600 hover:text-primary-500">
                Forgot your password?
              </a>
            </div>
          </div>

          <!-- Error Message -->
          <div v-if="loginError" class="bg-red-50 border border-red-200 rounded-md p-4">
            <div class="flex">
              <ExclamationCircleIcon class="h-5 w-5 text-red-400 mr-2" />
              <div class="text-sm text-red-800">
                {{ loginError }}
              </div>
            </div>
          </div>

          <!-- Submit Button -->
          <BaseButton
            type="submit"
            class="w-full"
            size="lg"
            :loading="authStore.isLoading"
            :disabled="!isFormValid || authStore.isLoading"
          >
            Sign in
          </BaseButton>
        </form>

        <!-- Demo Login Options -->
        <div class="mt-8 border-t border-gray-200 pt-6">
          <div class="text-center">
            <p class="text-sm font-medium text-gray-700 mb-4">Demo Login Options</p>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <BaseButton
                variant="secondary"
                size="sm"
                @click="fillDemoCredentials('admin')"
                :disabled="authStore.isLoading"
              >
                <UserIcon class="w-4 h-4 mr-2" />
                Admin Demo
              </BaseButton>
              
              <BaseButton
                variant="secondary"
                size="sm"
                @click="fillDemoCredentials('staff')"
                :disabled="authStore.isLoading"
              >
                <UserGroupIcon class="w-4 h-4 mr-2" />
                Staff Demo
              </BaseButton>
            </div>
            <p class="text-xs text-gray-500 mt-2">
              Use demo credentials for testing purposes
            </p>
          </div>
        </div>

        <!-- System Status -->
        <div class="mt-6 text-center">
          <div class="flex items-center justify-center space-x-2 text-xs text-gray-500">
            <div class="flex items-center">
              <div class="w-2 h-2 bg-green-400 rounded-full mr-1"></div>
              <span>Backend: Connected</span>
            </div>
            <span>•</span>
            <div class="flex items-center">
              <div class="w-2 h-2 bg-green-400 rounded-full mr-1"></div>
              <span>GraphQL: Ready</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div class="mt-8 text-center">
        <p class="text-xs text-gray-500">
          © 2024 Rails POS System. Built with Vue 3, GraphQL, and Rails.
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { 
  ExclamationCircleIcon,
  UserIcon,
  UserGroupIcon
} from '@heroicons/vue/24/outline'
import { useAuthStore } from '../stores/auth'
import { useGlobalStore } from '../stores/global'
import BaseButton from '../components/BaseButton.vue'
import BaseInput from '../components/BaseInput.vue'
import type { LoginCredentials } from '../types'

// Composables
const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()
const globalStore = useGlobalStore()

// State
const loginError = ref('')

const form = reactive({
  email: '',
  password: '',
  rememberMe: false
})

const formErrors = reactive({
  email: '',
  password: ''
})

// Demo credentials
const demoCredentials = {
  admin: {
    email: 'admin@railspos.com',
    password: 'admin123',
    role: 'admin'
  },
  staff: {
    email: 'staff@railspos.com', 
    password: 'staff123',
    role: 'staff'
  }
}

// Computed
const isFormValid = computed(() => {
  return form.email && 
         form.password && 
         form.email.includes('@') && 
         form.password.length >= 6
})

// Methods
function resetErrors() {
  formErrors.email = ''
  formErrors.password = ''
  loginError.value = ''
}

function validateForm(): boolean {
  resetErrors()
  let isValid = true

  if (!form.email) {
    formErrors.email = 'Email is required'
    isValid = false
  } else if (!form.email.includes('@')) {
    formErrors.email = 'Please enter a valid email address'
    isValid = false
  }

  if (!form.password) {
    formErrors.password = 'Password is required'
    isValid = false
  } else if (form.password.length < 6) {
    formErrors.password = 'Password must be at least 6 characters'
    isValid = false
  }

  return isValid
}

function fillDemoCredentials(type: 'admin' | 'staff') {
  const credentials = demoCredentials[type]
  form.email = credentials.email
  form.password = credentials.password
  resetErrors()
  
  globalStore.showInfo(
    'Demo Credentials Filled',
    `Filled with ${type} demo credentials. Click "Sign in" to continue.`
  )
}

async function handleSubmit() {
  if (!validateForm()) {
    return
  }

  try {
    resetErrors()
    
    const credentials: LoginCredentials = {
      email: form.email,
      password: form.password
    }

    const result = await authStore.login(credentials)
    
    if (result.success) {
      globalStore.showSuccess(
        'Login Successful',
        `Welcome back, ${authStore.userName}!`
      )
      
      // Redirect to intended route or default to orders
      const redirect = route.query.redirect as string || '/orders'
      router.push(redirect)
    } else {
      loginError.value = result.error || 'Invalid credentials. Please try again.'
      
      // Clear password on error
      form.password = ''
    }
  } catch (error) {
    console.error('Login error:', error)
    loginError.value = 'An unexpected error occurred. Please try again.'
    form.password = ''
  }
}

// Lifecycle
onMounted(() => {
  // If already logged in, redirect to intended route
  if (authStore.isLoggedIn) {
    const redirect = route.query.redirect as string || '/orders'
    router.push(redirect)
    return
  }

  // Initialize auth store (check for stored tokens)
  authStore.initializeAuth()
  
  // Auto-fill demo credentials in development
  if (import.meta.env.DEV) {
    fillDemoCredentials('admin')
  }
})
</script>