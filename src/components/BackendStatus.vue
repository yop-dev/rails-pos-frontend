<template>
  <div v-if="showStatus" class="fixed top-4 right-4 z-50">
    <div 
      :class="[
        'p-4 rounded-lg shadow-lg border max-w-sm',
        statusClass
      ]"
    >
      <div class="flex items-start gap-3">
        <div class="flex-shrink-0">
          <div v-if="status === 'connecting'" class="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
          <div v-else-if="status === 'connected'" class="w-5 h-5 rounded-full bg-green-500"></div>
          <div v-else-if="status === 'cold-start'" class="w-5 h-5 rounded-full bg-yellow-500 animate-pulse"></div>
          <div v-else class="w-5 h-5 rounded-full bg-red-500"></div>
        </div>
        
        <div class="flex-1">
          <h4 class="font-semibold text-sm" :class="textClass">
            {{ statusTitle }}
          </h4>
          <p class="text-xs mt-1 opacity-90" :class="textClass">
            {{ statusMessage }}
          </p>
          <div v-if="showTimer && countdown > 0" class="text-xs mt-1 font-mono" :class="textClass">
            Estimated: {{ countdown }}s remaining
          </div>
        </div>
        
        <button 
          @click="dismiss"
          class="flex-shrink-0 text-lg leading-none"
          :class="textClass"
        >
          ×
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'

const status = ref<'connecting' | 'connected' | 'cold-start' | 'error'>('connecting')
const showStatus = ref(true)
const countdown = ref(0)
const showTimer = ref(false)
let countdownInterval: NodeJS.Timeout | null = null

const statusClass = computed(() => {
  switch (status.value) {
    case 'connecting':
      return 'bg-blue-50 border-blue-200'
    case 'connected':
      return 'bg-green-50 border-green-200'
    case 'cold-start':
      return 'bg-yellow-50 border-yellow-200'
    case 'error':
      return 'bg-red-50 border-red-200'
    default:
      return 'bg-gray-50 border-gray-200'
  }
})

const textClass = computed(() => {
  switch (status.value) {
    case 'connecting':
      return 'text-blue-800'
    case 'connected':
      return 'text-green-800'
    case 'cold-start':
      return 'text-yellow-800'
    case 'error':
      return 'text-red-800'
    default:
      return 'text-gray-800'
  }
})

const statusTitle = computed(() => {
  switch (status.value) {
    case 'connecting':
      return 'Connecting to Backend'
    case 'connected':
      return 'Backend Connected'
    case 'cold-start':
      return 'Backend Starting Up'
    case 'error':
      return 'Connection Error'
    default:
      return 'Checking Backend'
  }
})

const statusMessage = computed(() => {
  switch (status.value) {
    case 'connecting':
      return 'Establishing connection...'
    case 'connected':
      return 'All systems operational'
    case 'cold-start':
      return 'Free tier backend is waking up. This happens after 15 minutes of inactivity.'
    case 'error':
      return 'Unable to connect to backend'
    default:
      return 'Checking status...'
  }
})

const dismiss = () => {
  showStatus.value = false
}

const startColdStartTimer = () => {
  countdown.value = 60
  showTimer.value = true
  status.value = 'cold-start'
  
  countdownInterval = setInterval(() => {
    countdown.value--
    if (countdown.value <= 0) {
      showTimer.value = false
      if (countdownInterval) clearInterval(countdownInterval)
    }
  }, 1000)
}

const setConnected = () => {
  status.value = 'connected'
  showTimer.value = false
  if (countdownInterval) clearInterval(countdownInterval)
  
  // Auto-hide success message after 3 seconds
  setTimeout(() => {
    if (status.value === 'connected') {
      showStatus.value = false
    }
  }, 3000)
}

const setError = () => {
  status.value = 'error'
  showTimer.value = false
  if (countdownInterval) clearInterval(countdownInterval)
}

// Check backend status on mount
const checkBackendStatus = async () => {
  try {
    const graphqlUri = import.meta.env.VITE_GRAPHQL_URI || 'http://localhost:3000/graphql'
    const backendUrl = graphqlUri.replace('/graphql', '')
    
    console.log('🏥 Checking backend health:', `${backendUrl}/up`)
    
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 90000) // 90 second timeout for cold starts
    
    const response = await fetch(`${backendUrl}/up`, {
      signal: controller.signal
    })
    
    clearTimeout(timeoutId)
    
    if (response.ok) {
      setConnected()
    } else {
      setError()
    }
  } catch (error: any) {
    console.log('🤶 Backend check failed, likely cold start:', error.message)
    startColdStartTimer()
  }
}

onMounted(() => {
  checkBackendStatus()
})

onUnmounted(() => {
  if (countdownInterval) clearInterval(countdownInterval)
})

// Expose methods for external use
defineExpose({
  setConnected,
  setError,
  startColdStartTimer,
  dismiss
})
</script>