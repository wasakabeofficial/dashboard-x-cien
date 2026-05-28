<script setup lang="ts">
import type { KpiEntity } from '@/domain/entities/dashboard.entity'
import AppCard from '@/presentation/components/shared/AppCard.vue'

defineProps<{
  data: KpiEntity
}>()
</script>

<template>
  <AppCard class="group relative overflow-hidden">
    <div class="absolute top-0 right-0 w-32 h-32 -mr-8 -mt-8 opacity-5 rounded-full" :class="data.colorClass" />
    
    <div class="relative">
      <div class="flex justify-between items-start mb-md">
        <div 
          :class="`p-sm rounded-xl ${data.colorClass} shadow-sm`"
        >
          <span class="material-symbols-outlined text-[22px]">{{ data.icon }}</span>
        </div>
        <div
          class="flex items-center gap-xs px-sm py-xs rounded-full bg-surface-container-low"
          :class="
            data.trend.direction === 'up'
              ? 'text-on-tertiary-container'
              : 'text-on-primary-fixed-variant'
          "
        >
          <span class="material-symbols-outlined text-[14px]">
            {{ data.trend.direction === 'up' ? 'trending_up' : 'trending_down' }}
          </span>
          <span class="font-label-sm text-label-sm">{{ data.trend.value }}</span>
        </div>
      </div>

      <p class="text-on-surface-variant font-label-md text-label-md mb-xs">{{ data.title }}</p>
      <h3 class="font-display-lg text-display-lg text-primary tracking-tight">{{ data.value }}</h3>
      <p class="text-on-surface-variant/70 font-body-sm text-body-sm mt-sm">{{ data.subtitle }}</p>
    </div>
  </AppCard>
</template>
