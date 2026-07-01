<template>
  <div class="bg-white flex flex-col h-full w-full overflow-hidden">

    <!-- Header -->
    <div class="border-b border-[#e5e6ea] w-full shrink-0">
      <!-- Title row -->
      <div class="flex items-start justify-between gap-[24px] px-[24px] pt-[16px] pb-[12px]">
        <div class="flex flex-col gap-[8px] items-start min-w-px">
          <button type="button" class="flex items-center gap-[4px] text-[13px] font-medium text-[#61667c] hover:text-[#03102f] transition-colors duration-150" @click="$router.push('/bills')">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M10 4L6 8l4 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" /></svg>
            Back
          </button>
          <div class="flex items-center gap-[8px]">
            <h1 class="text-[20px] font-medium text-[#03102f] leading-[1.3]">{{ bill.invoice }}</h1>
            <span class="inline-flex items-center px-[10px] py-[3px] rounded-full text-[12px] font-medium" :style="{ background: statusStyle(bill.status).bg, color: statusStyle(bill.status).text }">{{ bill.status }}</span>
          </div>
        </div>
        <div class="flex flex-col items-end gap-[2px] shrink-0">
          <span class="text-[11px] font-medium uppercase tracking-[0.3px] text-[#8093b8]">Amount to pay</span>
          <span class="text-[20px] text-[#03102f] leading-[1.3]" style="font-family: 'Reddit Mono', ui-monospace, monospace; font-weight: 500;">{{ youPaidText }}</span>
        </div>
      </div>

      <!-- Funding status box -->
      <div class="px-[24px] pb-[16px]">
        <div class="flex rounded-[8px] border border-[#e5e6ea] overflow-hidden">
          <div class="flex-1 flex flex-col gap-[6px] p-[16px]">
            <span class="text-[13px] text-[#61667c] leading-[1.5]">Funding status</span>
            <span class="inline-flex self-start items-center px-[10px] py-[3px] rounded-full text-[12px] font-medium border bg-white" :style="{ borderColor: fundingStyle(bill.funding).border, color: fundingStyle(bill.funding).text }">{{ bill.funding }}</span>
          </div>
          <div class="w-px bg-[#e5e6ea] shrink-0" />
          <div class="flex-1 flex flex-col gap-[6px] p-[16px]">
            <span class="text-[13px] text-[#61667c] leading-[1.5]">Funded via</span>
            <span class="text-[14px] text-[#03102f] leading-[1.5]">HitPay Balance</span>
          </div>
          <div class="w-px bg-[#e5e6ea] shrink-0" />
          <div class="flex-1 flex flex-col gap-[6px] p-[16px]">
            <span class="text-[13px] text-[#61667c] leading-[1.5]">Funding collected on</span>
            <span class="text-[14px] text-[#03102f] leading-[1.5]" style="font-family: 'Reddit Mono', ui-monospace, monospace;">{{ fundingCollectedOn }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Body: invoice pane · data column · collapsing spacer -->
    <div class="flex-1 overflow-y-auto w-full">
      <div class="flex min-h-full w-full">

        <!-- Left pane: Show invoice pill → full invoice + zoom -->
        <div class="flex-1 relative flex justify-center p-[24px] min-w-0 overflow-hidden" :class="showInvoice ? 'items-start' : 'items-center'">
          <Transition name="inv" mode="out-in">
            <button
              v-if="!showInvoice"
              key="btn"
              type="button"
              class="flex items-center gap-[8px] pl-[12px] pr-[4px] py-[4px] rounded-[40px] border border-[#e5e6ea] bg-white transition-colors duration-150 hover:bg-[#fafbfc]"
              @click="showInvoice = true"
            >
              <span class="text-[12px] font-normal text-[#03102f] leading-[1.5]">Show invoice</span>
              <span
                class="flex items-center justify-center size-[28px] rounded-[40px] border border-[#f2f2f4]"
                style="background: linear-gradient(to bottom, #ffffff, #f2f2f2); box-shadow: 0px 1.5px 0px 0px #e5e5e5;"
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M6 5L3 8l3 3M10 5l3 3-3 3" stroke="#61667c" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" /></svg>
              </span>
            </button>

            <div v-else key="doc" class="w-full flex flex-col items-center gap-[16px]">
              <div :style="{ transform: `scale(${zoom / 100})`, transformOrigin: 'top center', transition: 'transform 150ms ease' }">
                <img :src="invoice" alt="Invoice INV-0128HYY" class="block w-[520px] max-w-none rounded-[8px] border border-[#e5e6ea]" style="box-shadow: 0px 3px 22px rgba(38,42,50,0.09);" />
              </div>
              <!-- Zoom control -->
              <div class="sticky bottom-[8px] flex items-center gap-[8px] h-[36px] px-[4px] rounded-[8px] border border-[#e5e6ea] bg-white" style="box-shadow: 0px 1px 3px rgba(0,0,0,0.04), 0px 1.5px 1.5px rgba(0,0,0,0.09);">
                <button type="button" class="flex items-center justify-center size-[28px] rounded-[8px] border border-[#f2f2f4]" style="background: linear-gradient(to bottom, #ffffff, #f2f2f2); box-shadow: 0px 1.5px 0px 0px #e5e5e5;" @click="zoom = Math.max(50, zoom - 25)">
                  <img :src="zoomOut" alt="zoom out" class="size-[16px]" />
                </button>
                <span class="text-[14px] text-[#03102f] leading-[1.5] text-center min-w-[40px]">{{ zoom }}%</span>
                <button type="button" class="flex items-center justify-center size-[28px] rounded-[8px] border border-[#f2f2f4]" style="background: linear-gradient(to bottom, #ffffff, #f2f2f2); box-shadow: 0px 1.5px 0px 0px #e5e5e5;" @click="zoom = Math.min(200, zoom + 25)">
                  <img :src="zoomIn" alt="zoom in" class="size-[16px]" />
                </button>
              </div>
            </div>
          </Transition>
        </div>

        <!-- Data column -->
        <div class="relative w-[566px] shrink-0 border-x border-[#e5e6ea] flex flex-col bg-white">
          <!-- Collapse toggle on the divider (only while invoice is shown) -->
          <button
            v-if="showInvoice"
            type="button"
            class="absolute -left-[14px] top-1/2 -translate-y-1/2 z-10 flex items-center justify-center size-[28px] rounded-full bg-white border border-[#e5e6ea] transition-colors duration-150 hover:bg-[#f0f1f5]"
            style="box-shadow: 0px 1px 3px rgba(3,16,47,0.12);"
            aria-label="Hide invoice"
            @click="showInvoice = false"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M4.5 5l3 3-3 3M11.5 5l-3 3 3 3" stroke="#61667c" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" /></svg>
          </button>
          <div class="flex-1 flex flex-col gap-[16px] px-[48px] pt-[24px] pb-[24px]">

            <!-- Amount info card -->
            <div class="rounded-[8px] border border-[#e5e6ea] bg-[#f2f2f4] p-[4px] flex flex-col gap-[4px] w-full">
              <div class="bg-white rounded-[4px] flex flex-col gap-[8px] pt-[8px] pb-[4px] px-[4px]">
                <div v-for="r in amountRows" :key="r.label" class="flex items-start justify-between px-[12px]">
                  <span class="text-[12px] font-medium text-[#61667c] leading-[1.5]">{{ r.label }}</span>
                  <span
                    class="text-[14px] text-[#03102f] leading-[1.4]"
                    :style="r.mono ? { fontFamily: `'Reddit Mono', ui-monospace, monospace`, fontWeight: 600 } : { fontWeight: 500 }"
                  >{{ r.value }}</span>
                </div>
              </div>
              <div class="bg-[#03102f] rounded-[4px] flex items-center justify-between px-[12px] py-[8px]">
                <span class="text-[12px] font-medium text-[#cbcdd4] leading-[1.5]">{{ payLabel }}</span>
                <span class="flex items-baseline gap-[8px]">
                  <span class="text-[12px] font-medium text-[#cbcdd4] leading-[1.5]">SGD</span>
                  <span class="text-[24px] text-white leading-[1.35]" style="font-family: 'Reddit Mono', ui-monospace, monospace; font-weight: 500;">{{ youPaidNum }}</span>
                </span>
              </div>
              <!-- Scheduled bills show when payment will run -->
              <div v-if="isScheduled" class="bg-[#fff3da] rounded-[8px] flex items-center justify-between px-[12px] py-[8px]">
                <span class="flex items-center gap-[4px]">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><rect x="2.5" y="3.5" width="11" height="10" rx="2" stroke="#03102f" stroke-width="1.2" /><path d="M2.5 6.5h11M5.5 2v2.5M10.5 2v2.5" stroke="#03102f" stroke-width="1.2" stroke-linecap="round" /></svg>
                  <span class="text-[12px] text-[#03102f] leading-[1.5]">Schedule pay on</span>
                </span>
                <span class="text-[12px] font-medium text-[#03102f] leading-[1.5]">{{ scheduleDate }}</span>
              </div>
            </div>

            <div class="h-px w-full bg-[#e5e6ea]" />

            <!-- Beneficiary -->
            <div class="flex flex-col gap-[12px] w-full">
              <div v-for="r in beneficiaryRows" :key="r.label" class="flex gap-[16px] items-start w-full">
                <span class="w-[160px] shrink-0 text-[14px] text-[#61667c] leading-[1.5]">{{ r.label }}</span>
                <span class="flex-1 min-w-px text-[14px] text-[#03102f] leading-[1.5]">{{ r.value }}</span>
              </div>
            </div>

            <!-- Invoice details -->
            <div class="flex flex-col gap-[12px] w-full">
              <p class="text-[14px] font-medium text-[#03102f] leading-[1.5]">Invoice details</p>
              <div v-for="r in invoiceRows" :key="r.label" class="flex gap-[16px] items-start w-full">
                <span class="w-[160px] shrink-0 text-[14px] text-[#61667c] leading-[1.5]">{{ r.label }}</span>
                <span class="flex-1 min-w-px text-[14px] text-[#03102f] leading-[1.5]">{{ r.value }}</span>
              </div>
            </div>

            <div class="h-px w-full bg-[#e5e6ea]" />

            <!-- Timeline -->
            <div class="flex flex-col gap-[12px] w-full">
              <div class="flex items-center justify-between">
                <p class="text-[16px] font-medium text-[#03102f] leading-[1.4]">Timeline</p>
                <button
                  type="button"
                  class="flex items-center gap-[6px] h-[28px] px-[10px] rounded-[8px] border border-[#f2f2f4] transition-[filter] duration-150 hover:brightness-95"
                  style="background: linear-gradient(to bottom, #ffffff, #f2f2f2); box-shadow: 0px 1.5px 0px 0px #e5e5e5;"
                >
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M9.5 3.5l3 3-6 6H3.5v-3l6-6z" stroke="#61667c" stroke-width="1.3" stroke-linejoin="round" /></svg>
                  <span class="text-[13px] font-medium text-[#61667c] leading-[1.5]">Add Note</span>
                </button>
              </div>

              <div class="relative">
                <!-- connector rail -->
                <div class="absolute left-[11px] top-[22px] bottom-[22px] w-px bg-[#e5e6ea]" />
                <div v-for="(t, i) in timeline" :key="i" class="relative flex gap-[12px] items-start py-[12px]">
                  <span class="relative shrink-0 flex items-center justify-center" style="width: 23px; margin-top: 4px;">
                    <span
                      class="block rounded-full"
                      :style="t.active
                        ? { width: '10px', height: '10px', background: '#2465de', boxShadow: '0 0 0 3px #dbe7fe' }
                        : { width: '9px', height: '9px', background: '#cbcdd4' }"
                    />
                  </span>
                  <div class="flex flex-col gap-[4px] min-w-px pt-[1px]">
                    <span class="text-[14px] text-[#03102f] leading-[1.5]">{{ t.date }}</span>
                    <span class="text-[12px] text-[#61667c] leading-[1.5]">{{ t.text }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Footer -->
          <div class="shrink-0 border-t border-[#e5e6ea] flex items-center justify-end px-[40px] py-[16px]">
            <button
              type="button"
              class="flex items-center justify-center h-[36px] min-w-[100px] px-[16px] rounded-[8px] border border-[#f2f2f4] transition-[filter] duration-150 hover:brightness-95"
              style="background: linear-gradient(to bottom, #ffffff, #f2f2f2); box-shadow: 0px 1.5px 0px 0px #e5e5e5;"
            >
              <span class="text-[14px] font-medium text-[#61667c] leading-[1.5]" style="text-shadow: 0px 1px 1px rgba(0,0,0,0.08);">Send again</span>
            </button>
          </div>
        </div>

        <!-- Right spacer — collapses when the invoice is shown, so the data column
             is centered when hidden and slides right when the invoice reveals -->
        <div
          class="shrink-0 min-w-0"
          :style="{ flexGrow: showInvoice ? 0 : 1, flexBasis: '0px', transition: 'flex-grow 450ms cubic-bezier(0.32, 0.72, 0, 1)' }"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { bills, getBill, fundingStyle, statusStyle, parseAmount, formatSGD } from '../../composables/useBills.js'
import invoice from '../../assets/images/billreview/invoice.png'
import zoomIn from '../../assets/images/billreview/zoom-in.svg'
import zoomOut from '../../assets/images/billreview/zoom-out.svg'

const route = useRoute()
const showInvoice = ref(false)
const zoom = ref(100)

// Bill selected from the list (falls back to the first bill if opened directly)
const bill = computed(() => getBill(route.query.id) || bills[0])

const FEE = 3.5
const amountToPay = computed(() => parseAmount(bill.value.amount))
const youPaid = computed(() => amountToPay.value + FEE)
const youPaidText = computed(() => formatSGD(youPaid.value))
const youPaidNum = computed(() => youPaid.value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }))
const fundingCollectedOn = computed(() => (bill.value.funding === 'Collected' ? '08/08/2025 10:00 AM' : '—'))

