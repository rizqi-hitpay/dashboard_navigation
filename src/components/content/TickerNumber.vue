<template>
  <span>{{ display }}</span>
</template>

<script setup>
import { computed, onBeforeUnmount, ref, watch } from 'vue'
import { useDashboardData } from '../../composables/useDashboardData.js'

// Renders a formatted figure like "SGD 398,152", "+5%" or "SGD 1,200.00".
// While the dashboard data hasn't "arrived" it shows the zero equivalent
// (same prefix/suffix/decimals); when dataLoaded flips true it counts up to
// the real value. Mounted after the data is already loaded → shows the final
// value with no animation (APIs are cached on re-visits).
const props = defineProps({
  value: { type: String, required: true },
  duration: { type: Number, default: 1400 },
})

const { dataLoaded } = useDashboardData()

// "SGD 398,152.50" → prefix "SGD ", target 398152.5, decimals 2, suffix ""
const parsed = computed(() => {
  const m = props.value.match(/-?[\d,]+(?:\.(\d+))?/)
  if (!m) return null
  return {
    prefix: props.value.slice(0, m.index),
    suffix: props.value.slice(m.index + m[0].length),
    target: parseFloat(m[0].replace(/,/g, '')),
    decimals: m[1] ? m[1].length : 0,
  }
})

const progress = ref(dataLoaded.value ? 1 : 0)
let raf = null

watch(dataLoaded, (loaded) => {
  cancelAnimationFrame(raf)
  if (!loaded) { progress.value = 0; return }
  const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (reduce) { progress.value = 1; return }
  const t0 = performance.now()
  const tick = (now) => {
    const t = Math.min((now - t0) / props.duration, 1)
    progress.value = 1 - Math.pow(1 - t, 3) // decelerate — fast start, soft landing
    if (t < 1) raf = requestAnimationFrame(tick)
  }
  raf = requestAnimationFrame(tick)
})

onBeforeUnmount(() => cancelAnimationFrame(raf))

const display = computed(() => {
  if (!parsed.value) return props.value
  const { prefix, suffix, target, decimals } = parsed.value
  const current = target * progress.value
  return prefix + current.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }) + suffix
})
</script>
