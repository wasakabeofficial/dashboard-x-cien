import { ref } from 'vue'

/** Estado global compartido para el modal de descarga de reportes */
const isOpen = ref(false)

export function useReportModal() {
  function open(): void {
    isOpen.value = true
  }

  function close(): void {
    isOpen.value = false
  }

  return { isOpen, open, close }
}
