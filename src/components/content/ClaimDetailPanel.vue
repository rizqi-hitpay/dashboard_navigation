<template>
  <!-- Claim details (Figma: [Employee] Claim Details, 71:22038) — a floating panel
       over the list; the receipt preview opens as a second panel to its left -->
  <div class="absolute top-[12px] right-[12px] bottom-[12px] z-40 flex max-w-[calc(100%-24px)] pointer-events-none">

    <!-- Receipt preview -->
    <Transition name="receipt-panel">
      <div
        v-if="previewOpen"
        class="pointer-events-auto flex items-center justify-center w-[480px] shrink min-w-0 bg-white rounded-l-[8px] overflow-hidden p-[16px]"
        style="box-shadow: -16px 24px 120px 0px rgba(38,42,50,0.2);"
      >
        <img :src="receiptPhoto" alt="Receipt" class="w-full max-w-[447px] aspect-[447/578] rounded-[8px] object-cover" />
      </div>
    </Transition>

    <div
      class="pointer-events-auto relative flex flex-col w-[480px] shrink-0 bg-white overflow-hidden"
      :class="previewOpen ? 'rounded-r-[8px]' : 'rounded-[8px]'"
      style="box-shadow: -16px 24px 120px 0px rgba(38,42,50,0.2);"
      role="dialog"
      :aria-label="editing ? 'Edit claim' : claim.merchant + ' claim details'"
    >
      <!-- Header -->
      <div class="flex items-start gap-[16px] p-[16px] border-b border-[#e5e6ea] shrink-0">
        <div v-if="editing" class="flex-1 min-w-0 pt-[2px]">
          <p class="text-[16px] font-medium text-[#03102f] leading-[1.4]">Edit claim</p>
        </div>
        <div v-else class="flex flex-col gap-[4px] flex-1 min-w-0 pt-[2px]">
          <p class="text-[10px] font-medium uppercase tracking-[0.3px] text-[#61667c] leading-[18px] truncate">{{ claim.merchant }}</p>
          <div class="flex items-center flex-wrap gap-[8px]">
            <p class="text-[18px] font-medium text-[#03102f] leading-[1.35] whitespace-nowrap" style="font-family: 'Reddit Mono', ui-monospace, monospace;">{{ spent.currency }} {{ spent.value }}</p>
            <span
              v-for="chip in (readonly ? [] : stateChips)"
              :key="chip.label"
              class="inline-flex items-center justify-center min-h-[24px] min-w-[32px] px-[8px] py-[2px] rounded-[24px] text-[12px] font-medium leading-[1.5] whitespace-nowrap"
              :style="chip.style"
            >{{ chip.label }}</span>
          </div>
          <!-- Paid out in the account currency (Figma: Paid header) -->
          <p v-if="converted" class="text-[12px] text-[#61667c] leading-[1.5] whitespace-pre">Converted <span class="font-medium text-[#03102f]">{{ converted.amount }}</span>  ({{ converted.rate }})</p>
        </div>
        <button type="button" class="flex items-center justify-center size-[32px] rounded-[4px] shrink-0 transition-colors duration-150 hover:bg-[#f0f1f5]" aria-label="Close" @click="emit('close')">
          <img :src="closeIcon" width="20" height="20" alt="" />
        </button>
      </div>

      <!-- Body -->
      <div class="flex-1 min-h-0 overflow-y-auto">

        <!-- View -->
        <div v-if="!editing" class="flex flex-col gap-[20px] px-[16px] py-[12px]">
          <div class="flex flex-col gap-[12px]">
            <div v-for="row in detailRows" :key="row.label" class="flex flex-col gap-[4px]">
              <p class="text-[14px] text-[#61667c] leading-[1.5]">{{ row.label }}</p>
              <p class="text-[14px] text-[#03102f] leading-[1.5]">{{ row.value }}</p>
            </div>
            <div v-if="claim.attachment" class="flex flex-col gap-[4px]">
              <p class="text-[14px] text-[#61667c] leading-[1.5]">Attachment</p>
              <div class="flex items-center gap-[8px] p-[8px] rounded-[8px] border border-[#e5e6ea] bg-white">
                <span class="file-thumb relative h-[35px] w-[35.834px] shrink-0">
                  <span class="file-thumb__paper"><img :src="fileImageIcon" width="16" height="16" alt="" /></span>
                  <span class="file-thumb__type">{{ fileType }}</span>
                </span>
                <div class="flex flex-col flex-1 min-w-0">
                  <p class="text-[12px] text-[#03102f] leading-[1.5] truncate">{{ claim.attachment.name }}</p>
                  <p class="text-[10px] font-medium uppercase tracking-[0.3px] text-[#61667c] leading-[18px]">{{ claim.attachment.size }}</p>
                </div>
                <button type="button" class="btn-small shrink-0" @click="previewOpen = !previewOpen">{{ previewOpen ? 'Close preview' : 'Preview' }}</button>
              </div>
            </div>
          </div>

          <!-- Timeline: newest first, the latest event's dot in blue -->
          <div class="flex flex-col gap-[12px]">
            <div class="flex items-center justify-between">
              <p class="text-[16px] font-medium text-black leading-[1.4]">Timeline</p>
              <button type="button" class="btn-small gap-[6px]">
                <img :src="addNoteIcon" width="16" height="16" alt="" class="-mx-[1px]" />
                Add Note
              </button>
            </div>
            <div class="flex flex-col pl-[20px] pr-[24px] py-[4px] rounded-[8px] bg-[#f8f9fc]">
              <div v-for="(event, i) in timeline" :key="event.id" class="relative flex items-start gap-[4px] py-[12px]">
                <span v-if="i < timeline.length - 1" class="absolute left-[11px] top-[35px] -bottom-[11px] w-px bg-[#cbcdd4]" />
                <img :src="i === 0 ? dotActiveIcon : dotIcon" width="23" height="23" alt="" class="shrink-0" />
                <div class="flex flex-col gap-[4px] flex-1 min-w-0">
                  <p class="text-[14px] text-[#03102f] leading-[1.5]">{{ event.at }}</p>
                  <!-- Rejections lead with a red label, then the admin's reason -->
                  <p class="text-[12px] text-[#61667c] leading-[1.5]"><span v-if="event.label" class="text-[#dc3545]">{{ event.label }}</span>{{ event.label ? ' ' : '' }}{{ event.text }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Edit (Figma: Edit claim, 71:22040) -->
        <div v-else class="flex flex-col gap-[16px] px-[16px] py-[20px]">
          <FieldRows :rows="editRows" :values="form" />
          <div v-if="form.attachment" class="flex flex-col gap-[4px]">
            <p class="text-[14px] text-[#61667c] leading-[1.5]">Attachment</p>
            <div class="flex items-center gap-[8px] p-[8px] rounded-[8px] border border-[#e5e6ea] bg-white">
              <span class="file-thumb relative h-[35px] w-[35.834px] shrink-0">
                <span class="file-thumb__paper"><img :src="fileImageIcon" width="16" height="16" alt="" /></span>
                <span class="file-thumb__type">{{ fileType }}</span>
              </span>
              <div class="flex flex-col flex-1 min-w-0">
                <p class="text-[12px] text-[#03102f] leading-[1.5] truncate">{{ form.attachment.name }}</p>
                <p class="text-[10px] font-medium uppercase tracking-[0.3px] text-[#61667c] leading-[18px]">{{ form.attachment.size }}</p>
              </div>
              <div class="flex items-center gap-[8px] shrink-0">
                <button type="button" class="btn-small" @click="previewOpen = !previewOpen">{{ previewOpen ? 'Close preview' : 'Preview' }}</button>
                <button type="button" class="btn-small" @click="fileInput?.click()">Re-upload</button>
              </div>
            </div>
            <input ref="fileInput" type="file" accept=".pdf,.png,.jpg,.jpeg" class="hidden" @change="onReupload" />
          </div>
        </div>
      </div>

      <!-- Footer: Edit while the claim can still change; Cancel / Update while editing -->
      <div v-if="editing" class="flex items-center gap-[8px] p-[16px] border-t border-[#e5e6ea] shrink-0">
        <button type="button" class="flex items-center h-[36px] px-[12px] rounded-[8px] text-[14px] font-medium text-[#484d61] leading-[1.5] transition-colors duration-150 hover:bg-[#f6f7f9]" @click="cancelEdit">Cancel</button>
        <div class="flex-1" />
        <button
          type="button"
          class="flex items-center justify-center h-[36px] min-w-[100px] px-[12px] rounded-[8px] border border-[#2465de] transition-[filter,opacity] duration-150"
          :class="canUpdate ? 'hover:brightness-105 active:translate-y-[1px]' : 'opacity-50 cursor-not-allowed'"
          style="background: linear-gradient(to bottom, #4179e2, #1f5bcc); box-shadow: 0px 1.5px 0px 0px #1d5fd9;"
          :aria-disabled="!canUpdate"
          @click="update"
        >
          <span class="text-[14px] font-medium text-white leading-[1.5] whitespace-nowrap" style="text-shadow: 0px 1px 1px rgba(0,0,0,0.12);">Update</span>
        </button>
      </div>
      <!-- Admin/Owner reviewing a pending claim: Edit · Reject · Approve (Figma: [Admin] Claim Details) -->
      <div v-else-if="!readonly && isAdmin && claim.status === 'Need approval'" class="flex items-center gap-[8px] p-[16px] border-t border-[#e5e6ea] shrink-0">
        <button type="button" class="flex items-center gap-[8px] h-[36px] px-[12px] rounded-[8px] transition-colors duration-150 hover:bg-[#f0f5ff]" @click="startEdit">
          <img :src="editIcon" width="18" height="18" alt="" class="-mx-[2px]" />
          <span class="text-[14px] font-medium text-[#2465de] leading-[1.5]">Edit</span>
        </button>
        <div class="flex-1" />
        <button type="button" class="flex items-center gap-[8px] h-[36px] px-[12px] rounded-[8px] transition-colors duration-150 hover:bg-[#fdf2f3]" @click="decision = 'reject'">
          <img :src="rejectIcon" width="18" height="18" alt="" class="-mx-[2px]" />
          <span class="text-[14px] font-medium text-[#dc3545] leading-[1.5]">Reject</span>
        </button>
        <button
          type="button"
          class="flex items-center justify-center h-[36px] min-w-[100px] px-[12px] rounded-[8px] border border-[#2465de] transition-[filter] duration-150 hover:brightness-105 active:translate-y-[1px]"
          style="background: linear-gradient(to bottom, #4179e2, #1f5bcc); box-shadow: 0px 1.5px 0px 0px #1d5fd9;"
          @click="decision = 'approve'"
        >
          <span class="text-[14px] font-medium text-white leading-[1.5]" style="text-shadow: 0px 1px 1px rgba(0,0,0,0.12);">Approve</span>
        </button>
      </div>
      <!-- Admin/Owner with an approved claim: pay it out -->
      <div v-else-if="!readonly && isAdmin && awaitingPayment && claim.payment !== 'scheduled'" class="flex items-center justify-end p-[16px] border-t border-[#e5e6ea] shrink-0">
        <button
          type="button"
          class="flex items-center justify-center h-[36px] min-w-[100px] px-[12px] rounded-[8px] border border-[#2465de] transition-[filter] duration-150 hover:brightness-105 active:translate-y-[1px]"
          style="background: linear-gradient(to bottom, #4179e2, #1f5bcc); box-shadow: 0px 1.5px 0px 0px #1d5fd9;"
          @click="emit('create-reimbursement', claim)"
        >
          <span class="text-[14px] font-medium text-white leading-[1.5] whitespace-nowrap" style="text-shadow: 0px 1px 1px rgba(0,0,0,0.12);">Create reimbursement</span>
        </button>
      </div>
      <div v-else-if="!readonly && !isAdmin && editable" class="flex items-center justify-end p-[16px] border-t border-[#e5e6ea] shrink-0">
        <button type="button" class="flex items-center gap-[8px] h-[36px] px-[12px] rounded-[8px] transition-colors duration-150 hover:bg-[#f0f5ff]" @click="startEdit">
          <img :src="editIcon" width="18" height="18" alt="" class="-mx-[2px]" />
          <span class="text-[14px] font-medium text-[#2465de] leading-[1.5]">Edit</span>
        </button>
      </div>
    </div>

    <ClaimDecisionModal
      :open="!!decision"
      :kind="decision || 'approve'"
      :claim="claim"
      :amount="spent"
      @close="decision = null"
      @confirm="onDecision"
    />
  </div>
</template>

<script setup>
import { computed, reactive, ref, watch, onMounted, onUnmounted } from 'vue'
import FieldRows from '../forms/FieldRows.vue'
import ClaimDecisionModal from '../modals/ClaimDecisionModal.vue'
import { statusStyle } from '../../composables/useBills.js'
import rejectIcon from '../../assets/images/claims-reject.svg'
import receiptPhoto from '../../assets/images/claims-receipt.jpg'
import closeIcon from '../../assets/images/claims-panel-close.svg'
import fileImageIcon from '../../assets/images/claims-file-image.svg'
import addNoteIcon from '../../assets/images/claims-add-note.svg'
import dotActiveIcon from '../../assets/images/claims-timeline-dot-active.svg'
import dotIcon from '../../assets/images/claims-timeline-dot.svg'
import editIcon from '../../assets/images/claims-edit.svg'

const props = defineProps({
  claim: { type: Object, required: true },
  categories: { type: Array, default: () => [] },
  // 'employee' | 'admin' — Admin/Owner reviews (approve / reject / pay) instead of only editing
  role: { type: String, default: 'employee' },
  // Viewed from a reimbursement: details only, no status chips or actions
  readonly: { type: Boolean, default: false },
})
const emit = defineEmits(['close', 'update', 'approve', 'reject', 'create-reimbursement'])

const isAdmin = computed(() => props.role === 'admin')
const timeline = computed(() => props.claim.timeline ?? [])
const awaitingPayment = computed(() => props.claim.status === 'Completed' && props.claim.payment !== 'paid')

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const parseNumber = (v) => {
  const n = parseFloat(String(v).replace(/,/g, ''))
  return Number.isFinite(n) ? n : null
}
const money = (n) => n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
const splitAmount = (s) => {
  const [currency, value] = s.split(' ')
  return { currency, value }
}

// What was spent: the original currency for foreign-currency claims, else the list amount
const spent = computed(() => splitAmount(props.claim.fx ? props.claim.fx.original : props.claim.amount))
const reimbursed = computed(() => splitAmount(props.claim.amount))

const converted = computed(() => {
  if (!props.claim.fx) return null
  const rate = parseNumber(reimbursed.value.value) / parseNumber(spent.value.value)
  const shown = rate >= 0.01 ? money(rate) : rate.toPrecision(3)
  return { amount: props.claim.amount, rate: `${spent.value.currency} 1 = ${reimbursed.value.currency} ${shown}` }
})

// Header chips per state (Figma: Need approval / Approved + Waiting for payment / Paid)
const stateChips = computed(() => {
  const c = props.claim
  if (c.status === 'Completed' && c.payment === 'paid') return [{ label: 'Paid', style: { background: '#e6f9f0', color: '#238b5b' } }]
  // Admins see the decision; employees also see that payment is still on its way
  if (c.status === 'Completed' && isAdmin.value) return [{ label: 'Approved', style: { background: '#f5f6f9', color: '#002771' } }]
  if (c.status === 'Completed') {
    return [
      { label: 'Approved', style: { background: '#f5f6f9', color: '#002771' } },
      { label: 'Waiting for payment', style: { background: '#fff', color: '#bd8400', border: '1px solid #ffe0a2' } },
    ]
  }
  if (c.status === 'Need approval') return [{ label: 'Need approval', style: { background: '#f7edfd', color: '#7d1ab7' } }]
  const s = statusStyle(c.status)
  return [{ label: c.status, style: { background: s.bg, color: s.text } }]
})

// Approved and paid claims are locked; drafts, pending and rejected ones can still be fixed
const editable = computed(() => props.claim.status !== 'Completed')

const detailRows = computed(() => [
  { label: 'Date', value: props.claim.date },
  { label: 'Merchant', value: props.claim.merchant },
  { label: 'Description', value: props.claim.description },
  { label: 'Category', value: props.claim.category },
  { label: 'Submitted by', value: props.claim.staff },
])

const fileType = computed(() => (props.claim.attachment?.name.split('.').pop() || 'file').toUpperCase())

// ── Receipt preview ──
const previewOpen = ref(false)

// ── Edit ──
const editing = ref(false)
const form = reactive({})
const fileInput = ref(null)

const editRows = computed(() => [
  [
    { label: 'Date', type: 'date', iconLeading: true, placeholder: 'DD/MM/YYYY' },
    { label: 'Amount', prefix: spent.value.currency, prefixChevron: true, placeholder: '0.00' },
  ],
  [{ label: 'Merchant', placeholder: 'Merchant' }],
  [{ label: 'Description', type: 'textarea', placeholder: 'What was this expense for?' }],
  [{ label: 'Category', placeholder: 'Select category', options: props.categories }],
])

// "Jan 14, 2026" ↔ "14/01/2026"
function toInputDate(listDate) {
  const m = listDate.match(/^([A-Za-z]{3}) (\d{1,2}), (\d{4})$/)
  return m ? `${m[2].padStart(2, '0')}/${String(MONTHS.indexOf(m[1]) + 1).padStart(2, '0')}/${m[3]}` : listDate
}
function toListDate(value) {
  const m = String(value).trim().match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/)
  return m && MONTHS[+m[2] - 1] ? `${MONTHS[+m[2] - 1]} ${m[1].padStart(2, '0')}, ${m[3]}` : value
}

