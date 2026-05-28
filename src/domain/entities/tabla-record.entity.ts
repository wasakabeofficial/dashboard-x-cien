/** Entidad de negocio: Registro individual de la tabla de llamadas/incidencias */
export interface TablaRecordEntity {
  sendId: string
  content: string
  clientId: string
  validationTag: string
  callId: string
  durationMinutes: number
  callCost: number
  id: number
  createdAt: string
  updatedAt: string
}
