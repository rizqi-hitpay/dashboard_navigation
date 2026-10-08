<template>
  <!-- Area line chart (Figma Analytics-with-AI: 1:5180) -->
  <div ref="rootRef" class="relative w-full" :style="{ height: height + 'px' }" @mouseleave="hovered = null">
    <!-- Y axis -->
    <div class="absolute left-0 top-0 flex flex-col justify-between" :style="{ height: plotH + 'px' }">
      <p
        v-for="label in Y_AXIS"
        :key="label"
        class="w-[32px] p-[4px] box-content text-[10px] font-medium uppercase tracking-[0.3px] leading-[18px] text-[#9295a5] text-center"
      >{{ label }}</p>
    </div>

    <svg class="absolute left-0 top-0 overflow-visible" :width="width" :height="baseY" :viewBox="`0 0 ${width} ${baseY}`">
      <defs>
        <linearGradient :id="gradId" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="#ccdefe" />
          <stop offset="1" stop-color="#ffffff" />
        </linearGradient>
      </defs>
      <path :d="areaPath" :fill="`url(#${gradId})`" class="area" :class="{ 'area--static': static }" />
      <path :d="linePath" fill="none" stroke="#4c8afd" stroke-width="1.25" stroke-linejoin="round" pathLength="1" class="line" :class="{ 'line--static': static }" />

      <!-- Hover guide + point -->
      <g v-if="hovered !== null" class="pointer-events-none">
        <line :x1="points[hovered].x" :x2="points[hovered].x" :y1="points[hovered].y" :y2="baseY" stroke="#80acfe" stroke-dasharray="3 3" />
        <circle :cx="points[hovered].x" :cy="points[hovered].y" r="4" fill="#ffffff" stroke="#2465de" stroke-width="2" />
      </g>

      <!-- Hover zones: one column per point -->
      <rect
        v-for="(p, i) in points"
        :key="i"
        :x="p.x - colW / 2 - 2"
        y="0"
        :width="colW + 4"
        :height="baseY"
        fill="transparent"
        @mouseenter="hovered = i"
      />
    </svg>

    <Transition name="tip">
      <ChartTooltip
        v-if="hovered !== null"
        class="tip absolute z-10"
        :style="tooltipStyle"
        :label="labels[hovered]"
        :value="formatK(values[hovered])"
        :change="changeAt(values, hovered)"
        :arrow-at="arrowAt"
      />
    </Transition>

    <!-- X axis -->
    <div v-if="xAxis" class="absolute left-0 right-0" :style="{ top: baseY + 'px' }">
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
import { ref, computed, onMounted, onBeforeUnmount, useTemplateRef, useId } from 'vue'
import ChartTooltip from './ChartTooltip.vue'
import { Y_AXIS, PLOT_LEFT, PLOT_TOP, X_AXIS_H, valueToPx, formatK, changeAt } from './chartAxis.js'
import baselineImg from '../../assets/icons/chart-baseline.svg'

const props = defineProps({
  labels: { type: Array, required: true },
  values: { type: Array, required: true },
  height: { type: Number, default: 249 },
  xAxis: { type: Boolean, default: true },
  static: { type: Boolean, default: false }, // skip the draw-in animation
})

const gradId = `line-fill-${useId()}`
const rootRef = useTemplateRef('rootRef')
const width = ref(480)
const hovered = ref(null)

let ro
onMounted(() => {
  ro = new ResizeObserver(([entry]) => { width.value = Math.round(entry.contentRect.width) })
  ro.observe(rootRef.value)
})
onBeforeUnmount(() => ro?.disconnect())

const plotH = computed(() => props.height - PLOT_TOP - (props.xAxis ? X_AXIS_H : 0))
const baseY = computed(() => PLOT_TOP + plotH.value)

// Points sit at the centre of each x-axis label column (flex-1 with 4px gaps)
const colW = computed(() => (width.value - PLOT_LEFT - 4 * (props.values.length - 1)) / props.values.length)
const points = computed(() =>
  props.values.map((v, i) => ({
    x: PLOT_LEFT + i * (colW.value + 4) + colW.value / 2,
    y: baseY.value - valueToPx(v, plotH.value),
  })),
)

const linePath = computed(() => points.value.map((p, i) => `${i ? 'L' : 'M'}${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(' '))
const areaPath = computed(() => {
  const pts = points.value
  if (!pts.length) return ''
  return `${linePath.value} L${pts.at(-1).x.toFixed(1)} ${baseY.value} L${pts[0].x.toFixed(1)} ${baseY.value} Z`
})

const tooltipStyle = computed(() => {
  const i = hovered.value
  const n = props.values.length
  const p = points.value[i]
  const shift = '-' + edgeAnchor(i, n)
  return { top: Math.max(p.y - 42, -8) + 'px', left: p.x + 'px', transform: `translateX(${shift})` }
})

// Tooltips at the first/last point shift inward; the arrow follows the point
const edgeAnchor = (i, n) => (i === 0 ? '20%' : i === n - 1 ? '80%' : '50%')
const arrowAt = computed(() => (hovered.value === null ? '50%' : edgeAnchor(hovered.value, props.values.length)))
</script>

<style scoped>
.line {
  stroke-dasharray: 1;
  stroke-dashoffset: 1;
  animation: line-draw 900ms cubic-bezier(0.4, 0, 0.2, 1) 150ms forwards;
}
.area {
  opacity: 0;
  animation: area-in 600ms ease 450ms forwards;
}
.line--static {
  animation: none;
  stroke-dashoffset: 0;
}
.area--static {
  animation: none;
  opacity: 1;
}
@keyframes line-draw {
  to { stroke-dashoffset: 0; }
}
@keyframes area-in {
  to { opacity: 1; }
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
  .line { animation: none; stroke-dashoffset: 0; }
  .area { animation: none; opacity: 1; }
}
</style>