// Scheduled bills haven't been paid yet — show "You will pay" + the scheduled date
const isScheduled = computed(() => bill.value.status === 'Scheduled')
const payLabel = computed(() => (bill.value.status === 'Completed' ? 'You paid' : 'You will pay'))
const scheduleDate = computed(() => bill.value.due)

// Amount breakdown — driven by the row's amount
const amountRows = computed(() => [
  { label: 'Amount to pay', value: formatSGD(amountToPay.value), mono: true },
  { label: 'Fee', value: formatSGD(FEE), mono: true },
  { label: 'Transfer Type', value: 'LOCAL', mono: false },
])
// Recipient comes from the row; the rest isn't in the table, so kept as sample detail
const beneficiaryRows = computed(() => [
  { label: 'Recipient', value: bill.value.recipient },
  { label: 'Account number', value: '621788432' },
  { label: 'Bank', value: 'HSBC UK BANK PLC' },
])
const invoiceRows = computed(() => [
  { label: 'Invoice number', value: bill.value.invoice },
  { label: 'Invoice date', value: '08/08/2025' },
  { label: 'Due date', value: bill.value.due },
  { label: 'Category', value: 'Fashion' },
  { label: 'Description', value: 'For cleaning shoes payment' },
])
// Timeline isn't in the table — sample events (recipient name pulled from the row)
const timeline = computed(() => [
  { date: 'Aug, 07 2025, 7:48 PM', text: 'Payment completed', active: true },
  { date: 'Aug, 07 2025, 4:28 PM', text: `Payment processed to ${bill.value.recipient}` },
  { date: 'Jul, 23 2025, 4:28 PM', text: 'Funds collected, initiated by Olivia Winston' },
  { date: 'Jul, 23 2025, 4:28 PM', text: 'Bill approved by Olivia Winston' },
  { date: 'Apr, 10 2025, 4:28 PM', text: 'Bill submitted for approval by Gabriella' },
])
</script>

<style scoped>
/* Invoice reveal — fade + rise on the decelerate curve (see /motion), fast leave */
.inv-enter-active { transition: opacity 300ms cubic-bezier(0.32, 0.72, 0, 1), transform 300ms cubic-bezier(0.32, 0.72, 0, 1); }
.inv-leave-active { transition: opacity 120ms ease-in; }
.inv-enter-from { opacity: 0; transform: translateY(10px); }
.inv-leave-to { opacity: 0; }

@media (prefers-reduced-motion: reduce) {
  .inv-enter-active, .inv-leave-active { transition: none; }
  .inv-enter-from { transform: none; }
}
</style>
