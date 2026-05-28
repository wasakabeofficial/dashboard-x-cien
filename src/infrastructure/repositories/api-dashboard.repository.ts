import type { DashboardRepository } from '@/domain/repositories/dashboard-repository.interface'
import type { DashboardDataEntity, KpiEntity, DistributionItemEntity, InsightEntity } from '@/domain/entities/dashboard.entity'
import type { TablaRecordEntity } from '@/domain/entities/tabla-record.entity'

/** Tipo del objeto que devuelve la API getTablaVue */
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

/**
 * Implementación real del repositorio de dashboard.
 *
 * Consume GET getTablaVue y transforma cada columna en una gráfica / KPI:
 *   - validationTag → distribución (pastel)
 *   - durationMInutes → KPI de duración promedio
 *   - callCost       → KPI de costo total
 *   - createdAt       → (reservado para timeline futura)
 *
 * Principios SOLID:
 *   SRP — solo se ocupa de obtener y mapear datos del dashboard
 *   LSP — sustituye 100% a MockDashboardRepository
 *   DIP — implementa DashboardRepository (abstracción)
 */
export class ApiDashboardRepository implements DashboardRepository {
  private readonly apiUrl = import.meta.env.VITE_API_TABLA_URL

  async getDashboardData(): Promise<DashboardDataEntity> {
    const records = await this.fetchRecords()
    return {
      kpis: this.buildKpis(records),
      distribution: this.buildDistribution(records),
      successRate: this.calcSuccessRate(records),
      insights: this.buildInsights(records),
    }
  }

  // ────────────── helpers ──────────────

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

  // ────────────── KPIs ──────────────

  private buildKpis(records: TablaRecordEntity[]): KpiEntity[] {
    const total = records.length
    const totalCost = records.reduce((sum, r) => sum + r.callCost, 0)
    const avgDuration = total > 0
      ? records.reduce((sum, r) => sum + r.durationMinutes, 0) / total
      : 0

    return [
      {
        title: 'Total de Llamadas',
        value: total.toLocaleString(),
        subtitle: 'Llamadas registradas en el período',
        icon: 'call',
        trend: { value: `${total} registros`, direction: 'up' },
        colorClass: 'bg-primary-fixed text-on-primary-fixed',
      },
      {
        title: 'Costo Total',
        value: `$${totalCost.toFixed(2)} USD`,
        subtitle: 'Suma de costos de todas las llamadas',
        icon: 'payments',
        trend: { value: `${records.length} llamadas`, direction: 'up' },
        colorClass: 'bg-secondary-fixed text-on-secondary-fixed',
      },
      {
        title: 'Duración Promedio',
        value: `${avgDuration.toFixed(1)} min`,
        subtitle: 'Tiempo promedio por llamada',
        icon: 'timer',
        trend: { value: `${total} mediciones`, direction: 'up' },
        colorClass: 'bg-tertiary-fixed text-on-tertiary-fixed',
      },
    ]
  }

  // ────────────── Distribución (validationTag) ──────────────

  private buildDistribution(records: TablaRecordEntity[]): DistributionItemEntity[] {
    const groups = new Map<string, number>()
    for (const r of records) {
      const tag = r.validationTag || 'sin_clasificar'
      groups.set(tag, (groups.get(tag) ?? 0) + 1)
    }

    const colorMap: Record<string, string> = {
      soporte_insuficiente: 'bg-error',
      resuelto: 'bg-on-tertiary-container',
      en_proceso: 'bg-tertiary-fixed',
    }

    const labelMap: Record<string, string> = {
      soporte_insuficiente: 'Soporte Insuficiente',
      resuelto: 'Resuelto',
      en_proceso: 'En Proceso',
    }

    return Array.from(groups.entries())
      .map(([tag, count]) => ({
        label: labelMap[tag] ?? tag,
        value: count,
        colorClass: colorMap[tag] ?? 'bg-surface-variant',
      }))
      .sort((a, b) => b.value - a.value)
  }

  // ────────────── Tasa de éxito ──────────────

  private calcSuccessRate(records: TablaRecordEntity[]): number {
    if (records.length === 0) return 0
    const successful = records.filter((r) => r.validationTag !== 'soporte_insuficiente').length
    return Math.round((successful / records.length) * 100)
  }

  // ────────────── Insights ──────────────

  private buildInsights(records: TablaRecordEntity[]): InsightEntity[] {
    const sinSoporte = records.filter((r) => r.validationTag === 'soporte_insuficiente').length
    const pctSinSoporte = records.length > 0 ? Math.round((sinSoporte / records.length) * 100) : 0

    return [
      {
        type: 'campaign',
        title: 'Análisis de Incidencias',
        description:
          `Se registraron ${records.length} llamadas en total. ` +
          `${sinSoporte} de ellas (${pctSinSoporte}%) requieren soporte adicional.`,
        actionLabel: 'Ver Detalle',
      },
      {
        type: 'alert',
        title: 'Alertas de Calidad',
        description:
          `El ${pctSinSoporte}% de las interacciones fueron clasificadas como "soporte insuficiente". ` +
          'Revisa los casos para mejorar la atención.',
        teamMembers: ['team-1', 'team-2'],
      },
      {
        type: 'suggestion',
        suggestion:
          'Sugerencia: Prioriza los casos con "soporte_insuficiente" para reducir la tasa de reincidencia.',
      },
    ]
  }
}
