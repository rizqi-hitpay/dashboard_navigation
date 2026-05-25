<template>
  <div class="relative shrink-0">
    <!-- Trigger row -->
    <div
      ref="triggerRef"
      class="flex items-center border-t border-[#e5e6ea] cursor-pointer transition-colors duration-150"
      :class="[open ? 'bg-[rgba(0,39,113,0.04)]' : 'hover:bg-white/60', sidebarExpanded ? 'gap-2' : 'justify-center']"
      style="height: 47px; padding: 0 8px;"
      @click="open = !open"
    >
      <div class="w-7 h-7 rounded-[5px] bg-[#333748] flex items-center justify-center shrink-0 overflow-hidden">
        <span class="text-[12px] font-medium text-white">N</span>
      </div>
      <template v-if="sidebarExpanded">
        <span class="text-[13px] text-[#61667c] shrink-0">Nitin</span>
        <div class="w-px h-6 bg-[#e5e6ea] shrink-0"></div>
        <span class="text-[13px] text-[#03102f] flex-1 truncate">My Cat Shop</span>
        <img
          :src="arrowUpDownIcon"
          alt="switch"
          class="w-4 h-4 shrink-0 transition-transform duration-200"
          :style="{
            transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
            filter: 'invert(39%) sepia(21%) saturate(657%) hue-rotate(185deg) brightness(88%) contrast(84%)'
          }"
        />
      </template>
    </div>

    <!-- Popup menu -->
    <AccountMenu v-model="open" :anchor="triggerRef" />
  </div>
</template>

<script setup>
import { ref, watch, useTemplateRef } from 'vue'
import AccountMenu from './AccountMenu.vue'
import arrowUpDownIcon from '../../assets/icons/icon-arrow-up-down.svg'
import { sidebarExpanded, sidebarPinned } from '../../composables/useSidebarCollapsed.js'

const open = ref(false)
const triggerRef = useTemplateRef('triggerRef')

watch(open, (isOpen) => { sidebarPinned.value = isOpen })
</script>
