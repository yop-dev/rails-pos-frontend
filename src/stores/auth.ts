import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { User, LoginCredentials } from '../types'

export const useAuthStore = defineStore('auth', () => {
  // State
  const user = ref<User | null>(null)
  const token = ref<string | null>(null)
  const isLoading = ref(false)

  // Getters
  const isLoggedIn = computed(() => !!user.value && !!token.value)
  const userName = computed(() => 
    user.value ? `${user.value.firstName} ${user.value.lastName}` : ''
  )
  const userRole = computed(() => user.value?.role || '')

  // Actions
  async function login(credentials: LoginCredentials): Promise<{ success: boolean; error?: string }> {
    isLoading.value = true
    
    try {
      // TODO: Replace with actual GraphQL mutation when authentication is implemented
      // For now, simulate login with mock data for testing
      await new Promise(resolve => setTimeout(resolve, 1000)) // Simulate API delay
      
      // Mock successful login - replace with actual GraphQL call
      if (credentials.email && credentials.password) {
        const mockUser: User = {
          id: '1',
          firstName: 'Test',
          lastName: 'User',
          email: credentials.email,
          role: 'admin',
          createdAt: new Date().toISOString()
        }
        
        user.value = mockUser
        token.value = 'mock-jwt-token-' + Date.now()
        
        // Store token in localStorage
        localStorage.setItem('pos_auth_token', token.value)
        
        return { success: true }
      } else {
        return { 
          success: false, 
          error: 'Invalid credentials' 
        }
      }
    } catch (error) {
      return { 
        success: false, 
        error: 'Login failed. Please try again.' 
      }
    } finally {
      isLoading.value = false
    }
  }

  function logout() {
    user.value = null
    token.value = null
    localStorage.removeItem('pos_auth_token')
  }

  function initializeAuth() {
    const savedToken = localStorage.getItem('pos_auth_token')
    if (savedToken) {
      token.value = savedToken
      // TODO: Verify token with backend and get user info
      // For now, set a mock user for testing
      user.value = {
        id: '1',
        firstName: 'Test',
        lastName: 'User',
        email: 'test@example.com',
        role: 'admin',
        createdAt: new Date().toISOString()
      }
    }
  }

  async function verifyToken(authToken: string) {
    try {
      // TODO: Call backend to verify token and get user info
      // For now, just validate that token exists
      if (authToken && authToken.startsWith('mock-jwt-token-')) {
        user.value = {
          id: '1',
          firstName: 'Test',
          lastName: 'User',
          email: 'test@example.com',
          role: 'admin',
          createdAt: new Date().toISOString()
        }
      } else {
        logout()
      }
    } catch (error) {
      logout()
    }
  }

  // Custom reset function for Setup Stores
  function $reset() {
    logout()
  }

  return {
    // State
    user,
    token,
    isLoading,
    
    // Getters
    isLoggedIn,
    userName,
    userRole,
    
    // Actions
    login,
    logout,
    initializeAuth,
    verifyToken,
    $reset
  }
})