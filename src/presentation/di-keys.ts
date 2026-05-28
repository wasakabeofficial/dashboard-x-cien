import type { InjectionKey } from 'vue'
import type { GetClientsUseCase } from '@/application/use-cases/get-clients.use-case'
import type { GetHistorialUseCase } from '@/application/use-cases/get-historial.use-case'
import type { GetDashboardDataUseCase } from '@/application/use-cases/get-dashboard-data.use-case'

export const GET_CLIENTS_USE_CASE: InjectionKey<GetClientsUseCase> =
  Symbol('getClientsUseCase')

export const GET_HISTORIAL_USE_CASE: InjectionKey<GetHistorialUseCase> =
  Symbol('getHistorialUseCase')

export const GET_DASHBOARD_DATA_USE_CASE: InjectionKey<GetDashboardDataUseCase> =
  Symbol('getDashboardDataUseCase')
