import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: (to) => {
      // If user is logged in, redirect to orders, otherwise to login
      const authStore = useAuthStore()
      return authStore.isLoggedIn ? '/orders' : '/login'
    },
    meta: { requiresAuth: false } // Allow access to root for redirect logic
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
  {
    path: '/signup',
    name: 'Signup',
    component: () => import('../views/Signup.vue'),
    meta: { 
      title: 'Sign Up - Rails POS',
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
    redirect: '/login'
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
  console.log('Router: Navigating to', to.path, { requiresAuth: to.meta.requiresAuth })
  const authStore = useAuthStore()
  
  // Set page title
  document.title = to.meta.title as string || 'Rails POS'
  
  // Always initialize auth on navigation (it's idempotent)
  console.log('Router: Initializing auth before navigation check')
  await authStore.initializeAuth()
  
  console.log('Router: Auth state after initialization:', {
    isLoggedIn: authStore.isLoggedIn,
    hasUser: !!authStore.user,
    hasToken: !!authStore.token
  })
  
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
  
  // If user is logged in and trying to access auth pages, redirect to orders
  if ((to.name === 'Login' || to.name === 'Signup') && authStore.isLoggedIn) {
    console.log('Router: User already logged in, redirecting to orders')
    next({ name: 'OrderManager' })
    return
  }
  
  // Allow navigation
  console.log('Router: Navigation allowed to', to.path)
  next()
})

// Handle route errors
router.onError((error) => {
  console.error('Router error:', error)
  // Could redirect to an error page here if needed
})
