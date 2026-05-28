import { ref, computed, onMounted } from 'vue'
import { serviceLocator } from '@/infrastructure/di/service-locator'
import type { HistorialEntryEntity } from '@/domain/entities/historial.entity'

export function useHistorial() {
  const allEntries = ref<HistorialEntryEntity[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  const searchQuery = ref('')

  const entries = computed(() => {
    if (!searchQuery.value.trim()) return allEntries.value
    const term = searchQuery.value.toLowerCase()
    return allEntries.value.filter(
      (e) =>
        e.folio.toLowerCase().includes(term) ||
        e.nombreTitular.toLowerCase().includes(term) ||
        e.categoriaTecnica.toLowerCase().includes(term) ||
        e.estado.toLowerCase().includes(term) ||
        e.telefono.includes(term) ||
        e.correo.toLowerCase().includes(term),
    )
  })

  async function load(): Promise<void> {
    loading.value = true
    error.value = null
    try {
      const useCase = serviceLocator.getHistorial()
      allEntries.value = await useCase.execute()
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Error al cargar historial'
    } finally {
      loading.value = false
    }
  }

  async function getEntryByFolio(folio: string): Promise<HistorialEntryEntity | null> {
    const useCase = serviceLocator.getHistorial()
    return useCase.getByFolio(folio)
  }

  async function searchHistorial(query: string): Promise<void> {
    searchQuery.value = query
    if (!query.trim()) {
      await load()
      return
    }
    loading.value = true
    try {
      const useCase = serviceLocator.getHistorial()
      allEntries.value = await useCase.search(query)
    } finally {
      loading.value = false
    }
  }

  onMounted(load)

  return { entries, loading, error, load, getEntryByFolio, searchHistorial, searchQuery }
}
