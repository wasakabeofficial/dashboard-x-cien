import type { DashboardRepository } from '@/domain/repositories/dashboard-repository.interface'
import type { DashboardDataEntity } from '@/domain/entities/dashboard.entity'

/**
 * Implementación mock del repositorio de dashboard.
 * Principio LSP — sustituible por cualquier implementación real.
 * Principio ISP — implementa SOLO el contrato de DashboardRepository, nada extra.
 */
export class MockDashboardRepository implements DashboardRepository {
  async getDashboardData(): Promise<DashboardDataEntity> {
    await this.delay(250)

    return {
      kpis: [
        {
          title: 'Resumen de Envíos',
          value: '48,290',
          subtitle: 'Total de correos enviados este mes',
          icon: 'mail',
          trend: { value: '+12.5%', direction: 'up' },
          colorClass: 'bg-primary-fixed text-on-primary-fixed',
        },
        {
          title: 'Llamadas Realizadas',
          value: '1,402',
          subtitle: 'Interacciones directas completadas',
          icon: 'call',
          trend: { value: '-2.1%', direction: 'down' },
          colorClass: 'bg-secondary-fixed text-on-secondary-fixed',
        },
        {
          title: 'Validación de Datos',
          value: '45,392',
          subtitle: 'Correos verificados exitosamente',
          icon: 'verified_user',
          trend: { value: '94% Válidos', direction: 'up' },
          colorClass: 'bg-tertiary-fixed text-on-tertiary-fixed',
        },
      ],
      distribution: [
        { label: 'Entregados', value: 39600, colorClass: 'bg-primary' },
        { label: 'Pendientes', value: 6200, colorClass: 'bg-tertiary-fixed' },
        { label: 'Rebotados', value: 2490, colorClass: 'bg-secondary-fixed' },
      ],
      successRate: 82,
      insights: [
        {
          type: 'campaign',
          title: 'Optimización de Campaña',
          description:
            'Los envíos realizados entre las 9:00 AM y 11:00 AM muestran un 24% más de apertura.',
          actionLabel: 'Ver Análisis',
        },
        {
          type: 'alert',
          title: 'Alertas de Calidad',
          description:
            'Se detectaron 153 dominios sospechosos en la última carga de datos.',
          teamMembers: ['team-1', 'team-2'],
        },
        {
          type: 'suggestion',
          suggestion:
            "Sugerencia AI: Incrementa el presupuesto en 'Canal B' para maximizar conversiones.",
        },
      ],
    }
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms))
  }
}
