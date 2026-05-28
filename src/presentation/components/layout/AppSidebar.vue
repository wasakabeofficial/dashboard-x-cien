<script setup lang="ts">
import { ref } from 'vue'

interface NavItem {
  label: string
  icon: string
  href: string
}

const navItems = ref<NavItem[]>([
  { label: 'Dashboard', icon: 'dashboard', href: '#' },
  { label: 'Analytics', icon: 'monitoring', href: '#' },
  { label: 'Operations', icon: 'settings_suggest', href: '#' },
  { label: 'Inventory', icon: 'inventory_2', href: '#' },
  { label: 'Settings', icon: 'settings', href: '#' },
])

const activeIndex = ref(0)

function setActive(index: number): void {
  activeIndex.value = index
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
      <a
        v-for="(item, index) in navItems"
        :key="item.label"
        :href="item.href"
        class="flex items-center px-xl py-md transition-all duration-200"
        :class="
          activeIndex === index
            ? 'text-primary font-bold bg-secondary-container/50 border-r-4 border-primary opacity-90'
            : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high'
        "
        @click.prevent="setActive(index)"
      >
        <span class="material-symbols-outlined mr-md">{{ item.icon }}</span>
        <span class="font-label-md text-label-md">{{ item.label }}</span>
      </a>
    </nav>

    <!-- Bottom actions -->
    <div class="mt-auto px-xl pt-xl space-y-4">
      <button
        class="w-full bg-primary text-on-primary py-sm rounded-lg font-label-md hover:opacity-90 transition-all"
      >
        Descargar Reportes
      </button>
      <div class="space-y-1">
        <a
          class="flex items-center text-on-surface-variant hover:text-on-surface py-2"
          href="#"
        >
          <span class="material-symbols-outlined mr-md">help</span>
          <span class="font-label-md text-label-md">Soporte</span>
        </a>
        <a
          class="flex items-center text-on-surface-variant hover:text-on-surface py-2"
          href="#"
        >
          <span class="material-symbols-outlined mr-md">logout</span>
          <span class="font-label-md text-label-md">Cerrar Sesión</span>
        </a>
      </div>
    </div>
  </aside>
</template>
