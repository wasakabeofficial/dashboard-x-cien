<script setup lang="ts">
import { useHistorial } from '@/presentation/composables/use-historial.composable'

const { entries, loading, error } = useHistorial()

function getEstadoClass(estado: string): string {
  switch (estado) {
    case 'soporte_insuficiente':
      return 'bg-error/10 text-error border-error/30'
    case 'resuelto':
      return 'bg-on-tertiary-container/10 text-on-tertiary-container border-on-tertiary-container/30'
    case 'en_proceso':
      return 'bg-tertiary-fixed/50 text-on-tertiary-fixed border-tertiary-fixed'
    default:
      return 'bg-surface-variant text-on-surface-variant border-outline-variant'
  }
}

function formatEstado(estado: string): string {
  switch (estado) {
    case 'soporte_insuficiente':
      return 'Soporte Insuficiente'
    case 'resuelto':
      return 'Resuelto'
    case 'en_proceso':
      return 'En Proceso'
    default:
      return estado
  }
}
</script>

<template>
  <div class="p-xl space-y-xl">
    <!-- Page Header -->
    <div class="flex justify-between items-end">
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

    <!-- Cards -->
    <template v-else-if="entries.length > 0">
      <div class="grid grid-cols-1 gap-xl">
        <div
          v-for="entry in entries"
          :key="entry.folio"
          class="bg-surface-container-lowest rounded-xl border border-outline-variant overflow-hidden hover:shadow-md transition-shadow"
        >
          <!-- Card Header -->
          <div
            class="px-xl py-md bg-surface-container-low/50 border-b border-outline-variant flex items-center justify-between"
          >
            <div class="flex items-center gap-md">
              <span
                class="px-sm py-0.5 rounded text-xs font-label-md bg-primary-fixed-dim text-on-primary-fixed"
              >
                {{ entry.folio }}
              </span>
              <span class="font-label-md text-label-md text-on-surface-variant">
                {{ entry.fecha }}
              </span>
            </div>
            <span
              :class="`px-md py-xs rounded-full border text-xs font-label-md ${getEstadoClass(entry.estado)}`"
            >
              {{ formatEstado(entry.estado) }}
            </span>
          </div>

          <!-- Card Body -->
          <div class="p-xl space-y-md">
            <!-- Titular -->
            <div class="flex items-center gap-sm">
              <span class="material-symbols-outlined text-on-surface-variant text-[18px]">
                person
              </span>
              <span class="font-semibold text-primary">{{ entry.nombreTitular }}</span>
              <span class="text-body-sm text-on-surface-variant">
                (ID: {{ entry.idCliente }})
              </span>
            </div>

            <!-- Categoría Técnica -->
            <div
              class="inline-flex items-center gap-xs px-md py-xs rounded-full bg-secondary-container/50 text-on-secondary-container text-xs font-label-md"
            >
              <span class="material-symbols-outlined text-[14px]">build</span>
              {{ entry.categoriaTecnica }}
            </div>

            <!-- Situación (descripción) -->
            <p class="text-body-md text-body-md text-on-surface leading-relaxed">
              {{ entry.situacion }}
            </p>

            <!-- Contacto -->
            <div class="flex items-center gap-xl pt-sm border-t border-outline-variant/50">
              <div class="flex items-center gap-xs text-body-sm text-on-surface-variant">
                <span class="material-symbols-outlined text-[14px]">call</span>
                {{ entry.telefono }}
              </div>
              <div class="flex items-center gap-xs text-body-sm text-on-surface-variant">
                <span class="material-symbols-outlined text-[14px]">mail</span>
                {{ entry.correo }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>

    <!-- Empty -->
    <div
      v-else
      class="flex flex-col items-center justify-center py-16 text-on-surface-variant"
    >
      <span class="material-symbols-outlined text-5xl mb-md">history</span>
      <p class="font-body-md text-body-md">No hay registros de historial</p>
    </div>
  </div>
</template>
