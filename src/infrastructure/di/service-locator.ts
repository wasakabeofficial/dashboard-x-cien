import type { ClientRepository } from '@/domain/repositories/client-repository.interface'
import type { DashboardRepository } from '@/domain/repositories/dashboard-repository.interface'
import type { HistorialRepository } from '@/domain/repositories/historial-repository.interface'
import { ApiClientRepository } from '@/infrastructure/repositories/api-client.repository'
import { ApiDashboardRepository } from '@/infrastructure/repositories/api-dashboard.repository'
import { ApiHistorialRepository } from '@/infrastructure/repositories/api-historial.repository'
import { GetDashboardDataUseCase } from '@/application/use-cases/get-dashboard-data.use-case'
import { GetClientsUseCase } from '@/application/use-cases/get-clients.use-case'
import { GetHistorialUseCase } from '@/application/use-cases/get-historial.use-case'


class ServiceLocator {
  private readonly dashboardRepository: DashboardRepository
  private readonly clientRepository: ClientRepository
  private readonly historialRepository: HistorialRepository

  private readonly getDashboardDataUseCase: GetDashboardDataUseCase
  private readonly getClientsUseCase: GetClientsUseCase
  private readonly getHistorialUseCase: GetHistorialUseCase

  constructor() {
    this.dashboardRepository = new ApiDashboardRepository()
    this.clientRepository = new ApiClientRepository()
    this.historialRepository = new ApiHistorialRepository()

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

export const serviceLocator = new ServiceLocator()
