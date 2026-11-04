import { createRouter, createWebHistory } from 'vue-router'
import landingRoutes from '@/modules/landing/routes'
import authRoutes from '@/modules/auth/routes'

const routes = [
  ...landingRoutes,
  ...authRoutes,
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: () => import('@/modules/errors/views/NotFoundView.vue'),
    meta: {
      title: 'Página no encontrada | HENGEST',
    },
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    }
    if (to.hash) {
      return {
        el: to.hash,
        behavior: 'smooth',
        top: 80, // margen para la barra fija superior
      }
    }
    return { top: 0, behavior: 'smooth' }
  },
})

// Actualización dinámica del título de la pestaña
router.afterEach((to) => {
  if (to.meta?.title) {
    document.title = to.meta.title
  }
})

export default router
