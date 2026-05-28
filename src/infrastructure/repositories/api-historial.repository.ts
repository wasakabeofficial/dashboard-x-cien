import type { HistorialRepository } from '@/domain/repositories/historial-repository.interface'
import type { HistorialEntryEntity } from '@/domain/entities/historial.entity'

interface ApiHistorial {
  row_number: number
  Folio: string
  Fecha: string
  'ID Cliente': number
  'Nombre del Titular': string
  Situacion: string
  'Categoria Tecnica': string
  Estado: string
  Telefono: number
  Correo: string
}

export class ApiHistorialRepository implements HistorialRepository {
  private readonly apiUrl = import.meta.env.VITE_API_HISTORIAL_URL

  private getUrl(): string {
    if (!this.apiUrl) {
      throw new Error(
        'Falta VITE_API_HISTORIAL_URL en el archivo .env. Copia .env.example como .env y completa las variables.',
      )
    }
    return this.apiUrl
  }

  async getAll(): Promise<HistorialEntryEntity[]> {
    const response = await fetch(this.getUrl())

    if (!response.ok) {
      throw new Error(`Error al obtener historial: ${response.status} ${response.statusText}`)
    }

    const data: ApiHistorial[] = await response.json()
    return data.map((item) => this.mapToEntity(item))
  }

  async getByFolio(folio: string): Promise<HistorialEntryEntity | null> {
    const all = await this.getAll()
    return all.find((e) => e.folio === folio) ?? null
  }

  async search(query: string): Promise<HistorialEntryEntity[]> {
    const all = await this.getAll()
    const term = query.toLowerCase()
    return all.filter(
      (e) =>
        e.folio.toLowerCase().includes(term) ||
        e.nombreTitular.toLowerCase().includes(term) ||
        e.categoriaTecnica.toLowerCase().includes(term) ||
        e.estado.toLowerCase().includes(term) ||
        e.telefono.includes(term) ||
        e.correo.toLowerCase().includes(term) ||
        e.situacion.toLowerCase().includes(term),
    )
  }

  private mapToEntity(item: ApiHistorial): HistorialEntryEntity {
    return {
      folio: item.Folio || '—',
      fecha: this.formatDate(item.Fecha),
      idCliente: item['ID Cliente'],
      nombreTitular: item['Nombre del Titular'] || '—',
      situacion: item.Situacion || '—',
      categoriaTecnica: item['Categoria Tecnica'] || '—',
      estado: item.Estado || '—',
      telefono: item.Telefono ? String(item.Telefono) : '—',
      correo: item.Correo || '—',
    }
  }

  private formatDate(fecha: string): string {
    if (!fecha) return '—'
    try {
      const date = new Date(fecha)
      return date.toLocaleDateString('es-MX', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    } catch {
      return fecha
    }
  }
}
