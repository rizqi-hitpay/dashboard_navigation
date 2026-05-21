<template>
  <div class="flex flex-col flex-1 min-h-0 overflow-hidden">

    <!-- Title bar -->
    <div class="flex items-center shrink-0 gap-2" style="padding: 8px 16px; min-height: 48px; border-bottom: 1px solid #f0f1f5;">
      <button
        class="shrink-0 hover:opacity-70 transition-opacity"
        style="width: 18px; height: 18px; display: flex; align-items: center; justify-content: center;"
        @click="settingsOpen = false"
      >
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
          <path d="M11 13.5L6.5 9l4.5-4.5" stroke="#4c689c" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>
      <span class="text-[14px] font-medium text-[#03102f]">Settings</span>
    </div>

    <!-- Scrollable menu -->
    <div class="flex-1 overflow-y-auto py-2" style="padding-left: 8px; padding-right: 8px;">
      <template v-for="section in sections" :key="section.header">
        <div class="px-2 pb-1" style="padding-top: 12px;">
          <span class="text-[10px] font-medium tracking-widest uppercase" style="color: #8093b8;">{{ section.header }}</span>
        </div>
        <div
          v-for="item in section.items"
          :key="item.label"
          class="flex items-center gap-2 px-2 cursor-pointer transition-colors duration-150"
          style="border-radius: 4px; min-height: 28px; padding-top: 4px; padding-bottom: 4px;"
          :class="activeItem === item.label
            ? 'bg-[rgba(0,39,113,0.04)]'
            : 'hover:bg-[rgba(0,39,113,0.04)]'"
          @click="activeItem = item.label"
        >
          <span
            class="flex-1 text-[13px] truncate"
            :style="{ color: activeItem === item.label ? '#2364dd' : '#03102f', fontWeight: activeItem === item.label ? 500 : 400 }"
          >{{ item.label }}</span>

          <div class="flex items-center gap-1 shrink-0">
            <!-- BETA badge -->
            <span
              v-if="item.beta"
              class="text-[10px] font-medium text-white"
              style="background: #f4b840; padding: 2px 8px; border-radius: 4px; line-height: 1.8;"
            >BETA</span>
            <!-- Count badge -->
            <span
              v-if="item.count"
              class="text-[10px] font-medium text-white flex items-center justify-center shrink-0"
              style="background: #dc3545; width: 20px; height: 20px; border-radius: 32px;"
            >{{ item.count }}</span>
            <!-- Blue dot -->
            <span
              v-if="item.dot"
              class="flex items-center justify-center shrink-0"
              style="width: 18px; height: 18px;"
            >
              <span style="width: 6px; height: 6px; border-radius: 50%; background: #2364dd; display: block;"></span>
            </span>
            <!-- Warning chip -->
            <span
              v-if="item.warning"
              class="flex items-center justify-center shrink-0"
              style="width: 20px; height: 20px; background: white; border-radius: 4px;"
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M7 2.5L1.8 11h10.4L7 2.5z" stroke="#f4b840" stroke-width="1.2" stroke-linejoin="round" fill="none"/>
                <path d="M7 6.5v2.5" stroke="#f4b840" stroke-width="1.2" stroke-linecap="round"/>
                <circle cx="7" cy="10.5" r="0.6" fill="#f4b840"/>
              </svg>
            </span>
          </div>
        </div>
      </template>
    </div>

  </div>
</template>

<script setup>
import { ref } from 'vue'
import { settingsOpen } from '../../composables/useSettingsPanel.js'

const activeItem = ref('Business Details')

const sections = [
  {
    header: 'Account',
    items: [
      { label: 'Business Details', warning: true },
      { label: 'Account Verification' },
      { label: 'Bank Accounts' },
    ],
  },
  {
    header: 'Team',
    items: [
      { label: 'Staff' },
      { label: 'Audit Logs' },
    ],
  },
  {
    header: 'Branding',
    items: [
      { label: 'Checkout Customisation' },
      { label: 'Order Form Customisation' },
    ],
  },
  {
    header: 'Communications',
    items: [
      { label: 'Email Templates' },
      { label: 'Notifications' },
    ],
  },
  {
    header: 'Tax & Fees',
    items: [
      { label: 'Taxes' },
      { label: 'Surcharges' },
    ],
  },
  {
    header: 'Partners',
    items: [
      { label: 'Partners' },
      { label: 'Platform' },
    ],
  },
]
</script>
