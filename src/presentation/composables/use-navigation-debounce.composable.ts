import { ref } from 'vue'
import { useRouter, type RouteLocationRaw } from 'vue-router'

/**
 * Evita llamadas repetidas a router.push en menos de `delay` ms.
 * Previene saturar el router con clics rápidos en filas de tabla.
 *
 * @param delay — ventana de tiempo en ms (por defecto 400ms)
 */
export function useNavigationDebounce(delay = 400) {
  const router = useRouter()
  const lastNavigation = ref(0)

  function push(to: RouteLocationRaw): void {
    const now = Date.now()
    if (now - lastNavigation.value < delay) return
    lastNavigation.value = now
    router.push(to)
  }

  return { push }
}
