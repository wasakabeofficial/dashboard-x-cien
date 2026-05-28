import type { HistorialRepository } from '@/domain/repositories/historial-repository.interface'
import type { HistorialEntryEntity } from '@/domain/entities/historial.entity'

/** Tipo del objeto que devuelve la API */
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
  private readonly apiUrl = 'https://cesar.n8n-wsk.com/webhook/getHistorialVue'

  async getAll(): Promise<HistorialEntryEntity[]> {
    const response = await fetch(this.apiUrl)

    if (!response.ok) {
      throw new Error(`Error al obtener historial: ${response.status} ${response.statusText}`)
    }

    const data: ApiHistorial[] = await response.json()
    return data.map((item) => this.mapToEntity(item))
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
