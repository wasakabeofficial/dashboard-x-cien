import type { ClientRepository } from '@/domain/repositories/client-repository.interface'
import type { DashboardRepository } from '@/domain/repositories/dashboard-repository.interface'
import type { HistorialRepository } from '@/domain/repositories/historial-repository.interface'
import { ApiClientRepository } from '@/infrastructure/repositories/api-client.repository'
import { MockDashboardRepository } from '@/infrastructure/repositories/mock-dashboard.repository'
import { ApiHistorialRepository } from '@/infrastructure/repositories/api-historial.repository'
import { GetDashboardDataUseCase } from '@/application/use-cases/get-dashboard-data.use-case'
import { GetClientsUseCase } from '@/application/use-cases/get-clients.use-case'
import { GetHistorialUseCase } from '@/application/use-cases/get-historial.use-case'

/**
 * Service Locator / Contenedor de Inyección de Dependencias.
 *
 * Responsabilidad única: resolver y proporcionar las dependencias de toda la aplicación.
 * Principio DIP — aquí se conectan las abstracciones (interfaces) con las implementaciones concretas.
 * Principio SRP — esta es la única clase que conoce TODAS las implementaciones concretas.
 */
class ServiceLocator {
  private readonly dashboardRepository: DashboardRepository
  private readonly clientRepository: ClientRepository
  private readonly historialRepository: HistorialRepository

  private readonly getDashboardDataUseCase: GetDashboardDataUseCase
  private readonly getClientsUseCase: GetClientsUseCase
  private readonly getHistorialUseCase: GetHistorialUseCase

  constructor() {
    // --- Bindings ---
    this.dashboardRepository = new MockDashboardRepository()
    this.clientRepository = new ApiClientRepository()
    this.historialRepository = new ApiHistorialRepository()

    // --- Casos de uso ---
    this.getDashboardDataUseCase = new GetDashboardDataUseCase(this.dashboardRepository)
    this.getClientsUseCase = new GetClientsUseCase(this.clientRepository)
    this.getHistorialUseCase = new GetHistorialUseCase(this.historialRepository)
  }

  getDashboardData(): GetDashboardDataUseCase {
    return this.getDashboardDataUseCase
  }

  getClients(): GetClientsUseCase {
    return this.getClientsUseCase
  }

  getHistorial(): GetHistorialUseCase {
    return this.getHistorialUseCase
  }
}

/** Instancia singleton del Service Locator */
export const serviceLocator = new ServiceLocator()
