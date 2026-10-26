<template>
  <!-- Submit claim (Figma: Claims - Add New (Scan), 71:21714) — fills the main
       content area like the create card page, so the sidebar stays visible -->
  <div class="absolute inset-0 z-30 bg-white flex flex-col overflow-hidden">

    <!-- Header: Close / esc + Cancel / Submit -->
    <div class="flex items-center justify-between px-[24px] py-[12px] w-full border-b border-[#e5e6ea] shrink-0">
      <button type="button" class="flex items-start gap-[4px] cursor-pointer" @click="emit('close')">
        <span class="text-[14px] font-normal text-[#61667c] leading-[1.5]">Close</span>
        <span class="flex items-center justify-center px-[8px] py-[2px] rounded-[4px] border border-[#e5e6ea] bg-white">
          <span class="text-[12px] font-medium text-[#9295a5] leading-[1.5] whitespace-nowrap">esc</span>
        </span>
      </button>
      <div class="flex items-center gap-[8px] pl-[12px]">
        <button
          type="button"
          class="flex items-center justify-center h-[36px] min-w-[100px] px-[12px] rounded-[8px] border border-[#f2f2f4] transition-[filter] duration-150 hover:brightness-95 active:translate-y-[1px]"
          style="background: linear-gradient(to bottom, #ffffff, #f2f2f2); box-shadow: 0px 1.5px 0px 0px #e5e5e5;"
          @click="emit('close')"
        >
          <span class="text-[14px] font-medium text-[#61667c] leading-[1.5] whitespace-nowrap" style="text-shadow: 0px 1px 1px rgba(0,0,0,0.08);">Cancel</span>
        </button>
        <button
          type="button"
          class="flex items-center justify-center h-[36px] min-w-[100px] px-[12px] rounded-[8px] border border-[#2465de] transition-[filter,opacity] duration-150"
          :class="canSubmit ? 'hover:brightness-105 active:translate-y-[1px]' : 'opacity-50 cursor-not-allowed'"
          style="background: linear-gradient(to bottom, #4179e2, #1f5bcc); box-shadow: 0px 1.5px 0px 0px #1d5fd9;"
          :aria-disabled="!canSubmit"
          @click="submit"
        >
          <span class="text-[14px] font-medium text-white leading-[1.5] whitespace-nowrap" style="text-shadow: 0px 1px 1px rgba(0,0,0,0.12);">Submit</span>
        </button>
      </div>
    </div>

    <!-- Body: one centred column, or receipt preview + form side by side -->
    <div class="flex flex-1 min-h-0 w-full">

      <!-- Receipt preview (opened from the scanned thumbnail) -->
      <div v-if="previewOpen" class="flex flex-col flex-1 min-w-0 items-center gap-[16px] px-[24px] pt-[24px] pb-[12px] border-r border-[#e5e6ea] overflow-y-auto">
        <button
          ref="previewClose"
          type="button"
          class="self-end flex items-center gap-[8px] h-[36px] px-[12px] rounded-[8px] cursor-pointer transition-colors duration-150 hover:bg-[#f6f7f9]"
          @click="closePreview"
        >
          <img :src="closeIcon" width="18" height="18" alt="" class="shrink-0 -mx-[2px]" />
          <span class="text-[14px] font-medium text-[#61667c] leading-[1.5] whitespace-nowrap">Close</span>
        </button>
        <img ref="previewImg" :src="receiptPhoto" alt="Scanned receipt" class="w-full max-w-[447px] aspect-[447/578] rounded-[8px] object-cover shrink-0" />
      </div>

      <div ref="formPane" class="flex flex-col flex-1 min-w-0 overflow-y-auto" :class="previewOpen ? '' : 'items-center'">
        <div class="flex flex-col w-full pt-[12px] pb-[24px]" :class="previewOpen ? '' : 'max-w-[565.5px]'">

          <!-- Title + Upload / Manual tabs -->
          <div class="flex items-center gap-[16px] px-[24px] py-[12px] w-full" :class="previewOpen ? 'border-b border-[#e5e6ea] pb-[16px]' : ''">
            <div class="flex flex-col gap-[2px] flex-1 min-w-0">
              <p class="text-[16px] font-medium text-[#03102f] leading-[1.4] whitespace-nowrap">Submit Claims</p>
              <p class="text-[14px] font-normal text-[#61667c] leading-[1.5]">Upload claims and we scan it automatically</p>
            </div>
            <div class="flex items-center gap-[4px] p-[4px] rounded-[40px] bg-[#fcfcfd] border border-[#f2f2f4] shrink-0">
              <button
                v-for="t in tabs"
                :key="t.value"
                type="button"
                class="flex items-center gap-[4px] px-[8px] py-[4px] rounded-[40px] cursor-pointer transition-colors duration-150"
                :class="mode === t.value ? 'claim-tab--active' : 'hover:bg-[#f2f2f4]'"
                @click="setMode(t.value)"
              >
                <img :src="t.icon" width="14" height="14" alt="" class="shrink-0" />
                <span class="text-[12px] font-normal leading-[1.5] whitespace-nowrap" :class="mode === t.value ? 'text-[#03102f]' : 'text-[#61667c]'">{{ t.label }}</span>
              </button>
            </div>
          </div>

          <div class="flex flex-col gap-[16px] px-[24px] py-[12px] w-full">

            <!-- Drop zone: empty → hover/drag → scanning → scanned (hidden while previewing) -->
            <div
              v-if="mode === 'upload' && !previewOpen"
              class="relative flex flex-col items-center justify-center gap-[13px] h-[200px] w-full p-[8px] rounded-[8px] border border-dashed transition-colors duration-150"
              :class="[
                dropActive ? 'bg-[rgba(36,101,222,0.1)] border-[#2465de]' : 'bg-[#f8f9fc] border-[#ccd4e3]',
                stage === 'empty' ? 'cursor-pointer' : '',
              ]"
              @click="stage === 'empty' && pickFile()"
              @mouseenter="hovering = true"
              @mouseleave="hovering = false"
              @dragenter.prevent="dragDepth++"
              @dragover.prevent
              @dragleave="dragDepth = Math.max(0, dragDepth - 1)"
              @drop.prevent="onDrop"
            >
              <!-- Empty / hover -->
              <template v-if="stage === 'empty'">
                <div class="relative h-[116px] w-[71.077px] shrink-0">
                  <img :src="receiptEmpty" alt="" width="111.077" height="156" class="absolute max-w-none" style="left: -20px; top: -16px;" />
                  <Transition name="add-pop">
                    <span
                      v-if="dropActive"
                      class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center size-[48px] rounded-full bg-[#2465de]"
                      style="box-shadow: 0px 2.25px 16.5px 0px rgba(38,42,50,0.09);"
                    >
                      <img :src="plusIcon" width="18" height="18" alt="" />
                    </span>
                  </Transition>
                </div>
                <div class="flex flex-col items-center gap-[4px] text-center whitespace-nowrap">
                  <p class="text-[14px] text-[#03102f] leading-[1.5]">{{ dropActive ? 'Select or drag and drop your invoice here' : 'Drag and drop your claims here or select it from your files.' }}</p>
                  <p class="text-[12px] text-[#61667c] leading-[1.5]">{{ dropActive ? 'It supports PDF, PNG, or JPG. Max file size is 10MB' : 'Supported formats: PDF, PNG, or JPG. Maximum file size: 10MB.' }}</p>
                </div>
              </template>

              <!-- Scanning: a light band sweeps down the receipt -->
              <template v-else-if="stage === 'scanning'">
                <div class="relative h-[116px] w-[71.077px] shrink-0">
                  <img :src="receiptScanning" alt="" width="111.077" height="160" class="absolute max-w-none" style="left: -20px; top: -16px;" />
                </div>
                <div class="flex flex-col items-center gap-[4px] text-center whitespace-nowrap">
                  <p class="text-[14px] text-[#03102f] leading-[1.5]">Scanning you claims</p>
                  <p class="text-[12px] text-[#61667c] leading-[1.5]">{{ fileName }}</p>
                </div>
                <span class="scan-band absolute left-1/2 top-[14px] h-[33px] w-[120px] -translate-x-1/2 border-b border-[#80acfe]" />
              </template>

              <!-- Scanned: thumbnail opens the preview -->
              <template v-else>
                <button
                  ref="thumbEl"
                  type="button"
                  class="group relative h-[116px] w-[89.636px] shrink-0 rounded-[8px] overflow-hidden cursor-zoom-in"
                  aria-label="Preview receipt"
                  @click="openPreview"
                >
                  <img :src="receiptPhoto" alt="" class="absolute inset-0 size-full object-cover" />
                  <span class="absolute inset-0 flex items-center justify-center bg-[rgba(0,0,0,0.35)] opacity-0 transition-opacity duration-150 group-hover:opacity-100 group-focus-visible:opacity-100">
                    <img :src="zoomIcon" width="24" height="24" alt="" />
                  </span>
                </button>
                <div class="flex flex-col items-center gap-[4px] text-center whitespace-nowrap">
                  <p class="text-[14px] text-[#03102f] leading-[1.5]">Scanned completed</p>
                  <p class="text-[12px] text-[#61667c] leading-[1.5]">Please check scanned result</p>
                </div>
                <button
                  type="button"
                  class="absolute right-[11.25px] top-[11px] flex items-center gap-[6px] h-[28px] px-[8px] rounded-[8px] border border-[#f2f2f4] transition-[filter] duration-150 hover:brightness-95 active:translate-y-[1px]"
                  style="background: linear-gradient(to bottom, #ffffff, #f2f2f2); box-shadow: 0px 1.5px 0px 0px rgba(0,0,0,0.1);"
                  @click.stop="pickFile"
                >
                  <img :src="reuploadIcon" width="16" height="16" alt="" class="shrink-0 -mx-[1px]" />
                  <span class="text-[12px] font-medium text-[#61667c] leading-[1.5] whitespace-nowrap" style="text-shadow: 0px 1px 1px rgba(0,0,0,0.08);">Re-upload</span>
                </button>
              </template>
            </div>

            <!-- Skeleton fields while the scan runs -->
            <div v-if="mode === 'upload' && stage === 'scanning'" class="flex flex-col gap-[16px] w-full">
              <div v-for="(row, ri) in skeletonRows" :key="ri" class="flex gap-[12px] w-full">
                <div v-for="ci in row" :key="ci" class="relative flex-1 min-w-0 h-[58px]">
                  <span class="skeleton absolute left-[8px] right-[55.71px] top-[8px] h-[14px]" />
                  <span class="skeleton absolute left-[8px] right-[8px] top-[30px] h-[20px]" />
                </div>
              </div>
            </div>

            <!-- Claim fields: shown once scanned, or straight away in Manual -->
            <div v-if="mode === 'manual' || stage === 'scanned'" class="flex flex-col gap-[16px] py-[8px] w-full">
              <FieldRows :rows="topRows" :values="values" />

              <!-- Spent in another currency: what to pay back in the account currency
                   (Figma: Add New (Manual — Different Currency), 146:75719) -->
              <div v-if="isForeign" class="flex flex-col gap-[8px] w-full">
                <FieldRows :rows="reimburseRows" :values="values" :errors="{ 'Amount to reimburse': reimburseError }" />
                <div class="flex gap-[8px] w-full">
                  <p class="rate-chip flex-1 min-w-0 bg-[#f2f2f4] border-[#cbcdd4]">
                    Exchange rate: 1 {{ values.Currency }} = {{ formatRate(marketRate, yourRate != null ? 3 : 6) }} {{ reimburseCurrency }}
                  </p>
                  <p v-if="yourRate != null" class="rate-chip flex-1 min-w-0 bg-[#e5eeff] border-[#b3cdfe]">
                    Your rate: 1 {{ values.Currency }} = {{ formatRate(yourRate, 3) }} {{ reimburseCurrency }}
                  </p>
                </div>
              </div>

              <FieldRows :rows="bottomRows" :values="values" />
            </div>
          </div>
        </div>
      </div>
    </div>

    <input ref="fileInput" type="file" accept=".pdf,.png,.jpg,.jpeg" class="hidden" @change="onFilePicked" />
  </div>
</template>

<script setup>
import { computed, reactive, ref, watch, nextTick, onMounted, onUnmounted } from 'vue'
import FieldRows from '../forms/FieldRows.vue'
import { IDR_PER_UNIT, CURRENCIES } from '../../composables/useFx.js'
import uploadIcon from '../../assets/images/claims-tab-upload.svg'
import manualIcon from '../../assets/images/claims-tab-manual.svg'
import receiptEmpty from '../../assets/images/claims-receipt-empty.svg'
import receiptScanning from '../../assets/images/claims-receipt-scanning.svg'
import receiptPhoto from '../../assets/images/claims-receipt.jpg'
import zoomIcon from '../../assets/images/claims-zoom-in.svg'
import reuploadIcon from '../../assets/images/claims-reupload.svg'
import closeIcon from '../../assets/images/claims-close.svg'
import plusIcon from '../../assets/icons/icon-plus-white.svg'

const props = defineProps({
  // Currency of the bank account claims are paid back to
  reimburseCurrency: { type: String, default: 'IDR' },
  // A receipt dropped on the Claims table starts scanning straight away
  initialFile: { type: Object, default: null },
})
const emit = defineEmits(['close', 'submit'])

const tabs = [
  { value: 'upload', label: 'Upload', icon: uploadIcon },
  { value: 'manual', label: 'Manual', icon: manualIcon },
]
const mode = ref('upload')

// Upload stages: 'empty' → 'scanning' → 'scanned'
const stage = ref('empty')
const fileName = ref('')
const previewOpen = ref(false)

const hovering = ref(false)
const dragDepth = ref(0)
const dropActive = computed(() => stage.value === 'empty' && (hovering.value || dragDepth.value > 0))


const topRows = [
  [
    { label: 'Date', type: 'date', iconLeading: true, placeholder: 'DD/MM/YYYY' },
    { label: 'Merchant', placeholder: 'e.g. Hungry Spoon Bistro' },
  ],
  [{ label: 'Amount', prefixOptions: CURRENCIES, prefixKey: 'Currency', placeholder: '0.00' }],
]
const reimburseRows = computed(() => [
  // Always paid out in the bank account's currency, so the prefix is fixed (no picker)
  [{ label: 'Amount to reimburse', prefix: props.reimburseCurrency, placeholder: '0.00' }],
])
const bottomRows = [
  [{ label: 'Description', type: 'textarea', placeholder: 'What was this expense for?' }],
  [
    { label: 'Category', placeholder: 'Select category', options: ['Meal', 'Meals & Entertainment', 'Transport', 'Self care', 'Marketing'] },
    { label: 'Budget (optional)', placeholder: 'No budget', options: ['No budget', 'Marketing Q4', 'Team offsite'] },
  ],
]
const emptyValues = () => ({
  ...Object.fromEntries([...topRows, ...bottomRows].flat().map((f) => [f.label, ''])),
  Currency: props.reimburseCurrency,
  'Amount to reimburse': '',
})
const values = reactive(emptyValues())

// What the (mock) scan reads off the sample receipt
const SCANNED = {
  Date: '21/08/2026',
  Merchant: 'Hungry Spoon Bistro',
  Currency: 'SGD',
  Amount: '132.30',
  Description: 'Daily dose coffee',
  Category: 'Meal',
  'Budget (optional)': 'No budget',
}

// ── Different currency: convert to the reimbursement currency ──
function parseNumber(v) {
  const n = parseFloat(String(v).replace(/,/g, ''))
  return Number.isFinite(n) ? n : null
}
const money = (n) => n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

const isForeign = computed(() => values.Currency !== props.reimburseCurrency)
const marketRate = computed(() => IDR_PER_UNIT[values.Currency] / IDR_PER_UNIT[props.reimburseCurrency])
const convertedAmount = computed(() => {
  const n = parseNumber(values.Amount)
  return n == null ? '' : money(n * marketRate.value)
})

// Keep the reimbursed amount in step with the standard rate until the claimant
// types their own figure (e.g. from a bank statement); clearing it snaps back
watch(convertedAmount, (next, prev) => {
  const current = values['Amount to reimburse']
  if (!current || current === prev) values['Amount to reimburse'] = next
}, { immediate: true })
watch(isForeign, (foreign) => {
  values['Amount to reimburse'] = foreign ? convertedAmount.value : ''
})

// Effective rate from the claimant's own figure, shown only when it differs from the standard one
const yourRate = computed(() => {
  const spent = parseNumber(values.Amount)
  const back = parseNumber(values['Amount to reimburse'])
  if (!isForeign.value || !spent || back == null) return null
  return Math.abs(back - spent * marketRate.value) < 0.005 ? null : back / spent
})

function formatRate(rate, decimals) {
  if (rate >= 1) return rate.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
  // Very small rates need significant digits rather than fixed decimals
  return rate < 0.001 ? rate.toPrecision(3) : rate.toFixed(decimals)
}

const skeletonRows = [[1, 2], [1], [1]]

// The reimbursed figure can differ from the standard rate (bank fees, card rates), but only
// by so much: more than 5% above the converted amount is flagged (Figma: 193:51531)
const MAX_OVER_RATE = 0.05
const maxReimburse = computed(() => {
  const spent = parseNumber(values.Amount)
  return isForeign.value && spent ? spent * marketRate.value * (1 + MAX_OVER_RATE) : null
})
const reimburseError = computed(() => {
  if (!isForeign.value) return ''
  const back = parseNumber(values['Amount to reimburse'])
  if (back == null) return ''
  if (back <= 0) return 'Enter an amount greater than 0'
  if (maxReimburse.value != null && back > maxReimburse.value) {
    return `Amount is too high. It can be up to ${props.reimburseCurrency} ${money(maxReimburse.value)}, 5% above the exchange rate`
  }
  return ''
})

const canSubmit = computed(() =>
  (mode.value === 'manual' || stage.value === 'scanned') &&
  ['Date', 'Merchant', 'Amount', 'Category'].every((k) => String(values[k]).trim()) &&
  (!isForeign.value || parseNumber(values['Amount to reimburse']) != null) &&
  !reimburseError.value
)

const fileInput = ref(null)
function pickFile() {
  fileInput.value?.click()
}

function onFilePicked(e) {
  const file = e.target.files?.[0]
  if (file) startScan(file)
  e.target.value = ''
}

function onDrop(e) {
  dragDepth.value = 0
  const file = e.dataTransfer?.files?.[0]
  if (file) startScan(file)
}

const fileSize = ref('')
const formatSize = (bytes) => (bytes >= 1024 * 1024 ? `${(bytes / 1024 / 1024).toFixed(1)}MB` : `${Math.max(1, Math.round(bytes / 1024))}KB`)

let scanTimer = null
function startScan(file) {
  fileName.value = file.name
  fileSize.value = formatSize(file.size)
  stage.value = 'scanning'
  previewOpen.value = false
  clearTimeout(scanTimer)
  scanTimer = setTimeout(() => {
    Object.assign(values, SCANNED)
    stage.value = 'scanned'
  }, 2400)
}

if (props.initialFile) startScan(props.initialFile)

function setMode(next) {
  if (next === mode.value) return
  mode.value = next
  previewOpen.value = false
  // Manual starts from a blank form; Upload goes back to the drop zone
  if (next === 'manual' && stage.value !== 'scanned') Object.assign(values, emptyValues())
  if (next === 'upload' && stage.value !== 'scanned') stage.value = 'empty'
}

function submit() {
  if (!canSubmit.value) return
  const spent = parseNumber(values.Amount) ?? 0
  const back = isForeign.value ? parseNumber(values['Amount to reimburse']) ?? 0 : spent
  emit('submit', {
    date: values.Date,
    merchant: values.Merchant.trim(),
    description: values.Description.trim(),
    category: values.Category,
    // What was spent, and what gets paid back in the account currency
    spentCurrency: values.Currency,
    spentAmount: money(spent),
    currency: props.reimburseCurrency,
    amount: money(back),
    rate: isForeign.value && spent ? back / spent : null,
    // Scanned receipt travels with the claim; manual entries have none
    attachment: mode.value === 'upload' && stage.value === 'scanned' ? { name: fileName.value, size: fileSize.value } : null,
  })
}

// ── Receipt zoom: the preview grows out of the thumbnail and shrinks back into it ──
// A fixed "ghost" copy flies between the two spots (so scroll panes can't clip it) while
// the real image stays hidden; both share the receipt's 447:578 shape, so it's a pure scale.
const thumbEl = ref(null)
const previewImg = ref(null)
const previewClose = ref(null)
const formPane = ref(null)
const ZOOM = { duration: 420, easing: 'cubic-bezier(0.32, 0.72, 0, 1)' }
const reduceMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

function flyReceipt(from, target) {
  const to = target.getBoundingClientRect()
  if (!to.width) return
  const ghost = document.createElement('img')
  ghost.src = receiptPhoto
  ghost.alt = ''
  Object.assign(ghost.style, {
    position: 'fixed', left: `${to.left}px`, top: `${to.top}px`, width: `${to.width}px`, height: `${to.height}px`,
    objectFit: 'cover', borderRadius: '8px', zIndex: 200, pointerEvents: 'none', transformOrigin: 'top left',
    boxShadow: '0px 12px 32px rgba(3, 16, 47, 0.18)',
  })
  document.body.appendChild(ghost)
  target.style.visibility = 'hidden'
  const a = ghost.animate([
    { transform: `translate(${from.left - to.left}px, ${from.top - to.top}px) scale(${from.width / to.width}, ${from.height / to.height})` },
    { transform: 'none' },
  ], ZOOM)
  const done = () => { ghost.remove(); target.style.visibility = '' }
  a.onfinish = done
  a.oncancel = done
}
function fadeIn(el, dx = 0, delay = 0) {
  el?.animate([{ opacity: 0, transform: `translateX(${dx}px)` }, { opacity: 1, transform: 'none' }], { duration: 260, delay, easing: 'ease-out', fill: 'backwards' })
}

async function openPreview() {
  const from = thumbEl.value?.getBoundingClientRect()
  previewOpen.value = true
  await nextTick()
  if (!from || reduceMotion() || !previewImg.value) return
  flyReceipt(from, previewImg.value)
  fadeIn(previewClose.value, 0, 200)
  fadeIn(formPane.value, 24, 60)
}
async function closePreview() {
  const from = previewImg.value?.getBoundingClientRect()
  previewOpen.value = false
  await nextTick()
  if (!from || reduceMotion() || !thumbEl.value) return
  flyReceipt(from, thumbEl.value)
  fadeIn(formPane.value, -24, 0)
}

function onKeydown(e) {
  if (e.key !== 'Escape') return
  // Esc closes the receipt preview first, then the page
  if (previewOpen.value) closePreview()
  else emit('close')
}
onMounted(() => window.addEventListener('keydown', onKeydown))
onUnmounted(() => {
  window.removeEventListener('keydown', onKeydown)
  clearTimeout(scanTimer)
})
</script>

<style scoped>
/* Selected Upload / Manual pill (Figma: Tab Menu, selected) */
.claim-tab--active {
  background: linear-gradient(to bottom, #ffffff 40%, #fcfcfd);
  box-shadow: 0px 1px 1px 0px rgba(0, 0, 0, 0.04), 0px 3px 8px 0px rgba(38, 42, 50, 0.08);
}

/* Exchange-rate notes under "Amount to reimburse" (Figma: Snackbar/Small) */
.rate-chip {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px 12px 8px 8px;
  border-width: 1px;
  border-style: solid;
  border-radius: 8px;
  font-size: 12px;
  line-height: 1.5;
  color: #03102f;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* Scan band: the glow trails the line. Going down it sits above the line; at the bottom it
   folds over the line (Figma: 40:4390) and trails below on the way back up, then folds again.
   Pivoting on the line (bottom edge) keeps the line itself from jumping during the fold. */
.scan-band {
  background: linear-gradient(to top, #b3cdfe, rgba(229, 238, 255, 0));
  transform-origin: 50% 100%;
  animation: scan-sweep 2.6s ease-in-out infinite;
}
@keyframes scan-sweep {
  0%   { transform: translate(-50%, 0) scaleY(1); }
  44%  { transform: translate(-50%, 55px) scaleY(1); }
  50%  { transform: translate(-50%, 55px) scaleY(-1); }
  94%  { transform: translate(-50%, 0) scaleY(-1); }
  100% { transform: translate(-50%, 0) scaleY(1); }
}

/* Skeleton bars with a moving sheen (Figma: Skeleton / Loader) */
.skeleton {
  overflow: hidden;
  border-radius: 4px;
  background: #f2f2f4;
}
.skeleton::after {
  content: '';
  position: absolute;
  inset: 0 auto 0 -46px;
  width: 40px;
  background: linear-gradient(to left, #e5e6ea, rgba(229, 230, 234, 0));
  animation: skeleton-sheen 1.4s ease-in-out infinite;
}
@keyframes skeleton-sheen {
  to { transform: translateX(calc(100% + 600px)); }
}

/* "+" badge pops in when hovering or dragging over the drop zone */
.add-pop-enter-active { transition: opacity 160ms ease-out, transform 160ms cubic-bezier(0.34, 1.56, 0.64, 1); }
.add-pop-leave-active { transition: opacity 100ms ease-in; }
.add-pop-enter-from { opacity: 0; transform: translate(-50%, -50%) scale(0.6); }
.add-pop-leave-to { opacity: 0; }

@media (prefers-reduced-motion: reduce) {
  .scan-band, .skeleton::after { animation: none; }
  .add-pop-enter-active, .add-pop-leave-active { transition: none; }
  .add-pop-enter-from { transform: translate(-50%, -50%); }
}
</style>
