<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import { computed } from 'vue'
import { useReportModal } from '@/presentation/composables/use-report-modal.composable'
import { useSidebar } from '@/presentation/composables/use-sidebar.composable'

interface NavItem {
  label: string
  icon: string
  routeName: string
}

const navItems: NavItem[] = [
  { label: 'Dashboard', icon: 'dashboard', routeName: 'dashboard' },
  { label: 'Gestión de Clientes', icon: 'groups', routeName: 'clientes' },
  { label: 'Historial', icon: 'history', routeName: 'historial' },
  { label: 'Settings', icon: 'settings', routeName: 'settings' },
]

const route = useRoute()
const router = useRouter()
const { open: openReportModal } = useReportModal()
const { isOpen, close } = useSidebar()

const activeRouteName = computed(() => route.name as string)

function isActive(item: NavItem): boolean {
  return activeRouteName.value === item.routeName
}

function navigate(item: NavItem): void {
  router.push({ name: item.routeName })
  close() // cerrar sidebar en mobile
}
</script>

<template>
  <aside
    class="fixed left-0 top-0 h-screen w-70 bg-surface-container-lowest border-r border-outline-variant/40 flex flex-col py-xl z-40 transition-transform duration-300 lg:translate-x-0 shadow-[0_0_24px_rgba(0,0,0,0.04)]"
    :class="isOpen ? 'translate-x-0' : '-translate-x-full'"
  >
    <div class="px-xl mb-xl flex items-center justify-between">
      <div>
        <h1 class="font-headline-md text-headline-md font-bold text-primary tracking-tight">XCien</h1>
        <p class="text-on-surface-variant/70 font-label-sm text-label-sm mt-xs">Hub Empresarial</p>
      </div>
      <button
        class="w-8 h-8 flex items-center justify-center rounded-full hover:bg-surface-container-high transition-colors lg:hidden text-on-surface-variant"
        @click="close"
      >
        <span class="material-symbols-outlined">close</span>
      </button>
    </div>

    <nav class="flex-1 space-y-xs px-md">
      <button
        v-for="item in navItems"
        :key="item.routeName"
        class="w-full flex items-center px-lg py-md rounded-xl transition-all duration-200 text-left group"
        :class="
          isActive(item)
            ? 'text-primary font-semibold bg-primary/5 border-l-[3px] border-primary'
            : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high/60 border-l-[3px] border-transparent'
        "
        @click="navigate(item)"
      >
        <span 
          class="material-symbols-outlined mr-md transition-transform duration-200"
          :class="isActive(item) ? 'scale-110' : 'group-hover:scale-105'"
        >
          {{ item.icon }}
        </span>
        <span class="font-label-md text-label-md">{{ item.label }}</span>
      </button>
    </nav>

    <div class="mt-auto px-xl pt-xl space-y-md">
      <button
        class="w-full bg-primary text-on-primary py-md rounded-xl font-label-md hover:bg-primary/90 transition-all shadow-sm hover:shadow-md flex items-center justify-center gap-sm"
        @click="openReportModal(); close()"
      >
        <span class="material-symbols-outlined text-[18px]">download</span>
        Descargar Reportes
      </button>
      <div class="space-y-xs">
        <button
          class="w-full flex items-center text-on-surface-variant/70 hover:text-on-surface py-sm px-md rounded-lg hover:bg-surface-container-high/40 transition-all text-left"
        >
          <span class="material-symbols-outlined mr-md text-[20px]">help</span>
          <span class="font-label-sm text-label-sm">Soporte</span>
        </button>
        <button
          class="w-full flex items-center text-on-surface-variant/70 hover:text-on-surface py-sm px-md rounded-lg hover:bg-surface-container-high/40 transition-all text-left"
        >
          <span class="material-symbols-outlined mr-md text-[20px]">logout</span>
          <span class="font-label-sm text-label-sm">Cerrar Sesión</span>
        </button>
      </div>
    </div>
  </aside>
</template>
