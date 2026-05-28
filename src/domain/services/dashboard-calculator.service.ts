import type { TablaRecordEntity } from '@/domain/entities/tabla-record.entity'
import type { KpiEntity, DistributionItemEntity, InsightEntity } from '@/domain/entities/dashboard.entity'

/**
 * Servicio de dominio: Cálculos del dashboard.
 *
 * Responsabilidad única: transformar registros crudos en KPIs, distribución e insights.
 * Principio SRP — esta clase cambia solo si cambia la lógica de cálculo del dashboard.
 * Principio DIP — no depende de nada externo, solo de entidades de dominio.
 */
export class DashboardCalculatorService {
  buildKpis(records: TablaRecordEntity[]): KpiEntity[] {
    const total = records.length
    const totalCost = records.reduce((sum, r) => sum + r.callCost, 0)
    const avgDuration = total > 0
      ? records.reduce((sum, r) => sum + r.durationMinutes, 0) / total
      : 0

    return [
      {
        title: 'Total de Llamadas',
        value: total.toLocaleString(),
        subtitle: total > 0 ? 'Llamadas registradas en el período' : 'Sin registros',
        icon: 'call',
        trend: { value: `${total} registros`, direction: 'up' },
        colorClass: 'bg-primary-fixed text-on-primary-fixed',
      },
      {
        title: 'Costo Total',
        value: `$${totalCost.toFixed(2)} USD`,
        subtitle: total > 0 ? 'Suma de costos de todas las llamadas' : 'Sin datos',
        icon: 'payments',
        trend: { value: `${records.length} llamadas`, direction: 'up' },
        colorClass: 'bg-secondary-fixed text-on-secondary-fixed',
      },
      {
        title: 'Duración Promedio',
        value: total > 0 ? `${avgDuration.toFixed(1)} min` : '—',
        subtitle: total > 0 ? 'Tiempo promedio por llamada' : 'Sin mediciones',
        icon: 'timer',
        trend: { value: `${total} mediciones`, direction: 'up' },
        colorClass: 'bg-tertiary-fixed text-on-tertiary-fixed',
      },
    ]
  }

  buildDistribution(records: TablaRecordEntity[]): DistributionItemEntity[] {
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

  calcSuccessRate(records: TablaRecordEntity[]): number {
    if (records.length === 0) return 0
    const successful = records.filter((r) => r.validationTag !== 'soporte_insuficiente').length
    return Math.round((successful / records.length) * 100)
  }

  buildInsights(records: TablaRecordEntity[]): InsightEntity[] {
    const sinSoporte = records.filter((r) => r.validationTag === 'soporte_insuficiente').length
    const pctSinSoporte = records.length > 0 ? Math.round((sinSoporte / records.length) * 100) : 0

    return [
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
