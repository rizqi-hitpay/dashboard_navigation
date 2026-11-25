<template>
  <SidebarSections :sections="sections" :active-key="activeItem" @select="activeItem = $event.label" />
</template>

<script setup>
// Commerce main menu — Sidebar v4 styling (Figma 6416:16678)
import SidebarSections from './SidebarSections.vue'
import { activeItems } from '../../composables/useSidebarActiveItem.js'

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

const activeItem = activeItems.commerce

const sections = [
  {
    items: [
      { icon: counterIcon, label: 'Web POS', url: '/web-pos' },
      { icon: clipboardIcon, label: 'Orders' },
      { icon: pieChartIcon, label: 'Reports' },
      { icon: usersIcon, label: 'Customer' },
      { icon: productIcon, label: 'Products' },
    ],
  },
  {
    header: 'Marketing',
    items: [
      { icon: discountIcon, label: 'Discounts' },
      { icon: couponIcon, label: 'Coupons' },
    ],
  },
  {
    header: 'Point of Sale',
    items: [
      { icon: terminalIcon, label: 'Card Terminals' },
      { icon: mallIcon, label: 'Mall GTO Integrations' },
    ],
  },
  {
    header: 'Online Store',
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
    items: [
      { icon: locationIcon, label: 'Locations' },
    ],
  },
]
</script>
