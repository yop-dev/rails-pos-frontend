<template>
  <div class="flow-root">
    <ul role="list" class="-mb-8">
      <li 
        v-for="(event, eventIdx) in timelineEvents"
        :key="event.id"
      >
        <div class="relative pb-8">
          <span 
            v-if="eventIdx !== timelineEvents.length - 1"
            class="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200" 
            aria-hidden="true"
          ></span>
          <div class="relative flex space-x-3">
            <div>
              <span 
                :class="[
                  'h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white',
                  getEventClasses(event.type, event.completed)
                ]"
              >
                <component 
                  :is="getEventIcon(event.type)" 
                  :class="['h-4 w-4', event.completed ? 'text-white' : 'text-gray-400']"
                  aria-hidden="true" 
                />
              </span>
            </div>
            <div class="flex min-w-0 flex-1 justify-between space-x-4 pt-1.5">
              <div>
                <p :class="['text-sm', event.completed ? 'text-gray-900 font-medium' : 'text-gray-500']">
                  {{ event.title }}
                </p>
                <p v-if="event.description" class="mt-0.5 text-xs text-gray-500">
                  {{ event.description }}
                </p>
              </div>
              <div class="whitespace-nowrap text-right text-sm text-gray-500">
                <time v-if="event.timestamp" :datetime="event.timestamp">
                  {{ formatDateTime(event.timestamp) }}
                </time>
                <span v-else class="text-gray-400">
                  {{ event.pendingText }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { 
  ClockIcon,
  CheckCircleIcon,
  TruckIcon,
  DocumentTextIcon
} from '@heroicons/vue/24/outline'
import type { Order } from '../types'

interface TimelineEvent {
  id: string
  type: 'created' | 'confirmed' | 'completed'
  title: string
  description?: string
  timestamp?: string
  completed: boolean
  pendingText: string
}

const props = defineProps<{
  order: Order
}>()

const timelineEvents = computed<TimelineEvent[]>(() => {
  const events: TimelineEvent[] = [
    {
      id: 'created',
      type: 'created',
      title: 'Order Created',
      description: `Order placed via ${props.order.source === 'ONLINE' ? 'online' : 'in-store'}`,
      timestamp: props.order.createdAt,
      completed: true,
      pendingText: 'Pending'
    },
    {
      id: 'confirmed',
      type: 'confirmed', 
      title: 'Order Confirmed',
      description: 'Order has been confirmed and is being prepared',
      timestamp: props.order.confirmedAt,
      completed: !!props.order.confirmedAt,
      pendingText: 'Awaiting confirmation'
    },
    {
      id: 'completed',
      type: 'completed',
      title: 'Order Completed',
      description: 'Order has been completed successfully',
      timestamp: props.order.completedAt,
      completed: !!props.order.completedAt,
      pendingText: 'Awaiting completion'
    }
  ]

  return events
})

function getEventClasses(type: string, completed: boolean): string {
  if (completed) {
    switch (type) {
      case 'created':
        return 'bg-green-500'
      case 'confirmed': 
        return 'bg-blue-500'
      case 'completed':
        return 'bg-green-500'
      default:
        return 'bg-gray-400'
    }
  }
  return 'bg-gray-300'
}

function getEventIcon(type: string) {
  switch (type) {
    case 'created':
      return DocumentTextIcon
    case 'confirmed':
      return CheckCircleIcon
    case 'completed':
      return TruckIcon
    default:
      return ClockIcon
  }
}

function formatDateTime(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}
</script>