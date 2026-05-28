import type { ClientEntity } from '@/domain/entities/client.entity'

/**
 * Puerto (interfaz) del repositorio de clientes.
 * Define el contrato que cualquier implementación debe cumplir.
 * Principio: Dependency Inversion — las capas superiores dependen de esta abstracción.
 */
export interface ClientRepository {
  /** Obtiene todos los clientes */
  getAll(): Promise<ClientEntity[]>

  /** Obtiene un cliente por su ID */
  getById(id: string): Promise<ClientEntity | null>

  /** Busca clientes por término de búsqueda */
  search(query: string): Promise<ClientEntity[]>
}
