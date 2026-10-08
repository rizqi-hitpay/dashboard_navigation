<template>
  <!-- Bar chart (Figma Analytics-with-AI: 1:6286) -->
  <div class="relative w-full" :style="{ height: height + 'px' }">
    <!-- Y axis -->
    <div class="absolute left-0 top-0 flex flex-col justify-between" :style="{ height: plotH + 'px' }">
      <p
        v-for="label in Y_AXIS"
        :key="label"
        class="w-[32px] p-[4px] box-content text-[10px] font-medium uppercase tracking-[0.3px] leading-[18px] text-[#9295a5] text-center"
      >{{ label }}</p>
    </div>

    <!-- Bars: whole column is the hover target -->
    <div
      class="absolute left-0 right-0 flex items-end gap-[4px]"
      :style="{ top: PLOT_TOP + 'px', height: plotH + 'px', paddingLeft: PLOT_LEFT + 'px' }"
      @mouseleave="hovered = null"
    >
      <div
        v-for="(v, i) in values"
        :key="i"
        class="relative flex-1 min-w-0 h-full flex items-end"
        @mouseenter="hovered = i"
      >
        <div
          class="bar w-full rounded-t-[4px]"
          :class="{ 'bar--static': static }"
          :style="{ height: valueToPx(v, plotH) + 'px', backgroundColor: barColor(i), animationDelay: `${150 + i * 50}ms` }"
        />
      </div>

      <Transition name="tip">
        <ChartTooltip
          v-if="hovered !== null"
          class="tip absolute z-10"
          :style="tooltipStyle"
          :label="labels[hovered]"
          :value="formatK(values[hovered])"
          :change="kind === 'time' ? changeAt(values, hovered) : null"
          :arrow-at="arrowAt"
          :note="kind === 'category' ? `${share(hovered)}% of total` : ''"
        />
      </Transition>
    </div>

    <!-- X axis -->
    <div v-if="xAxis" class="absolute left-0 right-0" :style="{ top: plotH + PLOT_TOP + 'px' }">
      <img :src="baselineImg" alt="" class="absolute top-[-1px] h-px" :style="{ left: PLOT_LEFT + 'px', width: `calc(100% - ${PLOT_LEFT + 16}px)` }" />
      <div class="flex gap-[4px]" :style="{ paddingLeft: PLOT_LEFT + 'px' }">
        <p
          v-for="(label, i) in labels"
          :key="label"
          class="flex-1 min-w-0 p-[4px] text-[10px] font-medium uppercase tracking-[0.3px] leading-[18px] text-center whitespace-nowrap overflow-hidden text-ellipsis transition-colors duration-150"
          :class="hovered === i ? 'text-[#03102f]' : 'text-[#9295a5]'"
        >{{ label }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import ChartTooltip from './ChartTooltip.vue'
import { Y_AXIS, PLOT_LEFT, PLOT_TOP, X_AXIS_H, valueToPx, formatK, changeAt } from './chartAxis.js'
import baselineImg from '../../assets/icons/chart-baseline.svg'

const props = defineProps({
  labels: { type: Array, required: true },
  values: { type: Array, required: true },
  kind: { type: String, default: 'time' }, // 'time' → change vs previous · 'category' → share of total
  height: { type: Number, default: 249 },
  xAxis: { type: Boolean, default: true },
  static: { type: Boolean, default: false }, // skip the grow-in animation
})

const hovered = ref(null)
const plotH = computed(() => props.height - PLOT_TOP - (props.xAxis ? X_AXIS_H : 0))
const maxIndex = computed(() => props.values.indexOf(Math.max(...props.values)))

function barColor(i) {
  if (i === maxIndex.value) return hovered.value === i ? '#2465de' : '#4c8afd'
  return hovered.value === i ? '#b3cdfe' : '#ccdefe'
}

const share = (i) => Math.round((props.values[i] / props.values.reduce((a, b) => a + b, 0)) * 100)

// Above the hovered bar, kept inside the plot at the edges
const tooltipStyle = computed(() => {
  const i = hovered.value
  const n = props.values.length
  const top = plotH.value - valueToPx(props.values[i], plotH.value) - 56
  const shift = '-' + edgeAnchor(i, n)
  return {
    top: Math.max(top, -8) + 'px',
    left: `calc(${PLOT_LEFT}px + (100% - ${PLOT_LEFT}px) * ${(i + 0.5) / n})`,
    transform: `translateX(${shift})`,
  }
})

// Tooltips at the first/last point shift inward; the arrow follows the point
const edgeAnchor = (i, n) => (i === 0 ? '20%' : i === n - 1 ? '80%' : '50%')
const arrowAt = computed(() => (hovered.value === null ? '50%' : edgeAnchor(hovered.value, props.values.length)))
</script>

<style scoped>
.bar {
  transform-origin: bottom;
  animation: bar-grow 650ms cubic-bezier(0.34, 1.2, 0.64, 1) both;
  transition: background-color 150ms ease, height 400ms cubic-bezier(0.4, 0, 0.2, 1);
}
.bar--static {
  animation: none;
}
@keyframes bar-grow {
  from { transform: scaleY(0); }
  to { transform: scaleY(1); }
}

.tip {
  transition: left 150ms cubic-bezier(0.4, 0, 0.2, 1), top 150ms cubic-bezier(0.4, 0, 0.2, 1), transform 150ms ease;
}
.tip-enter-active,
.tip-leave-active {
  transition: opacity 120ms ease;
}
.tip-enter-from,
.tip-leave-to {
  opacity: 0;
}

@media (prefers-reduced-motion: reduce) {
  .bar { animation: none; transition: none; }
}
</style>
