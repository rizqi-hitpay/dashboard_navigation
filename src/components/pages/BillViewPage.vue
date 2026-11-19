<template>
  <!-- Bill detail (Figma BillPay 16017:11840) -->
  <div class="relative bg-white flex h-full w-full overflow-hidden">
    <div class="flex-1 min-w-0 h-full overflow-y-auto overflow-x-hidden">
      <div class="flex flex-col items-start w-full pt-[4px]">

        <!-- Page title (16017:12069) -->
        <div class="flex flex-wrap gap-x-[32px] gap-y-[8px] items-center px-[24px] py-[12px] w-full shrink-0">
          <div class="flex flex-1 flex-col gap-[8px] items-start justify-center min-w-[260px]">
            <button type="button" class="flex items-center gap-[6px] h-[28px] rounded-[8px] text-[12px] font-medium text-[#484d61] hover:text-[#03102f] transition-colors duration-150" @click="$router.push('/bills')">
              <img :src="chevronLeftIcon" width="16" height="16" alt="" />
              Back
            </button>
            <div class="flex gap-[8px] items-center">
              <h1 class="text-[18px] font-medium text-[#03102f] leading-[1.35] whitespace-nowrap">{{ bill.invoice }}</h1>
              <span class="chip" :style="{ background: chip.bg, color: chip.text }">{{ chip.label }}</span>
            </div>
            <div class="flex flex-wrap gap-x-[16px] gap-y-[4px] items-center">
              <span class="flex items-center gap-[4px] text-[12px] text-[#61667c] leading-[1.5] whitespace-nowrap">
                <img :src="buildingIcon" width="14" height="14" alt="" />Bill to {{ bill.recipient }}
              </span>
              <span class="flex items-center gap-[4px] text-[12px] text-[#61667c] leading-[1.5] whitespace-nowrap">
                <img :src="calendarIcon" width="14" height="14" alt="" />Due date: {{ formatDate(bill.due) }}
              </span>
            </div>
          </div>

          <!-- Bill amount -->
          <div class="flex flex-col gap-px items-start p-[8px] min-w-[100px] shrink-0">
            <span class="text-[10px] font-medium uppercase tracking-[0.3px] text-[#9295a5]" style="line-height: 18px;">Bill amount</span>
            <span class="text-[18px] font-medium text-[#03102f] leading-[1.35] whitespace-nowrap mono">SGD {{ money(youWillPay) }}</span>
          </div>

          <!-- Primary action: Payment Confirmation (paid) · Approve (awaiting approval) -->
          <div v-if="headerAction === 'confirmation'" class="relative flex shrink-0 rounded-[8px] border border-[#2465de]" style="box-shadow: 0px 1.5px 0px 0px #1d5fd9;">
            <button type="button" class="btn-blue flex items-center gap-[8px] h-[34px] pl-[12px] pr-[12px] rounded-l-[7px]">
              <img :src="telegramIcon" width="18" height="18" alt="" />
              <span class="text-[14px] font-medium text-white leading-[1.5] whitespace-nowrap" style="text-shadow: 0px 1px 1px rgba(0,0,0,0.12);">Payment Confirmation</span>
            </button>
            <button type="button" class="btn-blue flex items-center justify-center h-[34px] w-[40px] border-l border-[#2465de] rounded-r-[7px]" aria-label="Payment confirmation options" :aria-expanded="confirmMenuOpen" @click="confirmMenuOpen = !confirmMenuOpen">
              <img :src="chevronDownWhite" width="18" height="18" alt="" class="transition-transform duration-200" :class="confirmMenuOpen ? 'rotate-180' : ''" />
            </button>
            <!-- Full / Simplified version (same menu as the bills list) -->
            <div v-if="confirmMenuOpen" class="fixed inset-0 z-10" @click="confirmMenuOpen = false" />
            <Transition name="menu-pop">
              <div v-if="confirmMenuOpen" role="menu" class="absolute right-0 top-[44px] z-20 w-[190px] rounded-[8px] bg-white overflow-hidden" style="box-shadow: 0px 1px 3px 0px rgba(0,0,0,0.1), 0px 3px 22px 0px rgba(38,42,50,0.09);">
                <div class="flex flex-col p-[4px]">
                  <p class="px-[8px] py-[4px] text-[10px] font-medium uppercase tracking-[0.3px] leading-[18px] text-[#61667c]">Payment confirmation</p>
                  <button v-for="o in confirmOptions" :key="o.label" type="button" role="menuitem" class="flex flex-col items-start p-[8px] rounded-[4px] w-full text-left hover:bg-[#f5f6f9] transition-colors duration-100" @click="confirmMenuOpen = false">
                    <span class="text-[12px] text-[#03102f] leading-[1.5]">{{ o.label }}</span>
                    <span class="text-[12px] text-[#61667c] leading-[1.5]">{{ o.sub }}</span>
                  </button>
                </div>
              </div>
            </Transition>
          </div>
          <button v-else-if="headerAction === 'approve'" type="button" class="btn-blue flex items-center justify-center h-[36px] min-w-[100px] px-[12px] rounded-[8px] border border-[#2465de] shrink-0" style="box-shadow: 0px 1.5px 0px 0px #1d5fd9;">
            <span class="text-[14px] font-medium text-white leading-[1.5]" style="text-shadow: 0px 1px 1px rgba(0,0,0,0.12);">Approve</span>
          </button>
        </div>

        <!-- Status + progress (16017:12070) -->
        <div class="w-full px-[24px] pb-[12px]">
          <div class="flex flex-col gap-[8px] p-[4px] rounded-[8px] bg-[#f5f6f9]">
            <div class="flex flex-col gap-[4px] px-[16px] py-[8px]">
              <p class="text-[14px] font-medium text-[#03102f] leading-[1.5]">{{ status.title }}</p>
              <p class="text-[14px] text-[#61667c] leading-[1.5]">{{ status.text }}</p>
            </div>
            <div class="overflow-x-auto overflow-y-hidden pt-[8px]">
              <ol class="flex items-start min-w-[1024px] px-[8px] pb-[8px] rounded-[4px] bg-white">
                <li v-for="(s, i) in steps" :key="s.label" class="relative flex-1 min-w-[256px] px-[8px] pt-[16px]">
                  <!-- dot + connector to the next step -->
                  <span class="absolute left-[8px] top-[-8px] flex items-center" :class="i < steps.length - 1 ? 'right-[-13px]' : ''">
                    <img :src="s.dot" width="18" height="18" alt="" class="shrink-0" />
                    <span v-if="i < steps.length - 1" class="flex-1 h-px" :style="{ background: i < reached ? '#2465de' : '#e5e6ea' }" />
                  </span>
                  <p class="text-[12px] font-medium leading-[1.5]" :class="s.done ? 'text-[#03102f]' : 'text-[#9295a5]'">{{ s.label }}</p>
                  <p class="text-[12px] leading-[1.5] truncate" :class="s.done ? 'text-[#61667c]' : 'text-[#9295a5]'">{{ s.date }}</p>
                </li>
              </ol>
            </div>
          </div>
        </div>

        <!-- Content: amount + timeline (left) · details + attached invoice (right) -->
        <div class="flex flex-col lg:flex-row items-stretch w-full border-t border-[#e5e6ea]">

          <!-- Left (16017:12174) -->
          <div class="flex flex-col gap-[12px] flex-1 min-w-0 p-[24px] border-b lg:border-b-0 lg:border-r border-[#e5e6ea]">
            <BillAmountSummary v-bind="summary" />

            <span class="separator" aria-hidden="true" />

            <!-- Timeline (collapsed by default, as in the design) -->
            <div class="flex flex-col gap-[12px] w-full">
              <div class="flex items-center justify-between">
                <p class="text-[16px] font-medium text-black leading-[1.4]">Timeline</p>
                <div class="flex items-start gap-[8px]">
                  <button type="button" class="sec-btn h-[28px] px-[8px] gap-[6px]">
                    <img :src="editIcon" width="16" height="16" alt="" />
                    <span class="text-[12px] font-medium text-[#61667c] leading-[1.5]" style="text-shadow: 0px 1px 1px rgba(0,0,0,0.08);">Add Note</span>
                  </button>
                  <button type="button" class="sec-btn size-[28px]" :aria-label="timelineOpen ? 'Hide timeline' : 'Show timeline'" :aria-expanded="timelineOpen" @click="timelineOpen = !timelineOpen">
                    <img :src="chevronDownBtn" width="16" height="16" alt="" class="transition-transform duration-200" :class="timelineOpen ? 'rotate-180' : ''" />
                  </button>
                </div>
              </div>
              <Transition name="expand">
                <ol v-if="timelineOpen" class="flex flex-col w-full rounded-[8px] border border-[#e5e6ea] bg-white p-[12px]">
                  <li v-for="(t, i) in timeline" :key="i" class="relative flex gap-[8px] items-start py-[8px]">
                    <span v-if="i < timeline.length - 1" class="absolute left-[8.5px] top-[24px] bottom-[-8px] w-px bg-[#e5e6ea]" />
                    <span class="relative flex items-center justify-center size-[18px] shrink-0 mt-[1px]">
                      <span class="block rounded-full" :class="i === 0 ? 'size-[10px] bg-[#2465de]' : 'size-[8px] bg-[#cbcdd4]'" :style="i === 0 ? 'box-shadow: 0 0 0 3px #dbe7fe;' : ''" />
                    </span>
                    <span class="flex flex-1 min-w-0 items-start justify-between gap-[12px]">
                      <span class="text-[12px] leading-[1.5]" :class="i === 0 ? 'text-[#03102f]' : 'text-[#61667c]'">{{ t.text }}</span>
                      <span class="text-[12px] leading-[1.5] whitespace-nowrap shrink-0" :class="i === 0 ? 'text-[#03102f]' : 'text-[#61667c]'">{{ t.date }}</span>
                    </span>
                  </li>
                </ol>
              </Transition>
            </div>
          </div>

          <!-- Right (16017:12233) -->
          <div class="flex flex-col gap-[12px] flex-1 min-w-0 p-[24px]">
            <BillDetailsList :beneficiary-rows="beneficiaryRows" :invoice-rows="invoiceRows" />

            <span class="separator" aria-hidden="true" />

            <!-- Attached invoice -->
            <div class="flex flex-col gap-[12px] w-full">
              <div class="flex items-center justify-between">
                <p class="text-[16px] font-medium text-black leading-[1.4]">Attached invoice</p>
                <button type="button" class="flex items-center gap-[6px] h-[28px] min-w-[36px] px-[8px] rounded-[8px] hover:bg-[#f2f6ff] transition-colors duration-150" @click="invoiceOpen = true">
                  <img :src="transactionIcon" width="16" height="16" alt="" />
                  <span class="text-[12px] font-medium text-[#2465de] leading-[1.5]">Compare</span>
                </button>
              </div>
              <div class="flex items-center gap-[8px] p-[8px] rounded-[8px] border border-[#e5e6ea] bg-white">
                <!-- PDF file thumbnail (Figma Image File / PDF) -->
                <span class="relative h-[35px] w-[35.834px] shrink-0" aria-hidden="true">
                  <span class="absolute inset-y-0 left-0 right-[21.86%] rounded-[4.6px] border-[0.767px] border-[#e5e6ea] bg-white" style="box-shadow: 0px 0.767px 1.533px 0px rgba(0,0,0,0.05), 0px 3.067px 9.2px 0px rgba(38,42,50,0.08);">
                    <span class="absolute rounded-[9.39px] bg-[#e4e9f1]" style="inset: 14.29% 42.86% 80% 10.71%;" />
                    <span class="absolute rounded-[9.39px] bg-[#e4e9f1]" style="inset: 28.57% 21.43% 65.71% 10.71%;" />
                    <span class="absolute rounded-[9.39px] bg-[#e4e9f1]" style="inset: 42.86% 32.14% 51.43% 10.71%;" />
                    <span class="absolute rounded-[9.39px] bg-[#585a5d]" style="inset: 57.14% 60.71% 37.14% 10.71%;" />
                  </span>
                  <span class="absolute flex items-center justify-center rounded-[4px] border-[0.767px] border-[#bc1818] px-[4px] pt-[3.067px] pb-[3px]" style="inset: 50.07% -1.12% 12.6% 39.72%; background: linear-gradient(to bottom, #fc4848, #ea2f2f); filter: drop-shadow(0px 4px 4px rgba(82,14,14,0.2));">
                    <span class="text-[7px] font-semibold text-white leading-none tracking-[-0.14px]" style="text-shadow: 0px 0.767px 0.767px rgba(0,0,0,0.2);">PDF</span>
                  </span>
                </span>
                <span class="flex flex-1 min-w-0 flex-col">
                  <span class="text-[12px] text-[#03102f] leading-[1.5] truncate">{{ attachmentName }}</span>
                  <span class="text-[10px] font-medium text-[#61667c] uppercase tracking-[0.3px] leading-[18px]">20KB</span>
                </span>
                <button type="button" class="sec-btn h-[28px] px-[8px] gap-[6px]">
                  <img :src="downloadIcon" width="16" height="16" alt="" />
                  <span class="text-[12px] font-medium text-[#61667c] leading-[1.5]" style="text-shadow: 0px 1px 1px rgba(0,0,0,0.08);">Download</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Compare with original invoice (Figma BillPay 15118:555060) -->
    <CompareInvoiceModal
      :open="invoiceOpen"
      :summary="summary"
      :beneficiary-rows="beneficiaryRows"
      :invoice-rows="invoiceRows"
      :invoice-name="attachmentName"
      @close="invoiceOpen = false"
    />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { bills, getBill, parseAmount } from '../../composables/useBills.js'
