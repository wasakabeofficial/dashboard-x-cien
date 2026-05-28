import { ref, onMounted } from 'vue'
import { serviceLocator } from '@/infrastructure/di/service-locator'
import type { HistorialEntryEntity } from '@/domain/entities/historial.entity'

export function useHistorial() {
  const entries = ref<HistorialEntryEntity[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function load(): Promise<void> {
    loading.value = true
    error.value = null
    try {
      const useCase = serviceLocator.getHistorial()
      entries.value = await useCase.execute()
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

  onMounted(load)

  return { entries, loading, error, load, getEntryByFolio }
}
