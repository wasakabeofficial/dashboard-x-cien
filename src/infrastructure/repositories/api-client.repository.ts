import type { ClientRepository } from '@/domain/repositories/client-repository.interface'
import type { ClientEntity } from '@/domain/entities/client.entity'

interface ApiContacto {
  row_number: number
  'ID Cliente': number
  'Nombre Empresa': string
  'Contacto Principal': string
  'Teléfono': number
  'Correo': string
  'Tipo de Servicio': string
  'Velocidad': string
  'Medio': string
  'Plan': string
  'CPE – Marca/Modelo': string
  'Dirección': string
  'Ciudad': string
  'RFC': string
  'Estado de Cuenta': string
  'Fecha Alta': string
  'Observaciones': string
}

export class ApiClientRepository implements ClientRepository {
  private readonly apiUrl = import.meta.env.VITE_API_CLIENTS_URL

  private getUrl(): string {
    if (!this.apiUrl) {
      throw new Error(
        'Falta VITE_API_CLIENTS_URL en el archivo .env. Copia .env.example como .env y completa las variables.',
      )
    }
    return this.apiUrl
  }

  async getAll(): Promise<ClientEntity[]> {
    const response = await fetch(this.getUrl())

    if (!response.ok) {
      throw new Error(`Error al obtener clientes: ${response.status} ${response.statusText}`)
    }

    const data: ApiContacto[] = await response.json()
    return data.map((item) => this.mapToEntity(item))
  }

  async getById(id: string): Promise<ClientEntity | null> {
    const clients = await this.getAll()
    return clients.find((c) => c.id === id) ?? null
  }

  async search(query: string): Promise<ClientEntity[]> {
    const clients = await this.getAll()
    const term = query.toLowerCase()
    return clients.filter(
      (c) =>
        c.name.toLowerCase().includes(term) ||
        c.contactoPrincipal.toLowerCase().includes(term) ||
        c.folio.toLowerCase().includes(term) ||
        c.email.toLowerCase().includes(term),
    )
  }


  private mapToEntity(item: ApiContacto): ClientEntity {
    const nombreEmpresa = item['Nombre Empresa'] || 'Sin nombre'

    return {
      id: String(item['ID Cliente']),
      name: nombreEmpresa,
      contactoPrincipal: item['Contacto Principal'] || '—',
      phone: this.formatPhone(item['Teléfono']),
      email: item['Correo'] || '',
      folio: `#CL-${item['ID Cliente']}`,
      date: this.formatDate(item['Fecha Alta']),
      initials: this.getInitials(nombreEmpresa),
      situation: this.mapSituation(item['Tipo de Servicio']),
      status: this.mapStatus(item['Estado de Cuenta']),
      tipoServicio: item['Tipo de Servicio'] || '—',
      velocidad: item['Velocidad'] || '—',
      medio: item['Medio'] || '—',
      plan: item['Plan'] || '—',
      cpe: item['CPE – Marca/Modelo'] || '—',
      direccion: item['Dirección'] || '—',
      ciudad: item['Ciudad'] || '—',
      rfc: item['RFC'] || '—',
      observaciones: item['Observaciones'] || '—',
    }
  }

  private getInitials(name: string): string {
    return name
      .split(' ')
      .filter((w) => w.length > 2)
      .slice(0, 2)
      .map((w) => w[0])
      .join('')
      .toUpperCase()
      .slice(0, 2) || '--'
  }

  private mapSituation(tipoServicio: string): 'Residencial' | 'Empresarial' {
    const tipo = (tipoServicio || '').toLowerCase()
    if (tipo.includes('pyme') || tipo.includes('básico') || tipo.includes('comercial')) {
      return 'Residencial'
    }
    return 'Empresarial'
  }

  private mapStatus(estadoCuenta: string): 'Activo' | 'Inactivo' {
    const estado = (estadoCuenta || '').toLowerCase()
    return estado.includes('adeudo') || estado.includes('vencido') ? 'Inactivo' : 'Activo'
  }

  private formatDate(fechaAlta: string): string {
    if (!fechaAlta) return '—'
    try {
      const date = new Date(fechaAlta)
      return date.toLocaleDateString('es-MX', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      })
    } catch {
      return fechaAlta
    }
  }

  private formatPhone(phone: number): string {
    if (!phone) return '—'
    const str = String(phone)
    if (str.length === 12 && str.startsWith('52')) {
      return `+${str.slice(0, 2)} ${str.slice(2, 4)} ${str.slice(4, 8)} ${str.slice(8)}`
    }
    return `+${str}`
  }
}
