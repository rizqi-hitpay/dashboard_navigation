<template>
  <span>{{ display }}</span>
</template>

<script setup>
import { computed, onBeforeUnmount, ref, watch } from 'vue'

// Renders a formatted figure like "SGD 398,152", "+5%" or "SGD 1,200.00".
// While `loaded` is false it shows the zero equivalent (same prefix/suffix/
// decimals); when it flips true it counts up to the real value. Mounted with
// loaded already true → shows the final value with no animation.
const props = defineProps({
  value: { type: String, required: true },
  loaded: { type: Boolean, default: false },
  duration: { type: Number, default: 1400 },
})

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

const progress = ref(props.loaded ? 1 : 0)
let raf = null

watch(() => props.loaded, (loaded) => {
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
