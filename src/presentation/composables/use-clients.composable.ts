import { ref, computed, inject, onMounted } from 'vue'
import { GET_CLIENTS_USE_CASE } from '@/presentation/di-keys'
import type { ClientEntity } from '@/domain/entities/client.entity'

/**
 * Composable: Gestión de clientes en la UI.
 *
 * Responsabilidad única: exponer estado reactivo de clientes para la capa de presentación.
 * Principio DIP — recibe el caso de uso por inyección de dependencias (Vue provide/inject),
 *               no lo busca en infraestructura.
 */
export function useClients(pageSize = 4) {
  const clients = ref<ClientEntity[]>([])
  const loading = ref(false)
  const currentPage = ref(1)
  const searchQuery = ref('')

  // Inyectado desde App.vue — Clean Architecture DIP respetado
  const getClients = inject(GET_CLIENTS_USE_CASE)!

  const totalRecords = computed(() => clients.value.length)

  const totalPages = computed(() => Math.max(1, Math.ceil(clients.value.length / pageSize)))

  const paginatedClients = computed(() => {
    const start = (currentPage.value - 1) * pageSize
    return clients.value.slice(start, start + pageSize)
  })

  async function loadClients(): Promise<void> {
    loading.value = true
    try {
      clients.value = await getClients.execute()
    } finally {
      loading.value = false
    }
  }

  async function searchClients(query: string): Promise<void> {
    searchQuery.value = query
    if (!query.trim()) {
      await loadClients()
      return
    }
    loading.value = true
    try {
      clients.value = await getClients.search(query)
    } finally {
      loading.value = false
    }
    currentPage.value = 1
  }

  function goToPage(page: number): void {
    if (page >= 1 && page <= totalPages.value) {
      currentPage.value = page
    }
  }

  /**
   * Obtiene un cliente por su ID (para la vista de detalle).
   */
  async function getClientById(id: string): Promise<ClientEntity | null> {
    return getClients.getById(id)
  }

  onMounted(loadClients)

  return {
    clients,
    loading,
    currentPage,
    totalPages,
    totalRecords,
    paginatedClients,
    searchQuery,
    searchClients,
    goToPage,
    loadClients,
    getClientById,
  }
}
