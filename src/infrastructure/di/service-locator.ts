import type { ClientRepository } from '@/domain/repositories/client-repository.interface'
import type { DashboardRepository } from '@/domain/repositories/dashboard-repository.interface'
import { MockClientRepository } from '@/infrastructure/repositories/mock-client.repository'
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
    // Para cambiar a API real, reemplazar:
    //   new MockDashboardRepository() → new ApiDashboardRepository()
    this.dashboardRepository = new MockDashboardRepository()
    this.clientRepository = new MockClientRepository()

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