function startEdit() {
  Object.assign(form, {
    Date: toInputDate(props.claim.date),
    Amount: spent.value.value,
    Merchant: props.claim.merchant,
    Description: props.claim.description,
    Category: props.claim.category,
    attachment: props.claim.attachment ? { ...props.claim.attachment } : null,
  })
  editing.value = true
}

function cancelEdit() {
  editing.value = false
  previewOpen.value = false
}

const canUpdate = computed(() =>
  ['Date', 'Amount', 'Merchant', 'Category'].every((k) => String(form[k] ?? '').trim()) && parseNumber(form.Amount) != null
)

function onReupload(e) {
  const file = e.target.files?.[0]
  if (file) form.attachment = { name: file.name, size: formatSize(file.size) }
  e.target.value = ''
}

function formatSize(bytes) {
  return bytes >= 1024 * 1024 ? `${(bytes / 1024 / 1024).toFixed(1)}MB` : `${Math.max(1, Math.round(bytes / 1024))}KB`
}

function update() {
  if (!canUpdate.value) return
  const newSpent = parseNumber(form.Amount)
  const changes = {
    date: toListDate(form.Date),
    merchant: form.Merchant.trim(),
    description: form.Description.trim() || '—',
    category: form.Category,
    attachment: form.attachment,
  }
  if (props.claim.fx) {
    // Keep the claim's exchange rate; the paid-back amount follows the new spend
    const rate = parseNumber(reimbursed.value.value) / parseNumber(spent.value.value)
    changes.amount = `${reimbursed.value.currency} ${money(newSpent * rate)}`
    changes.fx = { ...props.claim.fx, original: `${spent.value.currency} ${money(newSpent)}` }
  } else {
    changes.amount = `${spent.value.currency} ${money(newSpent)}`
  }
  emit('update', changes)
  editing.value = false
  previewOpen.value = false
}

