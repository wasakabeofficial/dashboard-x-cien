import type { ClientEntity } from '@/domain/entities/client.entity'

export interface ClientRepository {
  getAll(): Promise<ClientEntity[]>
  getById(id: string): Promise<ClientEntity | null>
  search(query: string): Promise<ClientEntity[]>
}
