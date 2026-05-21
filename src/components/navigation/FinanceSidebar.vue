<template>
  <div class="flex flex-col flex-1 min-h-0 overflow-hidden">
    <!-- Title bar -->
    <div class="flex items-center justify-between shrink-0" style="padding: 8px 16px; min-height: 48px; border-bottom: 1px solid #f0f1f5;">
      <span class="text-[14px] font-medium text-[#03102f]">Finance</span>
      <div class="relative">
        <button
          class="flex items-center justify-center w-6 h-6 rounded transition-colors duration-150"
          :class="plusOpen ? 'bg-[rgba(0,39,113,0.08)]' : 'hover:bg-gray-100'"
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
        <PlusMenu v-model="plusOpen" :items="plusItems" />
      </div>
    </div>

    <!-- Scrollable menu -->
    <div class="flex-1 overflow-y-auto px-2 py-2 space-y-0.5">
      <template v-for="section in sections" :key="section.header || 'main'">
        <div v-if="section.header" class="pt-3 pb-1 px-2">
          <span class="text-[10px] font-medium tracking-widest uppercase" :style="{ color: section.headerColor }">{{ section.header }}</span>
        </div>
        <SidebarMenuItem
          v-for="item in section.items"
          :key="item.label"
          :icon="item.icon"
          :label="item.label"
          :active="activeItem === item.label"
          :expandable="item.expandable"
          :submenu-items="item.submenuItems || []"
          @click="activeItem = item.label"
        />
      </template>
    </div>

  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import SidebarMenuItem from './SidebarMenuItem.vue'
import PlusMenu from './PlusMenu.vue'
import { settingsOpen } from '../../composables/useSettingsPanel.js'

import plusIcon from '../../assets/icons/icon-plus.svg'
import gridIcon from '../../assets/icons/icon-grid.svg'
import circleArrowIcon from '../../assets/icons/icon-circle-arrow.svg'
import dollarPaperIcon from '../../assets/icons/icon-dollar-paper.svg'
import sendMoneyIcon from '../../assets/icons/icon-send-money.svg'
import walletIcon from '../../assets/icons/icon-wallet.svg'
import cashIcon from '../../assets/icons/icon-cash.svg'
import safeAlertIcon from '../../assets/icons/icon-safe-alert.svg'
import safeIcon from '../../assets/icons/icon-safe.svg'
import taxIcon from '../../assets/icons/icon-tax.svg'
import doubleArrowIcon from '../../assets/icons/icon-double-arrow.svg'
import paperRollIcon from '../../assets/icons/icon-paper-roll.svg'
import document2Icon from '../../assets/icons/icon-document-2.svg'
import refreshIcon from '../../assets/icons/icon-refresh.svg'
import settingIcon from '../../assets/icons/icon-setting.svg'
const activeItem = ref('Overview')
const plusOpen = ref(false)

watch(activeItem, (val) => {
  if (val === 'Settings') {
    settingsOpen.value = true
    activeItem.value = null
  }
})

const plusItems = [
  { label: 'Bill',       shortcut: ['c', 'b'] },
  { label: 'Transfer',   shortcut: ['c', 't'] },
  { label: 'Payroll',    shortcut: ['c', 'p'] },
]

const genericSubmenu = [
  { label: 'All menus', showBeta: true },
  { label: 'All menus', showBeta: true },
  { label: 'All menus', showBeta: true },
]

const sections = [
  {
    items: [
      { icon: gridIcon, label: 'Overview' },
      { icon: circleArrowIcon, label: 'Cash flow' },
    ],
  },
  {
    header: 'Tools',
    headerColor: '#8093b8',
    items: [
      { icon: dollarPaperIcon, label: 'Bill Pay' },
      { icon: sendMoneyIcon, label: 'Send Money' },
      { icon: walletIcon, label: 'Employee Spend' },
      { icon: cashIcon, label: 'Payroll' },
      { icon: safeAlertIcon, label: 'Chargeback & Disputes' },
      { icon: safeIcon, label: 'Approval Rules' },
    ],
  },
  {
    header: 'Accounting',
    headerColor: '#8093b8',
    items: [
      { icon: taxIcon, label: 'Fee Invoice' },
      { icon: doubleArrowIcon, label: 'Reconciliation' },
      { icon: paperRollIcon, label: 'Statements' },
      { icon: document2Icon, label: 'Tax Reports' },
      { icon: refreshIcon, label: 'Accounting Sync' },
    ],
  },
  {
    header: 'Others',
    headerColor: '#a6b3cd',
    items: [
      { icon: settingIcon, label: 'Settings', expandable: true },
    ],
  },
]
</script>
