<template>
  <!-- Chart detail tooltip — content of Tooltip/Detail Chart (1:6330), styled as Tooltip/Dark (1:6336) -->
  <div class="chart-tip flex flex-col justify-center px-[8px] py-[4px] rounded-[4px] bg-[#343848] pointer-events-none whitespace-nowrap">
    <p class="text-[10px] font-medium uppercase tracking-[0.3px] leading-[18px] text-[#9295a5]">{{ label }}</p>
    <div class="flex items-center gap-[8px]">
      <p class="text-[14px] font-medium text-white leading-[1.5]">{{ value }}</p>
      <div v-if="change !== null" class="flex items-center gap-[2px]">
        <img :src="change < 0 ? downIcon : upIcon" :width="change < 0 ? 12 : 10" height="9" alt="" class="block" />
        <p class="text-[12px] font-medium text-[#cbcdd4] leading-[1.5]">{{ Math.abs(change) }}%</p>
      </div>
      <p v-else-if="note" class="text-[12px] font-medium text-[#cbcdd4] leading-[1.5]">{{ note }}</p>
    </div>
    <!-- Arrow points at the hovered bar / point -->
    <span class="absolute bottom-[-6px] -translate-x-1/2 rotate-180" :style="{ left: arrowAt }">
      <img :src="arrowIcon" width="12" height="7.33" alt="" class="block" />
    </span>
  </div>
</template>

<script setup>
import downIcon from '../../assets/icons/chart-tooltip-down.svg'
import upIcon from '../../assets/icons/icon-trend-up-green.svg'
import arrowIcon from '../../assets/icons/tooltip-arrow-dark.svg'

defineProps({
  label: { type: String, required: true },
  value: { type: String, required: true },
  change: { type: Number, default: null }, // % vs previous point
  note: { type: String, default: '' },     // shown when there is no change, e.g. "34% of total"
  arrowAt: { type: String, default: '50%' }, // matches the tooltip's horizontal shift at chart edges
})
</script>

<style scoped>
.chart-tip {
  box-shadow: 0px 1px 3px 0px rgba(0, 0, 0, 0.1), 0px 3px 22px 0px rgba(38, 42, 50, 0.09);
}
</style>
