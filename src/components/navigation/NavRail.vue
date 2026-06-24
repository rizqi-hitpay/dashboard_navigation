<template>
  <!-- 64px footprint in flex flow; the panel floats over content and expands on hover -->
  <div
    class="relative w-[64px] shrink-0 h-full"
    style="z-index: 40;"
    @mouseenter="hovered = true"
    @mouseleave="hovered = false"
  >
    <!-- Floating panel: 64px collapsed → 140px on hover, inset 8px top/bottom -->
    <div
      class="absolute left-0 flex flex-col nav-panel"
      style="top: 8px; bottom: 8px;"
      :class="{ 'nav-panel--expanded': hovered }"
    >
      <!-- Logo: 32px collapsed → 22px when expanded -->
      <div
        class="flex items-center overflow-hidden"
        :style="{
          paddingTop: '12px',
          paddingBottom: '12px',
          paddingRight: '20px',
          paddingLeft: (hovered ? 20 : 16) + 'px',
          transition: 'padding-left 250ms cubic-bezier(0.4, 0, 0.2, 1)',
        }"
      >
        <span
          class="shrink-0 flex items-center justify-center"
          :style="{
            width: (hovered ? 22 : 32) + 'px',
            height: (hovered ? 22 : 32) + 'px',
            transition: 'width 250ms cubic-bezier(0.4, 0, 0.2, 1), height 250ms cubic-bezier(0.4, 0, 0.2, 1)',
          }"
        >
          <img :src="logoIcon" alt="HitPay" class="w-full h-full" />
        </span>
        <span
          class="nav-label"
          :class="{ 'nav-label--shown': hovered }"
          style="font-size: 14px; font-weight: 500; color: #03102f;"
        >HitPay</span>
      </div>

      <!-- Product nav items -->
      <NavRailItem
        v-for="(item, i) in productItems"
        :key="item.label"
        :icon="item.icon"
        :icon-active="item.iconActive"
        :label="item.label"
        :active="activeProduct === i"
        :icon-size="22"
        :label-size="13"
        :expanded="hovered"
        @click="activeProduct = i"
      />

      <!-- Separator: 40px line anchored to the icon column -->
      <div class="flex items-center" style="padding: 4px 0; width: 64px;">
        <div style="margin: 0 auto; width: 40px; height: 1px; background: #e5e6ea;"></div>
      </div>

      <!-- Bottom utility items -->
      <NavRailItem
        v-for="(item, i) in bottomItems"
        :key="item.label"
        :icon="item.icon"
        :icon-active="item.iconActive"
        :label="item.label"
        :active="item.label === 'AI Assistant' ? agentPanelOpen : activeBottom === i"
        :icon-size="18"
        :label-size="12"
        :expanded="hovered"
        @click="handleBottomClick(i, item)"
      />
    </div>
  </div>
</template>

<script setup>
import NavRailItem from './NavRailItem.vue'
import { activeProduct } from '../../composables/useNav.js'

import logoIcon from '../../assets/icons/logo-hitpay.svg'
import moneyLineIcon from '../../assets/icons/icon-money-line.svg'
import moneyBulkIcon from '../../assets/icons/icon-money.svg'
import bag2LineIcon from '../../assets/icons/icon-bag-2.svg'
import bag2BulkIcon from '../../assets/icons/icon-bag-2-bulk.svg'
import note2LineIcon from '../../assets/icons/icon-note-2.svg'
import note2BulkIcon from '../../assets/icons/icon-note-2-bulk.svg'
import aiChatIcon from '../../assets/icons/icon-ai-chat.svg'
import aiChatBulkIcon from '../../assets/icons/icon-ai-chat-bulk.svg'
import giftIcon from '../../assets/icons/icon-gift.svg'

import { ref } from 'vue'
import { agentPanelOpen } from '../../composables/useAgentPanel.js'

const hovered = ref(false)
const activeBottom = ref(null)

function handleBottomClick(i, item) {
  if (item.label === 'AI Assistant') {
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
  { icon: aiChatIcon, iconActive: aiChatBulkIcon, label: 'AI Assistant' },
  { icon: giftIcon, label: 'Refer & Earn' },
]
</script>

<style scoped>
/* Floating rail panel — collapsed blends with the page bg; on hover it becomes
   a 140px white overlay with top/bottom borders + a right drop-shadow. */
.nav-panel {
  width: 64px;
  background: #f8f9fc;
  border-top: 1px solid transparent;
  border-bottom: 1px solid transparent;
  box-shadow: 1px 0 11px rgba(38, 42, 50, 0);
  transition:
    width 250ms cubic-bezier(0.4, 0, 0.2, 1),
    background 200ms ease-out,
    border-color 200ms ease-out,
    box-shadow 200ms ease-out;
}
.nav-panel--expanded {
  width: 164px;
  background: #ffffff;
  border-top-color: #e5e6ea;
  border-bottom-color: #e5e6ea;
  box-shadow: 1px 0 11px rgba(38, 42, 50, 0.16);
}

.nav-label {
  margin-left: 0;
  max-width: 0;
  opacity: 0;
  white-space: nowrap;
  line-height: 1.5;
  overflow: hidden;
  transition:
    max-width 250ms cubic-bezier(0.4, 0, 0.2, 1),
    margin-left 250ms cubic-bezier(0.4, 0, 0.2, 1),
    opacity 180ms ease-out;
}
.nav-label--shown {
  margin-left: 8px;
  max-width: 120px;
  opacity: 1;
}
</style>
