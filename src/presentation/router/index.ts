import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'dashboard',
      component: () => import('@/presentation/views/DashboardView.vue'),
    },
    {
      path: '/cliente/:id',
      name: 'client-detail',
      component: () => import('@/presentation/views/ClientDetailView.vue'),
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: '/',
    },
  ],
})

export default router
