<script setup lang="ts">
import { ref } from 'vue'
import type { KpiData, Client, DistributionItem } from '@/types'
import KpiCard from '@/components/dashboard/KpiCard.vue'
import DistributionChart from '@/components/dashboard/DistributionChart.vue'
import ClientTable from '@/components/dashboard/ClientTable.vue'

// ---------------------------------------------------------------------------
// KPI Data
// ---------------------------------------------------------------------------
const kpiData = ref<KpiData[]>([
  {
    title: 'Resumen de Envíos',
    value: '48,290',
    subtitle: 'Total de correos enviados este mes',
    icon: 'mail',
    trend: { value: '+12.5%', direction: 'up' },
    colorClass: 'bg-primary-fixed text-on-primary-fixed',
  },
  {
    title: 'Llamadas Realizadas',
    value: '1,402',
    subtitle: 'Interacciones directas completadas',
    icon: 'call',
    trend: { value: '-2.1%', direction: 'down' },
    colorClass: 'bg-secondary-fixed text-on-secondary-fixed',
  },
  {
    title: 'Validación de Datos',
    value: '45,392',
    subtitle: 'Correos verificados exitosamente',
    icon: 'verified_user',
    trend: { value: '94% Válidos', direction: 'up' },
    colorClass: 'bg-tertiary-fixed text-on-tertiary-fixed',
  },
])

// ---------------------------------------------------------------------------
// Distribution Chart Data
// ---------------------------------------------------------------------------
const distributionItems = ref<DistributionItem[]>([
  { label: 'Entregados', value: 39600, colorClass: 'bg-primary' },
  { label: 'Pendientes', value: 6200, colorClass: 'bg-tertiary-fixed' },
  { label: 'Rebotados', value: 2490, colorClass: 'bg-secondary-fixed' },
])

const successRate = 82

// ---------------------------------------------------------------------------
// Clients Table Data
// ---------------------------------------------------------------------------
const clients = ref<Client[]>([
  {
    folio: '#FL-8902',
    id: 'CLT-4491',
    date: '12/Oct/2023',
    name: 'Ricardo Cantú',
    initials: 'RC',
    situation: 'Residencial',
    status: 'Activo',
    phone: '+52 55 1234 5678',
    email: 'r.cantu@email.com',
  },
  {
    folio: '#FL-8903',
    id: 'CLT-4492',
    date: '11/Oct/2023',
    name: 'María Sánchez',
    initials: 'MS',
    situation: 'Empresarial',
    status: 'Inactivo',
    phone: '+52 81 9876 5432',
    email: 'm.sanchez@corp.com',
  },
  {
    folio: '#FL-8904',
    id: 'CLT-4493',
    date: '11/Oct/2023',
    name: 'Arturo Alarcón',
    initials: 'AA',
    situation: 'Residencial',
    status: 'Activo',
    phone: '+52 33 2211 4455',
    email: 'arturo.a@gmail.com',
  },
  {
    folio: '#FL-8905',
    id: 'CLT-4494',
    date: '10/Oct/2023',
    name: 'Lucía Garza',
    initials: 'LG',
    situation: 'Residencial',
    status: 'Activo',
    phone: '+52 81 4455 6677',
    email: 'l.garza@email.com',
  },
  {
    folio: '#FL-8906',
    id: 'CLT-4495',
    date: '10/Oct/2023',
    name: 'Carlos Mendoza',
    initials: 'CM',
    situation: 'Empresarial',
    status: 'Activo',
    phone: '+52 55 9988 7766',
    email: 'c.mendoza@empresa.com',
  },
  {
    folio: '#FL-8907',
    id: 'CLT-4496',
    date: '09/Oct/2023',
    name: 'Ana Torres',
    initials: 'AT',
    situation: 'Residencial',
    status: 'Inactivo',
    phone: '+52 81 3344 5566',
    email: 'ana.torres@mail.com',
  },
])
</script>

