<template>
  <div class="w-[81px] flex flex-col h-full bg-[#f8f9fc] shrink-0 py-2">
    <!-- Logo -->
    <div
      class="relative flex justify-center items-center cursor-pointer h-[56px] px-2"
      @mouseenter="logoHovered = true"
      @mouseleave="logoHovered = false"
      @click="sidebarCollapsed = !sidebarCollapsed"
    >
      <Transition name="logo-swap">
        <img
          v-if="!logoHovered"
          key="logo"
          :src="logoIcon"
          alt="HitPay"
          class="absolute w-8 h-8"
        />
        <img
          v-else
          key="icon"
          :src="collapseIcon"
          alt="HitPay"
          class="absolute w-[18px] h-[18px]"
          :style="{ transform: sidebarCollapsed ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 200ms ease' }"
        />
      </Transition>
    </div>

    <!-- Product nav items -->
    <div class="flex flex-col flex-1">
      <NavRailItem
        v-for="(item, i) in productItems"
        :key="item.label"
        :icon="item.icon"
        :icon-active="item.iconActive"
        :label="item.label"
        :active="activeProduct === i"
        :icon-size="22"
        @click="activeProduct = i"
      />
    </div>

    <!-- Bottom utility items -->
    <div class="flex flex-col">
      <NavRailItem
        v-for="(item, i) in bottomItems"
        :key="item.label"
        :icon="item.icon"
        :label="item.label"
        :active="item.label === 'Ask Agent' ? agentPanelOpen : activeBottom === i"
        :icon-size="18"
        @click="handleBottomClick(i, item)"
      />
    </div>
  </div>
</template>

<script setup>
import NavRailItem from './NavRailItem.vue'
import { activeProduct } from '../../composables/useNav.js'

import logoIcon from '../../assets/icons/logo-hitpay.svg'
import collapseIcon from '../../assets/icons/icon-sidebar-collapse.svg'
import moneyLineIcon from '../../assets/icons/icon-money-line.svg'
import moneyBulkIcon from '../../assets/icons/icon-money.svg'
import bag2LineIcon from '../../assets/icons/icon-bag-2.svg'
import bag2BulkIcon from '../../assets/icons/icon-bag-2-bulk.svg'
import note2LineIcon from '../../assets/icons/icon-note-2.svg'
import note2BulkIcon from '../../assets/icons/icon-note-2-bulk.svg'
import sparkleIcon from '../../assets/icons/icon-sparkle.svg'
import giftIcon from '../../assets/icons/icon-gift.svg'
import questionIcon from '../../assets/icons/icon-question-mark.svg'

import { ref } from 'vue'
import { agentPanelOpen } from '../../composables/useAgentPanel.js'
import { sidebarCollapsed } from '../../composables/useSidebarCollapsed.js'

const activeBottom = ref(null)
const logoHovered = ref(false)

function handleBottomClick(i, item) {
  if (item.label === 'Ask Agent') {
    agentPanelOpen.value = !agentPanelOpen.value
  } else {
    activeBottom.value = activeBottom.value === i ? null : i
  }
}

const productItems = [
  { icon: moneyLineIcon, iconActive: moneyBulkIcon, label: 'Payments' },
  { icon: bag2LineIcon, iconActive: bag2BulkIcon, label: 'Commerce' },
  { icon: note2LineIcon, iconActive: note2BulkIcon, label: 'Finance' },
]

const bottomItems = [
  { icon: sparkleIcon, label: 'Ask Agent' },
  { icon: giftIcon, label: 'Refer' },
  { icon: questionIcon, label: 'Help' },
]
</script>

<style scoped>
.logo-swap-enter-active,
.logo-swap-leave-active {
  transition: opacity 180ms ease;
  position: absolute;
}
.logo-swap-enter-from,
.logo-swap-leave-to {
  opacity: 0;
}
</style>
