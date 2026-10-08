<template>
  <div
    ref="rootRef"
    class="relative"
    :class="{ 'card-intro': !introDone && !ghost }"
    :data-chart-id="ghost ? null : chart.id"
    @mouseenter="hovered = true"
    @mouseleave="onMouseLeave"
  >
    <!-- Card (Figma Analytics-with-AI: 1:6281) -->
    <div
      class="chart-card flex flex-col rounded-[8px] border bg-white overflow-hidden"
      :class="[
        placeholder ? 'chart-card--slot' : ghost ? 'chart-card--ghost' : showChrome ? 'chart-card--hover' : 'border-[#e5e6ea]',
        { 'chart-card--static': ghost },
      ]"
      :style="{ height: chart.height + 'px' }"
    >
      <!-- Head: title · rename input (Figma: 1:6841) -->
      <div
        v-if="editing"
        class="flex items-center gap-[8px] h-[45px] px-[8px] shrink-0"
      >
        <input
          ref="titleInputRef"
          v-model="draftTitle"
          class="title-input flex-1 min-w-0 h-[28px] px-[8px] rounded-[8px] border border-[#2465de] bg-white outline-none text-[13px] text-[#03102f] leading-[1.5]"
          aria-label="Chart name"
          @keydown.enter.prevent="saveTitle"
          @keydown.esc.prevent="cancelEdit"
          @blur="saveTitle"
        />
      </div>
      <div
        v-else
        class="relative flex items-center gap-[4px] h-[45px] pr-[16px] shrink-0 transition-[padding] duration-200"
        :class="showChrome || ghost ? 'cursor-grab' : ''"
        :style="{ paddingLeft: showChrome || ghost ? '28px' : '16px' }"
        @pointerdown="onHeadPointerDown"
      >
        <!-- Drag handle — the whole head drags; arrows on the focused handle move one slot -->
        <button
          type="button"
          data-drag-handle
          class="absolute left-[8px] top-[14.5px] size-[16px] rounded-[2px] cursor-grab transition-opacity duration-150 focus-visible:opacity-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#2465de]"
          :class="showChrome || ghost ? 'opacity-100' : 'opacity-0'"
          aria-label="Drag to reorder (arrow keys move)"
          @keydown="$emit('handle-key', $event)"
        >
          <img :src="draggableIcon" width="16" height="16" alt="" class="block" />
        </button>
        <p
          class="text-[14px] font-medium text-[#03102f] leading-[1.5] whitespace-nowrap overflow-hidden text-ellipsis"
          @dblclick="startEdit"
        >{{ chart.title }}</p>
        <button
          type="button"
          class="shrink-0 size-[12px] transition-opacity duration-150 hover:opacity-60"
          :class="showChrome ? 'opacity-100' : 'opacity-0 pointer-events-none'"
          aria-label="Rename chart"
          @click="startEdit"
        >
          <img :src="pencilIcon" width="12" height="12" alt="" class="block" />
        </button>
      </div>

      <!-- Graph (Figma: 1:6286) -->
      <div class="flex-1 min-h-0 border-t border-[#e5e6ea] p-[16px]">
        <div class="relative w-full h-full">
          <!-- Y axis -->
          <div class="absolute left-0 top-0 flex flex-col justify-between" :style="{ height: barsArea + 'px' }">
            <p
              v-for="label in Y_AXIS"
              :key="label"
              class="w-[32px] p-[4px] box-content text-[10px] font-medium uppercase tracking-[0.3px] leading-[18px] text-[#9295a5] text-center"
            >{{ label }}</p>
          </div>

          <!-- Bars: whole column is the hover target -->
          <div
            class="absolute left-0 right-0 top-[7px] flex items-end gap-[4px] pl-[56px]"
            :style="{ height: barsArea + 'px' }"
            @mouseleave="hoveredBar = null"
          >
            <div
              v-for="(h, i) in chart.bars"
              :key="i"
              class="relative flex-1 min-w-0 h-full flex items-end"
              @mouseenter="hoveredBar = i"
            >
              <div
                class="added-bar w-full rounded-t-[4px]"
                :class="{ 'added-bar--static': ghost || introDone }"
                :style="{ height: h * barScale + 'px', backgroundColor: barColor(i), animationDelay: `${150 + i * 50}ms` }"
              />
            </div>

            <!-- Bar tooltip (Figma: 1:6330) -->
            <Transition name="bar-tip">
              <div
                v-if="hoveredBar !== null"
                class="bar-tip absolute z-10 flex flex-col justify-center px-[12px] py-[4px] rounded-[8px] bg-[#fcfcfd] pointer-events-none whitespace-nowrap"
                :style="tooltipStyle"
              >
                <p class="text-[10px] font-medium uppercase tracking-[0.3px] leading-[18px] text-[#9295a5]">{{ chart.labels[hoveredBar] }}</p>
                <div class="flex items-center gap-[8px]">
                  <p class="text-[14px] font-medium text-[#03102f] leading-[1.5]">{{ formatK(chart.values[hoveredBar]) }}</p>
                  <div v-if="hoveredChange !== null" class="flex items-center gap-[2px]">
                    <img
                      :src="hoveredChange < 0 ? downIcon : upIcon"
                      :width="hoveredChange < 0 ? 12 : 10"
                      height="9"
                      alt=""
                      class="block"
                    />
                    <p class="text-[12px] font-medium text-[#61667c] leading-[1.5]">{{ Math.abs(hoveredChange) }}%</p>
                  </div>
                </div>
              </div>
            </Transition>
          </div>

          <!-- X axis -->
          <div class="absolute left-0 right-0" :style="{ top: barsArea + 7 + 'px' }">
            <img :src="baselineImg" alt="" class="absolute left-[56px] top-[-1px] w-[calc(100%-72px)] h-px" />
            <div class="flex gap-[4px] pl-[56px]">
              <p
                v-for="(label, i) in chart.labels"
                :key="label"
                class="flex-1 min-w-0 p-[4px] text-[10px] font-medium uppercase tracking-[0.3px] leading-[18px] text-center whitespace-nowrap transition-colors duration-150"
                :class="hoveredBar === i ? 'text-[#03102f]' : 'text-[#9295a5]'"
              >{{ label }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Actions toolbar (Figma: 1:6337) -->
    <Transition name="chrome">
      <div
        v-if="showChrome"
        class="action-bar absolute right-[-8px] top-[-14px] z-20 flex items-center gap-[8px] p-[4px] rounded-[8px] border border-[#f2f2f4] bg-white"
      >
        <template v-for="action in actions" :key="action.key">
          <span v-if="action.divider" class="w-px h-[14px] bg-[#e5e6ea]" />
          <button
            v-else
            type="button"
            class="relative flex items-center justify-center size-[16px] rounded-[4px] transition-opacity duration-150"
            :class="action.key === 'ai' ? '' : 'hover:opacity-60'"
            :aria-label="action.label"
            @mouseenter="hoveredAction = action.key"
            @mouseleave="hoveredAction = null"
            @click="onAction(action.key)"
          >
            <img :src="action.icon" width="16" height="16" alt="" class="block" />
            <!-- Dark tooltip (Figma: 1:6336) -->
            <Transition name="tip">
              <span
                v-if="hoveredAction === action.key && !(action.key === 'history' && historyOpen)"
                class="dark-tip absolute bottom-[calc(100%+12px)] left-1/2 -translate-x-1/2 flex items-center px-[8px] py-[4px] rounded-[4px] bg-[#343848] pointer-events-none"
              >
                <span class="text-[12px] font-medium text-[#cbcdd4] leading-[1.5] whitespace-nowrap">{{ action.tooltip || action.label }}</span>
                <span class="absolute bottom-[-6px] left-1/2 -translate-x-1/2 rotate-180">
                  <img :src="tipArrowIcon" width="12" height="7.33" alt="" class="block" />
                </span>
              </span>
            </Transition>
          </button>
        </template>

        <!-- Prompt history -->
        <Transition name="pop">
          <div
            v-if="historyOpen"
            class="popover absolute right-0 top-[calc(100%+8px)] w-[280px] flex flex-col py-[4px] rounded-[8px] border border-[#e5e6ea] bg-white"
            @mousedown.stop
          >
            <p class="px-[12px] pt-[4px] pb-[4px] text-[10px] font-medium uppercase tracking-[0.3px] leading-[18px] text-[#9295a5]">Prompt history</p>
            <button
              v-for="p in [...chart.prompts].reverse()"
              :key="p.at"
              type="button"
              class="flex flex-col items-start gap-[2px] px-[12px] py-[6px] text-left hover:bg-[#f6f7f9] transition-colors duration-150"
              @click="historyOpen = false; $emit('ask', p.text)"
            >
              <span class="text-[13px] text-[#03102f] leading-[1.5]">{{ p.text }}</span>
              <span class="text-[11px] text-[#9295a5] leading-[1.5]">{{ timeAgo(p.at) }}</span>
            </button>
            <p v-if="!chart.prompts.length" class="px-[12px] py-[6px] text-[13px] text-[#61667c] leading-[1.5]">No prompts yet</p>
          </div>
        </Transition>
      </div>
    </Transition>

    <!-- Resize handle — "Resize the chart" (Figma: 1:6335) -->
    <Transition name="chrome">
      <div
        v-if="showChrome"
        class="absolute bottom-[4px] right-[4.5px] z-10 size-[12px] cursor-nwse-resize touch-none"
        aria-label="Resize chart"
        @pointerdown="startResize"
      >
        <div class="absolute inset-[-67.71%_-117.71%_-117.71%_-67.71%] pointer-events-none">
          <img :src="resizeIcon" alt="" class="block max-w-none size-full" />
        </div>
      </div>
    </Transition>

    <!-- Add-below button (Figma: 1:6332) → turns into close while the add popover is open -->
    <Transition name="chrome">
      <button
        v-if="(showChrome || addOpen) && !editing"
        type="button"
        class="absolute bottom-[-13px] left-1/2 -translate-x-1/2 z-20 flex items-center p-[6px] rounded-[32px] bg-[#e5eeff] hover:bg-[#ccdefe] transition-colors duration-150"
        :aria-label="addOpen ? 'Close' : 'Add chart or table'"
        @mousedown.stop
        @click="addOpen = !addOpen"
      >
        <img
          :src="addOpen ? closeBlueIcon : plusBlueIcon"
          width="14" height="14" alt=""
          class="block transition-transform duration-200"
        />
      </button>
    </Transition>

    <!-- Add chart popover (Figma: 1:7367) -->
    <Transition name="pop">
      <div
        v-if="addOpen"
        class="popover absolute left-1/2 -translate-x-1/2 top-[calc(100%+17px)] z-30 flex flex-col p-[16px] rounded-[8px] border border-[#e5e6ea] bg-white"
        :style="{ width: compact ? '360px' : '400px' }"
        @mousedown.stop
      >
        <div class="flex flex-col gap-[8px] w-full pb-[68px]">
          <button
            v-for="prompt in prompts.slice(0, 2)"
            :key="prompt"
            type="button"
            class="flex items-center w-full px-[12px] py-[4px] rounded-[40px] border border-[#e5e6ea] bg-white hover:bg-[#f6f7f9] hover:border-[#cbcdd4] transition-colors duration-150 text-left"
            @click="ask(prompt)"
          >
            <span class="flex-1 min-w-0 text-[12px] text-[#61667c] leading-[1.5]">{{ prompt }}</span>
          </button>
        </div>
        <div class="absolute left-[9px] right-[10.5px] bottom-[7.5px]">
          <AnalyticsPromptInput autofocus @submit="ask" @escape="addOpen = false" />
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, computed, watch, nextTick, onMounted, onBeforeUnmount, useTemplateRef } from 'vue'
import AnalyticsPromptInput from './AnalyticsPromptInput.vue'
import { CHART_DEFAULT_HEIGHT } from '../../composables/useAnalytics.js'
import baselineImg from '../../assets/icons/chart-baseline.svg'
import draggableIcon from '../../assets/icons/chart-draggable.svg'
import pencilIcon from '../../assets/icons/chart-pencil.svg'
import resizeIcon from '../../assets/icons/chart-resize-handle.svg'
import tipArrowIcon from '../../assets/icons/tooltip-arrow-dark.svg'
import aiIcon from '../../assets/icons/chart-action-ai.svg'
import historyIcon from '../../assets/icons/chart-action-history.svg'
import fullWidthIcon from '../../assets/icons/chart-action-fullwidth.svg'
import downloadIcon from '../../assets/icons/chart-action-download.svg'
import removeIcon from '../../assets/icons/chart-action-remove.svg'
import plusBlueIcon from '../../assets/icons/chart-plus-blue-14.svg'
import closeBlueIcon from '../../assets/icons/chart-close-blue-14.svg'
import downIcon from '../../assets/icons/chart-tooltip-down.svg'
import upIcon from '../../assets/icons/icon-trend-up-green.svg'

