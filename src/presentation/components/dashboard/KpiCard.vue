<script setup lang="ts">
import type { KpiEntity } from '@/domain/entities/dashboard.entity'
import AppCard from '@/presentation/components/shared/AppCard.vue'

defineProps<{
  data: KpiEntity
}>()
</script>

<template>
  <AppCard
    class="shadow-[0px_4px_6px_-1px_rgba(0,0,0,0.1)] hover:shadow-md transition-shadow group"
  >
    <!-- Header: icon + trend -->
    <div class="flex justify-between items-start mb-md">
      <div :class="`p-sm rounded-lg ${data.colorClass}`">
        <span class="material-symbols-outlined">{{ data.icon }}</span>
      </div>
      <span
        class="font-label-md text-label-md flex items-center gap-xs"
        :class="
          data.trend.direction === 'up'
            ? 'text-on-tertiary-container'
            : 'text-on-primary-fixed-variant'
        "
      >
        {{ data.trend.value }}
        <span class="material-symbols-outlined text-[16px]">
          {{ data.trend.direction === 'up' ? 'trending_up' : 'trending_down' }}
        </span>
      </span>
    </div>

    <!-- Body -->
    <p class="text-on-surface-variant font-label-md text-label-md">{{ data.title }}</p>
    <h3 class="font-display-lg text-display-lg text-primary mt-xs">{{ data.value }}</h3>
    <p class="text-on-surface-variant font-body-sm text-body-sm mt-sm">{{ data.subtitle }}</p>
  </AppCard>
</template>
