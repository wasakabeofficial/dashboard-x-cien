import { ref } from 'vue'

/** Estado global compartido del sidebar (responsivo) */
const isOpen = ref(false)

export function useSidebar() {
  function open(): void {
    isOpen.value = true
  }

  function close(): void {
    isOpen.value = false
  }

  function toggle(): void {
    isOpen.value = !isOpen.value
  }

  return { isOpen, open, close, toggle }
}
