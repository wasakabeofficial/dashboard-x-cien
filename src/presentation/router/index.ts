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
      path: '/clientes',
      name: 'clientes',
      component: () => import('@/presentation/views/ClientesView.vue'),
    },
    {
      path: '/historial',
      name: 'historial',
      component: () => import('@/presentation/views/HistorialView.vue'),
    },
    {
      path: '/historial/:folio',
      name: 'historial-detail',
      component: () => import('@/presentation/views/HistorialDetailView.vue'),
    },
    {
      path: '/settings',
      name: 'settings',
      component: () => import('@/presentation/views/SettingsView.vue'),
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
