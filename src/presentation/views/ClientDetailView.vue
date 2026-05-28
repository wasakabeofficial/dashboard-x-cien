<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useClients } from '@/presentation/composables/use-clients.composable'
import type { ClientEntity } from '@/domain/entities/client.entity'

const route = useRoute()
const router = useRouter()
const { getClientById } = useClients()

const client = ref<ClientEntity | null>(null)
const loading = ref(true)
const error = ref<string | null>(null)

onMounted(async () => {
  const id = route.params.id as string
  if (!id) {
    error.value = 'ID de cliente no válido'
    loading.value = false
    return
  }

  try {
    client.value = await getClientById(id)
    if (!client.value) {
      error.value = 'Cliente no encontrado'
    }
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Error al cargar el cliente'
  } finally {
    loading.value = false
  }
})

function goBack(): void {
  router.back()
}

function getStatusBadgeClass(status: string): string {
  return status === 'Activo'
    ? 'bg-on-tertiary-container/10 text-on-tertiary-container border-on-tertiary-container/30'
    : 'bg-error/10 text-error border-error/30'
}
</script>

<template>
  <div class="p-md lg:p-xl space-y-xl">
    <!-- Header con botón volver -->
    <div class="flex items-center gap-md">
      <button
        class="p-sm rounded-lg border border-outline-variant hover:bg-surface-container-low transition-all shrink-0"
        @click="goBack"
      >
        <span class="material-symbols-outlined">arrow_back</span>
      </button>
      <div class="min-w-0">
        <h2 class="font-headline-md text-headline-md text-primary truncate">Detalle del Cliente</h2>
        <p class="text-on-surface-variant font-body-md text-body-md truncate">
          Información completa del registro
        </p>
      </div>
    </div>

    <!-- Loading -->
    <div
      v-if="loading"
      class="flex items-center justify-center py-12 text-on-surface-variant"
    >
      <span class="material-symbols-outlined animate-spin mr-2">sync</span>
      Cargando detalle del cliente...
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
    <div
      v-else-if="client"
      class="max-w-4xl mx-auto space-y-xl"
    >
      <!-- Identity Header -->
      <div
        class="bg-surface-container-lowest p-xl rounded-xl border border-outline-variant"
      >
        <div class="flex items-start justify-between mb-xl">
          <div class="flex items-center gap-md">
            <div
              class="w-16 h-16 rounded-full bg-secondary-fixed-dim text-lg flex items-center justify-center font-bold"
            >
              {{ client.initials }}
            </div>
            <div>
              <h3 class="font-headline-sm text-headline-sm text-primary">
                {{ client.name }}
              </h3>
              <p class="text-on-surface-variant font-body-md">{{ client.folio }}</p>
            </div>
          </div>
          <div class="flex items-center gap-sm">
            <span
              :class="`px-md py-xs rounded-full border text-xs font-label-md ${getStatusBadgeClass(client.status)}`"
            >
              {{ client.status }}
            </span>
            <span
              class="px-md py-xs rounded-full bg-secondary-container text-on-secondary-container text-xs font-label-md"
            >
              {{ client.situation }}
            </span>
          </div>
        </div>

        <!-- Detail Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-xl">
          <!-- Contacto -->
          <div>
            <p class="font-label-md text-label-md text-on-surface-variant mb-xs">
              Contacto Principal
            </p>
            <p class="font-body-md text-body-md text-primary">
              {{ client.contactoPrincipal }}
            </p>
          </div>

          <!-- Teléfono -->
          <div>
            <p class="font-label-md text-label-md text-on-surface-variant mb-xs">
              Teléfono
            </p>
            <p class="font-body-md text-body-md text-primary font-mono">
              {{ client.phone }}
            </p>
          </div>

          <!-- Correo -->
          <div>
            <p class="font-label-md text-label-md text-on-surface-variant mb-xs">
              Correo Electrónico
            </p>
            <p class="font-body-md text-body-md text-primary break-all">
              {{ client.email }}
            </p>
          </div>

          <!-- Fecha de Alta -->
          <div>
            <p class="font-label-md text-label-md text-on-surface-variant mb-xs">
              Fecha de Alta
            </p>
            <p class="font-body-md text-body-md text-primary">
              {{ client.date }}
            </p>
          </div>

          <!-- RFC -->
          <div>
            <p class="font-label-md text-label-md text-on-surface-variant mb-xs">RFC</p>
            <p class="font-body-md text-body-md text-primary font-mono">
              {{ client.rfc }}
            </p>
          </div>

        </div>
      </div>

      <!-- Service Details -->
      <div
        class="bg-surface-container-lowest p-xl rounded-xl border border-outline-variant"
      >
        <h4 class="font-headline-sm text-headline-sm text-primary mb-xl">
          Detalles del Servicio
        </h4>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-xl">
          <div>
            <p class="font-label-md text-label-md text-on-surface-variant mb-xs">
              Tipo de Servicio
            </p>
            <p class="font-body-md text-body-md text-primary">
              {{ client.tipoServicio }}
            </p>
          </div>
          <div>
            <p class="font-label-md text-label-md text-on-surface-variant mb-xs">
              Velocidad
            </p>
            <p class="font-body-md text-body-md text-primary">
              {{ client.velocidad }}
            </p>
          </div>
          <div>
            <p class="font-label-md text-label-md text-on-surface-variant mb-xs">Medio</p>
            <p class="font-body-md text-body-md text-primary">
              {{ client.medio }}
            </p>
          </div>
          <div>
            <p class="font-label-md text-label-md text-on-surface-variant mb-xs">Plan</p>
            <p class="font-body-md text-body-md text-primary">
              {{ client.plan }}
            </p>
          </div>
          <div class="md:col-span-2">
            <p class="font-label-md text-label-md text-on-surface-variant mb-xs">
              CPE – Marca/Modelo
            </p>
            <p class="font-body-md text-body-md text-primary">
              {{ client.cpe }}
            </p>
          </div>
        </div>
      </div>

      <!-- Location -->
      <div
        class="bg-surface-container-lowest p-xl rounded-xl border border-outline-variant"
      >
        <h4 class="font-headline-sm text-headline-sm text-primary mb-xl">Ubicación</h4>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-xl">
          <div>
            <p class="font-label-md text-label-md text-on-surface-variant mb-xs">
              Dirección
            </p>
            <p class="font-body-md text-body-md text-primary">
              {{ client.direccion }}
            </p>
          </div>
          <div>
            <p class="font-label-md text-label-md text-on-surface-variant mb-xs">Ciudad</p>
            <p class="font-body-md text-body-md text-primary">
              {{ client.ciudad }}
            </p>
          </div>
        </div>
      </div>

      <!-- Observations -->
      <div
        v-if="client.observaciones && client.observaciones !== '—'"
        class="bg-surface-container-lowest p-xl rounded-xl border border-outline-variant"
      >
        <h4 class="font-headline-sm text-headline-sm text-primary mb-xl">
          Observaciones
        </h4>
        <p class="font-body-md text-body-md text-on-surface">
          {{ client.observaciones }}
        </p>
      </div>
    </div>
  </div>
</template>