const props = defineProps({
  chart: { type: Object, required: true },
  prompts: { type: Array, required: true },
  compact: { type: Boolean, default: false }, // AI Assistant panel open → narrower grid
  canSpan: { type: Boolean, default: true },  // two-column grid available
  placeholder: { type: Boolean, default: false }, // being dragged → render as the drop slot
  ghost: { type: Boolean, default: false },       // the floating copy that follows the pointer
})
const emit = defineEmits(['remove', 'ask', 'edit-ai', 'grab', 'handle-key'])

const Y_AXIS = ['2.5K', '2.0K', '1.5K', '1.0K', '0.5K', '0']
// Head 45 + border 1 + padding 32 + x-axis 26 + top offset 7 → bars fill the rest (216px at 326px)
const barsArea = computed(() => props.chart.height - 111)
const barScale = computed(() => barsArea.value / (CHART_DEFAULT_HEIGHT - 111))

const rootRef = useTemplateRef('rootRef')
const hovered = ref(false)
const hoveredBar = ref(null)
const hoveredAction = ref(null)
const historyOpen = ref(false)
const addOpen = ref(false)
const editing = ref(false)
const resizing = ref(false)

// Intro animations run once — reordering re-inserts the node, which would replay them
const introDone = ref(false)
onMounted(() => setTimeout(() => { introDone.value = true }, 1200))

