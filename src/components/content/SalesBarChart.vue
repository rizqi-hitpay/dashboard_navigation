<template>
  <div>
    <!-- Header -->
    <div class="flex items-center justify-between mb-1" style="height: 40px;">
      <span class="text-[16px] font-medium text-[#03102f]">Your Sales</span>
      <div class="flex items-center rounded-[24px]" style="background: #f8f9fc; padding: 4px; gap: 4px;">
        <button
          v-for="t in ['7d', '30d']"
          :key="t"
          class="rounded-[20px] text-[14px] transition-colors duration-150"
          :class="activeTab === t ? 'bg-white text-[#03102f] shadow-sm font-medium' : 'text-[#61667c]'"
          style="padding: 4px 12px;"
          @click="activeTab = t"
        >{{ t }}</button>
      </div>
    </div>

    <!-- Chart card -->
    <div ref="chartContainer" style="border: 1px solid #e5e6ea; border-radius: 8px; padding: 16px; background: white;">
      <svg
        :viewBox="`0 0 ${chartWidth} 222`"
        width="100%"
        height="222"
        style="overflow: visible; display: block;"
      >
        <defs>
          <linearGradient id="weekendGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#356eff" stop-opacity="0.12" />
            <stop offset="100%" stop-color="#356eff" stop-opacity="0.04" />
          </linearGradient>
        </defs>

        <!-- Y-axis labels + horizontal grid lines -->
        <g v-for="lvl in yLevels" :key="lvl.label">
          <line :x1="BAR_X" :x2="chartWidth" :y1="lvl.y" :y2="lvl.y" stroke="#f2f2f4" stroke-width="1" />
          <text
            :x="40"
            :y="lvl.y + 4"
            text-anchor="end"
            font-size="10"
            font-family="Inter, sans-serif"
            font-weight="500"
            fill="#9295a5"
          >{{ lvl.label }}</text>
        </g>

        <!-- ── 30d view ── -->
        <template v-if="activeTab === '30d'">
          <g v-for="(group, gi) in groups30d" :key="'g' + gi">
            <!-- Weekend background: 2 bars (Sat+Sun) shift right by 1 bar each group -->
            <rect
              v-if="gi < 5"
              :x="groupX(gi) + gi * (barW30d + INNER_GAP)"
              :y="0"
              :width="2 * barW30d + INNER_GAP"
              :height="BAR_AREA_H"
              fill="url(#weekendGrad)"
            />
            <!-- Bars: flat at zero until the data lands, then grow bottom-up
                 with a left-to-right stagger -->
            <rect
              v-for="(bar, bi) in group.bars"
              :key="'b' + bi"
              class="bar-grow"
              :x="groupX(gi) + bi * (barW30d + INNER_GAP)"
              :y="dataLoaded ? BAR_AREA_H - valToPx(bar.value) : BAR_AREA_H"
              :width="barW30d"
              :height="dataLoaded ? valToPx(bar.value) : 0"
              rx="2"
              :fill="bar.highlight ? '#2364dd' : 'rgba(35,100,221,0.25)'"
              :style="{ transitionDelay: (gi * N_BARS_GROUP + bi) * 15 + 'ms' }"
            />
            <!-- X-axis label -->
            <text
              :x="groupX(gi) + groupContentW / 2"
              :y="216"
              text-anchor="middle"
              font-size="10"
              font-family="Inter, sans-serif"
              font-weight="500"
              fill="#9295a5"
            >{{ group.label }}</text>
          </g>

          <!-- Dashed marker line + dot — hidden until loaded, fades in after
               the bars finish growing -->
          <g class="marker-fade" :class="{ 'marker-fade--in': dataLoaded }">
            <line
              :x1="markerX"
              :x2="markerX"
              y1="0"
              :y2="BAR_AREA_H"
              stroke="#2364dd"
              stroke-width="1"
              stroke-dasharray="3,2"
            />
            <circle
              :cx="markerX"
              :cy="BAR_AREA_H - valToPx(markerValue)"
              r="3"
              fill="#2364dd"
              stroke="white"
              stroke-width="1.5"
            />
          </g>
        </template>

        <!-- ── 7d view ── -->
        <template v-else>
          <g v-for="(bar, i) in bars7d" :key="'7d' + i">
            <rect
              v-if="bar.weekend"
              :x="dayX7d(i)"
              :y="0"
              :width="barW7d"
              :height="BAR_AREA_H"
              fill="url(#weekendGrad)"
            />
            <rect
              class="bar-grow"
              :x="dayX7d(i)"
              :y="dataLoaded ? BAR_AREA_H - valToPx(bar.value) : BAR_AREA_H"
              :width="barW7d"
              :height="dataLoaded ? valToPx(bar.value) : 0"
              rx="2"
              :fill="bar.highlight ? '#2364dd' : 'rgba(35,100,221,0.25)'"
              :style="{ transitionDelay: i * 40 + 'ms' }"
            />
            <text
              :x="dayX7d(i) + barW7d / 2"
              :y="216"
              text-anchor="middle"
              font-size="10"
              font-family="Inter, sans-serif"
              font-weight="500"
              fill="#9295a5"
            >{{ bar.label }}</text>
          </g>
        </template>
      </svg>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useDashboardData } from '../../composables/useDashboardData.js'

