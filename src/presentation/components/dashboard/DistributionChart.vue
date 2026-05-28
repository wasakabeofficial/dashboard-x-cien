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
    <h4 class="font-headline-sm text-headline-sm text-primary mb-md tracking-tight">Distribución por Estado</h4>

    <div class="relative flex items-center justify-center py-md">
      <div
        class="w-44 h-44 rounded-full border-16 border-primary flex items-center justify-center relative shadow-[0_0_32px_rgba(0,0,0,0.08)]"
      >
        <div
          class="absolute inset-0 border-16 border-tertiary-fixed rounded-full"
          style="clip-path: polygon(50% 50%, 50% 0%, 100% 0%, 100% 50%)"
        ></div>
        <div
          class="absolute inset-0 border-16 border-secondary-fixed rounded-full"
          style="clip-path: polygon(50% 50%, 0% 50%, 0% 100%, 50% 100%)"
        ></div>
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
          <span :class="`w-3 h-3 rounded-full ${item.colorClass} shadow-sm`"></span>
          <span class="text-body-sm text-on-surface-variant">{{ item.label }}</span>
        </div>
        <span class="font-label-md text-primary font-semibold">{{ item.value.toLocaleString() }}</span>
      </div>
    </div>
  </AppCard>
</template>