const showChrome = computed(() =>
  (hovered.value || historyOpen.value || resizing.value) && !editing.value && !addOpen.value && !props.placeholder && !props.ghost)

// Pressing anywhere on the head (except its buttons) can start a drag
function onHeadPointerDown(e) {
  if (e.target.closest('button:not([data-drag-handle])')) return
  historyOpen.value = false
  addOpen.value = false
  emit('grab', e)
}

function onMouseLeave() {
  hovered.value = false
  hoveredBar.value = null
  hoveredAction.value = null
}

// ── Bars ──
const maxIndex = computed(() => props.chart.values.indexOf(Math.max(...props.chart.values)))
function barColor(i) {
  if (i === maxIndex.value) return hoveredBar.value === i ? '#2465de' : '#4c8afd'
  return hoveredBar.value === i ? '#b3cdfe' : '#ccdefe'
}
const formatK = (v) => (v / 1000).toFixed(2) + 'K'
const hoveredChange = computed(() => {
  const i = hoveredBar.value
  if (i === null || i === 0) return null
  const prev = props.chart.values[i - 1]
  return Math.round(((props.chart.values[i] - prev) / prev) * 100)
})
// Tooltip sits above the hovered bar, kept inside the plot
const tooltipStyle = computed(() => {
  const i = hoveredBar.value
  const n = props.chart.bars.length
  const top = barsArea.value - props.chart.bars[i] * barScale.value - 56
  const left = `calc(56px + (100% - 56px) * ${(i + 0.5) / n})`
  const shift = i === 0 ? '-20%' : i === n - 1 ? '-80%' : '-50%'
  return { top: Math.max(top, -8) + 'px', left, transform: `translateX(${shift})` }
})

