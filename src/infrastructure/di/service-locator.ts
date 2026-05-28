import type { ClientRepository } from '@/domain/repositories/client-repository.interface'
import type { DashboardRepository } from '@/domain/repositories/dashboard-repository.interface'
import { ApiClientRepository } from '@/infrastructure/repositories/api-client.repository'
import { MockDashboardRepository } from '@/infrastructure/repositories/mock-dashboard.repository'
import { GetDashboardDataUseCase } from '@/application/use-cases/get-dashboard-data.use-case'
import { GetClientsUseCase } from '@/application/use-cases/get-clients.use-case'

/**
 * Service Locator / Contenedor de Inyección de Dependencias.
 *
 * Responsabilidad única: resolver y proporcionar las dependencias de toda la aplicación.
 * Principio DIP — aquí se conectan las abstracciones (interfaces) con las implementaciones concretas.
 * Principio SRP — esta es la única clase que conoce TODAS las implementaciones concretas.
 *
 * Para cambiar de mocks a una API real, solo se modifican los bindings aquí.
 */
class ServiceLocator {
  private readonly dashboardRepository: DashboardRepository
  private readonly clientRepository: ClientRepository

  private readonly getDashboardDataUseCase: GetDashboardDataUseCase
  private readonly getClientsUseCase: GetClientsUseCase

  constructor() {
    // --- Bindings: abstracción → implementación concreta ---
    // Dashboard aún usa datos mock (se puede cambiar después)
    this.dashboardRepository = new MockDashboardRepository()
    // Clientes: ahora consume la API real
    this.clientRepository = new ApiClientRepository()

    // --- Casos de uso (reciben las dependencias por constructor) ---
    this.getDashboardDataUseCase = new GetDashboardDataUseCase(this.dashboardRepository)
    this.getClientsUseCase = new GetClientsUseCase(this.clientRepository)
  }

  getDashboardData(): GetDashboardDataUseCase {
    return this.getDashboardDataUseCase
  }

  getClients(): GetClientsUseCase {
    return this.getClientsUseCase
  }
}

/** Instancia singleton del Service Locator */
export const serviceLocator = new ServiceLocator()
