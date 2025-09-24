import { ref } from 'vue'
import { useMutation } from '@vue/apollo-composable'
import { gql } from '@apollo/client/core'
import type { User, LoginCredentials, MutationResponse, ApiError } from '../types'

// GraphQL Mutations
const LOGIN_MUTATION = gql`
  mutation Login($input: LoginInput!) {
    login(input: $input) {
      user {
        id
        firstName
        lastName
        email
        role
        createdAt
      }
      token
      refreshToken
      errors {
        message
        field
      }
    }
  }
`

const LOGOUT_MUTATION = gql`
  mutation Logout {
    logout {
      success
      message
      errors {
        message
      }
    }
  }
`

const REFRESH_TOKEN_MUTATION = gql`
  mutation RefreshToken($refreshToken: String!) {
    refreshToken(refreshToken: $refreshToken) {
      token
      refreshToken
      user {
        id
        firstName
        lastName
        email
        role
        createdAt
      }
      errors {
        message
      }
    }
  }
`

const VERIFY_TOKEN_QUERY = gql`
  query VerifyToken {
    currentUser {
      id
      firstName
      lastName
      email
      role
      createdAt
    }
  }
`

const CURRENT_USER_QUERY = gql`
  query CurrentUser {
    currentUser {
      id
      firstName
      lastName
      email
      role
      createdAt
    }
  }
`

// Login Response Interface
interface LoginResponse {
  user: User
  token: string
  refreshToken?: string
  errors?: ApiError[]
}

interface LogoutResponse {
  success: boolean
  message: string
  errors?: ApiError[]
}

interface RefreshTokenResponse {
  token: string
  refreshToken?: string
  user: User
  errors?: ApiError[]
}

// Composable for Authentication
export function useAuth() {
  const { mutate: loginMutation, loading: loginLoading } = useMutation(LOGIN_MUTATION)
  const { mutate: logoutMutation, loading: logoutLoading } = useMutation(LOGOUT_MUTATION)
  const { mutate: refreshTokenMutation, loading: refreshLoading } = useMutation(REFRESH_TOKEN_MUTATION)

  // Login function
  const login = async (credentials: LoginCredentials): Promise<MutationResponse<LoginResponse>> => {
    try {
      console.log('Attempting login with credentials:', { email: credentials.email })
      
      const result = await loginMutation({
        input: {
          email: credentials.email,
          password: credentials.password
        }
      })

      if (result?.data?.login?.errors?.length > 0) {
        return {
          success: false,
          errors: result.data.login.errors,
          message: result.data.login.errors[0]?.message || 'Login failed with validation errors'
        }
      }

      if (result?.data?.login?.user && result?.data?.login?.token) {
        const loginData: LoginResponse = {
          user: result.data.login.user,
          token: result.data.login.token,
          refreshToken: result.data.login.refreshToken
        }

        return {
          success: true,
          data: loginData,
          message: 'Login successful'
        }
      }

      return {
        success: false,
        errors: [{ message: 'Invalid response from server' }],
        message: 'Login failed - invalid server response'
      }

    } catch (error: any) {
      console.error('Login error:', error)
      
      // Handle GraphQL errors
      if (error.graphQLErrors?.length > 0) {
        return {
          success: false,
          errors: error.graphQLErrors.map((err: any) => ({ message: err.message })),
          message: error.graphQLErrors[0].message
        }
      }

      // Handle network errors
      if (error.networkError) {
        return {
          success: false,
          errors: [{ message: 'Network error - unable to connect to server' }],
          message: 'Connection failed. Please check your internet connection.'
        }
      }

      return {
        success: false,
        errors: [{ message: 'An unexpected error occurred during login' }],
        message: 'Login failed. Please try again.'
      }
    }
  }

  // Logout function
  const logout = async (): Promise<MutationResponse<LogoutResponse>> => {
    try {
      console.log('Attempting logout...')

      const result = await logoutMutation()

      if (result?.data?.logout?.errors?.length > 0) {
        return {
          success: false,
          errors: result.data.logout.errors,
          message: 'Logout failed'
        }
      }

      return {
        success: true,
        data: result.data.logout,
        message: result.data.logout?.message || 'Logout successful'
      }

    } catch (error: any) {
      console.error('Logout error:', error)
      
      // Even if logout fails on server, we should clear local state
      return {
        success: true, // Consider local logout successful
        message: 'Logged out locally (server logout may have failed)'
      }
    }
  }

  // Refresh token function
  const refreshToken = async (refreshTokenValue: string): Promise<MutationResponse<RefreshTokenResponse>> => {
    try {
      console.log('Attempting to refresh authentication token...')

      const result = await refreshTokenMutation({
        refreshToken: refreshTokenValue
      })

      if (result?.data?.refreshToken?.errors?.length > 0) {
        return {
          success: false,
          errors: result.data.refreshToken.errors,
          message: 'Token refresh failed'
        }
      }

      if (result?.data?.refreshToken?.token && result?.data?.refreshToken?.user) {
        const refreshData: RefreshTokenResponse = {
          token: result.data.refreshToken.token,
          refreshToken: result.data.refreshToken.refreshToken,
          user: result.data.refreshToken.user
        }

        return {
          success: true,
          data: refreshData,
          message: 'Token refreshed successfully'
        }
      }

      return {
        success: false,
        errors: [{ message: 'Invalid refresh token response' }],
        message: 'Token refresh failed'
      }

    } catch (error: any) {
      console.error('Token refresh error:', error)
      
      return {
        success: false,
        errors: [{ message: 'Token refresh failed' }],
        message: 'Authentication expired. Please log in again.'
      }
    }
  }

  return {
    login,
    logout,
    refreshToken,
    loginLoading,
    logoutLoading,
    refreshLoading
  }
}

