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
            <span class="text-[13px] text-[#61667c] leading-[1.5]">Funding collected on</span>
            <span class="text-[14px] text-[#03102f] leading-[1.5]" style="font-family: 'Reddit Mono', ui-monospace, monospace;">{{ fundingCollectedOn }}</span>
          </div>
          <div class="w-px bg-[#e5e6ea] shrink-0" />
          <div class="flex-1" />
        </div>
      </div>
    </div>

    <!-- Body: left invoice toggle · centered data column · right gutter -->
    <div class="flex-1 overflow-y-auto w-full">
      <div class="flex min-h-full w-full">

        <!-- Left gutter with Show invoice toggle / invoice preview -->
        <div class="flex-1 relative flex items-center justify-center p-[24px] min-w-0">
          <button
            v-if="!showInvoice"
            type="button"
            class="flex items-center gap-[8px] h-[36px] pl-[12px] pr-[4px] rounded-[8px] border border-[#e5e6ea] bg-white transition-[filter] duration-150 hover:brightness-[0.98]"
            style="box-shadow: 0px 1px 3px rgba(0,0,0,0.04), 0px 1.5px 1.5px rgba(0,0,0,0.09);"
            @click="showInvoice = true"
          >
            <span class="text-[13px] font-medium text-[#03102f]">Show invoice</span>
            <span class="flex items-center justify-center size-[28px] rounded-[6px] bg-[#f5f6f9]">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M6 5L3 8l3 3M10 5l3 3-3 3" stroke="#61667c" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" /></svg>
            </span>
          </button>
          <div v-else class="relative w-full max-w-[420px]">
            <img :src="invoice" alt="Invoice INV-0128HYY" class="w-full rounded-[8px] border border-[#e5e6ea]" style="box-shadow: 0px 3px 22px rgba(38,42,50,0.09);" />
            <button
              type="button"
              class="absolute top-[8px] right-[8px] flex items-center justify-center size-[28px] rounded-[6px] bg-white border border-[#e5e6ea] transition-colors duration-150 hover:bg-[#f0f1f5]"
              aria-label="Hide invoice"
              @click="showInvoice = false"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M4 4l8 8M12 4l-8 8" stroke="#61667c" stroke-width="1.5" stroke-linecap="round" /></svg>
            </button>
          </div>
        </div>

        <!-- Center data column -->
        <div class="w-[566px] shrink-0 border-x border-[#e5e6ea] flex flex-col bg-white">
          <div class="flex-1 flex flex-col gap-[16px] px-[48px] pt-[24px] pb-[24px]">

            <!-- Amount info card -->
            <div class="rounded-[8px] border border-[#e5e6ea] overflow-hidden w-full" style="box-shadow: 0px 1px 3px rgba(0,0,0,0.04), 0px 1.5px 1.5px rgba(0,0,0,0.06);">
              <div class="flex flex-col gap-[8px] px-[16px] py-[12px]">
                <div v-for="r in amountRows" :key="r.label" class="flex items-center justify-between">
                  <span class="text-[13px] text-[#61667c] leading-[1.5]">{{ r.label }}</span>
                  <span
                    class="text-[14px] font-medium text-[#03102f] leading-[1.4]"
                    :style="r.mono ? { fontFamily: `'Reddit Mono', ui-monospace, monospace` } : {}"
                  >{{ r.value }}</span>
                </div>
              </div>
              <div class="bg-[#03102f] flex items-center justify-between px-[16px] py-[12px]">
                <span class="text-[13px] font-medium text-[#cbcdd4] leading-[1.5]">You paid</span>
                <span class="flex items-baseline gap-[8px]">
                  <span class="text-[12px] font-medium text-[#cbcdd4] leading-[1.5]">SGD</span>
                  <span class="text-[24px] text-white leading-[1.35]" style="font-family: 'Reddit Mono', ui-monospace, monospace; font-weight: 500;">{{ youPaidNum }}</span>
                </span>
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

        <!-- Right gutter -->
        <div class="flex-1 min-w-0" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { bills, getBill, fundingStyle, statusStyle, parseAmount, formatSGD } from '../../composables/useBills.js'
import invoice from '../../assets/images/billreview/invoice.png'

const route = useRoute()
const showInvoice = ref(false)

// Bill selected from the list (falls back to the first bill if opened directly)
const bill = computed(() => getBill(route.query.id) || bills[0])

const FEE = 3.5
const amountToPay = computed(() => parseAmount(bill.value.amount))
const youPaid = computed(() => amountToPay.value + FEE)
const youPaidText = computed(() => formatSGD(youPaid.value))
const youPaidNum = computed(() => youPaid.value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }))
const fundingCollectedOn = computed(() => (bill.value.funding === 'Collected' ? '08/08/2025 10:00 AM' : '—'))

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