import BillAmountSummary from '../content/BillAmountSummary.vue'
import BillDetailsList from '../content/BillDetailsList.vue'
import CompareInvoiceModal from '../modals/CompareInvoiceModal.vue'
import chevronLeftIcon from '../../assets/icons/bill-detail/chevron-left.svg'
import buildingIcon from '../../assets/icons/bill-detail/building.svg'
import calendarIcon from '../../assets/icons/bill-detail/calendar-today.svg'
import telegramIcon from '../../assets/icons/bill-detail/telegram-white.svg'
import chevronDownWhite from '../../assets/icons/bill-detail/chevron-down-white.svg'
import dotDone from '../../assets/icons/bill-detail/dot-done.svg'
import dotComplete from '../../assets/icons/bill-detail/dot-complete.svg'
import dotUpcoming from '../../assets/icons/bill-detail/dot-upcoming.svg'
import editIcon from '../../assets/icons/bill-detail/edit-2.svg'
import chevronDownBtn from '../../assets/icons/bill-detail/chevron-down-btn.svg'
import transactionIcon from '../../assets/icons/bill-detail/transaction.svg'
import downloadIcon from '../../assets/icons/bill-detail/download.svg'

const route = useRoute()
const bill = computed(() => getBill(route.query.id) || bills[0])

