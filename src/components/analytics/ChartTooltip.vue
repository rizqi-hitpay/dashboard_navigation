<template>
  <!-- Tooltip/Detail Chart (Figma Analytics-with-AI: 1:6330) -->
  <div class="chart-tip flex flex-col justify-center px-[12px] py-[4px] rounded-[8px] bg-[#fcfcfd] pointer-events-none whitespace-nowrap">
    <p class="text-[10px] font-medium uppercase tracking-[0.3px] leading-[18px] text-[#9295a5]">{{ label }}</p>
    <div class="flex items-center gap-[8px]">
      <p class="text-[14px] font-medium text-[#03102f] leading-[1.5]">{{ value }}</p>
      <div v-if="change !== null" class="flex items-center gap-[2px]">
        <img :src="change < 0 ? downIcon : upIcon" :width="change < 0 ? 12 : 10" height="9" alt="" class="block" />
        <p class="text-[12px] font-medium text-[#61667c] leading-[1.5]">{{ Math.abs(change) }}%</p>
      </div>
      <p v-else-if="note" class="text-[12px] font-medium text-[#61667c] leading-[1.5]">{{ note }}</p>
    </div>
  </div>
</template>

<script setup>
import downIcon from '../../assets/icons/chart-tooltip-down.svg'
import upIcon from '../../assets/icons/icon-trend-up-green.svg'

defineProps({
  label: { type: String, required: true },
  value: { type: String, required: true },
  change: { type: Number, default: null }, // % vs previous point
  note: { type: String, default: '' },     // shown when there is no change, e.g. "34% of total"
})
</script>

<style scoped>
.chart-tip {
  box-shadow: 0px 1px 3px 0px rgba(0, 0, 0, 0.1), 0px 3px 22px 0px rgba(38, 42, 50, 0.09);
}
</style>
