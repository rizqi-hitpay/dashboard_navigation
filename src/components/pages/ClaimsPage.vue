<template>
  <div class="bg-white flex flex-col h-full w-full overflow-y-auto overflow-x-hidden">
    <div class="flex flex-1 flex-col items-start w-full pt-[4px]">

      <!-- Page title + actions -->
      <div class="flex h-[60px] items-center justify-between gap-[32px] px-[24px] w-full shrink-0">
        <p class="font-medium text-[18px] text-[#03102f] leading-[1.35] whitespace-nowrap">Claims</p>
        <button
          type="button"
          class="flex items-center justify-center gap-[8px] h-[36px] px-[12px] rounded-[8px] border border-[#2465de] transition-[filter] duration-150 hover:brightness-105 active:translate-y-[1px]"
          style="background: linear-gradient(to bottom, #4179e2, #1f5bcc); box-shadow: 0px 1.5px 0px 0px #1d5fd9;"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 3.5v9M3.5 8h9" stroke="#fff" stroke-width="1.5" stroke-linecap="round" /></svg>
          <span class="text-[14px] font-medium text-white leading-[1.5] whitespace-nowrap" style="text-shadow: 0px 1px 1px rgba(0,0,0,0.12);">Submit Claims</span>
        </button>
      </div>

      <!-- Tab group: All claims / My claims -->
      <div class="w-full px-[24px] pb-[8px] shrink-0">
        <div class="flex items-start border-b border-[#e5e6ea]">
          <button
            v-for="t in viewTabs"
            :key="t"
            type="button"
            class="flex items-center justify-center min-w-[88px] px-[12px] pb-[8px] -mb-px text-[12px] leading-[1.5] whitespace-nowrap border-b-2 transition-colors duration-150"
            :class="activeView === t ? 'border-[#2465de] font-medium text-[#03102f]' : 'border-transparent font-normal text-[#61667c] hover:text-[#03102f]'"
            @click="activeView = t"
          >{{ t }}</button>
        </div>
      </div>

      <!-- Content -->
      <div class="flex flex-col gap-[24px] w-full px-[24px] pt-[12px] pb-[12px]">

        <!-- Table card -->
        <div class="w-full rounded-[8px] border border-[#e5e6ea] overflow-hidden bg-white">

          <!-- Toolbar: status segmented controls + search / filter -->
          <div class="flex items-center justify-between gap-[8px] h-[44px] px-[12px] py-[8px] bg-white border-b-[0.5px] border-[#cbcdd4]">
            <div class="flex items-start gap-[4px]">
              <button
                v-for="t in statusTabs"
                :key="t"
                type="button"
                class="flex items-center justify-center min-w-[48px] px-[8px] py-[4px] rounded-[8px] text-[12px] leading-[1.5] whitespace-nowrap transition-colors duration-150"
                :class="activeStatus === t ? 'bg-[#e5e6ea] font-medium text-[#03102f]' : 'font-normal text-[#61667c] hover:bg-[#f6f7f9]'"
                @click="activeStatus = t"
              >{{ t }}</button>
            </div>
            <div class="flex items-center gap-[8px] shrink-0">
              <button
                type="button"
                class="flex items-center justify-center size-[28px] rounded-[8px] border border-[#f2f2f4] transition-[filter] duration-150 hover:brightness-95 active:translate-y-[1px]"
                style="background: linear-gradient(to bottom, #ffffff, #f2f2f2); box-shadow: 0px 1.5px 0px 0px #e5e5e5;"
                aria-label="Search"
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="7" cy="7" r="4.5" stroke="#61667c" stroke-width="1.4" /><path d="M10.5 10.5L14 14" stroke="#61667c" stroke-width="1.4" stroke-linecap="round" /></svg>
              </button>
              <button
                type="button"
                class="flex items-center justify-center size-[28px] rounded-[8px] border border-[#f2f2f4] transition-[filter] duration-150 hover:brightness-95 active:translate-y-[1px]"
                style="background: linear-gradient(to bottom, #ffffff, #f2f2f2); box-shadow: 0px 1.5px 0px 0px #e5e5e5;"
                aria-label="Filter"
              >
                <img :src="filterIcon" alt="" width="16" height="16" />
              </button>
            </div>
          </div>

          <!-- Table -->
          <div class="w-full overflow-x-auto">
            <table class="w-full border-collapse min-w-[1000px]" style="table-layout: fixed;">
              <colgroup>
                <col style="width: 149px;" />
                <col />
                <col />
                <col />
                <col style="width: 149px;" />
                <col style="width: 192px;" />
              </colgroup>
              <thead>
                <tr>
                  <th
                    v-for="(col, ci) in columns"
                    :key="col.key"
                    class="bg-[#fcfcfd] h-[34px] border-b-[0.5px] border-[#cbcdd4] px-[12px] py-[8px] text-left align-middle"
                    :class="ci < columns.length - 1 ? 'border-r border-r-[#e5e6ea]' : ''"
                  >
                    <div class="flex items-center gap-[8px]">
                      <span class="flex-1 min-w-px text-[10px] font-medium uppercase tracking-[0.3px] leading-[18px] text-[#03102f] whitespace-nowrap overflow-hidden text-ellipsis">{{ col.label }}</span>
                      <svg class="shrink-0" width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M7 2.9v8.2M3.8 7.9L7 11.1l3.2-3.2" stroke="#61667c" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round" /></svg>
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="c in filteredClaims"
                  :key="c.id"
                  class="cursor-pointer transition-colors duration-150 hover:bg-[#fcfcfd] [&:last-child>td]:border-b-0"
                >
                  <!-- Date -->
                  <td class="h-[44px] px-[12px] py-[8px] align-middle border-b border-r border-[#e5e6ea]">
                    <span class="text-[13px] text-[#03102f] leading-[1.4] whitespace-nowrap" style="font-family: 'Reddit Mono', ui-monospace, monospace;">{{ c.date }}</span>
                  </td>
                  <!-- Merchant -->
                  <td class="h-[44px] px-[12px] py-[8px] align-middle border-b border-r border-[#e5e6ea]">
                    <p class="text-[13px] font-normal text-[#03102f] leading-[1.5] whitespace-nowrap overflow-hidden text-ellipsis">{{ c.merchant }}</p>
                  </td>
                  <!-- Staff -->
                  <td class="h-[44px] px-[12px] py-[8px] align-middle border-b border-r border-[#e5e6ea]">
                    <p class="text-[13px] font-normal text-[#03102f] leading-[1.5] whitespace-nowrap overflow-hidden text-ellipsis">{{ c.staff }}</p>
                  </td>
                  <!-- Category -->
                  <td class="h-[44px] px-[12px] py-[8px] align-middle border-b border-r border-[#e5e6ea]">
                    <span class="inline-flex items-center justify-center min-h-[24px] min-w-[32px] px-[8px] py-[2px] rounded-[24px] border border-[#cbcdd4] bg-white text-[12px] font-medium text-[#61667c] leading-[1.5] whitespace-nowrap">{{ c.category }}</span>
                  </td>
                  <!-- Amount (exchange icon marks foreign-currency claims) -->
                  <td class="h-[44px] px-[12px] py-[8px] align-middle border-b border-r border-[#e5e6ea]">
                    <div class="flex items-center gap-[4px]">
                      <img v-if="c.fx" :src="exchangeIcon" alt="Foreign currency" width="16" height="16" class="shrink-0" />
                      <span class="flex-1 min-w-px text-right text-[13px] font-semibold text-[#03102f] leading-[1.4] whitespace-nowrap overflow-hidden text-ellipsis" style="font-family: 'Reddit Mono', ui-monospace, monospace;">{{ c.amount }}</span>
                    </div>
                  </td>
                  <!-- Status -->
                  <td class="h-[44px] px-[12px] py-[8px] align-middle border-b border-[#e5e6ea]">
                    <span
                      class="inline-flex items-center justify-center min-h-[24px] min-w-[32px] px-[8px] py-[2px] rounded-[24px] text-[12px] font-medium leading-[1.5] whitespace-nowrap"
                      :style="{ background: statusStyle(c.status).bg, color: statusStyle(c.status).text }"
                    >{{ c.status === 'Need approval' ? 'Need Approval' : c.status }}</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Pagination -->
        <div class="relative flex items-center justify-center w-full shrink-0">
          <div class="flex items-start gap-[20px]">
            <button type="button" class="flex items-center justify-center gap-[2px] h-[36px] px-[2px] py-[8px] rounded-[4px] text-[13px] font-normal text-[#61667c] leading-[1.5] hover:bg-[#f0f1f5] transition-colors duration-150">
              <svg class="shrink-0" width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M8.8 3.5L5.3 7l3.5 3.5" stroke="#61667c" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round" /></svg>
              Prev
            </button>
            <button type="button" class="flex items-center justify-center gap-[2px] h-[36px] px-[2px] py-[8px] rounded-[4px] text-[13px] font-normal text-[#61667c] leading-[1.5] hover:bg-[#f0f1f5] transition-colors duration-150">
              Next
              <svg class="shrink-0" width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M5.2 3.5L8.7 7l-3.5 3.5" stroke="#61667c" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round" /></svg>
            </button>
          </div>
          <div class="absolute right-0 flex items-center gap-[8px] h-[36px] w-[167px] px-[8px] rounded-[8px] border border-[#e5e6ea] bg-white cursor-pointer">
            <div class="flex flex-1 items-center gap-[4px] min-w-px whitespace-nowrap">
              <span class="text-[14px] font-normal text-[#9295a5] tracking-[0.15px] leading-[20px] overflow-hidden text-ellipsis">Item per page:</span>
              <span class="flex-1 min-w-px text-[14px] font-medium text-[#03102f] tracking-[0.1px] leading-[20px] overflow-hidden text-ellipsis">10</span>
            </div>
            <svg class="shrink-0" width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M4.5 7l4.5 4.5L13.5 7" stroke="#61667c" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" /></svg>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { statusStyle } from '../../composables/useBills.js'
