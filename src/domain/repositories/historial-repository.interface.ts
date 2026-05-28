import type { HistorialEntryEntity } from '@/domain/entities/historial.entity'

export interface HistorialRepository {
  getAll(): Promise<HistorialEntryEntity[]>
  getByFolio(folio: string): Promise<HistorialEntryEntity | null>
  search(query: string): Promise<HistorialEntryEntity[]>
}