// Mock Authentication for Development
export function useMockAuth() {
  const loginLoading = ref(false)
  const logoutLoading = ref(false)
  const refreshLoading = ref(false)

  const login = async (credentials: LoginCredentials): Promise<MutationResponse<LoginResponse>> => {
    loginLoading.value = true
    
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // Mock validation - accept any email/password for demo
      if (credentials.email && credentials.password && credentials.password.length >= 6) {
        // Determine user role based on email
        let role = 'staff'
        let firstName = 'Demo'
        let lastName = 'User'
        
        if (credentials.email.includes('admin')) {
          role = 'admin'
          firstName = 'Admin'
          lastName = 'User'
        } else if (credentials.email.includes('staff')) {
          role = 'staff'
          firstName = 'Staff'
          lastName = 'Member'
        }

        const mockUser: User = {
          id: 'user-' + Date.now(),
          firstName,
          lastName,
          email: credentials.email,
          role,
          createdAt: new Date().toISOString()
        }

        const mockToken = 'mock-jwt-' + btoa(credentials.email) + '-' + Date.now()

        return {
          success: true,
          data: {
            user: mockUser,
            token: mockToken,
            refreshToken: 'mock-refresh-' + Date.now()
          },
          message: 'Login successful'
        }
      } else {
        return {
          success: false,
          errors: [{ message: 'Invalid email or password' }],
          message: 'Please check your credentials and try again'
        }
      }
    } catch (error) {
      return {
        success: false,
        errors: [{ message: 'Mock login error' }],
        message: 'Login simulation failed'
      }
    } finally {
      loginLoading.value = false
    }
  }

  const logout = async (): Promise<MutationResponse<LogoutResponse>> => {
    logoutLoading.value = true
    
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500))
      
      return {
        success: true,
        data: {
          success: true,
          message: 'Successfully logged out'
        },
        message: 'Logout successful'
      }
    } catch (error) {
      return {
        success: false,
        errors: [{ message: 'Mock logout error' }],
        message: 'Logout failed'
      }
    } finally {
      logoutLoading.value = false
    }
  }

  const refreshToken = async (refreshTokenValue: string): Promise<MutationResponse<RefreshTokenResponse>> => {
    refreshLoading.value = true
    
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      if (refreshTokenValue && refreshTokenValue.startsWith('mock-refresh-')) {
        const mockUser: User = {
          id: 'user-refreshed',
          firstName: 'Refreshed',
          lastName: 'User',
          email: 'refreshed@example.com',
          role: 'admin',
          createdAt: new Date().toISOString()
        }

        return {
          success: true,
          data: {
            token: 'mock-jwt-refreshed-' + Date.now(),
            refreshToken: 'mock-refresh-new-' + Date.now(),
            user: mockUser
          },
          message: 'Token refreshed successfully'
        }
      } else {
        return {
          success: false,
          errors: [{ message: 'Invalid refresh token' }],
          message: 'Token refresh failed'
        }
      }
    } catch (error) {
      return {
        success: false,
        errors: [{ message: 'Mock refresh error' }],
        message: 'Token refresh failed'
      }
    } finally {
      refreshLoading.value = false
    }
  }

  return {
    login,
    logout,
    refreshToken,
    loginLoading,
    logoutLoading,
    refreshLoading
  }
}

// Export appropriate composable based on environment
export default function useAuthentication() {
  const isDevelopment = import.meta.env.DEV
  
  if (isDevelopment) {
    console.log('Using mock authentication for development')
    return useMockAuth()
  }
  
  return useAuth()
}

// Helper function for token management
export function useTokenManager() {
  const TOKEN_KEY = 'rails_pos_token'
  const REFRESH_TOKEN_KEY = 'rails_pos_refresh_token'
  const USER_KEY = 'rails_pos_user'

  const setTokens = (token: string, refreshToken?: string) => {
    localStorage.setItem(TOKEN_KEY, token)
    if (refreshToken) {
      localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken)
    }
  }

  const setUser = (user: User) => {
    localStorage.setItem(USER_KEY, JSON.stringify(user))
  }

  const getToken = (): string | null => {
    return localStorage.getItem(TOKEN_KEY)
  }

  const getRefreshToken = (): string | null => {
    return localStorage.getItem(REFRESH_TOKEN_KEY)
  }

  const getStoredUser = (): User | null => {
    const userStr = localStorage.getItem(USER_KEY)
    return userStr ? JSON.parse(userStr) : null
  }

  const clearTokens = () => {
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(REFRESH_TOKEN_KEY)
    localStorage.removeItem(USER_KEY)
  }

  const isTokenExpired = (token: string): boolean => {
    try {
      // Decode JWT token to check expiration
      const payload = JSON.parse(atob(token.split('.')[1]))
      const currentTime = Math.floor(Date.now() / 1000)
      return payload.exp < currentTime
    } catch (error) {
      console.error('Error checking token expiration:', error)
      return true // Assume expired if we can't decode
    }
  }

  return {
    setTokens,
    setUser,
    getToken,
    getRefreshToken,
    getStoredUser,
    clearTokens,
    isTokenExpired
  }
}

// Types for GraphQL inputs (matching backend schema)
interface LoginInput {
  email: string
  password: string
}

export type { LoginInput, LoginResponse, LogoutResponse, RefreshTokenResponse }