const money = (n) => n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
function formatDate(d) {
  const m = String(d).match(/^(\d{4})-(\d{2})-(\d{2})$/)
  if (!m) return d
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  return `${months[Number(m[2]) - 1]} ${Number(m[3])}, ${m[1]}`
}

/* ── Status chip (same tokens + labels as the bills list) ── */
const CHIPS = {
  Pending: ['#f7edfd', '#7d1ab7', 'Need approval'],
  Overdue: ['#f7edfd', '#7d1ab7', 'Need approval'],
  'Need approval': ['#f7edfd', '#7d1ab7', 'Need approval'],
  Scheduled: ['#fff9ec', '#bd8400'],
  Failed: ['#f9e9e9', '#c20a1c'],
  Rejected: ['#f9e9e9', '#c20a1c'],
  Cancel: ['#f9e9e9', '#c20a1c'],
  Draft: ['#f2f2f4', '#484d61'],
  Processing: ['#e5eeff', '#2465de'],
  Completed: ['#e6f9f0', '#238b5b'],
}
const chip = computed(() => {
  const [bg, text, label] = CHIPS[bill.value.status] || CHIPS.Draft
  return { bg, text, label: label || bill.value.status }
})
const awaitingApproval = computed(() => ['Pending', 'Overdue', 'Need approval'].includes(bill.value.status))
const headerAction = computed(() => {
  if (['Completed', 'Processing'].includes(bill.value.status)) return 'confirmation'
  if (awaitingApproval.value) return 'approve'
  return null
})
const confirmMenuOpen = ref(false)
const confirmOptions = [
  { label: 'Full version', sub: '(Perfect for record keeping)' },
  { label: 'Simplified version', sub: '(Share with recipients)' },
]

