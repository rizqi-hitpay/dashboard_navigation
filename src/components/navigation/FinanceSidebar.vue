<template>
  <SidebarSections :sections="sections" :active-key="activeItem" @select="handleItemClick" />
</template>

<script setup>
// Finance main menu — Sidebar v4 styling (Figma 6416:16678)
import { computed } from 'vue'
import SidebarSections from './SidebarSections.vue'
import { activeItems } from '../../composables/useSidebarActiveItem.js'
import { claimsRole } from '../../composables/useClaimsRole.js'

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
import billIcon from '../../assets/icons/icon-bill.svg'
import cardOutIcon from '../../assets/icons/icon-card-out.svg'

const activeItem = activeItems.finance

function handleItemClick(item) {
  // Navigation is handled by SidebarMenuItem (via :url / auto-slug); just track active state.
  activeItem.value = item.id || item.label
}

const sections = computed(() => [
  {
    items: [
      { icon: dollarPaperIcon, label: 'Fee invoice' },
    ],
  },
  {
    header: 'Bill Pay',
    items: [
      { icon: paperRollIcon, label: 'Bills', url: '/bills' },
      { icon: groupIcon, label: 'Vendors', url: '/vendors' },
      { icon: settingIcon, label: 'Settings', id: 'bill-pay-settings', url: '/settings' },
    ],
  },
  {
    header: 'Send Money',
    items: [
      { icon: sendMoneyIcon, label: 'Summary' },
      { icon: usersIcon, label: 'Beneficiaries' },
      { icon: documentIcon, label: 'Transfer History' },
    ],
  },
  {
    header: 'Cards',
    items: [
      { icon: bankCardIcon, label: 'Cards' },
      { icon: transactionIcon, label: 'Transactions', url: '/cards/transactions' },
      { icon: wallet3Icon, label: 'Balance', url: '/cards/balance' },
    ],
  },
  // Admin/Owner: "New" on the section + Reimbursements; Employee: Claims only, "New" on the item
  {
    header: 'Claims',
    headerNew: claimsRole.value === 'admin',
    items: claimsRole.value === 'admin'
      ? [
          { icon: billIcon, label: 'Claims', url: '/claims' },
          { icon: cardOutIcon, label: 'Reimbursements', url: '/claims/reimbursements' },
        ]
      : [
          { icon: billIcon, label: 'Claims', url: '/claims', showNewChip: true },
        ],
  },
])
</script>
