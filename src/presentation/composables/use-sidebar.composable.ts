import { ref } from 'vue'

const isOpen = ref(false)
const isExpanded = ref(true)

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

  function expand(): void {
    isExpanded.value = true
  }

  function collapse(): void {
    isExpanded.value = false
  }

  function toggleExpand(): void {
    isExpanded.value = !isExpanded.value
  }

  return { isOpen, isExpanded, open, close, toggle, expand, collapse, toggleExpand }
}
