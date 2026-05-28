import type { DashboardRepository } from '@/domain/repositories/dashboard-repository.interface'
import type { DashboardDataEntity, DashboardFilter } from '@/domain/entities/dashboard.entity'

export class GetDashboardDataUseCase {
  constructor(private readonly dashboardRepository: DashboardRepository) {}

  async execute(filter?: DashboardFilter): Promise<DashboardDataEntity> {
    return this.dashboardRepository.getDashboardData(filter)
  }
}
