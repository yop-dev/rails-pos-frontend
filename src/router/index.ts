import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: '/orders'
  },
  // Public routes (e.g., login) could go here in the future
  // {
  //   path: '/login',
  //   name: 'Login',
  //   component: () => import('../views/Login.vue'),
  //   meta: { title: 'Login' }
  // },
  {
    path: '/',
    component: () => import('../layouts/MainLayout.vue'),
    children: [
      {
        path: 'orders',
        name: 'OrderManager',
        component: () => import('../views/OrderManager.vue'),
        meta: { title: 'Order Manager' }
      },
      {
        path: 'orders/create',
        name: 'CreateOrder',
        component: () => import('../views/CreateOrder.vue'),
        meta: { title: 'Create Order' }
      },
      {
        path: 'orders/:id',
        name: 'OrderDetail',
        component: () => import('../views/OrderDetail.vue'),
        meta: { title: 'Order Details' },
        props: true
      },
      {
        path: 'products',
        name: 'ProductManager',
        component: () => import('../views/ProductManager.vue'),
        meta: { title: 'Product Manager' }
      }
    ]
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

// Navigation guard for page titles
router.beforeEach((to) => {
  document.title = to.meta.title as string || 'Rails POS'
})