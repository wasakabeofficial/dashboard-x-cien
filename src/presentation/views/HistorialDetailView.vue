<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useHistorial } from '@/presentation/composables/use-historial.composable'
import type { HistorialEntryEntity } from '@/domain/entities/historial.entity'

const route = useRoute()
const router = useRouter()
const { getEntryByFolio } = useHistorial()

const entry = ref<HistorialEntryEntity | null>(null)
const loading = ref(true)
const error = ref<string | null>(null)

const folio = route.params.folio as string

onMounted(async () => {
  try {
    entry.value = await getEntryByFolio(folio)
    if (!entry.value) {
      error.value = `No se encontró el registro con folio "${folio}"`
    }
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Error al cargar el detalle'
  } finally {
    loading.value = false
  }
})

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

function goBack(): void {
  router.push('/historial')
}
</script>

<template>
  <div class="p-xl space-y-xl">
    <!-- Header -->
    <div class="flex items-center gap-lg">
      <button
        class="flex items-center gap-xs text-on-surface-variant hover:text-primary transition-colors font-body-md text-body-md"
        @click="goBack"
      >
        <span class="material-symbols-outlined">arrow_back</span>
        Volver al historial
      </button>
    </div>

    <!-- Loading -->
    <div
      v-if="loading"
      class="flex items-center justify-center py-12 text-on-surface-variant"
    >
      <span class="material-symbols-outlined animate-spin mr-2">sync</span>
      Cargando detalle...
    </div>

    <!-- Error -->
    <div
      v-else-if="error"
      class="bg-error-container text-on-error-container p-xl rounded-xl flex items-center gap-md"
    >
      <span class="material-symbols-outlined">error</span>
      <span>{{ error }}</span>
    </div>

    <!-- Detail Card -->
    <div v-else-if="entry" class="max-w-3xl space-y-lg">
      <!-- Title section -->
      <div
        class="bg-surface-container-lowest rounded-xl border border-outline-variant p-xl space-y-lg"
      >
        <div class="flex items-start justify-between">
          <div>
            <h2 class="font-headline-md text-headline-md text-primary">
              Incidencia {{ entry.folio }}
            </h2>
            <p class="text-on-surface-variant font-body-md text-body-md">
              {{ entry.fecha }}
            </p>
          </div>
          <span
            :class="`inline-block px-md py-xs rounded-full border text-xs font-label-md ${getEstadoClass(entry.estado)}`"
          >
            {{ formatEstado(entry.estado) }}
          </span>
        </div>
      </div>

      <!-- Info Grid -->
      <div
        class="bg-surface-container-lowest rounded-xl border border-outline-variant p-xl space-y-lg"
      >
        <h3 class="font-title-md text-title-md text-on-surface/80 pb-sm border-b border-outline-variant/50">
          Información General
        </h3>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-x-xl gap-y-lg">
          <div>
            <p class="font-label-md text-label-md text-on-surface-variant mb-xs">Folio</p>
            <p class="font-body-md text-body-md text-on-surface font-semibold">{{ entry.folio }}</p>
          </div>
          <div>
            <p class="font-label-md text-label-md text-on-surface-variant mb-xs">Fecha</p>
            <p class="font-body-md text-body-md text-on-surface">{{ entry.fecha }}</p>
          </div>
          <div>
            <p class="font-label-md text-label-md text-on-surface-variant mb-xs">Titular</p>
            <p class="font-body-md text-body-md text-on-surface font-semibold">{{ entry.nombreTitular }}</p>
          </div>
          <div>
            <p class="font-label-md text-label-md text-on-surface-variant mb-xs">Categoría Técnica</p>
            <p class="font-body-md text-body-md text-on-surface">{{ entry.categoriaTecnica }}</p>
          </div>
          <div>
            <p class="font-label-md text-label-md text-on-surface-variant mb-xs">Estado</p>
            <p class="font-body-md text-body-md">
              <span
                :class="`inline-block px-md py-xs rounded-full border text-xs font-label-md ${getEstadoClass(entry.estado)}`"
              >
                {{ formatEstado(entry.estado) }}
              </span>
            </p>
          </div>
          <div>
            <p class="font-label-md text-label-md text-on-surface-variant mb-xs">Teléfono</p>
            <div class="flex items-center gap-xs">
              <span class="material-symbols-outlined text-on-surface-variant text-[14px]">call</span>
              <p class="font-body-md text-body-md text-on-surface">{{ entry.telefono }}</p>
            </div>
          </div>
          <div>
            <p class="font-label-md text-label-md text-on-surface-variant mb-xs">Correo</p>
            <div class="flex items-center gap-xs">
              <span class="material-symbols-outlined text-on-surface-variant text-[14px]">mail</span>
              <p class="font-body-md text-body-md text-on-surface">{{ entry.correo }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Situación (full width) -->
      <div
        class="bg-surface-container-lowest rounded-xl border border-outline-variant p-xl space-y-lg"
      >
        <h3 class="font-title-md text-title-md text-on-surface/80 pb-sm border-b border-outline-variant/50">
          Situación
        </h3>
        <p class="text-body-md text-body-md text-on-surface leading-relaxed whitespace-pre-wrap">
          {{ entry.situacion }}
        </p>
      </div>
    </div>
  </div>
</template>