// ── Toolbar ──
const actions = computed(() => [
  { key: 'ai', label: 'Edit with AI', icon: aiIcon },
  { key: 'd1', divider: true },
  { key: 'history', label: 'Prompt history', icon: historyIcon },
  { key: 'width', label: props.chart.span === 2 ? 'Half width' : 'Full width', icon: fullWidthIcon },
  { key: 'download', label: 'Download chart', icon: downloadIcon },
  { key: 'd2', divider: true },
  { key: 'remove', label: 'Remove chart', icon: removeIcon },
])

function onAction(key) {
  if (key === 'ai') emit('edit-ai', props.chart)
  else if (key === 'history') historyOpen.value = !historyOpen.value
  else if (key === 'width') props.chart.span = props.chart.span === 2 ? 1 : 2
  else if (key === 'download') downloadChart()
  else if (key === 'remove') emit('remove', props.chart.id)
}

function timeAgo(at) {
  const mins = Math.floor((Date.now() - at) / 60000)
  if (mins < 1) return 'Just now'
  if (mins < 60) return `${mins} min ago`
  return `${Math.floor(mins / 60)} hr ago`
}

// ── Add popover ──
function ask(text) {
  addOpen.value = false
  emit('ask', text)
}

// Close popovers on outside click / Esc
function onDocMouseDown(e) {
  if (!rootRef.value?.contains(e.target)) {
    historyOpen.value = false
    addOpen.value = false
  }
}
function onDocKey(e) {
  if (e.key === 'Escape') { historyOpen.value = false; addOpen.value = false }
}
onMounted(() => {
  document.addEventListener('mousedown', onDocMouseDown)
  document.addEventListener('keydown', onDocKey)
})
onBeforeUnmount(() => {
  document.removeEventListener('mousedown', onDocMouseDown)
  document.removeEventListener('keydown', onDocKey)
})
watch(addOpen, (open) => { if (open) historyOpen.value = false })

