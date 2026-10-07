<template>
  <div class="relative bg-white flex flex-col h-full w-full overflow-hidden">
    <div class="flex flex-1 flex-col items-start w-full py-[4px] overflow-y-auto overflow-x-hidden">

      <!-- Page title (Figma: 4873:37432) -->
      <div class="flex items-center px-[24px] py-[12px] w-full shrink-0">
        <p class="font-medium text-[18px] text-[#03102f] leading-[1.35] whitespace-nowrap">Analytics</p>
      </div>

      <!-- Charts added from the AI Assistant (Figma Analytics-with-AI: 1:3465) -->
      <div v-if="analyticsCharts.length" class="w-full px-[24px] py-[12px]">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-[16px] py-[4px]">
          <div
            v-for="chart in analyticsCharts"
            :key="chart.id"
            class="chart-card-in self-start flex flex-col rounded-[8px] border border-[#e5e6ea] bg-white"
          >
            <div class="flex items-center px-[16px] py-[12px]">
              <p class="text-[14px] font-medium text-[#03102f] leading-[1.5] whitespace-nowrap">{{ chart.title }}</p>
            </div>
            <div class="border-t border-[#e5e6ea] p-[16px] overflow-hidden">
              <div class="relative h-[249px] w-full">
                <!-- Y axis -->
                <div class="absolute left-0 top-0 flex flex-col gap-[12px]">
                  <p
                    v-for="label in yAxis"
                    :key="label"
                    class="w-[32px] p-[4px] box-content text-[10px] font-medium uppercase tracking-[0.3px] leading-[18px] text-[#9295a5] text-center"
                  >{{ label }}</p>
                </div>
                <!-- Bars -->
                <div class="absolute left-0 right-0 top-[7px] h-[216px] flex items-end gap-[4px] pl-[56px]">
                  <div
                    v-for="(h, i) in chart.bars"
                    :key="i"
                    class="added-bar flex-1 rounded-t-[4px]"
                    :class="h === Math.max(...chart.bars) ? 'bg-[#4c8afd]' : 'bg-[#ccdefe] hover:bg-[#b3cdfe]'"
                    :style="{ height: h + 'px', animationDelay: `${150 + i * 50}ms` }"
                  />
                </div>
                <!-- X axis -->
                <div class="absolute left-0 right-0 top-[223px]">
                  <img :src="baselineImg" alt="" class="absolute left-[56px] right-[16px] top-[-1px] w-[calc(100%-72px)] h-px" />
                  <div class="flex gap-[4px] pl-[56px]">
                    <p
                      v-for="label in chart.labels"
                      :key="label"
                      class="flex-1 min-w-0 p-[4px] text-[10px] font-medium uppercase tracking-[0.3px] leading-[18px] text-[#9295a5] text-center whitespace-nowrap"
                    >{{ label }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Add tile (Figma: 1:3514) -->
          <button
            type="button"
            class="chart-card-in group flex flex-col items-center justify-center gap-[8px] min-h-[169px] p-[16px] rounded-[8px] border border-dashed border-[#cbcdd4] bg-white hover:border-[#2465de] transition-colors duration-150"
            style="animation-delay: 80ms;"
            @click="agentPanelOpen = true"
          >
            <span class="flex items-center p-[8px] rounded-[32px] bg-[#f2f2f4] group-hover:bg-[#e5e6ea] transition-colors duration-150">
              <img :src="plusCircleIcon" width="18" height="18" alt="" class="block" />
            </span>
            <span class="text-[13px] text-[#61667c] leading-[1.5] whitespace-nowrap">Add chart or table</span>
          </button>
        </div>
      </div>

      <!-- Empty state (Figma: 4873:38226) -->
      <div v-else class="flex flex-1 flex-col w-full min-h-[655px] px-[24px] py-[12px]">
        <div class="flex flex-1 flex-col items-center bg-[#fcfcfd] py-[40px] px-[16px]">
          <div class="flex flex-col items-center gap-[24px] w-full max-w-[500px]">

            <!-- Chart illustration (Figma: 4873:38622) -->
            <div class="analytics-illus relative shrink-0" aria-hidden="true">
              <!-- Donut card (Figma: 4873:38623) -->
              <div class="chart-pop absolute left-0 top-0 flex items-center justify-center size-[161.255px]" style="--dx: 50px; --dy: 0px; animation-delay: 0ms;">
                <div class="rotate-[-20.81deg]">
                  <div class="relative flex items-center p-[10px] rounded-[10px] bg-white size-[125px]" :style="{ filter: dropShadow }">
                    <div class="relative size-[105px]">
                      <svg width="105" height="105" viewBox="0 0 105 105" class="absolute inset-0 -rotate-90">
                        <circle
                          v-for="seg in pieSegments"
                          :key="seg.color"
                          cx="52.5" cy="52.5" :r="PIE_R"
                          fill="none"
                          :stroke="seg.color"
                          :stroke-width="PIE_W"
                          :stroke-dasharray="`${seg.length} ${PIE_C}`"
                          :stroke-dashoffset="-seg.offset"
                          class="pie-seg"
                        />
                      </svg>
                      <div class="absolute left-[22.5px] top-[41.5px] w-[60.5px] flex flex-col items-center gap-[0.5px]">
                        <p class="text-[7px] text-[#61667c] leading-[1.5] whitespace-nowrap">Total</p>
                        <p class="w-full font-mono-reddit font-medium text-[8px] text-[#03102f] leading-[1.4] text-center whitespace-nowrap overflow-hidden text-ellipsis">SGD {{ fmt(pieTotalShown) }}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Bar card (Figma: 4873:38634) -->
              <div class="chart-pop absolute left-[107.13px] top-[44.13px] flex items-center justify-center w-[154.333px] h-[94.695px]" style="--dx: -53.6px; --dy: -10.9px; animation-delay: 90ms;">
                <div class="rotate-[6.3deg]">
                  <div
                    class="flex flex-col p-[10px] rounded-[10px] bg-white overflow-hidden w-[146.535px] h-[79.082px]"
                    style="box-shadow: 0px 62px 17.5px 0px rgba(0,0,0,0), 0px 39.5px 16px 0px rgba(0,0,0,0.01), 0px 22.5px 13.5px 0px rgba(0,0,0,0.02), 0px 10px 10px 0px rgba(0,0,0,0.03), 0px 2.5px 5.5px 0px rgba(0,0,0,0.04);"
                  >
                    <div class="flex flex-1 items-end gap-[2px] pt-[3.5px] w-full">
                      <div
                        v-for="(h, i) in bars"
                        :key="i"
                        class="bar flex-1 rounded-t-[2px]"
                        :style="{ height: h + 'px', backgroundColor: i === maxBarIndex ? '#83a3f4' : '#ededf0' }"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <!-- Overview card (Figma: 4873:38661) -->
              <div class="chart-pop absolute left-[107.13px] top-[2.63px] flex items-center justify-center w-[131.456px] h-[64.497px]" style="--dx: -42.2px; --dy: 45.7px; animation-delay: 180ms;">
                <div class="rotate-[-6.98deg]">
                  <div class="flex flex-col gap-[0.5px] rounded-[10px] bg-white w-[126.375px] h-[49.5px]" :style="{ filter: dropShadow }">
                    <div class="flex items-center justify-between h-[21px] px-[6px] py-[4px] border-b-[0.5px] border-[#e5e6ea]">
                      <div class="h-[7.5px] w-[46px] rounded-[12px] bg-[#ededf0]" />
                      <div class="flex items-center gap-[1px] px-[4px] py-[2px] rounded-[2px] border-[0.5px] border-[#e5e6ea]">
                        <img :src="trendUpIcon" width="5" height="4.5" alt="" class="block" />
                        <p class="font-mono-reddit text-[6.5px] text-[#03102f] leading-[1.4] whitespace-nowrap">{{ Math.round(growthShown) }}%</p>
                      </div>
                    </div>
                    <div class="flex items-center p-[6px]">
                      <p class="font-mono-reddit font-medium text-[12px] text-[#03102f] leading-[1.35] whitespace-nowrap">SGD {{ fmt(amountShown) }}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Title + description (Figma: 4873:38335) -->
            <div class="flex flex-col gap-[8px] w-full text-center">
              <p class="stagger font-medium text-[18px] text-[#03102f] leading-[1.35]" :style="stagger(0)">Add your first chart</p>
              <p class="stagger text-[16px] text-[#61667c] leading-[1.4]" :style="stagger(1)">
                Ask the
                <button type="button" class="font-medium text-[#2465de] underline hover:opacity-75 transition-opacity duration-150" @click="askAgent(prompts[2])">AI Assistant</button>
                in your own words, then add the answer here. You can rearrange charts and edit them later.
              </p>
            </div>

            <p class="stagger text-[14px] text-[#61667c] leading-[1.5] text-center whitespace-nowrap" :style="stagger(2)">Or start with this</p>

            <!-- Suggested prompts (Figma: 4873:38338) -->
            <div class="flex flex-col items-center gap-[8px]">
              <button
                v-for="(prompt, i) in prompts"
                :key="prompt"
                type="button"
                class="stagger flex items-center justify-center px-[12px] py-[4px] rounded-[40px] border border-[#e5e6ea] bg-white hover:bg-[#f6f7f9] transition-colors duration-150"
                :style="stagger(3 + i)"
                @click="askAgent(prompt)"
              >
                <span class="text-[13px] text-[#03102f] leading-[1.5] text-center whitespace-nowrap">{{ prompt }}</span>
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { askAgent, agentPanelOpen } from '../../composables/useAgentPanel.js'
import { analyticsCharts } from '../../composables/useAnalytics.js'
import trendUpIcon from '../../assets/icons/icon-trend-up-green.svg'
import plusCircleIcon from '../../assets/icons/icon-plus-circle-grey.svg'
import baselineImg from '../../assets/icons/chart-baseline.svg'

const yAxis = ['2.5K', '2.0K', '1.5K', '1.0K', '0.5K', '0']

const prompts = [
  'Create a line chart of my monthly sales this year',
  'Create a table of my top 10 products last month',
  'Create a bar chart of sales by payment method this quarter',
]

const dropShadow = 'drop-shadow(0px 39.5px 8px rgba(0,0,0,0.01)) drop-shadow(0px 22.5px 6.75px rgba(0,0,0,0.02)) drop-shadow(0px 10px 5px rgba(0,0,0,0.03)) drop-shadow(0px 2.5px 2.75px rgba(0,0,0,0.04))'

// Text fades up after the three charts have popped out
const stagger = (i) => ({ animationDelay: `${450 + i * 70}ms` })

// ── Donut (ring of 105px, 10.5px thick — Figma: 4873:38625) ──
const PIE_R = 47.25
const PIE_W = 10.5
const PIE_C = 2 * Math.PI * PIE_R
const PIE_GAP = 3
const PIE_COLORS = ['#ededf0', '#83a3f4', '#c0e8d7'] // clockwise from 12 o'clock

const pie = ref([7600, 2800, 770]) // = SGD 11,170 in the design
const pieSegments = computed(() => {
  const total = pie.value.reduce((a, b) => a + b, 0)
  let offset = 0
  return pie.value.map((v, i) => {
    const arc = (v / total) * PIE_C
    const seg = { color: PIE_COLORS[i], offset: offset + PIE_GAP / 2, length: Math.max(arc - PIE_GAP, 0) }
    offset += arc
    return seg
  })
})

// ── Bars (max 55.5px — Figma: 4873:38638) ──
const BAR_MAX = 55.5
const bars = ref([39.5, 18, 31, 55.5, 6, 38, 28])
const maxBarIndex = computed(() => bars.value.indexOf(Math.max(...bars.value)))

// ── Overview card ──
const amount = ref(398152)
const growth = ref(5)

// Animated display values
const pieTotalShown = ref(11170)
const amountShown = ref(amount.value)
const growthShown = ref(growth.value)

const fmt = (n) => Math.round(n).toLocaleString('en-US')
const rand = (min, max) => min + Math.random() * (max - min)

const rafs = new Set()
function tween(target, to, duration = 700) {
  const from = target.value
  const start = performance.now()
  const step = (now) => {
    const t = Math.min((now - start) / duration, 1)
    const eased = 1 - Math.pow(1 - t, 3)
    target.value = from + (to - from) * eased
    if (t < 1) rafs.add(requestAnimationFrame(step))
  }
  rafs.add(requestAnimationFrame(step))
}

function shuffleData() {
  pie.value = [Math.round(rand(3500, 9000)), Math.round(rand(1200, 4500)), Math.round(rand(300, 1800))]
  const peak = Math.floor(Math.random() * 7)
  bars.value = bars.value.map((_, i) => (i === peak ? BAR_MAX : Math.round(rand(6, BAR_MAX - 8))))
  amount.value = Math.round(rand(240000, 520000))
  growth.value = Math.round(rand(2, 18))

  tween(pieTotalShown, pie.value.reduce((a, b) => a + b, 0))
  tween(amountShown, amount.value)
  tween(growthShown, growth.value)
}

let timer = null
onMounted(() => { timer = setInterval(shuffleData, 3000) })
onBeforeUnmount(() => {
  clearInterval(timer)
  rafs.forEach(cancelAnimationFrame)
})
</script>

<style scoped>
.analytics-illus {
  width: 261.5px;
  height: 161.3px;
}

.font-mono-reddit {
  font-family: 'Reddit Mono', ui-monospace, monospace;
}

/* Appear: each card fades in and expands out from the illustration's center */
.chart-pop {
  animation: chart-pop 700ms cubic-bezier(0.34, 1.4, 0.64, 1) both;
}
@keyframes chart-pop {
  from {
    opacity: 0;
    transform: translate(var(--dx), var(--dy)) scale(0.4);
  }
  to {
    opacity: 1;
    transform: none;
  }
}

.stagger {
  animation: fade-up 450ms cubic-bezier(0.4, 0, 0.2, 1) both;
}
@keyframes fade-up {
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: none; }
}

/* Data changes */
.pie-seg {
  transition: stroke-dasharray 700ms cubic-bezier(0.4, 0, 0.2, 1), stroke-dashoffset 700ms cubic-bezier(0.4, 0, 0.2, 1);
}
.bar {
  transition: height 700ms cubic-bezier(0.34, 1.2, 0.64, 1), background-color 400ms ease;
}

/* Added chart: card rises in, bars grow from the baseline */
.chart-card-in {
  animation: fade-up 400ms cubic-bezier(0.4, 0, 0.2, 1) both;
}
.added-bar {
  transform-origin: bottom;
  animation: bar-grow 650ms cubic-bezier(0.34, 1.2, 0.64, 1) both;
  transition: background-color 150ms ease;
}
@keyframes bar-grow {
  from { transform: scaleY(0); }
  to { transform: scaleY(1); }
}

@media (prefers-reduced-motion: reduce) {
  .chart-pop, .stagger, .chart-card-in, .added-bar { animation: none; }
  .pie-seg, .bar { transition: none; }
}
</style>
