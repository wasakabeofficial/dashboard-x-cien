import { ref, watch, inject, onMounted } from 'vue'
import { GET_DASHBOARD_DATA_USE_CASE } from '@/presentation/di-keys'
import type { DashboardDataEntity, DashboardFilter } from '@/domain/entities/dashboard.entity'

export type PeriodFilter = 'all' | '7d' | '30d' | '90d'

/**
 * Composable: Gestión de datos del dashboard.
 *
 * Responsabilidad única: exponer estado reactivo del dashboard.
 * Principio DIP — recibe el caso de uso por inyección de dependencias (Vue provide/inject),
 *               no lo busca en infraestructura.
 * Principio OCP — los filtros se añaden sin modificar el composable base.
 */
export function useDashboard() {
  const data = ref<DashboardDataEntity | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Inyectado desde App.vue — Clean Architecture DIP respetado
  const getDashboardData = inject(GET_DASHBOARD_DATA_USE_CASE)!

  // Estado de filtros
  const periodFilter = ref<PeriodFilter>('all')
  const validationTagFilter = ref<string>('all')

  /** Construye el objeto DashboardFilter a partir del estado reactivo */
  function buildFilter(): DashboardFilter | undefined {
    if (periodFilter.value === 'all' && validationTagFilter.value === 'all') {
      return undefined
    }
    return {
      period: periodFilter.value,
      validationTag: validationTagFilter.value !== 'all' ? validationTagFilter.value : undefined,
    }
  }

  /** Carga (o recarga) los datos aplicando el filtro actual */
  async function loadDashboard(): Promise<void> {
    loading.value = true
    error.value = null
    try {
      data.value = await getDashboardData.execute(buildFilter())
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Error al cargar datos del dashboard'
    } finally {
      loading.value = false
    }
  }

  // Cuando cambia algún filtro, recargamos los datos
  watch([periodFilter, validationTagFilter], () => {
    loadDashboard()
  })

  function setPeriodFilter(period: PeriodFilter): void {
    periodFilter.value = period
  }

  function setValidationTagFilter(tag: string): void {
    validationTagFilter.value = tag
  }

  function clearFilters(): void {
    periodFilter.value = 'all'
    validationTagFilter.value = 'all'
  }

  onMounted(loadDashboard)

  return {
    data,
    loading,
    error,
    loadDashboard,
    periodFilter,
    validationTagFilter,
    setPeriodFilter,
    setValidationTagFilter,
    clearFilters,
  }
}
