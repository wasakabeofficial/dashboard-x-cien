<script setup lang="ts">
import { ref } from 'vue'
import { useDashboard } from '@/presentation/composables/use-dashboard.composable'
import type { PeriodFilter } from '@/presentation/composables/use-dashboard.composable'
import KpiCard from '@/presentation/components/dashboard/KpiCard.vue'
import DistributionChart from '@/presentation/components/dashboard/DistributionChart.vue'

const {
  data: dashboardData,
  loading: dashboardLoading,
  error: dashboardError,
  periodFilter,
  validationTagFilter,
  setPeriodFilter,
  setValidationTagFilter,
  clearFilters,
} = useDashboard()

const showFilters = ref(false)

const periodOptions: { label: string; value: PeriodFilter }[] = [
  { label: 'Todo el período', value: 'all' },
  { label: 'Últimos 7 días', value: '7d' },
  { label: 'Últimos 30 días', value: '30d' },
  { label: 'Últimos 90 días', value: '90d' },
]

const validationTagOptions = [
  { label: 'Todas', value: 'all' },
  { label: 'Resuelto', value: 'resuelto' },
  { label: 'En Proceso', value: 'en_proceso' },
  { label: 'Soporte Insuficiente', value: 'soporte_insuficiente' },
]

function hasActiveFilters(): boolean {
  return periodFilter.value !== 'all' || validationTagFilter.value !== 'all'
}
</script>

