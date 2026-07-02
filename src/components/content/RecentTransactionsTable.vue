<template>
  <div>
    <!-- Section header -->
    <div class="flex items-center justify-between mb-1" style="height: 40px;">
      <span class="text-[16px] font-medium text-[#03102f]">Recent Transactions</span>
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
        <!-- Header -->
        <thead>
          <tr style="background: #fcfcfd; border-bottom: 1px solid #cbcdd4;">
            <th class="text-left" style="padding: 8px 12px; width: 144px; border-right: 1px solid #e5e6ea;">
              <div class="flex items-center gap-1.5">
                <span class="text-[10px] font-medium text-[#03102f] uppercase tracking-wider">Date</span>
                <svg width="8" height="10" viewBox="0 0 8 10" fill="none">
                  <path d="M4 2v6M1.5 5.5L4 8l2.5-2.5" stroke="#60657c" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </div>
            </th>
            <th class="text-left" style="padding: 8px 12px; border-right: 1px solid #e5e6ea;">
              <div class="flex items-center gap-1.5">
                <span class="text-[10px] font-medium text-[#03102f] uppercase tracking-wider">Customer</span>
                <svg width="8" height="10" viewBox="0 0 8 10" fill="none">
                  <path d="M4 2v6M1.5 5.5L4 8l2.5-2.5" stroke="#60657c" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </div>
            </th>
            <th class="text-left" style="padding: 8px 12px; width: 142px;">
              <div class="flex items-center gap-1.5">
                <span class="text-[10px] font-medium text-[#03102f] uppercase tracking-wider">Amount</span>
                <svg width="8" height="10" viewBox="0 0 8 10" fill="none">
                  <path d="M4 2v6M1.5 5.5L4 8l2.5-2.5" stroke="#60657c" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </div>
            </th>
          </tr>
        </thead>

        <!-- Rows -->
        <tbody>
          <tr
            v-for="(row, i) in rows"
            :key="i"
            :style="{
              background: i % 2 === 0 ? '#ffffff' : '#fcfcfd',
              borderBottom: i < rows.length - 1 ? '1px solid #cbcdd4' : 'none',
            }"
            style="height: 44px;"
          >
            <!-- Date -->
            <td style="padding: 8px 12px; border-right: 1px solid #e5e6ea;">
              <span
                class="text-[13px] text-[#03102f] whitespace-nowrap cell-fade"
                :class="{ 'cell-fade--in': loaded }"
                :style="{ transitionDelay: i * 50 + 'ms' }"
                style="font-family: 'Reddit Mono', monospace; font-weight: 400;"
              >{{ row.date }}</span>
            </td>

            <!-- Customer -->
            <td style="padding: 8px 12px; border-right: 1px solid #e5e6ea;">
              <span
                class="text-[13px] text-[#03102f] truncate block cell-fade"
                :class="{ 'cell-fade--in': loaded }"
                :style="{ transitionDelay: i * 50 + 'ms' }"
              >{{ row.customer }}</span>
            </td>

            <!-- Amount -->
            <td style="padding: 8px 12px;">
              <span
                class="text-[13px] text-[#03102f] whitespace-nowrap"
                style="font-family: 'Reddit Mono', monospace; font-weight: 600;"
              ><TickerNumber :value="row.amount" :loaded="loaded" /></span>
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

defineProps({
  rows: {
    type: Array,
    default: () => [],
  },
  loaded: { type: Boolean, default: false },
})
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