/* ── Status card + 4-step progress ── */
const paidOn = computed(() => bill.value.paidOn || '27 Sep 2026')
const status = computed(() => {
  const r = bill.value.recipient
  const s = bill.value.status
  if (s === 'Completed') return { title: 'Payment complete', text: `This payment was sent to ${r} on ${paidOn.value}.` }
  if (s === 'Processing') return { title: 'Payment in progress', text: `We're sending this payment to ${r}. It usually arrives in 2-5 business days.` }
  if (s === 'Scheduled') return { title: 'Payment scheduled', text: `This payment will be sent to ${r} on ${formatDate(bill.value.due)}.` }
  if (awaitingApproval.value) return { title: 'Waiting for approval', text: 'This bill needs to be approved before it can be paid.' }
  if (s === 'Draft') return { title: 'Draft', text: 'Finish the bill details and submit it for review.' }
  if (s === 'Failed') return { title: 'Payment failed', text: `The payment to ${r} failed. The funds were returned to your HitPay balance.` }
  if (s === 'Rejected') return { title: 'Bill rejected', text: 'This bill was rejected and won’t be paid.' }
  if (s === 'Cancel') return { title: 'Bill cancelled', text: 'This bill was cancelled and won’t be paid.' }
  return { title: s, text: '' }
})
// How many steps are done: Bill created · Review & confirm · Payment · Completed
const reached = computed(() => {
  const s = bill.value.status
  if (s === 'Completed') return 4
  if (s === 'Processing' || s === 'Failed') return 3
  if (s === 'Scheduled' || s === 'Rejected' || s === 'Cancel') return 2
  return 1
})
const STEP_DATES = ['1 Mar 2026 at 07:01', '2 Mar 2026 at 07:01', '4 Mar 2026 at 07:01', '5 Mar 2026 at 13:12']
const steps = computed(() =>
  [
    `Bill created by ${bill.value.createdBy || 'Steph Tan'}`,
    'Review & confirm',
    'Payment',
    'Completed',
  ].map((label, i) => {
    const done = i < reached.value
    const isFinal = done && i === 3
    return {
      label,
      done,
      date: done ? (bill.value.stepDates?.[i] || STEP_DATES[i]) : 'Pending',
      dot: isFinal ? dotComplete : done ? dotDone : dotUpcoming,
    }
  })
)

