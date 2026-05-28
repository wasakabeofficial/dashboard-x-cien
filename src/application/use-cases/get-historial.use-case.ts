import type { HistorialRepository } from '@/domain/repositories/historial-repository.interface'
import type { HistorialEntryEntity } from '@/domain/entities/historial.entity'

export class GetHistorialUseCase {
  constructor(private readonly historialRepository: HistorialRepository) {}

  async execute(): Promise<HistorialEntryEntity[]> {
    return this.historialRepository.getAll()
  }

  async getByFolio(folio: string): Promise<HistorialEntryEntity | null> {
    return this.historialRepository.getByFolio(folio)
  }

  async search(query: string): Promise<HistorialEntryEntity[]> {
    return this.historialRepository.search(query)
  }
}
