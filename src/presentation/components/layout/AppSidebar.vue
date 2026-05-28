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
const { isOpen, isExpanded, close, toggleExpand } = useSidebar()

const activeRouteName = computed(() => route.name as string)

function isActive(item: NavItem): boolean {
  return activeRouteName.value === item.routeName
}

function navigate(item: NavItem): void {
  router.push({ name: item.routeName })
  close()
}
</script>

<template>
  <aside
    class="fixed left-0 top-0 h-screen bg-surface-container-lowest border-r border-outline-variant/40 flex flex-col py-xl z-40 transition-all duration-300 lg:translate-x-0 shadow-[0_0_24px_rgba(0,0,0,0.04)]"
    :class="[
      isOpen ? 'translate-x-0' : '-translate-x-full',
      isExpanded ? 'w-70' : 'w-20'
    ]"
  >
    <div class="px-xl mb-xl flex items-center" :class="isExpanded ? 'justify-between' : 'justify-center'">
      <div v-if="isExpanded">
        <h1 class="font-headline-md text-headline-md font-bold text-primary tracking-tight">XCien</h1>
        <p class="text-on-surface-variant/70 font-label-sm text-label-sm mt-xs">Hub Empresarial</p>
      </div>
      <div v-else class="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
        <span class="material-symbols-outlined text-primary text-[24px]">hub</span>
      </div>
      <button
        v-if="isExpanded"
        class="w-8 h-8 flex items-center justify-center rounded-full hover:bg-surface-container-high transition-colors lg:hidden text-on-surface-variant"
        @click="close"
      >
        <span class="material-symbols-outlined">close</span>
      </button>
    </div>

    <button
      class="hidden lg:flex absolute top-6 -right-3 w-6 h-6 rounded-full bg-surface-container-lowest border border-outline-variant/40 items-center justify-center hover:bg-surface-container-high transition-colors shadow-sm z-50"
      @click="toggleExpand"
    >
      <span class="material-symbols-outlined text-[16px] text-on-surface-variant">
        {{ isExpanded ? 'chevron_left' : 'chevron_right' }}
      </span>
    </button>

    <nav class="flex-1 space-y-xs px-md">
      <button
        v-for="item in navItems"
        :key="item.routeName"
        class="w-full flex items-center rounded-xl transition-all duration-200 text-left group"
        :class="[
          isActive(item)
            ? 'text-primary font-semibold bg-primary/5 border-l-[3px] border-primary'
            : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high/60 border-l-[3px] border-transparent',
          isExpanded ? 'px-lg py-md' : 'px-0 py-md justify-center'
        ]"
        @click="navigate(item)"
      >
        <span 
          class="material-symbols-outlined transition-transform duration-200"
          :class="[
            isActive(item) ? 'scale-110' : 'group-hover:scale-105',
            isExpanded ? 'mr-md' : ''
          ]"
        >
          {{ item.icon }}
        </span>
        <span v-if="isExpanded" class="font-label-md text-label-md">{{ item.label }}</span>
      </button>
    </nav>

    <div class="mt-auto pt-xl space-y-md" :class="isExpanded ? 'px-xl' : 'px-md'">
      <button
        class="w-full bg-primary text-on-primary rounded-xl font-label-md hover:bg-primary/90 transition-all shadow-sm hover:shadow-md flex items-center"
        :class="isExpanded ? 'py-md justify-center gap-sm' : 'py-md justify-center'"
        @click="openReportModal(); close()"
      >
        <span class="material-symbols-outlined text-[18px]">download</span>
        <span v-if="isExpanded">Descargar Reportes</span>
      </button>
      <div class="space-y-xs">
        <button
          class="w-full flex items-center text-on-surface-variant/70 hover:text-on-surface py-sm rounded-lg hover:bg-surface-container-high/40 transition-all text-left"
          :class="isExpanded ? 'px-md' : 'px-0 justify-center'"
        >
          <span class="material-symbols-outlined text-[20px]" :class="isExpanded ? 'mr-md' : ''">help</span>
          <span v-if="isExpanded" class="font-label-sm text-label-sm">Soporte</span>
        </button>
        <button
          class="w-full flex items-center text-on-surface-variant/70 hover:text-on-surface py-sm rounded-lg hover:bg-surface-container-high/40 transition-all text-left"
          :class="isExpanded ? 'px-md' : 'px-0 justify-center'"
        >
          <span class="material-symbols-outlined text-[20px]" :class="isExpanded ? 'mr-md' : ''">logout</span>
          <span v-if="isExpanded" class="font-label-sm text-label-sm">Cerrar Sesión</span>
        </button>
      </div>
    </div>
  </aside>
</template>
