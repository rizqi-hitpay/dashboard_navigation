<template>
  <div class="flex items-center justify-between border-b border-[#e5e6ea] w-full shrink-0 bg-white" style="padding: 16px;">

    <!-- Menu + product switcher -->
    <div class="flex items-center gap-[12px]">
      <button
        class="relative flex items-center justify-center size-[24px] shrink-0 cursor-pointer"
        aria-label="Open menu"
        @click="$emit('menu')"
      >
        <img :src="menuIcon" width="24" height="24" alt="" />
        <img :src="notifDotIcon" width="14" height="14" alt="" class="absolute" style="top: -2px; right: -4px;" />
      </button>

      <div class="flex items-center gap-[8px]">
        <div class="flex items-end gap-[6px]">
          <img :src="logoIcon" width="26" height="26" alt="HitPay" />
          <span class="text-[14px] font-medium text-[#002771] leading-[1.5] whitespace-nowrap">{{ productLabel }}</span>
        </div>
        <img :src="chevronDownIcon" width="16" height="16" alt="" />
      </div>
    </div>

    <!-- Account switcher pill -->
    <div class="relative shrink-0">
      <button
        ref="triggerRef"
        class="flex items-center gap-[8px] h-[40px] px-[8px] rounded-[8px] border border-[#e5e6ea] bg-[#fcfcfd] w-[130px] cursor-pointer"
        @click="menuOpen = !menuOpen"
      >
        <div class="w-7 h-7 rounded-[4px] bg-[#343848] flex items-center justify-center shrink-0">
          <span class="text-[14px] font-medium text-white">H</span>
        </div>
        <span class="flex-1 min-w-0 text-[14px] text-[#03102f] leading-[1.5] truncate text-left">Shenzhen Huaju advertising Singapore Co., LTD</span>
        <img :src="arrowUpDownIcon" width="16" height="16" alt="" class="shrink-0" />
      </button>
      <AccountMenu v-model="menuOpen" :anchor="triggerRef" />
    </div>

  </div>
</template>

<script setup>
import { computed, ref, useTemplateRef } from 'vue'
import AccountMenu from './AccountMenu.vue'
import { activeProduct } from '../../composables/useNav.js'
import logoIcon from '../../assets/icons/logo-hitpay.svg'
import menuIcon from '../../assets/icons/icon-mobile-menu.svg'
import notifDotIcon from '../../assets/icons/icon-notif-dot.svg'
import chevronDownIcon from '../../assets/icons/icon-chevron-down.svg'
import arrowUpDownIcon from '../../assets/icons/icon-arrow-up-down.svg'

defineEmits(['menu'])

const menuOpen = ref(false)
const triggerRef = useTemplateRef('triggerRef')

const productLabel = computed(() => ['Payments', 'Commerce', 'Finance'][activeProduct.value] ?? 'Payments')
</script>
