<template>
  <svg :width="size" :height="size" :viewBox="`0 0 ${size} ${size}`" class="shrink-0">
    <circle
      :cx="cx"
      :cy="cy"
      :r="r"
      fill="none"
      stroke="#f0f1f5"
      :stroke-width="strokeWidth"
    />
    <circle
      v-for="(seg, i) in computed_segments"
      :key="i"
      :cx="cx"
      :cy="cy"
      :r="r"
      fill="none"
      :stroke="seg.color"
      :stroke-width="strokeWidth"
      :stroke-dasharray="`${seg.dash} ${circumference}`"
      :stroke-dashoffset="-seg.offset"
      stroke-linecap="round"
      style="transition: stroke-dasharray 300ms ease-out;"
    />
    <!-- Center text -->
    <text
      :x="cx"
      :y="cy - 6"
      text-anchor="middle"
      font-size="14"
      font-weight="600"
      fill="#03102f"
    >{{ topSegment.pct }}%</text>
    <text
      :x="cx"
      :y="cy + 10"
      text-anchor="middle"
      font-size="9"
      fill="#8093b8"
    >{{ topSegment.label }}</text>
  </svg>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  segments: { type: Array, default: () => [] },
  size: { type: Number, default: 100 },
  strokeWidth: { type: Number, default: 12 },
})

const cx = computed(() => props.size / 2)
const cy = computed(() => props.size / 2)
const r = computed(() => (props.size - props.strokeWidth) / 2 - 2)
const circumference = computed(() => 2 * Math.PI * r.value)

const computed_segments = computed(() => {
  let offset = 0
  return props.segments.map(seg => {
    const dash = (seg.pct / 100) * circumference.value
    const result = { ...seg, dash, offset }
    offset += dash
    return result
  })
})

const topSegment = computed(() => {
  if (!props.segments.length) return { pct: 0, label: '' }
  return props.segments.reduce((a, b) => a.pct > b.pct ? a : b)
})
</script>
