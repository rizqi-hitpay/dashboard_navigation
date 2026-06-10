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
    <div class="overflow-hidden" style="border: 1px solid #e5e6ea; border-radius: 8px;">
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

        <!-- Empty state: 220px white area (5 rows tall), centered message -->
        <tbody v-if="rows.length === 0">
          <tr>
            <td colspan="3" style="padding: 0;">
              <div class="flex items-center justify-center bg-white" style="height: 220px;">
                <span class="text-[12px] text-[#61667c]">No data to display</span>
              </div>
            </td>
          </tr>
        </tbody>

        <!-- Rows -->
        <tbody v-else>
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
                class="text-[13px] text-[#03102f] whitespace-nowrap"
                style="font-family: 'Reddit Mono', monospace; font-weight: 400;"
              >{{ row.date }}</span>
            </td>

            <!-- Customer -->
            <td style="padding: 8px 12px; border-right: 1px solid #e5e6ea;">
              <span class="text-[13px] text-[#03102f] truncate block">{{ row.customer }}</span>
            </td>

            <!-- Amount -->
            <td style="padding: 8px 12px;">
              <span
                class="text-[13px] text-[#03102f] whitespace-nowrap"
                style="font-family: 'Reddit Mono', monospace; font-weight: 600;"
              >{{ row.amount }}</span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
defineProps({
  rows: {
    type: Array,
    default: () => [],
  },
})
</script>
