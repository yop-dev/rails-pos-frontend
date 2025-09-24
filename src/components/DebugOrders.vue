<template>
  <div class="p-6 bg-gray-100 rounded-lg">
    <h3 class="text-lg font-bold mb-4">Debug Orders</h3>
    
    <div class="mb-4">
      <button @click="testQuery" class="bg-blue-500 text-white px-4 py-2 rounded">
        Test Orders Query
      </button>
    </div>

    <div class="space-y-4">
      <div>
        <strong>Loading:</strong> {{ loading }}
      </div>
      
      <div>
        <strong>Error:</strong> {{ error ? error.message : 'None' }}
      </div>
      
      <div>
        <strong>Orders Count:</strong> {{ orders.length }}
      </div>

      <div v-if="orders.length > 0">
        <strong>Sample Order:</strong>
        <pre class="bg-white p-2 rounded text-xs overflow-auto">{{ JSON.stringify(orders[0], null, 2) }}</pre>
      </div>

      <div>
        <strong>Raw Result:</strong>
        <pre class="bg-white p-2 rounded text-xs overflow-auto">{{ JSON.stringify(result, null, 2) }}</pre>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useQuery } from '@vue/apollo-composable'
import { gql } from '@apollo/client/core'
import { computed } from 'vue'

const GET_ORDERS_DEBUG = gql`
  query GetOrdersDebug {
    orders {
      id
      reference
      status
      source
      total {
        formatted
      }
      customer {
        fullName
        email
      }
    }
  }
`

const { result, loading, error, refetch } = useQuery(GET_ORDERS_DEBUG)

const orders = computed(() => result.value?.orders ?? [])

function testQuery() {
  console.log('Testing query...')
  console.log('Result:', result.value)
  console.log('Loading:', loading.value)
  console.log('Error:', error.value)
  refetch()
}
</script>