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
      <span v-if="sidebarExpanded" class="text-[14px] font-medium text-[#03102f]">Commerce</span>
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
import { ref, watch, useTemplateRef } from 'vue'
import SidebarMenuItem from './SidebarMenuItem.vue'
import PlusMenu from './PlusMenu.vue'
import { settingsOpen } from '../../composables/useSettingsPanel.js'
import { sidebarExpanded, sidebarPinned, sidebarCollapsed } from '../../composables/useSidebarCollapsed.js'
import { activeItems } from '../../composables/useSidebarActiveItem.js'

import plusIcon from '../../assets/icons/icon-plus.svg'
import counterIcon from '../../assets/icons/icon-counter.svg'
import clipboardIcon from '../../assets/icons/icon-clipboard.svg'
import pieChartIcon from '../../assets/icons/icon-pie-chart.svg'
import usersIcon from '../../assets/icons/icon-users.svg'
import productIcon from '../../assets/icons/icon-product.svg'
import discountIcon from '../../assets/icons/icon-discount.svg'
import couponIcon from '../../assets/icons/icon-coupon.svg'
import terminalIcon from '../../assets/icons/icon-terminal.svg'
import mallIcon from '../../assets/icons/icon-mall.svg'
import storeIcon from '../../assets/icons/icon-store.svg'
import brushIcon from '../../assets/icons/icon-brush.svg'
import documentIcon from '../../assets/icons/icon-document.svg'
import imageIcon from '../../assets/icons/icon-image.svg'
import calendarIcon from '../../assets/icons/icon-calendar-today.svg'
import earthIcon from '../../assets/icons/icon-earth.svg'
import truckIcon from '../../assets/icons/icon-truck.svg'
import locationIcon from '../../assets/icons/icon-location.svg'
import settingIcon from '../../assets/icons/icon-setting.svg'

const activeItem = activeItems.commerce
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
  { label: 'Product',   shortcut: ['c', 'p'] },
  { label: 'Order',     shortcut: ['c', 'o'] },
  { label: 'Discount',  shortcut: ['c', 'd'] },
  { label: 'Coupon',    shortcut: ['c', 'c'] },
  { label: 'Booking',   shortcut: ['c', 'b'] },
]

const sections = [
  {
    items: [
      { icon: counterIcon, label: 'Web POS' },
      { icon: clipboardIcon, label: 'Orders' },
      { icon: pieChartIcon, label: 'Reports' },
      { icon: usersIcon, label: 'Customer' },
      { icon: productIcon, label: 'Products' },
    ],
  },
  {
    header: 'Marketing',
    headerColor: '#8093b8',
    items: [
      { icon: discountIcon, label: 'Discounts' },
      { icon: couponIcon, label: 'Coupons' },
    ],
  },
  {
    header: 'Point of Sale',
    headerColor: '#8093b8',
    items: [
      { icon: terminalIcon, label: 'Card Terminals' },
      { icon: mallIcon, label: 'Mall GTO Integrations' },
    ],
  },
  {
    header: 'Online Store',
    headerColor: '#8093b8',
    items: [
      { icon: storeIcon, label: 'Store Overview' },
      { icon: brushIcon, label: 'Store Design' },
      { icon: documentIcon, label: 'Pages' },
      { icon: imageIcon, label: 'Media' },
      { icon: calendarIcon, label: 'Booking' },
      { icon: earthIcon, label: 'Domain' },
      { icon: truckIcon, label: 'Shipping & Pickup' },
    ],
  },
  {
    header: 'Others',
    headerColor: '#a6b3cd',
    items: [
      { icon: locationIcon, label: 'Locations' },
      { icon: settingIcon, label: 'Settings', expandable: true },
    ],
  },
]
</script>
