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
      <span v-if="sidebarExpanded" class="text-[14px] font-medium text-[#03102f]">Payments</span>
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
          :active="activeItem === item.label"
          :expandable="item.expandable"
          :default-open="item.defaultOpen"
          :submenu-items="item.submenuItems || []"
          @click="activeItem = item.label"
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
import gridIcon from '../../assets/icons/icon-grid.svg'
import transactionIcon from '../../assets/icons/icon-transaction.svg'
import pieChartIcon from '../../assets/icons/icon-pie-chart.svg'
import bankIcon from '../../assets/icons/icon-bank.svg'
import usersIcon from '../../assets/icons/icon-users.svg'
import productIcon from '../../assets/icons/icon-product.svg'
import discountIcon from '../../assets/icons/icon-discount.svg'
import bankCardIcon from '../../assets/icons/icon-bank-card.svg'
import linkIcon from '../../assets/icons/icon-link.svg'
import receiptIcon from '../../assets/icons/icon-receipt.svg'
import repeatIcon from '../../assets/icons/icon-repeat.svg'
import qrCodeIcon from '../../assets/icons/icon-qr-code.svg'
import codeIcon from '../../assets/icons/icon-code.svg'
import puzzleIcon from '../../assets/icons/icon-puzzle.svg'
import settingIcon from '../../assets/icons/icon-setting.svg'
const activeItem = activeItems.payments
const plusOpen = ref(false)
const plusBtnRef = useTemplateRef('plusBtnRef')

watch(plusOpen, (open) => { sidebarPinned.value = open })

watch(activeItem, (val) => {
  if (val === 'Settings') {
    if (sidebarCollapsed.value) sidebarCollapsed.value = false
    settingsOpen.value = true
    activeItem.value = null
  }
})

const plusItems = [
  { label: 'Payment Link', shortcut: ['c', 'l'] },
  { label: 'Invoice',       shortcut: ['c', 'i'] },
  { label: 'Repeating Invoice', shortcut: ['c', 'r'] },
  { label: 'Plan',          shortcut: ['c', 'p'] },
  { label: 'Subscription',  shortcut: ['c', 's'] },
]

const invoicingSubmenu = [
  { label: 'All Invoices' },
  { label: 'Repeating', showBeta: true },
  { label: 'Products' },
]

const recurringBillingSubmenu = [
  { label: 'Plans' },
  { label: 'Subscription' },
]

const payoutsSubmenu = [
  { label: 'Payouts' },
  { label: 'Wallet Balances' },
]

const sections = [
  {
    items: [
      { icon: gridIcon, label: 'Overview' },
      { icon: transactionIcon, label: 'Transactions' },
      { icon: pieChartIcon, label: 'Reports' },
      { icon: bankIcon, label: 'Payouts & Balances', submenuItems: payoutsSubmenu },
      { icon: usersIcon, label: 'Customer' },
      { icon: productIcon, label: 'Products' },
      { icon: discountIcon, label: 'Discounts' },
    ],
  },
  {
    header: 'No-code Tools',
    headerColor: '#8093b8',
    items: [
      { icon: linkIcon, label: 'Payment Links' },
      { icon: receiptIcon, label: 'Invoicing', submenuItems: invoicingSubmenu },
      { icon: repeatIcon, label: 'Recurring Billing', submenuItems: recurringBillingSubmenu },
      { icon: qrCodeIcon, label: 'Static QRs' },
    ],
  },
  {
    header: 'Others',
    headerColor: '#a6b3cd',
    items: [
      { icon: codeIcon, label: 'Developers' },
      { icon: puzzleIcon, label: 'Integrations' },
      { icon: bankCardIcon, label: 'Payment Methods' },
      { icon: settingIcon, label: 'Settings', expandable: true },
    ],
  },
]
</script>
