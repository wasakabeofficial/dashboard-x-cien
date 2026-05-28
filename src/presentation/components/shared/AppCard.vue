<script setup lang="ts">
/**
 * AppCard — Contenedor reutilizable de tarjeta con estilo consistente.
 *
 * Uso:
 *   <AppCard>
 *     <template #header>...</template>
 *     <template #default>...</template>
 *   </AppCard>
 */

defineProps<{
  /** Clases adicionales para personalizar */
  padding?: 'md' | 'lg'
}>()

const paddingClass = 'p-md lg:p-xl'
</script>

<template>
  <div
    :class="[
      'bg-surface-container-lowest rounded-xl border border-outline-variant',
      paddingClass,
    ]"
  >
    <slot name="header" />
    <slot />
  </div>
</template>
