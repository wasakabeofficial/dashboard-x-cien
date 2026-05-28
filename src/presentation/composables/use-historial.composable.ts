import { ref, computed, inject, onMounted } from 'vue'
import { GET_HISTORIAL_USE_CASE } from '@/presentation/di-keys'
import type { HistorialEntryEntity } from '@/domain/entities/historial.entity'

/**
 * Composable: Gestión del historial de incidencias.
 *
 * Responsabilidad única: exponer estado reactivo del historial.
 * Principio DIP — recibe el caso de uso por inyección de dependencias (Vue provide/inject),
 *               no lo busca en infraestructura.
 */
export function useHistorial() {
  const allEntries = ref<HistorialEntryEntity[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  const searchQuery = ref('')

  // Inyectado desde App.vue — Clean Architecture DIP respetado
  const getHistorial = inject(GET_HISTORIAL_USE_CASE)!

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
      allEntries.value = await getHistorial.execute()
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Error al cargar historial'
    } finally {
      loading.value = false
    }
  }

  async function getEntryByFolio(folio: string): Promise<HistorialEntryEntity | null> {
    return getHistorial.getByFolio(folio)
  }

  async function searchHistorial(query: string): Promise<void> {
    searchQuery.value = query
    if (!query.trim()) {
      await load()
      return
    }
    loading.value = true
    try {
      allEntries.value = await getHistorial.search(query)
    } finally {
      loading.value = false
    }
  }

  onMounted(load)

  return { entries, loading, error, load, getEntryByFolio, searchHistorial, searchQuery }
}
