export interface TablaRecordEntity {
  sendId: string
  content: string
  clientId: string
  validationTag: string
  callId: string
  durationMinutes: number
  callCost: number
  transcripcion: string | null
  id: number
  createdAt: string
  updatedAt: string
}