const { dataLoaded } = useDashboardData()

const activeTab = ref('30d')

// ── Fixed constants ──
const BAR_AREA_H   = 196
const BAR_X        = 56     // y-axis zone width
const INNER_GAP    = 4      // gap between bars within a 30d group
const OUTER_GAP    = 4      // gap between groups
const GAP_7D       = 8      // gap between day bars
const N_BARS_GROUP = 6
const N_GROUPS     = 6
const N_DAYS       = 7
const MAX_VAL      = 2500

// ── Responsive width ──
const chartContainer = ref(null)
const chartWidth = ref(498)

let ro
onMounted(() => {
  if (!chartContainer.value) return
  ro = new ResizeObserver(([entry]) => {
    chartWidth.value = Math.round(entry.contentRect.width)
  })
  ro.observe(chartContainer.value)
})
onUnmounted(() => ro?.disconnect())

const availW = computed(() => chartWidth.value - BAR_X)

// ── 30d: adaptive bar width ──
// total space = N_GROUPS*N_BARS*barW + inner_gaps + outer_gaps
const barW30d = computed(() => {
  const totalInnerGaps = (N_BARS_GROUP - 1) * N_GROUPS * INNER_GAP
  const totalOuterGaps = (N_GROUPS - 1) * OUTER_GAP
  return Math.max((availW.value - totalInnerGaps - totalOuterGaps) / (N_GROUPS * N_BARS_GROUP), 2)
})

const groupContentW = computed(() =>
  N_BARS_GROUP * barW30d.value + (N_BARS_GROUP - 1) * INNER_GAP
)

const groupX = (gi) => BAR_X + gi * (groupContentW.value + OUTER_GAP)

// Highlighted bar marker
const markerValue = 2274
const markerX = computed(() =>
  groupX(2) + 1 * (barW30d.value + INNER_GAP) + barW30d.value / 2
)

// ── 7d: adaptive bar width ──
const barW7d = computed(() =>
  Math.max((availW.value - (N_DAYS - 1) * GAP_7D) / N_DAYS, 4)
)

const dayX7d = (i) => BAR_X + i * (barW7d.value + GAP_7D)

const valToPx = (v) => (v / MAX_VAL) * BAR_AREA_H

// ── Y-axis ──
const yLevels = [
  { label: '2.5K', y: 0   },
  { label: '2.0K', y: 39  },
  { label: '1.5K', y: 78  },
  { label: '1.0K', y: 118 },
  { label: '0.5K', y: 157 },
  { label: '0',    y: 196 },
]

// ── 30d data ──
const groups30d = [
  {
    label: '23 MAY',
    bars: [
      { value: 1130 }, { value:  399 }, { value: 1622 },
      { value:  572 }, { value:  319 }, { value:  812 },
    ],
  },
  {
    label: '29 MAY',
    bars: [
      { value:  160 }, { value:  904 }, { value: 1250 },
      { value: 1968 }, { value:  837 }, { value: 1330 },
    ],
  },
  {
    label: '04 JUN',
    bars: [
      { value:  812 }, { value: 2274, highlight: true }, { value:  957 },
      { value: 1636 }, { value:  186 }, { value: 1143 },
    ],
  },
  {
    label: '10 JUN',
    bars: [
      { value: 1356 }, { value: 1503 }, { value:  745 },
      { value: 1024 }, { value: 1277 }, { value:  439 },
    ],
  },
  {
    label: '16 JUN',
    bars: [
      { value:  226 }, { value: 2009 }, { value:  439 },
      { value: 1556 }, { value:  891 }, { value:  173 },
    ],
  },
  {
    label: '22 JUN',
    bars: [
      { value:  545 }, { value: 1130 }, { value:  199 },
      { value: 1503 }, { value:  745 }, { value: 1356 },
    ],
  },
]

// ── 7d data ──
const bars7d = [
  { label: 'MON', value: 1200 },
  { label: 'TUE', value: 1800 },
  { label: 'WED', value:  950 },
  { label: 'THU', value: 2300, highlight: true },
  { label: 'FRI', value: 1650 },
  { label: 'SAT', value: 1100, weekend: true },
  { label: 'SUN', value:  700, weekend: true },
]
</script>

<style scoped>
/* Loading state (Figma 3973:3800): axes/grid/weekend bands stay, bars grow
   bottom-up on the decelerate curve once the data lands (y and height are
   SVG geometry properties, so they transition like any CSS property) */
.bar-grow {
  transition: y 700ms cubic-bezier(0.32, 0.72, 0, 1), height 700ms cubic-bezier(0.32, 0.72, 0, 1);
}

/* Marker appears after the bars have mostly grown */
.marker-fade { opacity: 0; }
.marker-fade--in { opacity: 1; transition: opacity 300ms ease 950ms; }

@media (prefers-reduced-motion: reduce) {
  .bar-grow { transition: none; }
  .marker-fade--in { transition: none; }
}
</style>
