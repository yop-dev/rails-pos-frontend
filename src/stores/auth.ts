import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import type { User, LoginCredentials } from '../types'
import useAuthentication, { useTokenManager } from '../composables/useAuth'

export const useAuthStore = defineStore('auth', () => {
  // State
  const user = ref<User | null>(null)
  const token = ref<string | null>(null)
  const refreshToken = ref<string | null>(null)
  const isLoading = ref(false)

  // Composables
  const { login: authLogin, logout: authLogout, refreshToken: authRefreshToken, loginLoading } = useAuthentication()
  const { setTokens, setUser, getToken, getRefreshToken, getStoredUser, clearTokens, isTokenExpired } = useTokenManager()

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
      console.log('AuthStore: Attempting login')
      
      const result = await authLogin(credentials)
      
      if (result.success && result.data) {
        // Set user and tokens
        user.value = result.data.user
        token.value = result.data.token
        refreshToken.value = result.data.refreshToken || null
        
        // Store in localStorage
        setTokens(result.data.token, result.data.refreshToken)
        setUser(result.data.user)
        
        console.log('AuthStore: Login successful', { user: user.value.email, role: user.value.role })
        
        return { success: true }
      } else {
        console.log('AuthStore: Login failed', result.message)
        return { 
          success: false, 
          error: result.message || 'Login failed. Please try again.' 
        }
      }
    } catch (error) {
      console.error('AuthStore: Login error', error)
      return { 
        success: false, 
        error: 'An unexpected error occurred during login.' 
      }
    } finally {
      isLoading.value = false
    }
  }

  async function logout() {
    console.log('AuthStore: Attempting logout')
    
    try {
      // Call server logout (optional, even if it fails we clear local state)
      await authLogout()
    } catch (error) {
      console.warn('AuthStore: Server logout failed, clearing local state anyway', error)
    } finally {
      // Always clear local state
      user.value = null
      token.value = null
      refreshToken.value = null
      clearTokens()
      
      console.log('AuthStore: Logout completed')
    }
  }

  async function initializeAuth() {
    console.log('AuthStore: Initializing authentication...')
    
    const savedToken = getToken()
    const savedRefreshToken = getRefreshToken()
    const savedUser = getStoredUser()
    
    console.log('AuthStore: Found stored data:', {
      hasToken: !!savedToken,
      hasRefreshToken: !!savedRefreshToken,
      hasUser: !!savedUser,
      tokenPreview: savedToken ? savedToken.substring(0, 20) + '...' : 'none'
    })
    
    if (savedToken && savedUser) {
      // Check if token is expired
      const tokenExpired = isTokenExpired(savedToken)
      console.log('AuthStore: Token expiration check:', { expired: tokenExpired })
      
      if (tokenExpired) {
        console.log('AuthStore: Token expired, attempting refresh...')
        
        if (savedRefreshToken) {
          const refreshResult = await refreshAuthToken(savedRefreshToken)
          if (!refreshResult.success) {
            console.log('AuthStore: Refresh failed, clearing stored auth')
            clearTokens()
            return
          }
        } else {
          console.log('AuthStore: No refresh token available, clearing auth')
          clearTokens()
          return
        }
      } else {
        // Token is valid, restore auth state
        user.value = savedUser
        token.value = savedToken
        refreshToken.value = savedRefreshToken
        
        console.log('AuthStore: Auth restored from storage', { 
          user: user.value.email, 
          role: user.value.role,
          isLoggedIn: isLoggedIn.value 
        })
      }
    } else {
      console.log('AuthStore: No stored authentication found')
    }
  }

  async function refreshAuthToken(refreshTokenValue: string): Promise<{ success: boolean; error?: string }> {
    try {
      console.log('AuthStore: Refreshing authentication token...')
      
      const result = await authRefreshToken(refreshTokenValue)
      
      if (result.success && result.data) {
        // Update auth state
        user.value = result.data.user
        token.value = result.data.token
        refreshToken.value = result.data.refreshToken || null
        
        // Update localStorage
        setTokens(result.data.token, result.data.refreshToken)
        setUser(result.data.user)
        
        console.log('AuthStore: Token refresh successful')
        return { success: true }
      } else {
        console.log('AuthStore: Token refresh failed', result.message)
        return {
          success: false,
          error: result.message || 'Token refresh failed'
        }
      }
    } catch (error) {
      console.error('AuthStore: Token refresh error', error)
      return {
        success: false,
        error: 'Failed to refresh authentication token'
      }
    }
  }

  async function verifyToken(authToken: string): Promise<boolean> {
    try {
      if (!authToken || isTokenExpired(authToken)) {
        console.log('AuthStore: Token is invalid or expired')
        logout()
        return false
      }
      
      // TODO: Add server-side token verification query
      // For now, just check if token exists and is not expired
      return true
    } catch (error) {
      console.error('AuthStore: Token verification failed', error)
      logout()
      return false
    }
  }

  // Custom reset function for Setup Stores
  function $reset() {
    user.value = null
    token.value = null
    refreshToken.value = null
    isLoading.value = false
    clearTokens()
  }

  return {
    // State
    user,
    token,
    refreshToken,
    isLoading: computed(() => isLoading.value || loginLoading.value),
    
    // Getters
    isLoggedIn,
    userName,
    userRole,
    
    // Actions
    login,
    logout,
    initializeAuth,
    refreshAuthToken,
    verifyToken,
    $reset
  }
})