<template>
  <div class="p-xl space-y-xl">
    <!-- Page Header -->
    <div class="flex justify-between items-end">
      <div>
        <h2 class="font-headline-md text-headline-md text-primary">Panel Operativo</h2>
        <p class="text-on-surface-variant font-body-md text-body-md">
          Bienvenido de nuevo, Administrador. Aquí está el resumen de hoy.
        </p>
      </div>
      <div class="flex gap-md">
        <button
          class="px-md py-sm bg-surface-container-lowest border border-outline text-secondary font-label-md rounded-lg flex items-center gap-xs hover:bg-surface-container-low transition-all"
        >
          <span class="material-symbols-outlined text-[18px]">filter_list</span>
          Filtros
        </button>
        <button
          class="px-md py-sm bg-primary text-on-primary font-label-md rounded-lg flex items-center gap-xs hover:opacity-90 transition-all shadow-sm"
        >
          <span class="material-symbols-outlined text-[18px]">add</span>
          Nueva Tarea
        </button>
      </div>
    </div>

    <!-- KPI Cards -->
    <section class="grid grid-cols-1 md:grid-cols-3 gap-xl">
      <KpiCard v-for="kpi in kpiData" :key="kpi.title" :data="kpi" />
    </section>

    <!-- Middle Section: Charts & Insights -->
    <section class="grid grid-cols-1 lg:grid-cols-12 gap-xl">
      <!-- Distribution Chart -->
      <div class="lg:col-span-4">
        <DistributionChart :items="distributionItems" :success-rate="successRate" />
      </div>

      <!-- Actionable Insights -->
      <div class="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-md">
        <!-- Campaign Optimization -->
        <div
          class="bg-primary-container p-xl rounded-xl text-on-primary-container relative overflow-hidden group"
        >
          <div class="relative z-10">
            <h4 class="font-headline-sm text-headline-sm text-white mb-md">
              Optimización de Campaña
            </h4>
            <p class="font-body-md text-white/80 mb-xl">
              Los envíos realizados entre las 9:00 AM y 11:00 AM muestran un 24% más de apertura.
            </p>
            <button
              class="bg-white text-primary px-md py-sm rounded-lg font-label-md flex items-center gap-sm"
            >
              Ver Análisis
              <span class="material-symbols-outlined text-[18px]">arrow_forward</span>
            </button>
          </div>
          <div
            class="absolute -bottom-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl group-hover:scale-125 transition-transform duration-700"
          ></div>
        </div>

        <!-- Quality Alerts -->
        <div
          class="bg-surface-container-highest p-xl rounded-xl border border-outline-variant flex flex-col justify-between"
        >
          <div>
            <h4 class="font-headline-sm text-headline-sm text-primary mb-xs">Alertas de Calidad</h4>
            <p class="font-body-sm text-on-surface-variant">
              Se detectaron 153 dominios sospechosos en la última carga de datos.
            </p>
          </div>
          <div class="flex items-center gap-md mt-md">
            <div class="flex -space-x-2">
              <div
                class="w-8 h-8 rounded-full border-2 border-surface bg-surface-variant flex items-center justify-center overflow-hidden"
              >
                <img
                  alt="Team 1"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuA2vVykU4jZtfg2feeipvHg3Fr2urqVlyIbVl32iMbQ9uzn5neOKLF-W29JYg-cex2IM3aRVcxhKupi4dtnpfPFSzRPasufx_hxh5Y030mA4r7GS6UooMgNwNqjPMm-D84f8WQPRmCAwRwsm39zO1_JQawdfCC8Cg8yFhp8ClGOIuW4-DFvn-W9iqNSKeD7joukB66Dr7FtGHfQjgmQQLSlwijIXVfuwVvG9X7xXqkptoLvz-OBne5clrAtOqm-UcARa6-C0Nm7YKs"
                />
              </div>
              <div
                class="w-8 h-8 rounded-full border-2 border-surface bg-surface-variant flex items-center justify-center overflow-hidden"
              >
                <img
                  alt="Team 2"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuA8Tr0jtXtM-IKfhtn0CnEV6UYjtfl0Ri9ZIWEhDnzyVkDKojO1OS8z7n1OpGR_aCLPUkpQGT2SxPtjx6UEVDYU3CBVuqgsJwQaZ2wB_BR54E--jIbzeG9rUKE2J_WKF_jsYIalInwidTY90oPFd3nJm7SgUQGx6cpSq1Rs9oRd1Rjroauky45DpRp7fhDzP3RoqQUYtKoSJQKS11zqihMEO16sxqiCCT-q9wqnhV3XB1eCj7pEIVXKatqZwU-ZJCVWvEIxv8WTJZ4"
                />
              </div>
            </div>
            <span class="text-body-sm text-on-surface-variant">Revisado por IT</span>
          </div>
        </div>

        <!-- AI Suggestion Banner -->
        <div
          class="md:col-span-2 bg-secondary-container p-md rounded-xl flex items-center justify-between border border-outline-variant"
        >
          <div class="flex items-center gap-md">
            <div class="bg-white p-sm rounded-lg shadow-sm">
              <span class="material-symbols-outlined text-primary">auto_awesome</span>
            </div>
            <span class="font-label-md text-on-secondary-container">
              Sugerencia AI: Incrementa el presupuesto en 'Canal B' para maximizar conversiones.
            </span>
          </div>
          <span class="material-symbols-outlined text-on-secondary-container cursor-pointer">
            close
          </span>
        </div>
      </div>
    </section>

    <!-- Data Table -->
    <ClientTable :clients="clients" />
  </div>
</template>
