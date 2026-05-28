import type { DashboardDataEntity } from '@/domain/entities/dashboard.entity'

/**
 * Puerto (interfaz) del repositorio de dashboard.
 * Principio: Interface Segregation — interfaz específica para datos del dashboard.
 */
export interface DashboardRepository {
  /** Obtiene todos los datos del dashboard */
  getDashboardData(): Promise<DashboardDataEntity>
}
