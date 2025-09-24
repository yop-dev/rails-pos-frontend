<template>
  <div class="fixed inset-0 bg-black bg-opacity-25 flex items-center justify-center z-50">
    <div class="bg-white rounded-lg p-6 flex items-center space-x-4 shadow-xl">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      <div class="text-gray-900">
        <div class="font-medium">Loading...</div>
        <div v-if="message" class="text-sm text-gray-500 mt-1">{{ message }}</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useGlobalStore } from '../stores/global'

const globalStore = useGlobalStore()

const message = computed(() => globalStore.loadingMessage)
</script>