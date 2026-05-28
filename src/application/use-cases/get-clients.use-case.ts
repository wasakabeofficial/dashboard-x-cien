import type { ClientRepository } from '@/domain/repositories/client-repository.interface'
import type { ClientEntity } from '@/domain/entities/client.entity'

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
