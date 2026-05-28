<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  data: unknown[]
  loading?: boolean
  emptyMessage?: string
  emptyIcon?: string
  totalRecords?: number
  currentPage?: number
  totalPages?: number
  pageSize?: number
}>()

const emit = defineEmits<{
  'go-to-page': [page: number]
}>()

const hasData = computed(() => props.data.length > 0)
const showPagination = computed(() => props.totalRecords !== undefined)

function goToPage(page: number): void {
  if (page < 1 || (props.totalPages && page > props.totalPages)) return
  emit('go-to-page', page)
}
</script>

<template>
  <section
    class="bg-surface-container-lowest rounded-xl border border-outline-variant flex flex-col h-160"
  >
    <!-- Loading -->
    <div
      v-if="loading"
      class="flex-1 flex items-center justify-center text-on-surface-variant"
    >
      <span class="material-symbols-outlined animate-spin mr-2">sync</span>
      Cargando...
    </div>

    <!-- Table content -->
    <template v-else>
      <div class="flex-1 overflow-y-auto">
        <div v-if="hasData" class="min-w-0 overflow-x-auto">
          <table class="w-full text-left border-collapse min-w-150">
            <thead class="sticky top-0 z-10">
              <tr class="bg-surface-container-low border-b border-outline-variant">
                <slot name="columns" />
              </tr>
            </thead>
            <tbody class="font-table-data text-table-data divide-y divide-outline-variant">
              <slot name="rows" :data="data" />
            </tbody>
          </table>
        </div>

        <!-- Empty State -->
        <div
          v-else
          class="flex flex-col items-center justify-center h-full text-on-surface-variant"
        >
          <span class="material-symbols-outlined text-4xl mb-md">{{ emptyIcon || 'table_rows' }}</span>
          <p class="font-body-md text-body-md">{{ emptyMessage || 'No hay registros para mostrar' }}</p>
        </div>
      </div>

      <!-- Footer -->
      <div
        class="px-xl py-md bg-surface-container-low/50 border-t border-outline-variant flex items-center justify-between shrink-0"
      >
        <p class="text-body-sm text-on-surface-variant">
          <template v-if="hasData && totalRecords !== undefined">
            Mostrando 1 a {{ Math.min(pageSize ?? totalRecords, totalRecords) }} de
            {{ totalRecords }} registros
          </template>
          <template v-else-if="hasData">
            {{ data.length }} {{ data.length === 1 ? 'registro' : 'registros' }} en total
          </template>
          <template v-else>
            Sin registros
          </template>
        </p>

        <!-- Paginación (solo si se proporcionan props de paginación) -->
        <div
          v-if="showPagination && hasData && totalPages && totalPages > 0"
          class="flex items-center gap-sm"
        >
          <button
            class="w-8 h-8 flex items-center justify-center rounded border border-outline-variant hover:bg-surface-container-high disabled:opacity-50 transition-all"
            :disabled="currentPage === 1"
            @click="goToPage((currentPage ?? 1) - 1)"
          >
            <span class="material-symbols-outlined text-[18px]">chevron_left</span>
          </button>

          <div class="flex items-center gap-xs">
            <template v-for="page in totalPages" :key="page">
              <button
                v-if="page === 1 || page === totalPages || Math.abs(page - (currentPage ?? 1)) <= 1"
                :class="
                  page === currentPage
                    ? 'w-8 h-8 flex items-center justify-center rounded bg-primary text-on-primary font-label-md text-xs'
                    : 'w-8 h-8 flex items-center justify-center rounded border border-outline-variant hover:bg-surface-container-high font-label-md text-xs'
                "
                @click="goToPage(page)"
              >
                {{ page }}
              </button>
              <span
                v-else-if="page === (currentPage ?? 1) - 2 || page === (currentPage ?? 1) + 2"
                class="text-on-surface-variant"
                >...</span
              >
            </template>
          </div>

          <button
            class="w-8 h-8 flex items-center justify-center rounded border border-outline-variant hover:bg-surface-container-high transition-all"
            :disabled="currentPage === totalPages"
            @click="goToPage((currentPage ?? 1) + 1)"
          >
            <span class="material-symbols-outlined text-[18px]">chevron_right</span>
          </button>
        </div>
      </div>
    </template>
  </section>
</template>
