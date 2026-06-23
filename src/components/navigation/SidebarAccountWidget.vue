<template>
  <div class="relative shrink-0">
    <!-- Trigger row -->
    <div
      ref="triggerRef"
      class="flex items-center border-t border-[#e5e6ea] bg-[#fcfcfd] cursor-pointer transition-colors duration-150"
      :class="[open ? 'bg-[rgba(0,39,113,0.04)]' : 'hover:bg-white/60', sidebarExpanded ? 'gap-2' : 'justify-center']"
      style="height: 56px; padding: 0 8px;"
      @click="open = !open"
    >
      <div class="w-8 h-8 rounded-[5px] bg-[#343848] flex items-center justify-center shrink-0 overflow-hidden">
        <span class="text-[14px] font-medium text-white">C</span>
      </div>
      <template v-if="sidebarExpanded">
        <div class="flex-1 min-w-0 flex flex-col justify-center">
          <span class="text-[13px] leading-[1.5] text-[#03102f] truncate">My Cat Shop</span>
          <span class="text-[12px] leading-[1.5] text-[#61667c] truncate">Cherry Test QA</span>
        </div>
        <img
          :src="arrowUpDownIcon"
          alt="switch"
          class="w-4 h-4 shrink-0 transition-transform duration-200"
          :style="{
            transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
            filter: 'invert(38%) sepia(7%) saturate(1126%) hue-rotate(192deg) brightness(101%) contrast(88%)'
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
