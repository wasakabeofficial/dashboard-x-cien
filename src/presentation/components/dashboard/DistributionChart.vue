<script setup lang="ts">
import type { DistributionItemEntity } from '@/domain/entities/dashboard.entity'
import AppCard from '@/presentation/components/shared/AppCard.vue'

defineProps<{
  items: DistributionItemEntity[]
  successRate: number
}>()
</script>

<template>
  <AppCard>
    <h4 class="font-headline-sm text-headline-sm text-primary mb-xl">Distribución por Estado</h4>

    <!-- Abstract Pie Chart -->
    <div class="relative flex items-center justify-center py-xl">
      <div
        class="w-48 h-48 rounded-full border-[16px] border-primary flex items-center justify-center relative"
      >
        <div
          class="absolute inset-0 border-[16px] border-tertiary-fixed rounded-full"
          style="clip-path: polygon(50% 50%, 50% 0%, 100% 0%, 100% 50%)"
        ></div>
        <div
          class="absolute inset-0 border-[16px] border-secondary-fixed rounded-full"
          style="clip-path: polygon(50% 50%, 0% 50%, 0% 100%, 50% 100%)"
        ></div>
        <div class="text-center">
          <p class="font-display-lg text-[24px] text-primary">{{ successRate }}%</p>
          <p class="font-label-md text-on-surface-variant">Tasa de Éxito</p>
        </div>
      </div>
    </div>

    <!-- Legend -->
    <div class="mt-xl space-y-md">
      <div v-for="item in items" :key="item.label" class="flex items-center justify-between">
        <div class="flex items-center gap-xs">
          <span :class="`w-3 h-3 rounded-full ${item.colorClass}`"></span>
          <span class="text-body-sm text-on-surface-variant">{{ item.label }}</span>
        </div>
        <span class="font-label-md text-primary">{{ item.value.toLocaleString() }}</span>
      </div>
    </div>
  </AppCard>
</template>