import filterIcon from '../../assets/icons/icon-filter.svg'
import exchangeIcon from '../../assets/icons/icon-exchange.svg'

// Admin/Owner view: every staff member's claims vs. only the current user's
const viewTabs = ['All claims', 'My claims']
const activeView = ref('All claims')
const currentStaff = 'Maya Thompson'

// Toolbar segmented controls
const statusTabs = ['All', 'Draft', 'Need approval', 'Completed', 'Rejected']
const activeStatus = ref('All')

const columns = [
  { key: 'date', label: 'Date' },
  { key: 'merchant', label: 'Merchant' },
  { key: 'staff', label: 'Staff' },
  { key: 'category', label: 'Category' },
  { key: 'amount', label: 'Amount' },
  { key: 'status', label: 'Status' },
]

const claims = [
  { id: 1, date: 'Jan 14, 2026', merchant: 'Redwood Artisans', staff: 'Maya Thompson', category: 'Meals & Entertainment', amount: 'SGD 2,345.67', status: 'Draft' },
  { id: 2, date: 'Apr 27, 2026', merchant: 'Maple Grove Florist', staff: 'Ethan Carter', category: 'Meals & Entertainment', amount: 'SGD 3,456.78', status: 'Rejected' },
  { id: 3, date: 'Oct 05, 2026', merchant: 'Ocean Breeze Jewelry', staff: 'Ava Mitchell', category: 'Meals & Entertainment', amount: 'SGD 4,567.89', status: 'Need approval' },
  { id: 4, date: 'Dec 19, 2026', merchant: 'Copper Ridge Cafe', staff: 'Liam Anderson', category: 'Transport', amount: 'SGD 5,678.90', status: 'Need approval' },
  { id: 5, date: 'Jun 11, 2026', merchant: 'Sunset Valley Market', staff: 'Zoe Reynolds', category: 'Self care', amount: 'SGD 3,210.98', fx: true, status: 'Completed' },
  { id: 6, date: 'Feb 08, 2026', merchant: 'Golden Pine Electronics', staff: 'Noah Bennett', category: 'Marketing', amount: 'SGD 980.34', status: 'Draft' },
  { id: 7, date: 'May 22, 2026', merchant: 'Crystal Lake Toys', staff: 'Mia Sullivan', category: 'Marketing', amount: 'SGD 4,320.12', fx: true, status: 'Completed' },
  { id: 8, date: 'Jul 21, 2026', merchant: 'Crimson Maple Books', staff: 'Lucas Hayes', category: 'Meals & Entertainment', amount: 'SGD 3,890.45', status: 'Rejected' },
  { id: 9, date: 'Aug 09, 2026', merchant: 'Ironwood Sports', staff: 'Emma Collins', category: 'Transport', amount: 'SGD 2,157.89', fx: true, status: 'Rejected' },
  { id: 10, date: 'Sep 30, 2026', merchant: 'Emerald Coast Apparel', staff: 'Oliver Brooks', category: 'Self care', amount: 'SGD 1,245.67', status: 'Draft' },
  { id: 11, date: 'Nov 03, 2026', merchant: 'Silver Oak Bakery', staff: 'Sophia Morgan', category: 'Marketing', amount: 'SGD 1,234.56', fx: true, status: 'Need approval' },
  { id: 12, date: 'Mar 15, 2026', merchant: 'Blue Harbor Outfitters', staff: 'Jack Foster', category: 'Transport', amount: 'SGD 1,789.01', status: 'Completed' },
]

const filteredClaims = computed(() =>
  claims.filter((c) =>
    (activeView.value === 'All claims' || c.staff === currentStaff) &&
    (activeStatus.value === 'All' || c.status === activeStatus.value)
  )
)
</script>
