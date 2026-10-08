<template>
  <!-- Chart hover tooltip — Tooltip/Dark (Figma Analytics-with-AI: 1:6336) carrying the
       Tooltip/Detail Chart content (1:6330): date · value · change, in one row -->
  <div class="chart-tip flex items-center justify-center gap-[8px] px-[8px] py-[4px] rounded-[4px] bg-[#343848] pointer-events-none whitespace-nowrap">
    <p class="tip-text">{{ label }}</p>
    <p class="tip-text">{{ value }}</p>
    <div v-if="change !== null" class="flex items-center gap-[2px]">
      <img :src="change < 0 ? downIcon : upIcon" :width="change < 0 ? 12 : 10" height="9" alt="" class="block" />
      <p class="tip-text">{{ Math.abs(change) }}%</p>
    </div>
    <p v-else-if="note" class="tip-text">{{ note }}</p>
    <!-- Arrow points at the hovered bar / point -->
    <span class="absolute bottom-[-6px] -translate-x-1/2 rotate-180" :style="{ left: `calc(${arrowAt} + 0.5px)` }">
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
/* Sans/Body Small/Medium in text/200 */
.tip-text {
  font-size: 12px;
  font-weight: 500;
  line-height: 1.5;
  color: #cbcdd4;
  text-align: center;
}
</style>
