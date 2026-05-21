<template>
  <div class="relative shrink-0">
    <!-- Trigger row -->
    <div
      class="flex items-center gap-2 border-t border-[#e5e6ea] cursor-pointer transition-colors duration-150"
      :class="open ? 'bg-[rgba(0,39,113,0.04)]' : 'hover:bg-white/60'"
      style="height: 47px; padding: 0 8px;"
      @click="open = !open"
    >
      <div class="w-7 h-7 rounded-[5px] bg-[#333748] flex items-center justify-center shrink-0 overflow-hidden">
        <span class="text-[12px] font-medium text-white">N</span>
      </div>
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
    </div>

    <!-- Popup menu -->
    <AccountMenu v-model="open" />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import AccountMenu from './AccountMenu.vue'
import arrowUpDownIcon from '../../assets/icons/icon-arrow-up-down.svg'

const open = ref(false)
</script>
