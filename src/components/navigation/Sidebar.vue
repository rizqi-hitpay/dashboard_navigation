<template>
  <SidebarSections :sections="sections" :active-key="activeItem" @select="activeItem = $event.label" />
</template>

<script setup>
// Payments main menu (Figma 6416:16684)
import { watch } from 'vue'
import { useRoute } from 'vue-router'
import SidebarSections from './SidebarSections.vue'
import { activeItems } from '../../composables/useSidebarActiveItem.js'

import gridIcon from '../../assets/icons/sidebar-v4/grid.svg'
import transactionIcon from '../../assets/icons/sidebar-v4/transaction.svg'
import pieChartIcon from '../../assets/icons/sidebar-v4/pie-chart.svg'
import bankIcon from '../../assets/icons/sidebar-v4/bank.svg'
import usersIcon from '../../assets/icons/sidebar-v4/users.svg'
import productIcon from '../../assets/icons/sidebar-v4/product.svg'
import linkIcon from '../../assets/icons/sidebar-v4/link.svg'
import receiptIcon from '../../assets/icons/sidebar-v4/receipt.svg'
import repeatIcon from '../../assets/icons/sidebar-v4/repeat.svg'
import qrCodeIcon from '../../assets/icons/sidebar-v4/qr-code.svg'
import codeIcon from '../../assets/icons/sidebar-v4/code.svg'
import puzzleIcon from '../../assets/icons/sidebar-v4/puzzle.svg'
import bankCardIcon from '../../assets/icons/sidebar-v4/bank-card.svg'
import giftIcon from '../../assets/icons/sidebar-v4/gift.svg'

const activeItem = activeItems.payments

// Opening Reports or Analytics directly (URL, AI panel "Add to analytics")
// highlights the parent so its submenu shows
const route = useRoute()
watch(() => route.path, (path) => {
  if (/^\/(reports|analytics)(\/|$)/.test(path)) activeItem.value = 'Reports'
}, { immediate: true })

const invoicingSubmenu = [
  { label: 'All Invoices' },
  { label: 'Repeating', showBeta: true },
  { label: 'Products' },
]

const recurringBillingSubmenu = [
  { label: 'Plans' },
  { label: 'Subscription' },
]

// Figma Analytics-with-AI: 114:15953
const reportsSubmenu = [
  { label: 'Reports', url: '/reports' },
  { label: 'Analytics', url: '/analytics', showBeta: true },
]

const payoutsSubmenu = [
  { label: 'Payouts' },
  { label: 'Wallet Balances' },
]

// Icons are Figma's own sidebar-v4 assets (already text/400), so no tint
const v4 = (items) => items.map((i) => ({ ...i, iconTint: false }))

const sections = [
  {
    items: v4([
      { icon: gridIcon, label: 'Overview', url: '/' },
      { icon: transactionIcon, label: 'Transactions' },
      { icon: pieChartIcon, label: 'Reports', submenuItems: reportsSubmenu },
      { icon: bankIcon, label: 'Payouts & Balances', submenuItems: payoutsSubmenu },
      { icon: usersIcon, label: 'Customer' },
      { icon: productIcon, label: 'Products' },
    ]),
  },
  {
    header: 'No-code tools',
    items: v4([
      { icon: linkIcon, label: 'Payment Links' },
      { icon: receiptIcon, label: 'Invoicing', submenuItems: invoicingSubmenu },
      { icon: repeatIcon, label: 'Recurring Billing', submenuItems: recurringBillingSubmenu },
      { icon: qrCodeIcon, label: 'Static QRs' },
    ]),
  },
  {
    header: 'Others',
    items: v4([
      { icon: codeIcon, label: 'Developers' },
      { icon: puzzleIcon, label: 'Integrations' },
      { icon: bankCardIcon, label: 'Payment Methods' },
      { icon: giftIcon, label: 'Refer and earn' },
    ]),
  },
]
</script>