// ── Rename ──
const draftTitle = ref('')
const titleInputRef = useTemplateRef('titleInputRef')
async function startEdit() {
  draftTitle.value = props.chart.title
  editing.value = true
  await nextTick()
  titleInputRef.value?.focus()
  titleInputRef.value?.select()
}
function saveTitle() {
  if (!editing.value) return
  const value = draftTitle.value.trim()
  if (value) props.chart.title = value
  editing.value = false
}
function cancelEdit() {
  editing.value = false
}

// ── Resize: drag the corner — height freely, width snaps between half and full ──
function startResize(e) {
  e.preventDefault()
  const grid = rootRef.value.parentElement
  const gap = parseFloat(getComputedStyle(grid).columnGap) || 0
  const twoCols = props.canSpan && getComputedStyle(grid).gridTemplateColumns.split(' ').length > 1
  const colWidth = twoCols ? (grid.clientWidth - gap) / 2 : grid.clientWidth
  const startX = e.clientX
  const startY = e.clientY
  const startH = props.chart.height
  const startW = rootRef.value.offsetWidth
  resizing.value = true
  document.body.style.userSelect = 'none'

  const onMove = (ev) => {
    props.chart.height = Math.round(Math.min(Math.max(startH + ev.clientY - startY, 260), 640))
    if (twoCols) props.chart.span = startW + ev.clientX - startX > colWidth * 1.5 ? 2 : 1
  }
  const onUp = () => {
    resizing.value = false
    document.body.style.userSelect = ''
    window.removeEventListener('pointermove', onMove)
    window.removeEventListener('pointerup', onUp)
  }
  window.addEventListener('pointermove', onMove)
  window.addEventListener('pointerup', onUp)
}