// ── Admin decision (approve / reject confirmation) ──
const decision = ref(null)
function onDecision(reason) {
  if (decision.value === 'reject') emit('reject', reason)
  else emit('approve')
  decision.value = null
  previewOpen.value = false
}

// A different claim resets the panel to its details view
watch(() => props.claim.id, () => {
  editing.value = false
  previewOpen.value = false
  decision.value = null
})

function onKeydown(e) {
  if (e.key !== 'Escape') return
  if (decision.value) decision.value = null
  else if (previewOpen.value) previewOpen.value = false
  else if (editing.value) cancelEdit()
  else emit('close')
}
onMounted(() => window.addEventListener('keydown', onKeydown))
onUnmounted(() => window.removeEventListener('keydown', onKeydown))
</script>

<style scoped>
/* Small secondary button (Figma: Button/Secondary, 28px) */
.btn-small {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 28px;
  padding: 0 8px;
  border: 1px solid #f2f2f4;
  border-radius: 8px;
  background: linear-gradient(to bottom, #ffffff, #f2f2f2);
  box-shadow: 0px 1.5px 0px 0px rgba(0, 0, 0, 0.1);
  font-size: 12px;
  font-weight: 500;
  line-height: 1.5;
  color: #61667c;
  text-shadow: 0px 1px 1px rgba(0, 0, 0, 0.08);
  white-space: nowrap;
  transition: filter 150ms ease;
}
.btn-small:hover { filter: brightness(0.95); }
.btn-small:active { transform: translateY(1px); }

/* Attachment thumbnail (Figma: Image File) — paper with a file-type tag */
.file-thumb__paper {
  position: absolute;
  inset: 0 21.86% 0 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: white;
  border: 0.767px solid #e5e6ea;
  border-radius: 4.6px;
  box-shadow: 0px 0.767px 1.533px 0px rgba(0, 0, 0, 0.05), 0px 3.067px 9.2px 0px rgba(38, 42, 50, 0.08);
}
.file-thumb__type {
  position: absolute;
  inset: 50.07% -1.12% 12.6% 39.72%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 3px 4px;
  border: 0.767px solid #494949;
  border-radius: 4px;
  background: linear-gradient(to bottom, #5b5c5d, #4b4747);
  filter: drop-shadow(0px 4px 4px rgba(14, 38, 82, 0.2));
  font-size: 7px;
  font-weight: 600;
  line-height: 1;
  letter-spacing: -0.14px;
  color: white;
  text-shadow: 0px 0.767px 0.767px rgba(0, 0, 0, 0.2);
}

/* Receipt preview slides out from behind the details panel */
.receipt-panel-enter-active { transition: opacity 220ms ease-out, transform 260ms cubic-bezier(0.32, 0.72, 0, 1); }
.receipt-panel-leave-active { transition: opacity 140ms ease-in, transform 160ms ease-in; }
.receipt-panel-enter-from,
.receipt-panel-leave-to { opacity: 0; transform: translateX(24px); }

@media (prefers-reduced-motion: reduce) {
  .receipt-panel-enter-active, .receipt-panel-leave-active { transition: none; }
  .receipt-panel-enter-from, .receipt-panel-leave-to { transform: none; }
}
</style>
