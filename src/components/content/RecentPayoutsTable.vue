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
    <div class="overflow-hidden" style="border: 1px solid #e5e6ea; border-radius: 8px;">
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
                class="text-[13px] text-[#03102f] whitespace-nowrap"
                style="font-family: 'Reddit Mono', monospace; font-weight: 400;"
              >{{ row.date }}</span>
            </td>

            <!-- Bank Account -->
            <td :style="{ padding: '8px 12px', borderRight: '1px solid #e5e6ea' }">
              <div>
                <div class="text-[13px] text-[#03102f]">{{ row.bank }}</div>
                <div v-if="row.bankSub" class="text-[12px] text-[#61667c] mt-0.5">{{ row.bankSub }}</div>
              </div>
            </td>

            <!-- Amount (right-aligned) -->
            <td :style="{ padding: '8px 12px', borderRight: '1px solid #e5e6ea', textAlign: 'right' }">
              <span
                class="text-[13px] text-[#03102f] whitespace-nowrap"
                style="font-family: 'Reddit Mono', monospace; font-weight: 600;"
              >{{ row.amount }}</span>
            </td>

            <!-- Status chip -->
            <td style="padding: 8px 12px;">
              <span
                class="inline-flex items-center text-[12px] font-medium whitespace-nowrap"
                :style="chipStyle(row.status)"
              >{{ row.status }}</span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
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
