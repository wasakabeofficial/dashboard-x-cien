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

interface ApiTablaRecord {
  sendId: string
  Content: string
  clientId: string
  validationTag: string
  callId: string
  durationMInutes: string
  callCost: string
  transcripcion: string | null
  id: number
  createdAt: string
  updatedAt: string
}

export class ApiHistorialRepository implements HistorialRepository {
  private readonly apiUrl = import.meta.env.VITE_API_HISTORIAL_URL
  private readonly tablaUrl = import.meta.env.VITE_API_TABLA_URL

  private getUrl(): string {
    if (!this.apiUrl) {
      throw new Error(
        'Falta VITE_API_HISTORIAL_URL en el archivo .env. Copia .env.example como .env y completa las variables.',
      )
    }
    return this.apiUrl
  }

  private getTablaUrl(): string {
    if (!this.tablaUrl) {
      throw new Error(
        'Falta VITE_API_TABLA_URL en el archivo .env. Copia .env.example como .env y completa las variables.',
      )
    }
    return this.tablaUrl
  }

  async getAll(): Promise<HistorialEntryEntity[]> {
    const [historialData, tablaData] = await Promise.all([
      this.fetchHistorial(),
      this.fetchTabla(),
    ])

    const transcripcionMap = this.buildTranscripcionMap(tablaData)

    return historialData.map((item) => {
      const entity = this.mapToEntity(item)
      const clientIdKey = String(item['ID Cliente'])
      const transcripcion = transcripcionMap.get(clientIdKey)
      if (transcripcion) {
        entity.transcripcion = transcripcion
      }
      return entity
    })
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

  private async fetchHistorial(): Promise<ApiHistorial[]> {
    const response = await fetch(this.getUrl())
    if (!response.ok) {
      throw new Error(`Error al obtener historial: ${response.status} ${response.statusText}`)
    }
    return response.json()
  }

  private async fetchTabla(): Promise<ApiTablaRecord[]> {
    try {
      const response = await fetch(this.getTablaUrl())
      if (!response.ok) {
        console.warn(`No se pudieron obtener datos de tabla: ${response.status}`)
        return []
      }
      return response.json()
    } catch (err) {
      console.warn('Error al consumir getTablaVue para enriquecer historial:', err)
      return []
    }
  }

  private buildTranscripcionMap(records: ApiTablaRecord[]): Map<string, string> {
    const map = new Map<string, string>()

    const sorted = [...records].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )

    for (const record of sorted) {
      if (record.transcripcion && record.transcripcion.trim().length > 0) {
        if (!map.has(record.clientId)) {
          map.set(record.clientId, record.transcripcion)
        }
      }
    }

    return map
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
