<template>
  <div>
    <!-- Section header (hidden in bare mode, where the parent card owns the title) -->
    <div v-if="!bare" class="flex items-center justify-between mb-1" style="height: 40px;">
      <span class="text-[16px] font-medium text-[#03102f]">Recent Transactions</span>
      <button class="flex items-center gap-1 text-[12px] font-medium text-[#2364dd] hover:opacity-75 transition-opacity">
        View all
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path d="M3 7h8M8 4l3 3-3 3" stroke="#2364dd" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>
    </div>

    <!-- Table -->
    <div class="overflow-hidden" :style="bare ? {} : { border: '1px solid #e5e6ea', borderRadius: '8px' }">
      <table class="w-full border-collapse">
        <!-- Header -->
        <thead>
          <tr style="background: #fcfcfd; border-bottom: 1px solid #cbcdd4;">
            <th
              v-for="(col, ci) in cols"
              :key="col.key"
              class="text-left"
              :class="bare ? 'sticky top-0 z-[1] bg-[#fcfcfd] shadow-[inset_0_-1px_0_#cbcdd4]' : ''"
              :style="{
                padding: '8px 12px',
                width: col.width ? col.width + 'px' : undefined,
                borderRight: ci < cols.length - 1 ? '1px solid #e5e6ea' : 'none',
              }"
            >
              <div class="flex items-center gap-1.5" :class="bare ? 'justify-between' : ''">
                <span class="text-[10px] font-medium text-[#03102f] uppercase tracking-wider whitespace-nowrap">{{ col.label }}</span>
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
            :class="bare ? 'hover:!bg-[#f6f7f9] transition-colors duration-150' : ''"
            :style="{
              background: i % 2 === 0 ? '#ffffff' : '#fcfcfd',
              borderBottom: i < rows.length - 1 ? '1px solid #cbcdd4' : 'none',
            }"
            style="height: 44px;"
          >
            <td
              v-for="(col, ci) in cols"
              :key="col.key"
              :style="{
                padding: '8px 12px',
                borderRight: ci < cols.length - 1 ? '1px solid #e5e6ea' : 'none',
                textAlign: col.align || 'left',
                maxWidth: col.width ? col.width + 'px' : undefined,
              }"
            >
              <span
                class="text-[13px] text-[#03102f] whitespace-nowrap"
                :class="col.mono ? '' : 'truncate block'"
                :style="col.mono ? { fontFamily: `'Reddit Mono', monospace`, fontWeight: col.strong ? 600 : 400 } : {}"
              >{{ row[col.key] }}</span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  rows: {
    type: Array,
    default: () => [],
  },
  // [{ key, label, width?, mono?, strong?, align? }] — defaults to Date · Customer · Amount
  columns: {
    type: Array,
    default: null,
  },
  bare: { type: Boolean, default: false }, // no section header or outer border, sticky column headers
})

const DEFAULT_COLUMNS = [
  { key: 'date', label: 'Date', width: 144, mono: true },
  { key: 'customer', label: 'Customer' },
  { key: 'amount', label: 'Amount', width: 142, mono: true, strong: true },
]

const cols = computed(() => props.columns || DEFAULT_COLUMNS)
</script>
