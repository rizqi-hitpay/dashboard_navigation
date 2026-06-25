<template>
  <div class="w-[81px] flex flex-col h-full bg-[#f8f9fc] shrink-0 py-2">
    <!-- Logo -->
    <div class="relative flex justify-center items-center h-[56px] px-2">
      <img :src="logoIcon" alt="HitPay" class="w-8 h-8" />
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
        :icon-active="item.iconActive"
        :label="item.label"
        :active="item.label === 'AI Assistant' ? agentPanelOpen : activeBottom === i"
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
  { icon: giftIcon, label: 'Refer' },
]
</script>
