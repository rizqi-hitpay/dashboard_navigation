<template>
  <div class="bg-white rounded-[8px] flex flex-col" style="border: 1px solid #e5e6ea; min-width: 0;">
    <!-- Top: label + info icon + trend badge -->
    <div class="flex items-center gap-2 shrink-0" style="padding: 8px 12px; min-height: 42px; border-bottom: 1px solid #e5e6ea;">
      <span class="flex-1 text-[14px] font-normal text-[#03102f] leading-none truncate">{{ label }}</span>

      <!-- Info icon (optional) -->
      <button v-if="showInfo" class="shrink-0 w-4 h-4 flex items-center justify-center opacity-60 hover:opacity-100 transition-opacity">
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="7" cy="7" r="6" stroke="#61667c" stroke-width="1.2"/>
          <path d="M7 6v4M7 4.5v.5" stroke="#61667c" stroke-width="1.2" stroke-linecap="round"/>
        </svg>
      </button>

      <!-- UpDown trend badge -->
      <div
        v-if="trend"
        class="shrink-0 flex items-center gap-0.5 rounded-[4px]"
        style="padding: 4px 8px; border: 1px solid #e5e6ea; height: 26px;"
      >
        <!-- Triangle icon: up=green, down=red -->
        <svg width="10" height="9" viewBox="0 0 10 9" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            v-if="direction === 'up'"
            d="M5 0.5L9.5 8.5H0.5L5 0.5Z"
            :fill="upColor"
          />
          <path
            v-else
            d="M5 8.5L0.5 0.5H9.5L5 8.5Z"
            :fill="downColor"
          />
        </svg>
        <span class="text-[13px] text-[#03102f] leading-none" style="font-family: 'Reddit Mono', monospace; font-weight: 400;">{{ trend }}</span>
      </div>
    </div>

    <!-- Bottom: value -->
    <div class="flex items-center" style="padding: 12px; min-height: 57px;">
      <span
        class="text-[24px] text-[#03102f] truncate leading-none"
        style="font-family: 'Reddit Mono', monospace; font-weight: 500;"
      >{{ value }}</span>
    </div>
  </div>
</template>

<script setup>
defineProps({
  label:     { type: String, required: true },
  value:     { type: String, required: true },
  trend:     { type: String, default: '' },
  direction: { type: String, default: 'up' },
  showInfo:  { type: Boolean, default: false },
})

const upColor   = '#2BC37D'
const downColor = '#DC3545'
</script>
