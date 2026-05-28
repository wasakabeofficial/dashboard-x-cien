import type { ClientRepository } from '@/domain/repositories/client-repository.interface'
import type { ClientEntity } from '@/domain/entities/client.entity'

/**
 * Caso de uso: Obtener clientes.
 *
 * Responsabilidad única: orquestar la obtención de datos de clientes.
 * Principio SRP — solo cambia si cambia la lógica de "cómo obtener clientes".
 * Principio DIP — depende de ClientRepository (abstracción), no de una fuente concreta.
 * Principio OCP — abierto a extensión (ej. filtros, paginación) sin modificar la clase base.
 */
export class GetClientsUseCase {
  constructor(private readonly clientRepository: ClientRepository) {}

  async execute(): Promise<ClientEntity[]> {
    return this.clientRepository.getAll()
  }

  async search(query: string): Promise<ClientEntity[]> {
    return this.clientRepository.search(query)
  }

  async getById(id: string): Promise<ClientEntity | null> {
    return this.clientRepository.getById(id)
  }
}