<template>
  <div class="p-md lg:p-lg space-y-lg bg-surface min-h-screen">
    <div class="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-sm">
      <div>
        <h2 class="font-headline-md text-headline-md text-primary tracking-tight">Panel Operativo</h2>
        <p class="text-on-surface-variant/70 font-body-md text-body-md mt-xs">
          Bienvenido de nuevo, Administrador. Aquí está el resumen de hoy.
        </p>
      </div>
      <div class="flex gap-md shrink-0">
        <div class="relative">
          <button
            class="px-md py-sm bg-surface-container-lowest border border-outline-variant/60 text-secondary font-label-md rounded-xl flex items-center gap-xs hover:bg-surface-container-low hover:border-outline transition-all shadow-sm"
            :class="{ 'ring-2 ring-primary/40 border-primary/40': hasActiveFilters() }"
            @click="showFilters = !showFilters"
          >
            <span class="material-symbols-outlined text-[18px]">filter_list</span>
            Filtros
            <span
              v-if="hasActiveFilters()"
              class="w-2 h-2 rounded-full bg-primary ml-xs animate-pulse"
            ></span>
          </button>

          <div
            v-if="showFilters"
            class="absolute right-0 top-full mt-sm w-80 bg-surface-container-lowest border border-outline-variant/40 rounded-2xl shadow-[0_8px_24px_rgba(0,0,0,0.12)] p-lg z-30 backdrop-blur-xl"
          >
            <div class="space-y-lg">
              <div>
                <label class="font-label-sm text-label-sm text-on-surface-variant block mb-sm">Período</label>
                <div class="flex flex-wrap gap-xs">
                  <button
                    v-for="opt in periodOptions"
                    :key="opt.value"
                    class="px-sm py-xs rounded-lg border text-body-sm transition-all"
                    :class="periodFilter === opt.value
                      ? 'bg-primary text-on-primary border-primary shadow-sm'
                      : 'bg-surface-container-low/60 text-on-surface-variant border-outline-variant/40 hover:bg-surface-container'"
                    @click="setPeriodFilter(opt.value)"
                  >
                    {{ opt.label }}
                  </button>
                </div>
              </div>

              <div>
                <label class="font-label-sm text-label-sm text-on-surface-variant block mb-sm">Categoría</label>
                <div class="flex flex-wrap gap-xs">
                  <button
                    v-for="opt in validationTagOptions"
                    :key="opt.value"
                    class="px-sm py-xs rounded-lg border text-body-sm transition-all"
                    :class="validationTagFilter === opt.value
                      ? 'bg-primary text-on-primary border-primary shadow-sm'
                      : 'bg-surface-container-low/60 text-on-surface-variant border-outline-variant/40 hover:bg-surface-container'"
                    @click="setValidationTagFilter(opt.value)"
                  >
                    {{ opt.label }}
                  </button>
                </div>
              </div>

              <div class="flex justify-between items-center pt-sm border-t border-outline-variant/40">
                <span v-if="hasActiveFilters()" class="text-body-sm text-on-surface-variant">
                  Filtros activos
                </span>
                <button
                  v-if="hasActiveFilters()"
                  class="text-body-sm text-primary font-label-md hover:underline"
                  @click="clearFilters()"
                >
                  Limpiar filtros
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div
      v-if="dashboardLoading"
      class="flex items-center justify-center py-12 text-on-surface-variant"
    >
      <span class="material-symbols-outlined animate-spin mr-2">sync</span>
      Cargando datos del dashboard...
    </div>

    <div
      v-else-if="dashboardError"
      class="bg-error-container text-on-error-container p-xl rounded-2xl"
    >
      {{ dashboardError }}
    </div>

    <template v-if="dashboardData && !dashboardLoading">
      <section class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-md">
        <KpiCard v-for="kpi in dashboardData.kpis" :key="kpi.title" :data="kpi" />
      </section>

      <section class="grid grid-cols-1 lg:grid-cols-12 gap-md">
        <div class="lg:col-span-12 xl:col-span-4">
          <DistributionChart
            :items="dashboardData.distribution"
            :success-rate="dashboardData.successRate"
          />
        </div>

        <div class="lg:col-span-12 xl:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-md">
          <div
            v-for="insight in dashboardData.insights.filter((i) => i.type === 'alert')"
            :key="insight.type"
            class="bg-surface-container-lowest p-lg rounded-2xl border border-outline-variant/40 flex flex-col justify-between shadow-[0_1px_3px_rgba(0,0,0,0.04)] hover:shadow-[0_4px_12px_rgba(0,0,0,0.08)] transition-all duration-300"
          >
            <div>
              <h4 class="font-headline-sm text-headline-sm text-primary mb-xs tracking-tight">
                {{ insight.title }}
              </h4>
              <p class="font-body-sm text-on-surface-variant/80 leading-relaxed">
                {{ insight.description }}
              </p>
            </div>
            <div v-if="insight.teamMembers" class="flex items-center gap-md mt-sm">
              <div class="flex -space-x-2">
                <div
                  class="w-8 h-8 rounded-full border-2 border-surface-container-lowest bg-surface-variant flex items-center justify-center overflow-hidden shadow-sm"
                >
                  <img
                    alt="Team 1"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuA2vVykU4jZtfg2feeipvHg3Fr2urqVlyIbVl32iMbQ9uzn5neOKLF-W29JYg-cex2IM3aRVcxhKupi4dtnpfPFSzRPasufx_hxh5Y030mA4r7GS6UooMgNwNqjPMm-D84f8WQPRmCAwRwsm39zO1_JQawdfCC8Cg8yFhp8ClGOIuW4-DFvn-W9iqNSKeD7joukB66Dr7FtGHfQjgmQQLSlwijIXVfuwVvG9X7xXqkptoLvz-OBne5clrAtOqm-UcARa6-C0Nm7YKs"
                  />
                </div>
                <div
                  class="w-8 h-8 rounded-full border-2 border-surface-container-lowest bg-surface-variant flex items-center justify-center overflow-hidden shadow-sm"
                >
                  <img
                    alt="Team 2"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuA8Tr0jtXtM-IKfhtn0CnEV6UYjtfl0Ri9ZIWEhDnzyVkDKojO1OS8z7n1OpGR_aCLPUkpQGT2SxPtjx6UEVDYU3CBVuqgsJwQaZ2wB_BR54E--jIbzeG9rUKE2J_WKF_jsYIalInwidTY90oPFd3nJm7SgUQGx6cpSq1Rs9oRd1Rjroauky45DpRp7fhDzP3RoqQUYtKoSJQKS11zqihMEO16sxqiCCT-q9wqnhV3XB1eCj7pEIVXKatqZwU-ZJCVWvEIxv8WTJZ4"
                  />
                </div>
              </div>
              <span class="text-body-sm text-on-surface-variant/70">Revisado por IT</span>
            </div>
          </div>

          <div
            v-for="insight in dashboardData.insights.filter((i) => i.type === 'suggestion')"
            :key="insight.type"
            class="md:col-span-2 bg-gradient-to-br from-secondary-container/40 to-secondary-container/20 p-md rounded-2xl flex items-center justify-between border border-secondary-container/60 shadow-sm"
          >
            <div class="flex items-center gap-md">
              <div class="bg-surface-container-lowest p-sm rounded-xl shadow-sm">
                <span class="material-symbols-outlined text-primary">auto_awesome</span>
              </div>
              <span class="font-label-md text-on-secondary-container leading-relaxed">
                {{ insight.suggestion }}
              </span>
            </div>
            <span class="material-symbols-outlined text-on-secondary-container/60 cursor-pointer hover:text-on-secondary-container transition-colors">
              close
            </span>
          </div>
        </div>
      </section>
    </template>
  </div>
</template>
