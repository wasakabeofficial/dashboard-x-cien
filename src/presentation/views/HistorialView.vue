<script setup lang="ts">
import { useHistorial } from '@/presentation/composables/use-historial.composable'
import HistorialTable from '@/presentation/components/dashboard/HistorialTable.vue'

const { entries, loading, error } = useHistorial()
</script>

<template>
  <div class="p-md lg:p-xl space-y-xl">
    <!-- Page Header -->
    <div class="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-md">
      <div>
        <h2 class="font-headline-md text-headline-md text-primary">Historial de Incidencias</h2>
        <p class="text-on-surface-variant font-body-md text-body-md">
          Registro completo de incidentes, soporte y seguimiento
        </p>
      </div>
    </div>

    <!-- Loading -->
    <div
      v-if="loading"
      class="flex items-center justify-center py-12 text-on-surface-variant"
    >
      <span class="material-symbols-outlined animate-spin mr-2">sync</span>
      Cargando historial...
    </div>

    <!-- Error -->
    <div
      v-else-if="error"
      class="bg-error-container text-on-error-container p-xl rounded-xl flex items-center gap-md"
    >
      <span class="material-symbols-outlined">error</span>
      <span>{{ error }}</span>
    </div>

    <!-- Table -->
    <HistorialTable v-else :entries="entries" />
  </div>
</template>
