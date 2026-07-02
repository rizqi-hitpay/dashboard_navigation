<template>
  <div>
    <!-- Header -->
    <div class="flex items-center justify-between mb-1" style="height: 40px;">
      <span class="text-[16px] font-medium text-[#03102f]">Recent Payouts</span>
      <button class="flex items-center gap-1 text-[12px] font-medium text-[#2364dd] hover:opacity-75 transition-opacity">
        View all
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path d="M3 7h8M8 4l3 3-3 3" stroke="#2364dd" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>
    </div>

    <!-- Table -->
    <div class="relative overflow-hidden" style="border: 1px solid #e5e6ea; border-radius: 8px;">
      <Transition name="tbl-overlay">
        <TableLoadingOverlay v-if="!loaded" />
      </Transition>
      <table class="w-full border-collapse">

        <!-- Header row -->
        <thead>
          <tr style="background: #fcfcfd; border-bottom: 1px solid #cbcdd4; height: 34px;">
            <th
              v-for="(col, ci) in columns"
              :key="col.key"
              :class="col.align === 'right' ? 'text-right' : 'text-left'"
              :style="{
                padding: '8px 12px',
                borderRight: ci < columns.length - 1 ? '1px solid #e5e6ea' : 'none',
              }"
            >
              <div
                class="flex items-center gap-1.5"
                :class="col.align === 'right' ? 'justify-end' : ''"
              >
                <span class="text-[10px] font-medium text-[#03102f] uppercase tracking-wider whitespace-nowrap">
                  {{ col.label }}
                </span>
                <!-- Sort arrow -->
                <svg width="8" height="10" viewBox="0 0 8 10" fill="none" class="shrink-0">
                  <path d="M4 2v6M1.5 5.5L4 8l2.5-2.5" stroke="#60657c" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </div>
            </th>
          </tr>
        </thead>

        <!-- Data rows -->
        <tbody>
          <tr
            v-for="(row, ri) in rows"
            :key="ri"
            :style="{
              background: ri % 2 === 0 ? '#ffffff' : '#fcfcfd',
              borderBottom: ri < rows.length - 1 ? '1px solid #cbcdd4' : 'none',
              height: '44px',
            }"
          >
            <!-- Initiate Date -->
            <td :style="{ padding: '8px 12px', borderRight: '1px solid #e5e6ea' }">
              <span
                class="text-[13px] text-[#03102f] whitespace-nowrap cell-fade"
                :class="{ 'cell-fade--in': loaded }"
                :style="{ transitionDelay: ri * 50 + 'ms' }"
                style="font-family: 'Reddit Mono', monospace; font-weight: 400;"
              >{{ row.date }}</span>
            </td>

            <!-- Bank Account -->
            <td :style="{ padding: '8px 12px', borderRight: '1px solid #e5e6ea' }">
              <div class="cell-fade" :class="{ 'cell-fade--in': loaded }" :style="{ transitionDelay: ri * 50 + 'ms' }">
                <div class="text-[13px] text-[#03102f]">{{ row.bank }}</div>
                <div v-if="row.bankSub" class="text-[12px] text-[#61667c] mt-0.5">{{ row.bankSub }}</div>
              </div>
            </td>

            <!-- Amount (right-aligned) -->
            <td :style="{ padding: '8px 12px', borderRight: '1px solid #e5e6ea', textAlign: 'right' }">
              <span
                class="text-[13px] text-[#03102f] whitespace-nowrap"
                style="font-family: 'Reddit Mono', monospace; font-weight: 600;"
              ><TickerNumber :value="row.amount" :loaded="loaded" /></span>
            </td>

            <!-- Status chip -->
            <td style="padding: 8px 12px;">
              <span
                class="inline-flex items-center text-[12px] font-medium whitespace-nowrap cell-fade"
                :class="{ 'cell-fade--in': loaded }"
                :style="[chipStyle(row.status), { transitionDelay: ri * 50 + 'ms' }]"
              >{{ row.status }}</span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import TickerNumber from './TickerNumber.vue'
import TableLoadingOverlay from './TableLoadingOverlay.vue'

const columns = [
  { key: 'date',   label: 'Initiate Date',  align: 'left'  },
  { key: 'bank',   label: 'Bank Account',   align: 'left'  },
  { key: 'amount', label: 'Amount',         align: 'right' },
  { key: 'status', label: 'Status',         align: 'left'  },
]

defineProps({
  rows: {
    type: Array,
    default: () => [],
    // Each row: { date, bank, bankSub?, amount, status }
  },
  loaded: { type: Boolean, default: false },
})

function chipStyle(status) {
  const base = { borderRadius: '24px', padding: '4px 8px' }
  if (status === 'Failed')
    return { ...base, background: '#f9e9e9', color: '#dc3545' }
  if (status === 'In-transit')
    return { ...base, background: '#fef4de', color: '#eaa00c' }
  // Success
  return { ...base, background: '#e6f9f1', color: '#2bc37d' }
}
</script>

<style scoped>
/* Loading state (Figma 3973:3773): text cells hidden until the data is ready,
   then fade in with a light per-row stagger. Amounts stay visible at SGD 0.00
   and count up via TickerNumber. */
.cell-fade { opacity: 0; }
.cell-fade--in { opacity: 1; transition: opacity 400ms cubic-bezier(0.32, 0.72, 0, 1); }

/* Spinner overlay lifts with a quick fade once the data lands */
.tbl-overlay-leave-active { transition: opacity 250ms ease; }
.tbl-overlay-leave-to { opacity: 0; }

@media (prefers-reduced-motion: reduce) {
  .cell-fade--in { transition: none; }
  .tbl-overlay-leave-active { transition: none; }
}
</style>
