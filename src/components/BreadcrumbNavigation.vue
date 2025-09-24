<template>
  <nav v-if="breadcrumbs.length > 0" class="flex items-center space-x-2 text-sm text-gray-500">
    <ol class="flex items-center space-x-2">
      <li v-for="(crumb, index) in breadcrumbs" :key="crumb.path || crumb.label" class="flex items-center">
        <!-- Home Icon for first crumb -->
        <HomeIcon v-if="index === 0" class="w-4 h-4 mr-1 text-gray-400" />
        
        <!-- Crumb Content -->
        <router-link
          v-if="crumb.path && !crumb.active"
          :to="crumb.path"
          class="hover:text-gray-700 transition-colors"
        >
          {{ crumb.label }}
        </router-link>
        <span
          v-else
          class="font-medium"
          :class="crumb.active ? 'text-gray-900' : 'text-gray-500'"
        >
          {{ crumb.label }}
        </span>
        
        <!-- Separator -->
        <ChevronRightIcon
          v-if="index < breadcrumbs.length - 1"
          class="w-4 h-4 mx-2 text-gray-300"
        />
      </li>
    </ol>
  </nav>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { HomeIcon, ChevronRightIcon } from '@heroicons/vue/24/outline'

interface BreadcrumbItem {
  label: string
  path?: string
  active?: boolean
}

// Composables
const route = useRoute()

// Computed breadcrumbs based on current route
const breadcrumbs = computed(() => {
  const crumbs: BreadcrumbItem[] = []
  
  // Always start with dashboard/home
  crumbs.push({
    label: 'Dashboard',
    path: '/orders'
  })
  
  // Generate breadcrumbs based on route
  switch (route.name) {
    case 'OrderManager':
      crumbs.push({
        label: 'Orders',
        active: true
      })
      break
      
    case 'CreateOrder':
      crumbs.push(
        {
          label: 'Orders',
          path: '/orders'
        },
        {
          label: 'Create Order',
          active: true
        }
      )
      break
      
    case 'OrderDetail':
      crumbs.push(
        {
          label: 'Orders',
          path: '/orders'
        },
        {
          label: `Order ${route.params.id}`,
          active: true
        }
      )
      break
      
    case 'ProductManager':
      crumbs.push({
        label: 'Products',
        active: true
      })
      break
      
    default:
      // For unknown routes, try to generate from path segments
      const pathSegments = route.path.split('/').filter(segment => segment)
      
      pathSegments.forEach((segment, index) => {
        const isLast = index === pathSegments.length - 1
        const label = segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, ' ')
        const path = isLast ? undefined : '/' + pathSegments.slice(0, index + 1).join('/')
        
        crumbs.push({
          label,
          path,
          active: isLast
        })
      })
  }
  
  return crumbs
})
</script>