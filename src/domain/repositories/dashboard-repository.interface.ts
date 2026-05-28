import type { DashboardDataEntity, DashboardFilter } from '@/domain/entities/dashboard.entity'

/**
 * Puerto (interfaz) del repositorio de dashboard.
 * Principio: Interface Segregation — interfaz específica para datos del dashboard.
 */
export interface DashboardRepository {
  /** Obtiene datos del dashboard, opcionalmente filtrados */
  getDashboardData(filter?: DashboardFilter): Promise<DashboardDataEntity>
}
