import type { HistorialEntryEntity } from '@/domain/entities/historial.entity'

/** Puerto (interfaz) del repositorio de historial */
export interface HistorialRepository {
  getAll(): Promise<HistorialEntryEntity[]>
  getByFolio(folio: string): Promise<HistorialEntryEntity | null>
}
