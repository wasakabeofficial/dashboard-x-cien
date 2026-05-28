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

export interface DistributionItemEntity {
  label: string
  value: number
  colorClass: string
}

export interface DashboardDataEntity {
  kpis: KpiEntity[]
  distribution: DistributionItemEntity[]
  successRate: number
  insights: InsightEntity[]
}

export interface InsightEntity {
  type: 'campaign' | 'alert' | 'suggestion'
  title?: string
  description?: string
  actionLabel?: string
  teamMembers?: string[]
  suggestion?: string
}

export interface DashboardFilter {
  period?: 'all' | '7d' | '30d' | '90d'
  validationTag?: string
}
