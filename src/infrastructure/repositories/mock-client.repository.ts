import type { ClientRepository } from '@/domain/repositories/client-repository.interface'
import type { ClientEntity } from '@/domain/entities/client.entity'

/**
 * Implementación mock del repositorio de clientes.
 * Se mantiene para propósitos de testing o fallback.
 */
export class MockClientRepository implements ClientRepository {
  private readonly clients: ClientEntity[] = [
    {
      id: '4491',
      name: 'Ricardo Cantú',
      contactoPrincipal: 'Ricardo Cantú',
      phone: '+52 55 1234 5678',
      email: 'r.cantu@email.com',
      folio: '#FL-8902',
      date: '12 oct 2022',
      initials: 'RC',
      situation: 'Residencial',
      status: 'Activo',
      tipoServicio: 'Internet PYME Fibra',
      velocidad: '200 Mbps simétrico',
      medio: 'Fibra óptica',
      plan: 'PYME Fiber 200',
      cpe: 'MikroTik hEX S',
      direccion: 'Calle Principal 123',
      ciudad: 'Monterrey, NL',
      rfc: 'XXX000101XXX',
      observaciones: 'Cliente regular',
    },
    {
      id: '4492',
      name: 'María Sánchez',
      contactoPrincipal: 'María Sánchez',
      phone: '+52 81 9876 5432',
      email: 'm.sanchez@corp.com',
      folio: '#FL-8903',
      date: '11 oct 2022',
      initials: 'MS',
      situation: 'Empresarial',
      status: 'Inactivo',
      tipoServicio: 'Internet Dedicado Empresarial',
      velocidad: '1 Gbps simétrico',
      medio: 'Fibra óptica',
      plan: 'Enterprise Fiber 1G',
      cpe: 'Cisco ISR 4321',
      direccion: 'Av. Empresarial 500',
      ciudad: 'San Pedro, NL',
      rfc: 'YYY000202YYY',
      observaciones: 'Adeudo pendiente',
    },
  ]

  async getAll(): Promise<ClientEntity[]> {
    await this.delay(200)
    return [...this.clients]
  }

  async getById(id: string): Promise<ClientEntity | null> {
    await this.delay(100)
    return this.clients.find((c) => c.id === id) ?? null
  }

  async search(query: string): Promise<ClientEntity[]> {
    await this.delay(150)
    const term = query.toLowerCase()
    return this.clients.filter(
      (c) =>
        c.name.toLowerCase().includes(term) ||
        c.contactoPrincipal.toLowerCase().includes(term) ||
        c.folio.toLowerCase().includes(term) ||
        c.email.toLowerCase().includes(term),
    )
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms))
  }
}
