import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Notification } from '../types'

export const useGlobalStore = defineStore('global', () => {
  // State
  const isLoading = ref(false)
  const loadingMessage = ref('')
  const notifications = ref<Notification[]>([])
  const sidebarOpen = ref(false)
  const theme = ref<'light' | 'dark'>('light')

  // Getters
  const hasNotifications = computed(() => notifications.value.length > 0)
  const unreadNotifications = computed(() => 
    notifications.value.filter(n => !n.persistent).length
  )

  // Actions
  function setLoading(loading: boolean, message = '') {
    isLoading.value = loading
    loadingMessage.value = message
  }

  function showNotification(notification: Omit<Notification, 'id'>) {
    const id = Date.now().toString() + Math.random().toString(36).substr(2, 9)
    const newNotification: Notification = {
      id,
      duration: 5000, // Default 5 seconds
      persistent: false,
      ...notification
    }

    notifications.value.push(newNotification)

    // Auto-remove non-persistent notifications
    if (!newNotification.persistent && newNotification.duration) {
      setTimeout(() => {
        removeNotification(id)
      }, newNotification.duration)
    }

    return id
  }

  function removeNotification(id: string) {
    const index = notifications.value.findIndex(n => n.id === id)
    if (index > -1) {
      notifications.value.splice(index, 1)
    }
  }

  function clearAllNotifications() {
    notifications.value = []
  }

  function showSuccess(title: string, message?: string, duration?: number) {
    return showNotification({
      type: 'success',
      title,
      message,
      duration
    })
  }

  function showError(title: string, message?: string, persistent = false) {
    return showNotification({
      type: 'error',
      title,
      message,
      persistent,
      duration: persistent ? undefined : 8000 // Errors stay longer
    })
  }

  function showWarning(title: string, message?: string, duration?: number) {
    return showNotification({
      type: 'warning',
      title,
      message,
      duration
    })
  }

  function showInfo(title: string, message?: string, duration?: number) {
    return showNotification({
      type: 'info',
      title,
      message,
      duration
    })
  }

  function toggleSidebar() {
    sidebarOpen.value = !sidebarOpen.value
  }

  function setSidebar(open: boolean) {
    sidebarOpen.value = open
  }

  function setTheme(newTheme: 'light' | 'dark') {
    theme.value = newTheme
    localStorage.setItem('pos_theme', newTheme)
  }

  function initializeTheme() {
    const savedTheme = localStorage.getItem('pos_theme') as 'light' | 'dark' | null
    if (savedTheme) {
      theme.value = savedTheme
    } else {
      // Check system preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      theme.value = prefersDark ? 'dark' : 'light'
    }
  }

  // Custom reset function for Setup Stores
  function $reset() {
    isLoading.value = false
    loadingMessage.value = ''
    notifications.value = []
    sidebarOpen.value = false
    theme.value = 'light'
  }

  return {
    // State
    isLoading,
    loadingMessage,
    notifications,
    sidebarOpen,
    theme,
    
    // Getters
    hasNotifications,
    unreadNotifications,
    
    // Actions
    setLoading,
    showNotification,
    removeNotification,
    clearAllNotifications,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    toggleSidebar,
    setSidebar,
    setTheme,
    initializeTheme,
    $reset
  }
})