/* ── Amounts ── */
const FX_RATE = 1.34
const amountToPay = computed(() => parseAmount(bill.value.amount))
// Bills paid locally in SGD (e.g. from the Upload bills flow) have no FX leg
const hasFx = computed(() => bill.value.recipientCurrency !== 'SGD')
const recipientGetsText = computed(() =>
  hasFx.value ? `USD ${money(amountToPay.value / FX_RATE)}` : `SGD ${money(amountToPay.value)}`
)
const fees = computed(() => bill.value.fees || [
  { label: 'PayNow fee', amount: 0 },
  { label: 'Payout fee', amount: 1.5 },
])
const feesTotal = computed(() => fees.value.reduce((s, f) => s + f.amount, 0))
const youWillPay = computed(() => amountToPay.value + feesTotal.value)
// Props for the shared amount card (page + Compare modal)
const summary = computed(() => ({
  recipientGetsText: recipientGetsText.value,
  amountToPay: amountToPay.value,
  fxRate: hasFx.value ? FX_RATE : null,
  fees: fees.value,
}))

/* ── Details ── */
const beneficiaryRows = computed(() => [
  { label: 'Recipient', value: bill.value.recipient },
  { label: 'Account number', value: '621788432' },
  { label: 'Bank', value: 'HSBC UK BANK PLC' },
])
const invoiceRows = computed(() => [
  { label: 'Invoice number', value: bill.value.invoice },
  { label: 'Invoice date', value: bill.value.invoiceDate || '08/08/2025' },
  { label: 'Due date', value: formatDate(bill.value.due) },
  { label: 'Category', value: bill.value.category || 'Fashion' },
  { label: 'Description', value: bill.value.description || 'For cleaning shoes payment' },
])
const attachmentName = computed(() => `${bill.value.invoice}.pdf`)

