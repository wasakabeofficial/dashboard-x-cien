import { ref, onMounted } from 'vue'
import { serviceLocator } from '@/infrastructure/di/service-locator'
import type { DashboardDataEntity } from '@/domain/entities/dashboard.entity'

/**
 * Composable: Gestión de datos del dashboard.
 *
 * Responsabilidad única: exponer estado reactivo del dashboard.
 * Principio DIP — se apoya en el caso de uso, no en implementaciones concretas.
 */
export function useDashboard() {
  const data = ref<DashboardDataEntity | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function loadDashboard(): Promise<void> {
    loading.value = true
    error.value = null
    try {
      const useCase = serviceLocator.getDashboardData()
      data.value = await useCase.execute()
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Error al cargar datos del dashboard'
    } finally {
      loading.value = false
    }
  }

  onMounted(loadDashboard)

  return {
    data,
    loading,
    error,
    loadDashboard,
  }
}
