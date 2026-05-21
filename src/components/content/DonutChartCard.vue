<template>
  <div>
    <!-- Header -->
    <div class="flex items-center justify-between mb-1" style="height: 40px;">
      <span class="text-[16px] font-medium text-[#03102f]">{{ title }}</span>

      <!-- Tab group -->
      <div class="flex items-center rounded-[24px]" style="background: #f8f9fc; padding: 4px; gap: 4px;">
        <button
          v-for="t in tabs"
          :key="t.label"
          class="relative rounded-[20px] text-[14px] transition-colors duration-150"
          :class="activeTab === t.label
            ? 'bg-white text-[#03102f] shadow-sm font-medium'
            : 'text-[#61667c]'"
          style="padding: 4px 12px;"
          @click="activeTab = t.label"
        >
          {{ t.label }}
          <span
            v-if="t.badge"
            class="absolute flex items-center justify-center rounded-full text-[10px] font-medium text-white"
            style="background: #dc3545; min-width: 20px; height: 20px; padding: 0 3px; top: -8px; right: -8px;"
          >{{ t.badge }}</span>
        </button>
      </div>
    </div>

    <!-- Chart card -->
    <div style="border: 1px solid #e5e6ea; border-radius: 8px; padding: 24px; background: white;">

      <!-- Donut chart -->
      <div class="flex justify-center" style="margin-bottom: 24px;">
        <div class="relative" style="width: 210px; height: 210px;">
          <svg
            width="210"
            height="210"
            viewBox="0 0 210 210"
            style="overflow: visible; cursor: default;"
            @mouseover="handleMouseOver"
            @mouseleave="hoveredIndex = null"
          >
            <!-- Transparent background catches hover on center hole / gaps -->
            <circle cx="105" cy="105" r="105" fill="rgba(0,0,0,0)" style="pointer-events: all;" />

            <path
              v-for="(seg, i) in computedSegments"
              :key="i"
              :d="seg.path"
              :style="{
                fill: segFill(i),
                cursor: 'pointer',
                transition: 'fill 180ms ease',
              }"
              transform="rotate(-90, 105, 105)"
            />
          </svg>

          <!-- Center label overlay -->
          <div
            class="absolute inset-0 flex flex-col items-center justify-center"
            style="pointer-events: none; gap: 2px;"
          >
            <span
              class="text-[14px] text-[#61667c]"
              style="font-weight: 400; line-height: 1.2;"
            >{{ centerTitle }}</span>
            <span
              class="text-[16px] font-medium text-[#03102f]"
              style="line-height: 1.4;"
            >{{ centerValue }}</span>
          </div>
        </div>
      </div>

      <!-- Legend -->
      <div class="flex items-center justify-center" style="gap: 8px; margin-bottom: 24px;">
        <div
          v-for="(seg, i) in segments"
          :key="seg.label"
          class="flex items-center"
          style="gap: 6px; cursor: pointer;"
          @mouseenter="hoveredIndex = i"
          @mouseleave="hoveredIndex = null"
        >
          <span
            class="rounded-full shrink-0"
            :style="{
              background: legendDotColor(i),
              width: '8px',
              height: '8px',
              transition: 'background 180ms ease',
            }"
          ></span>
          <span class="text-[12px] text-[#03102f]">{{ seg.label }}</span>
        </div>
      </div>

      <!-- Discover more link (optional) -->
      <div v-if="discoverText" class="flex justify-center">
        <button class="flex items-center gap-1.5 text-[12px] font-medium text-[#2364dd] hover:opacity-80 transition-opacity">
          {{ discoverText }}
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M3 7h8M8 4l3 3-3 3" stroke="#2364dd" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  title:        { type: String, required: true },
  segments:     { type: Array,  required: true },  // [{label, pct, color, value?}]
  total:        { type: String, default: '' },
  centerLabel:  { type: String, default: 'Total' },
  discoverText: { type: String, default: '' },
  tabs:         { type: Array,  default: () => [{ label: '7d' }, { label: '30d' }] },
})

const activeTab    = ref('30d')
const hoveredIndex = ref(null)

// ── Donut geometry (Figma: 210×210px, innerRadius ratio 0.8) ──
const CX = 105, CY = 105
const OUTER_R = 105
const INNER_R = 84             // 0.8 × outer
const C       = 2 * Math.PI * ((OUTER_R + INNER_R) / 2)   // ≈ 593.76
const GAP     = 3              // px gap between segments

// ── Ring arc path for one segment ──
function ringArcPath(startAngle, endAngle) {
  const cos = Math.cos, sin = Math.sin
  const large = (endAngle - startAngle > Math.PI) ? 1 : 0

  const x1 = CX + OUTER_R * cos(startAngle), y1 = CY + OUTER_R * sin(startAngle)
  const x2 = CX + OUTER_R * cos(endAngle),   y2 = CY + OUTER_R * sin(endAngle)
  const x3 = CX + INNER_R * cos(endAngle),   y3 = CY + INNER_R * sin(endAngle)
  const x4 = CX + INNER_R * cos(startAngle), y4 = CY + INNER_R * sin(startAngle)

  return `M${x1} ${y1} A${OUTER_R} ${OUTER_R} 0 ${large} 1 ${x2} ${y2} L${x3} ${y3} A${INNER_R} ${INNER_R} 0 ${large} 0 ${x4} ${y4}Z`
}

const computedSegments = computed(() => {
  const totalPct = props.segments.reduce((s, seg) => s + seg.pct, 0)
  const usableC  = C - GAP * props.segments.length
  const result   = []
  let cumulative = 0

  for (const seg of props.segments) {
    const arcLen     = (seg.pct / totalPct) * usableC
    const startAngle = (cumulative / C) * 2 * Math.PI
    const endAngle   = ((cumulative + arcLen) / C) * 2 * Math.PI
    result.push({ ...seg, arcLen, startAngle, endAngle, path: ringArcPath(startAngle, endAngle) })
    cumulative += arcLen + GAP
  }

  return result
})

// ── Mouse over SVG: identify which path (if any) is under the cursor ──
function handleMouseOver(e) {
  const paths = Array.from(e.currentTarget.querySelectorAll('path'))
  const idx   = paths.indexOf(e.target)
  hoveredIndex.value = idx >= 0 ? idx : null
}

// ── Fill: hovered = full color; others = #f2f2f4; no hover = full color ──
function segFill(i) {
  if (hoveredIndex.value === null) return computedSegments.value[i].color
  return i === hoveredIndex.value ? computedSegments.value[i].color : '#f2f2f4'
}

// ── Legend dots stay colored; non-hovered dims slightly ──
function legendDotColor(i) {
  if (hoveredIndex.value === null) return props.segments[i].color
  return i === hoveredIndex.value ? props.segments[i].color : '#cbcdd4'
}

// ── Center text ──
const centerTitle = computed(() => {
  if (hoveredIndex.value === null) return props.centerLabel
  const seg = props.segments[hoveredIndex.value]
  return `${seg.label} (${seg.pct}%)`
})

const centerValue = computed(() => {
  if (hoveredIndex.value === null) return props.total
  return props.segments[hoveredIndex.value].value ?? ''
})
</script>