/* ── Timeline (collapsed by default) ── */
const timelineOpen = ref(false)
const timeline = computed(() => {
  const r = bill.value.recipient
  const latest = {
    Completed: `Payment sent to ${r} from HitPay Balance`,
    Processing: `Payment is being processed to ${r}`,
    Scheduled: `Payment scheduled for ${formatDate(bill.value.due)}`,
    Failed: `Payment to ${r} failed — funds returned to your HitPay balance`,
    Rejected: 'Bill rejected by Olivia Winston',
    Cancel: 'Bill cancelled by Olivia Winston',
    Draft: 'Bill saved as draft',
  }[bill.value.status] || 'Waiting for approval from Olivia Winston'
  // Same timestamps as the progress steps above (newest first)
  const d = (i) => bill.value.stepDates?.[i] || STEP_DATES[i]
  return [
    { text: latest, date: d(3) },
    { text: 'Bill reviewed and confirmed', date: d(1) },
    { text: `Bill created by ${bill.value.createdBy || 'Steph Tan'}`, date: d(0) },
  ]
})

/* ── Compare with original invoice ── */
const invoiceOpen = ref(false)
</script>

<style scoped>
.mono { font-family: 'Reddit Mono', ui-monospace, monospace; }
.chip {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 24px;
  min-width: 32px;
  padding: 2px 8px;
  border-radius: 24px;
  font-size: 12px;
  font-weight: 500;
  line-height: 1.5;
  white-space: nowrap;
}
.separator { display: block; width: 100%; height: 16px; background: linear-gradient(#e5e6ea, #e5e6ea) center / 100% 1px no-repeat; }

.btn-blue { background: linear-gradient(to bottom, #4179e2, #1f5bcc); transition: filter 150ms ease; }
.btn-blue:hover { filter: brightness(1.08); }
.sec-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  border: 1px solid #f2f2f4;
  background: linear-gradient(to bottom, #ffffff, #f2f2f2);
  box-shadow: 0px 1.5px 0px 0px rgba(0, 0, 0, 0.1);
  transition: filter 150ms ease;
}
.sec-btn:hover { filter: brightness(0.96); }
.sec-btn:active { transform: translateY(1px); }

/* Dropdown pop — fast in with a small rise, faster fade out (see /motion) */
.menu-pop-enter-active { transition: opacity 140ms ease-out, transform 140ms ease-out; }
.menu-pop-leave-active { transition: opacity 100ms ease-in; }
.menu-pop-enter-from { opacity: 0; transform: translateY(-4px); }
.menu-pop-leave-to { opacity: 0; }

/* Timeline expand */
.expand-enter-active { transition: opacity 200ms ease-out, transform 200ms ease-out; }
.expand-leave-active { transition: opacity 130ms ease-in; }
.expand-enter-from { opacity: 0; transform: translateY(-4px); }
.expand-leave-to { opacity: 0; }


@media (prefers-reduced-motion: reduce) {
  .menu-pop-enter-active, .menu-pop-leave-active,
  .expand-enter-active, .expand-leave-active,
  .menu-pop-enter-from, .expand-enter-from { transform: none; }
}
</style>
