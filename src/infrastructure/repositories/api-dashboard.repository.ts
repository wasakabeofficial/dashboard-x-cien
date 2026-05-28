import type { DashboardRepository } from '@/domain/repositories/dashboard-repository.interface'
import type { DashboardDataEntity, DashboardFilter } from '@/domain/entities/dashboard.entity'
import type { TablaRecordEntity } from '@/domain/entities/tabla-record.entity'
import { DashboardCalculatorService } from '@/domain/services/dashboard-calculator.service'

interface ApiTablaRecord {
  sendId: string
  Content: string
  clientId: string
  validationTag: string
  callId: string
  durationMInutes: string
  callCost: string
  id: number
  createdAt: string
  updatedAt: string
}
class ApiDashboardRepository implements DashboardRepository {
  private readonly apiUrl = import.meta.env.VITE_API_TABLA_URL
  private readonly calculator = new DashboardCalculatorService()

  async getDashboardData(filter?: DashboardFilter): Promise<DashboardDataEntity> {
    let records = await this.fetchRecords()
    if (filter) {
      records = this.applyFilter(records, filter)
    }

    return {
      kpis: this.calculator.buildKpis(records),
      distribution: this.calculator.buildDistribution(records),
      successRate: this.calculator.calcSuccessRate(records),
      insights: this.calculator.buildInsights(records),
    }
  }


  private applyFilter(records: TablaRecordEntity[], filter: DashboardFilter): TablaRecordEntity[] {
    let filtered = records

    if (filter.period && filter.period !== 'all') {
      const now = new Date()
      const cutoff = new Date()
      const days = parseInt(filter.period.replace('d', ''))
      cutoff.setDate(now.getDate() - days)
      filtered = filtered.filter((r) => {
        const date = new Date(r.createdAt)
        return date >= cutoff
      })
    }

    if (filter.validationTag && filter.validationTag !== 'all') {
      filtered = filtered.filter((r) => r.validationTag === filter.validationTag)
    }

    return filtered
  }


  private async fetchRecords(): Promise<TablaRecordEntity[]> {
    const url = this.getUrl()
    const response = await fetch(url)
    if (!response.ok) {
      throw new Error(`Error al obtener datos del dashboard: ${response.status} ${response.statusText}`)
    }
    const raw: ApiTablaRecord[] = await response.json()
    return raw.map((r) => this.mapToEntity(r))
  }

  private getUrl(): string {
    if (!this.apiUrl) {
      throw new Error(
        'Falta VITE_API_TABLA_URL en el archivo .env. Copia .env.example como .env y completa las variables.',
      )
    }
    return this.apiUrl
  }

  private mapToEntity(raw: ApiTablaRecord): TablaRecordEntity {
    return {
      sendId: raw.sendId,
      content: raw.Content,
      clientId: raw.clientId,
      validationTag: raw.validationTag,
      callId: raw.callId,
      durationMinutes: parseFloat(raw.durationMInutes) || 0,
      callCost: parseFloat(raw.callCost) || 0,
      id: raw.id,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
    }
  }
}
