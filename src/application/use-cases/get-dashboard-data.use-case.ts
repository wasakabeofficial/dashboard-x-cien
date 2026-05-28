import type { DashboardRepository } from '@/domain/repositories/dashboard-repository.interface'
import type { DashboardDataEntity, DashboardFilter } from '@/domain/entities/dashboard.entity'

/**
 * Caso de uso: Obtener datos completos del dashboard.
 *
 * Responsabilidad única: orquestar la obtención de datos del dashboard.
 * Principio SRP — esta clase solo cambia si cambia la regla de "cómo obtener datos del dashboard".
 * Principio DIP — depende de la abstracción DashboardRepository, no de una implementación concreta.
 * Principio OCP — acepta un DashboardFilter opcional sin modificar la clase base.
 */
export class GetDashboardDataUseCase {
  constructor(private readonly dashboardRepository: DashboardRepository) {}

  async execute(filter?: DashboardFilter): Promise<DashboardDataEntity> {
    return this.dashboardRepository.getDashboardData(filter)
  }
}
