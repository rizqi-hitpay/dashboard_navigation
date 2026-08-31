<template>
  <canvas
    ref="canvasRef"
    class="absolute inset-0 w-full h-full"
    aria-hidden="true"
    @pointerdown="onPointerDown"
    @pointermove="onPointerMove"
    @pointerleave="onPointerLeave"
  />
</template>

<script setup>
// Pulsing dot grid for the "Setting up your workspace" state — a 1:1 port
// of the workpulse reference (workpulse-eosin.vercel.app): an ambient
// radial sine wave flows outward from the center, clicks spawn expanding
// ripples, and hovering warms the dots near the cursor.
import { onMounted, onUnmounted, useTemplateRef } from 'vue'

const canvasRef = useTemplateRef('canvasRef')

const SPACING = 4
const COLOR = 'rgb(129, 161, 214)'
const RIPPLE_LIFE = 2600
// The dot field lives in a 700x700 circle at the center (Figma: 2092:13444),
// with a short soft fade at the rim
const AREA_R = 350
const RIM_FADE = 40

let raf = 0
let resizeObserver = null
let cw = 0
let ch = 0
let cx = 0
let cy = 0
let reducedMotion = false

const ripples = []
const pointer = { x: 0, y: 0, target: 0, current: 0 }

function onPointerDown(e) {
  const rect = e.currentTarget.getBoundingClientRect()
  ripples.push({ x: e.clientX - rect.left, y: e.clientY - rect.top, start: performance.now() })
}
function onPointerMove(e) {
  const rect = e.currentTarget.getBoundingClientRect()
  pointer.x = e.clientX - rect.left
  pointer.y = e.clientY - rect.top
  pointer.target = 1
}
function onPointerLeave() {
  pointer.target = 0
}

let grid = []

function resize() {
  const canvas = canvasRef.value
  if (!canvas) return
  const rect = canvas.getBoundingClientRect()
  cw = rect.width
  ch = rect.height
  cx = cw / 2
  cy = ch / 2
  const dpr = Math.min(window.devicePixelRatio || 1, 2)
  canvas.width = Math.round(cw * dpr)
  canvas.height = Math.round(ch * dpr)
  canvas.getContext('2d').setTransform(dpr, 0, 0, dpr, 0, 0)

  // Precompute the in-circle dot grid once — at a 4px pitch there are tens
  // of thousands of cells, so per-frame hypot/bounds work would add up
  const cols = Math.ceil(cw / SPACING)
  const rows = Math.ceil(ch / SPACING)
  const gx = (cw - (cols - 1) * SPACING) / 2
  const gy = (ch - (rows - 1) * SPACING) / 2
  grid = []
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const x = gx + col * SPACING
      const y = gy + row * SPACING
      const u = Math.hypot(x - cx, y - cy)
      if (u > AREA_R) continue
      grid.push({
        x,
        y,
        u,
        rimFade: Math.min(1, (AREA_R - u) / RIM_FADE),
        falloff: 1 - 0.3 * Math.min(u / AREA_R, 1),
      })
    }
  }
  if (reducedMotion) drawFrame(performance.now(), true)
}

function drawFrame(now, staticOnly = false) {
  const canvas = canvasRef.value
  if (!canvas) return
  const ctx = canvas.getContext('2d')
  ctx.clearRect(0, 0, cw, ch)

  // Expire finished click ripples
  for (let i = ripples.length - 1; i >= 0; i--) {
    if (now - ripples[i].start > RIPPLE_LIFE) ripples.splice(i, 1)
  }
  // Hover glow eases toward its target strength
  pointer.current += (pointer.target - pointer.current) * 0.08

  const hasHover = pointer.current > 0.001
  ctx.fillStyle = COLOR
  for (const d of grid) {
    // Ambient radial wave + soft falloff toward the rim
    let h = staticOnly
      ? 0.5 * d.falloff
      : Math.pow(0.5 + 0.5 * Math.sin(d.u / 130 - 0.0024 * now), 1.6) * d.falloff

    // Click ripples: an expanding ring with a shimmering tail
    for (const rp of ripples) {
      const dt = now - rp.start
      const n = Math.hypot(d.x - rp.x, d.y - rp.y)
      h += Math.exp(-(((n - 0.28 * dt) ** 2)) / 1352)
        * (1 - dt / RIPPLE_LIFE)
        * (0.6 + 0.4 * Math.sin(n / 90 - 0.02 * dt))
        * 1.1
    }

    // Hover glow around the cursor
    if (hasHover) {
      const pd = Math.hypot(d.x - pointer.x, d.y - pointer.y)
      h += Math.exp(-((pd / 78) ** 2))
        * (0.7 + 0.3 * Math.sin(pd / 26 - 0.006 * now))
        * 0.45
        * pointer.current
    }

    h = Math.max(0, Math.min(h, 1.4))
    const r = 0.5 + 0.7 * h
    ctx.globalAlpha = (0.08 + 0.72 * h) * d.rimFade
    ctx.beginPath()
    ctx.arc(d.x, d.y, r, 0, Math.PI * 2)
    ctx.fill()
  }
  ctx.globalAlpha = 1
}

function loop(now) {
  drawFrame(now)
  raf = requestAnimationFrame(loop)
}

onMounted(() => {
  reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  resize()
  resizeObserver = new ResizeObserver(resize)
  resizeObserver.observe(canvasRef.value)
  if (!reducedMotion) raf = requestAnimationFrame(loop)
})

onUnmounted(() => {
  cancelAnimationFrame(raf)
  resizeObserver?.disconnect()
})
</script>
