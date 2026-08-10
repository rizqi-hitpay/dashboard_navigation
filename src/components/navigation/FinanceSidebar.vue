<template>
  <div class="flex flex-col flex-1 min-h-0 overflow-hidden">
    <!-- Title bar -->
    <div
      class="flex items-center shrink-0"
      :class="sidebarExpanded ? 'justify-between' : 'justify-center'"
      :style="{
        minHeight: '48px',
        borderBottom: '1px solid #f0f1f5',
        padding: sidebarExpanded ? '8px 16px' : '0',
      }"
    >
      <span v-if="sidebarExpanded" class="text-[14px] font-medium text-[#03102f]">Finance</span>
      <div class="relative">
        <button
          ref="plusBtnRef"
          class="flex items-center justify-center w-6 h-6 rounded border border-[#e5e6ea] transition-colors duration-150"
          :class="plusOpen ? 'bg-[rgba(0,39,113,0.08)]' : 'hover:bg-[#f0f1f5]'"
          @click="plusOpen = !plusOpen"
        >
          <img
            :src="plusIcon" alt="add" class="w-4 h-4 transition-transform duration-200"
            :style="{
              transform: plusOpen ? 'rotate(45deg)' : 'rotate(0deg)',
              filter: 'invert(27%) sepia(90%) saturate(1285%) hue-rotate(200deg) brightness(95%) contrast(97%)'
            }"
          />
        </button>
        <PlusMenu v-model="plusOpen" :items="plusItems" :anchor="plusBtnRef" />
      </div>
    </div>

    <!-- Scrollable menu -->
    <div class="flex-1 overflow-y-auto px-2 py-2 space-y-0.5">
      <template v-for="section in sections" :key="section.header || 'main'">
        <template v-if="section.header">
          <div v-if="sidebarExpanded" class="pt-3 pb-1 px-2">
            <span class="text-[10px] font-medium tracking-widest uppercase" :style="{ color: section.headerColor }">{{ section.header }}</span>
          </div>
          <div v-else class="py-2">
            <div class="h-px w-full bg-[#e5e6ea]" />
          </div>
        </template>
        <SidebarMenuItem
          v-for="item in section.items"
          :key="item.label"
          :icon="item.icon"
          :label="item.label"
          :url="item.url"
          :active="activeItem === (item.id || item.label)"
          :expandable="item.expandable"
          :submenu-items="item.submenuItems || []"
          @click="handleItemClick(item)"
        />
      </template>
    </div>

  </div>
</template>

<script setup>
import { ref, watch, useTemplateRef } from 'vue'
import SidebarMenuItem from './SidebarMenuItem.vue'
import PlusMenu from './PlusMenu.vue'
import { settingsOpen } from '../../composables/useSettingsPanel.js'
import { sidebarExpanded, sidebarPinned, sidebarCollapsed } from '../../composables/useSidebarCollapsed.js'
import { activeItems } from '../../composables/useSidebarActiveItem.js'

import plusIcon from '../../assets/icons/icon-plus.svg'
import dollarPaperIcon from '../../assets/icons/icon-dollar-paper.svg'
import paperRollIcon from '../../assets/icons/icon-paper-roll.svg'
import groupIcon from '../../assets/icons/icon-group.svg'
import settingIcon from '../../assets/icons/icon-setting.svg'
import sendMoneyIcon from '../../assets/icons/icon-send-money.svg'
import usersIcon from '../../assets/icons/icon-users.svg'
import documentIcon from '../../assets/icons/icon-document.svg'
import bankCardIcon from '../../assets/icons/icon-bank-card.svg'
import transactionIcon from '../../assets/icons/icon-transaction.svg'
import wallet3Icon from '../../assets/icons/icon-wallet-3.svg'

const activeItem = activeItems.finance
const plusOpen = ref(false)
const plusBtnRef = useTemplateRef('plusBtnRef')

function handleItemClick(item) {
  // The Others → Settings row drills into the settings sidebar instead of routing
  if (item.drilldown) {
    if (sidebarCollapsed.value) sidebarCollapsed.value = false
    settingsOpen.value = true
    return
  }
  // Navigation is handled by SidebarMenuItem (via :url / auto-slug); just track active state.
  activeItem.value = item.id || item.label
}

watch(plusOpen, (open) => { sidebarPinned.value = open })

const plusItems = [
  { label: 'Bill',       shortcut: ['c', 'b'] },
  { label: 'Transfer',   shortcut: ['c', 't'] },
  { label: 'Payroll',    shortcut: ['c', 'p'] },
]

const sections = [
  {
    items: [
      { icon: dollarPaperIcon, label: 'Fee invoice' },
    ],
  },
  {
    header: 'Bill Pay',
    headerColor: '#8093b8',
    items: [
      { icon: paperRollIcon, label: 'Bills', url: '/bills' },
      { icon: groupIcon, label: 'Vendors', url: '/vendors' },
      { icon: settingIcon, label: 'Settings', id: 'bill-pay-settings', url: '/settings' },
    ],
  },
  {
    header: 'Send Money',
    headerColor: '#8093b8',
    items: [
      { icon: sendMoneyIcon, label: 'Summary' },
      { icon: usersIcon, label: 'Beneficiaries' },
      { icon: documentIcon, label: 'Transfer History' },
    ],
  },
  {
    header: 'Cards',
    headerColor: '#8093b8',
    items: [
      { icon: bankCardIcon, label: 'Cards' },
      { icon: transactionIcon, label: 'Transactions', url: '/cards/transactions' },
      { icon: wallet3Icon, label: 'Balance', url: '/cards/balance' },
    ],
  },
  {
    header: 'Others',
    headerColor: '#8093b8',
    items: [
      { icon: settingIcon, label: 'Settings', expandable: true, drilldown: true },
    ],
  },
]
</script>
