<script setup lang="ts">
import { computed } from 'vue'
import type { DistributionItemEntity } from '@/domain/entities/dashboard.entity'
import AppCard from '@/presentation/components/shared/AppCard.vue'

const props = defineProps<{
  items: DistributionItemEntity[]
  successRate: number
}>()

const radius = 80
const circumference = 2 * Math.PI * radius

const segments = computed(() => {
  const total = props.items.reduce((sum, item) => sum + item.value, 0)
  if (total === 0) return []

  let offset = 0
  return props.items.map((item) => {
    const percentage = item.value / total
    const dashLength = percentage * circumference
    const segment = {
      ...item,
      dashArray: `${dashLength} ${circumference - dashLength}`,
      dashOffset: -offset,
      percentage: Math.round(percentage * 100),
    }
    offset += dashLength
    return segment
  })
})

const colorMap: Record<string, string> = {
  'bg-error': '#ba1a1a',
  'bg-on-tertiary-container': '#008cc7',
  'bg-tertiary-fixed': '#c9e6ff',
  'bg-surface-variant': '#e0e3e5',
}

function getStrokeColor(colorClass: string): string {
  return colorMap[colorClass] || '#76777d'
}
</script>

<template>
  <AppCard>
    <h4 class="font-headline-sm text-headline-sm text-primary mb-md tracking-tight">Distribución por Estado</h4>

    <div class="relative flex items-center justify-center py-md">
      <svg width="200" height="200" viewBox="0 0 200 200" class="transform -rotate-90">
        <circle
          v-for="(segment, index) in segments"
          :key="index"
          cx="100"
          cy="100"
          :r="radius"
          fill="none"
          :stroke="getStrokeColor(segment.colorClass)"
          stroke-width="24"
          :stroke-dasharray="segment.dashArray"
          :stroke-dashoffset="segment.dashOffset"
          stroke-linecap="round"
          class="transition-all duration-500"
        />
      </svg>
      <div class="absolute inset-0 flex items-center justify-center">
        <div class="text-center">
          <p class="font-display-lg text-[28px] text-primary tracking-tight">{{ successRate }}%</p>
          <p class="font-label-sm text-on-surface-variant/70">Tasa de Éxito</p>
        </div>
      </div>
    </div>

    <div class="mt-md space-y-sm">
      <div 
        v-for="item in items" 
        :key="item.label" 
        class="flex items-center justify-between p-sm rounded-lg hover:bg-surface-container-low/60 transition-colors"
      >
        <div class="flex items-center gap-sm">
          <span 
            class="w-3 h-3 rounded-full shadow-sm"
            :style="{ backgroundColor: getStrokeColor(item.colorClass) }"
          ></span>
          <span class="text-body-sm text-on-surface-variant">{{ item.label }}</span>
        </div>
        <span class="font-label-md text-primary font-semibold">{{ item.value.toLocaleString() }}</span>
      </div>
    </div>
  </AppCard>
</template>
