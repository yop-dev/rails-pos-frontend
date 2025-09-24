import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: '/orders'
  },
  // Public routes
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/Login.vue'),
    meta: { 
      title: 'Login - Rails POS',
      requiresAuth: false,
      layout: 'auth' // Use different layout for auth pages
    }
  },
  // Protected routes
  {
    path: '/',
    component: () => import('../layouts/MainLayout.vue'),
    meta: { requiresAuth: true },
    children: [
      {
        path: 'orders',
        name: 'OrderManager',
        component: () => import('../views/OrderManager.vue'),
        meta: { 
          title: 'Order Manager - Rails POS',
          requiresAuth: true
        }
      },
      {
        path: 'orders/create',
        name: 'CreateOrder',
        component: () => import('../views/CreateOrder.vue'),
        meta: { 
          title: 'Create Order - Rails POS',
          requiresAuth: true
        }
      },
      {
        path: 'orders/:id',
        name: 'OrderDetail',
        component: () => import('../views/OrderDetail.vue'),
        meta: { 
          title: 'Order Details - Rails POS',
          requiresAuth: true
        },
        props: true
      },
      {
        path: 'products',
        name: 'ProductManager',
        component: () => import('../views/ProductManager.vue'),
        meta: { 
          title: 'Product Manager - Rails POS',
          requiresAuth: true
        }
      }
    ]
  },
  // Catch-all route
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    redirect: '/orders'
  }
]

export const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    }
    return { top: 0 }
  }
})

// Global navigation guards
router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()
  
  // Set page title
  document.title = to.meta.title as string || 'Rails POS'
  
  // Initialize auth if not already done
  if (!authStore.isLoggedIn && !authStore.isLoading) {
    await authStore.initializeAuth()
  }
  
  // Check if route requires authentication
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth !== false)
  
  if (requiresAuth && !authStore.isLoggedIn) {
    // Redirect to login with return path
    console.log('Router: Access denied, redirecting to login')
    next({
      name: 'Login',
      query: { redirect: to.fullPath }
    })
    return
  }
  
  // If user is logged in and trying to access login page, redirect to orders
  if (to.name === 'Login' && authStore.isLoggedIn) {
    console.log('Router: User already logged in, redirecting to orders')
    next({ name: 'OrderManager' })
    return
  }
  
  // Allow navigation
  next()
})

// Handle route errors
router.onError((error) => {
  console.error('Router error:', error)
  // Could redirect to an error page here if needed
})
