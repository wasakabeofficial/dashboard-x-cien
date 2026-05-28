/** Entidad de negocio: Indicador KPI */
export interface KpiEntity {
  title: string
  value: string
  subtitle: string
  icon: string
  trend: {
    value: string
    direction: 'up' | 'down'
  }
  colorClass: string
}

/** Entidad de negocio: Elemento de distribución */
export interface DistributionItemEntity {
  label: string
  value: number
  colorClass: string
}

/** Entidad de negocio: Dato completo del dashboard */
export interface DashboardDataEntity {
  kpis: KpiEntity[]
  distribution: DistributionItemEntity[]
  successRate: number
  insights: InsightEntity[]
}

/** Entidad de negocio: Insight / alerta */
export interface InsightEntity {
  type: 'campaign' | 'alert' | 'suggestion'
  title?: string
  description?: string
  actionLabel?: string
  teamMembers?: string[]
  suggestion?: string
}

/** Filtros disponibles para el dashboard */
export interface DashboardFilter {
  period?: 'all' | '7d' | '30d' | '90d'
  validationTag?: string
}
