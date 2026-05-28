import type { ClientRepository } from '@/domain/repositories/client-repository.interface'
import type { ClientEntity } from '@/domain/entities/client.entity'

/**
 * Implementación mock del repositorio de clientes.
 * Principio LSP — es sustituible por cualquier otra implementación de ClientRepository.
 * Principio DIP — implementa una abstracción (ClientRepository), no al revés.
 */
export class MockClientRepository implements ClientRepository {
  private readonly clients: ClientEntity[] = [
    {
      folio: '#FL-8902',
      id: 'CLT-4491',
      date: '12/Oct/2023',
      name: 'Ricardo Cantú',
      initials: 'RC',
      situation: 'Residencial',
      status: 'Activo',
      phone: '+52 55 1234 5678',
      email: 'r.cantu@email.com',
    },
    {
      folio: '#FL-8903',
      id: 'CLT-4492',
      date: '11/Oct/2023',
      name: 'María Sánchez',
      initials: 'MS',
      situation: 'Empresarial',
      status: 'Inactivo',
      phone: '+52 81 9876 5432',
      email: 'm.sanchez@corp.com',
    },
    {
      folio: '#FL-8904',
      id: 'CLT-4493',
      date: '11/Oct/2023',
      name: 'Arturo Alarcón',
      initials: 'AA',
      situation: 'Residencial',
      status: 'Activo',
      phone: '+52 33 2211 4455',
      email: 'arturo.a@gmail.com',
    },
    {
      folio: '#FL-8905',
      id: 'CLT-4494',
      date: '10/Oct/2023',
      name: 'Lucía Garza',
      initials: 'LG',
      situation: 'Residencial',
      status: 'Activo',
      phone: '+52 81 4455 6677',
      email: 'l.garza@email.com',
    },
    {
      folio: '#FL-8906',
      id: 'CLT-4495',
      date: '10/Oct/2023',
      name: 'Carlos Mendoza',
      initials: 'CM',
      situation: 'Empresarial',
      status: 'Activo',
      phone: '+52 55 9988 7766',
      email: 'c.mendoza@empresa.com',
    },
    {
      folio: '#FL-8907',
      id: 'CLT-4496',
      date: '09/Oct/2023',
      name: 'Ana Torres',
      initials: 'AT',
      situation: 'Residencial',
      status: 'Inactivo',
      phone: '+52 81 3344 5566',
      email: 'ana.torres@mail.com',
    },
  ]

  async getAll(): Promise<ClientEntity[]> {
    // Simula latencia de red
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
        c.folio.toLowerCase().includes(term) ||
        c.email.toLowerCase().includes(term),
    )
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms))
  }
}
