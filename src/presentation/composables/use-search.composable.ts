import { ref } from 'vue'

/**
 * Búsqueda global compartida entre TopNav y las vistas.
 * Singleton — el estado se mantiene a nivel de módulo.
 */
const query = ref('')

export function useSearch() {
  function setQuery(q: string): void {
    query.value = q
  }

  function clear(): void {
    query.value = ''
  }

  return { query, setQuery, clear }
}
