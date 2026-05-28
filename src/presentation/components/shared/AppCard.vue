<script setup lang="ts">
defineProps<{
  padding?: 'md' | 'lg'
}>()

const paddingClass = 'p-md lg:p-xl'
</script>

<template>
  <div
    :class="[
      'bg-surface-container-lowest rounded-2xl border border-outline-variant/60',
      'shadow-[0_1px_3px_rgba(0,0,0,0.04),0_1px_2px_rgba(0,0,0,0.06)]',
      'hover:shadow-[0_4px_12px_rgba(0,0,0,0.08),0_2px_4px_rgba(0,0,0,0.04)]',
      'transition-all duration-300 ease-out',
      paddingClass,
    ]"
  >
    <slot name="header" />
    <slot />
  </div>
</template>
