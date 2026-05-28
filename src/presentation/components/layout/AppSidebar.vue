<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import { computed } from 'vue'

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

const activeRouteName = computed(() => route.name as string)

function isActive(item: NavItem): boolean {
  return activeRouteName.value === item.routeName
}

function navigate(item: NavItem): void {
  router.push({ name: item.routeName })
}
</script>

<template>
  <aside
    class="fixed left-0 top-0 h-screen w-[280px] bg-surface border-r border-outline-variant flex flex-col py-xl z-40"
  >
    <!-- Brand -->
    <div class="px-xl mb-xl">
      <h1 class="font-headline-md text-headline-md font-bold text-primary">XCien</h1>
      <p class="text-on-surface-variant font-label-md text-label-md">Hub Empresarial</p>
    </div>

    <!-- Navigation -->
    <nav class="flex-1 space-y-1">
      <button
        v-for="item in navItems"
        :key="item.routeName"
        class="w-full flex items-center px-xl py-md transition-all duration-200 text-left"
        :class="
          isActive(item)
            ? 'text-primary font-bold bg-secondary-container/50 border-r-4 border-primary opacity-90'
            : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high'
        "
        @click="navigate(item)"
      >
        <span class="material-symbols-outlined mr-md">{{ item.icon }}</span>
        <span class="font-label-md text-label-md">{{ item.label }}</span>
      </button>
    </nav>

    <!-- Bottom actions -->
    <div class="mt-auto px-xl pt-xl space-y-4">
      <button
        class="w-full bg-primary text-on-primary py-sm rounded-lg font-label-md hover:opacity-90 transition-all"
      >
        Descargar Reportes
      </button>
      <div class="space-y-1">
        <button
          class="w-full flex items-center text-on-surface-variant hover:text-on-surface py-2 text-left"
        >
          <span class="material-symbols-outlined mr-md">help</span>
          <span class="font-label-md text-label-md">Soporte</span>
        </button>
        <button
          class="w-full flex items-center text-on-surface-variant hover:text-on-surface py-2 text-left"
        >
          <span class="material-symbols-outlined mr-md">logout</span>
          <span class="font-label-md text-label-md">Cerrar Sesión</span>
        </button>
      </div>
    </div>
  </aside>
</template>
