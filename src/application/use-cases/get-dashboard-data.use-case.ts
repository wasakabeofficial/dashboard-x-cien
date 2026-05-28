import type { DashboardRepository } from '@/domain/repositories/dashboard-repository.interface'
import type { DashboardDataEntity } from '@/domain/entities/dashboard.entity'

/**
 * Caso de uso: Obtener datos completos del dashboard.
 *
 * Responsabilidad única: orquestar la obtención de datos del dashboard.
 * Principio SRP — esta clase solo cambia si cambia la regla de "cómo obtener datos del dashboard".
 * Principio DIP — depende de la abstracción DashboardRepository, no de una implementación concreta.
 */
export class GetDashboardDataUseCase {
  constructor(private readonly dashboardRepository: DashboardRepository) {}

  async execute(): Promise<DashboardDataEntity> {
    return this.dashboardRepository.getDashboardData()
  }
}
