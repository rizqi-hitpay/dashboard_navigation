<template>
  <div class="h-full overflow-y-auto bg-white" style="padding: 24px 28px;">
    <div class="flex items-center shrink-0 mb-5">
      <h1 class="text-[18px] font-medium text-[#03102f]">Bill Pay Settings</h1>
    </div>

    <div class="max-w-[640px] space-y-4">
      <div
        v-for="group in groups"
        :key="group.title"
        class="rounded-lg border border-[#E5E6EA] overflow-hidden"
      >
        <div class="px-4 py-3 border-b border-[#f0f1f5]">
          <p class="text-[13px] font-medium text-[#03102f]">{{ group.title }}</p>
          <p class="text-[12px] text-[#61667c]">{{ group.description }}</p>
        </div>
        <div>
          <div
            v-for="setting in group.settings"
            :key="setting.label"
            class="flex items-center justify-between px-4 py-3 border-b border-[#f6f7f9] last:border-0"
          >
            <span class="text-[13px] text-[#03102f]">{{ setting.label }}</span>
            <button
              class="relative w-9 h-5 rounded-full transition-colors duration-150 shrink-0"
              :style="{ background: setting.on ? '#2364dd' : '#d4d8e2' }"
              @click="setting.on = !setting.on"
            >
              <span
                class="absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white transition-transform duration-150"
                :style="{ transform: setting.on ? 'translateX(16px)' : 'translateX(0)' }"
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive } from 'vue'

const groups = reactive([
  {
    title: 'Approvals',
    description: 'Control who can approve and pay bills.',
    settings: [
      { label: 'Require approval before payment', on: true },
      { label: 'Allow auto-approve under SGD 500', on: false },
    ],
  },
  {
    title: 'Notifications',
    description: 'Choose when to be notified about bills.',
    settings: [
      { label: 'Email me when a bill is due', on: true },
      { label: 'Notify on failed payments', on: true },
      { label: 'Weekly bill summary', on: false },
    ],
  },
  {
    title: 'Payments',
    description: 'Defaults applied to new bill payments.',
    settings: [
      { label: 'Schedule payments on due date', on: true },
      { label: 'Use primary account by default', on: true },
    ],
  },
])
</script>