// ── Download: render the chart to a PNG ──
function downloadChart() {
  const { title, bars, labels } = props.chart
  const W = 640, H = 400, S = 2
  const canvas = document.createElement('canvas')
  canvas.width = W * S
  canvas.height = H * S
  const ctx = canvas.getContext('2d')
  ctx.scale(S, S)
  ctx.fillStyle = '#ffffff'
  ctx.fillRect(0, 0, W, H)
  ctx.fillStyle = '#03102f'
  ctx.font = '500 16px Inter, sans-serif'
  ctx.fillText(title, 24, 36)

  const plotTop = 72, plotBottom = H - 48, plotLeft = 72, plotRight = W - 24
  const plotH = plotBottom - plotTop
  ctx.font = '500 10px Inter, sans-serif'
  ctx.fillStyle = '#9295a5'
  ctx.textAlign = 'right'
  Y_AXIS.forEach((label, i) => ctx.fillText(label, plotLeft - 16, plotTop + (plotH * i) / (Y_AXIS.length - 1) + 4))

  const step = (plotRight - plotLeft) / bars.length
  const scale = plotH / 216
  ctx.textAlign = 'center'
  bars.forEach((h, i) => {
    const x = plotLeft + i * step + 2
    const bh = h * scale
    ctx.fillStyle = i === maxIndex.value ? '#4c8afd' : '#ccdefe'
    ctx.beginPath()
    ctx.roundRect(x, plotBottom - bh, step - 4, bh, [4, 4, 0, 0])
    ctx.fill()
    ctx.fillStyle = '#9295a5'
    ctx.fillText(labels[i].toUpperCase(), x + (step - 4) / 2, plotBottom + 20)
  })
  ctx.strokeStyle = '#f2f2f4'
  ctx.beginPath()
  ctx.moveTo(plotLeft, plotBottom + 0.5)
  ctx.lineTo(plotRight, plotBottom + 0.5)
  ctx.stroke()

  const a = document.createElement('a')
  a.download = `${title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}.png`
  a.href = canvas.toDataURL('image/png')
  a.click()
}
</script>

<style scoped>
.chart-card {
  transition: border-color 150ms ease, box-shadow 150ms ease, opacity 150ms ease;
}
.chart-card--hover {
  border-color: #80acfe;
  box-shadow: 0px 0px 0px 3px #e5eeff;
}
/* Drop slot left behind by the dragged chart */
.chart-card--slot {
  border: 1.5px dashed #80acfe;
  background: #f5f8ff;
  box-shadow: none;
}
.chart-card--slot > * {
  visibility: hidden;
}
/* Floating copy under the pointer */
.chart-card--ghost {
  border-color: #80acfe;
  box-shadow: 0px 0px 0px 3px #e5eeff, 0px 16px 40px -8px rgba(3, 16, 47, 0.22);
}
.card-intro {
  animation: card-intro 400ms cubic-bezier(0.4, 0, 0.2, 1) both;
}
@keyframes card-intro {
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: none; }
}
.chart-card--static,
.added-bar--static {
  animation: none !important;
}

.title-input {
  box-shadow: 0px 0px 0px 3px #b3cdfe, inset 0px 2px 4px 0px rgba(0, 0, 0, 0.24);
}

.action-bar,
.popover,
.bar-tip,
.dark-tip {
  box-shadow: 0px 1px 3px 0px rgba(0, 0, 0, 0.1), 0px 3px 22px 0px rgba(38, 42, 50, 0.09);
}

.added-bar {
  transform-origin: bottom;
  animation: bar-grow 650ms cubic-bezier(0.34, 1.2, 0.64, 1) both;
  transition: background-color 150ms ease, height 200ms ease;
}
@keyframes bar-grow {
  from { transform: scaleY(0); }
  to { transform: scaleY(1); }
}

.chrome-enter-active,
.chrome-leave-active {
  transition: opacity 150ms ease;
}
.chrome-enter-from,
.chrome-leave-to {
  opacity: 0;
}

.tip-enter-active,
.tip-leave-active,
.bar-tip-enter-active,
.bar-tip-leave-active {
  transition: opacity 120ms ease;
}
.tip-enter-from,
.tip-leave-to,
.bar-tip-enter-from,
.bar-tip-leave-to {
  opacity: 0;
}
.bar-tip {
  transition: left 150ms cubic-bezier(0.4, 0, 0.2, 1), top 150ms cubic-bezier(0.4, 0, 0.2, 1), transform 150ms ease;
}

.pop-enter-active,
.pop-leave-active {
  transition: opacity 160ms ease, margin-top 160ms cubic-bezier(0.4, 0, 0.2, 1);
}
.pop-enter-from,
.pop-leave-to {
  opacity: 0;
  margin-top: -4px;
}

@media (prefers-reduced-motion: reduce) {
  .added-bar, .card-intro { animation: none; }
  .chart-card, .added-bar, .bar-tip { transition: none; }
}
</style>
