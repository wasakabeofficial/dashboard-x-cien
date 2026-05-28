import type { DashboardDataEntity, DashboardFilter } from '@/domain/entities/dashboard.entity'
import type { TablaRecordEntity } from '@/domain/entities/tabla-record.entity'

export interface DashboardRepository {
  getDashboardData(filter?: DashboardFilter): Promise<DashboardDataEntity>
  getTablaRecords(): Promise<TablaRecordEntity[]>
}
