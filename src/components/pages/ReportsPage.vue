<template>
  <!-- Reports (Figma Analytics-with-AI: 114:13628) -->
  <div class="relative bg-white flex flex-col h-full w-full overflow-hidden">
    <div class="flex flex-1 flex-col items-start w-full overflow-y-auto overflow-x-hidden">

      <!-- Analytics promo banner — Snackbar/Big (Figma: 114:14042) -->
      <div class="banner-collapse w-full" :class="{ 'is-closed': bannerDismissed }">
        <div class="overflow-hidden">
          <div class="px-[24px] pt-[12px]">
            <div
              class="relative flex items-start gap-[16px] w-full pl-[16px] pr-[32px] py-[16px] rounded-[8px] border border-[#b3cdfe] bg-[#e5eeff]"
              style="filter: drop-shadow(0px 3px 11px rgba(38,42,50,0.03));"
            >
              <div class="flex items-center p-[12px] rounded-[8px] bg-white shrink-0" style="box-shadow: 0px 3px 22px 0px rgba(38,42,50,0.09);">
                <img :src="bannerChartIcon" width="24" height="24" alt="" class="block" />
              </div>
              <div class="flex flex-1 min-w-0 items-center gap-[8px]">
                <div class="flex flex-1 min-w-0 flex-col gap-[4px]">
                  <p class="text-[14px] font-medium text-[#03102f] leading-[1.5]">Ask question, get a chart</p>
                  <p class="text-[12px] text-[#03102f] leading-[1.5]">
                    Skip the filters. Ask your own words, like “<button
                      type="button"
                      class="inline font-medium text-[#2465de] text-left hover:underline focus-visible:underline focus-visible:outline-none"
                      @click="askAgent(examplePrompt)"
                    >{{ examplePrompt }}</button>”, and keep answer on Analytics page
                  </p>
                </div>
                <div class="flex items-start gap-[8px] pr-[12px] shrink-0">
                  <VerificationButton variant="secondary" size="sm" @click="router.push('/analytics')">Go to Analytics page</VerificationButton>
                  <VerificationButton variant="primary" size="sm" :icon="aiChatWhiteIcon" @click="openAgentStarter({ prompts, placeholder: 'What are my best selling products last month?' })">Ask questions</VerificationButton>
                </div>
              </div>
              <button
                type="button"
                class="absolute right-[11px] top-[11px] flex rounded-full opacity-25 hover:opacity-50 focus-visible:opacity-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#2465de] transition-opacity duration-150"
                aria-label="Dismiss"
                @click="bannerDismissed = true"
              >
                <img :src="closeCircleIcon" width="20" height="20" alt="" class="block" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Title + filters (Figma: 114:14044) -->
      <div class="flex flex-col w-full pb-[12px] shrink-0">
        <div class="px-[24px] pt-[12px]">
          <p class="font-medium text-[18px] text-[#03102f] leading-[1.35] whitespace-nowrap">Reports</p>
        </div>
        <div class="flex flex-wrap items-center gap-[8px] px-[24px] pt-[12px]">
          <p class="pr-[4px] text-[12px] font-medium text-[#03102f] leading-[1.5] whitespace-nowrap">Filter for:</p>

          <!-- Date range -->
          <div class="report-input w-[268px] px-[8px]">
            <img :src="calendarIcon" width="16" height="16" alt="" class="block shrink-0" />
            <span class="flex-1 min-w-0 text-center truncate" :class="dateFrom ? 'text-[#03102f]' : 'text-[#9295a5]'">{{ dateFrom || 'Start date' }}</span>
            <span class="text-[#61667c] shrink-0">To</span>
            <span class="flex-1 min-w-0 text-center truncate" :class="dateTo ? 'text-[#03102f]' : 'text-[#9295a5]'">{{ dateTo || 'End date' }}</span>
            <button
              v-if="dateFrom || dateTo"
              type="button"
              class="flex shrink-0 rounded-full hover:opacity-70 transition-opacity duration-150"
              aria-label="Clear dates"
              @click="dateFrom = ''; dateTo = ''"
            >
              <img :src="clearIcon" width="16" height="16" alt="" class="block" />
            </button>
            <span v-else class="w-[16px] shrink-0" />
          </div>

          <!-- Select filters, using the shared dropdown -->
          <template v-for="f in filters" :key="f.key">
            <button
              :ref="(el) => (filterEls[f.key] = el)"
              type="button"
              class="report-input px-[8px] hover:border-[#cbcdd4] focus-visible:border-[#2465de] focus-visible:outline-none"
              :aria-expanded="openFilter === f.key"
              aria-haspopup="menu"
              @click="toggleFilter(f.key)"
            >
              <span class="whitespace-nowrap"><span class="text-[#9295a5]">{{ f.label }}:</span> <span class="text-[#03102f]">{{ filterValues[f.key] }}</span></span>
              <img
                :src="chevronDownIcon" width="18" height="18" alt=""
                class="block shrink-0 transition-transform duration-200"
                :class="openFilter === f.key ? 'rotate-180' : ''"
              />
            </button>
            <PlusMenu
              :model-value="openFilter === f.key"
              :items="f.options.map((label) => ({ label }))"
              :anchor="filterEls[f.key]"
              :width="menuWidth"
              :offset-x="0"
              close-on-select
              @update:model-value="(v) => { if (!v) openFilter = null }"
              @select="(item) => (filterValues[f.key] = item.label)"
            />
          </template>
        </div>
      </div>

      <!-- Sub-menu + report sections (Figma: 114:14055) -->
      <div class="flex items-start gap-[24px] xl:gap-[40px] w-full px-[24px] pt-[12px] pb-[24px]">
        <nav
          class="flex flex-col gap-[8px] shrink-0 transition-[width] duration-[280ms] ease-[cubic-bezier(0.4,0,0.2,1)]"
          :class="agentPanelOpen ? 'w-[160px]' : 'w-[180px] xl:w-[280px]'"
          aria-label="Report types"
        >
          <button
            v-for="item in subMenu"
            :key="item"
            type="button"
            class="flex items-center px-[8px] py-[4px] rounded-[8px] text-left text-[14px] leading-[1.5] transition-colors duration-150"
            :class="activeSub === item
              ? 'bg-[rgba(0,39,113,0.04)] font-medium text-[#002771]'
              : 'text-[#61667c] hover:bg-[rgba(0,39,113,0.04)] hover:text-[#03102f]'"
            :aria-current="activeSub === item ? 'page' : undefined"
            @click="activeSub = item"
          >{{ item }}</button>
        </nav>

        <div v-if="activeSub === 'Payments'" class="flex flex-1 min-w-0 flex-col gap-[32px]">
          <!-- Transactions -->
          <section class="flex items-center gap-[32px]">
            <div class="flex flex-1 min-w-0 flex-col gap-[4px]">
              <p class="text-[16px] font-medium text-[#03102f] leading-[1.4]">Transactions</p>
              <p class="text-[12px] text-[#61667c] leading-[1.5]">Shows a complete list of sales within a timeframe.</p>
            </div>
            <VerificationButton variant="secondary" :icon="eyeIcon" @click="router.push('/transactions')">View transactions</VerificationButton>
          </section>

          <!-- Payments Summary -->
          <section class="flex flex-col gap-[24px]">
            <div class="flex items-center gap-[32px]">
              <div class="flex flex-1 min-w-0 flex-col gap-[4px]">
                <p class="text-[16px] font-medium text-[#03102f] leading-[1.4]">Payments Summary</p>
                <p class="text-[12px] text-[#61667c] leading-[1.5]">General overview of sales within a timeframe, including gross sales, refunds, net sales, fees and net collected</p>
              </div>
              <VerificationButton variant="primary" :icon="downloadWhiteIcon" @click="exportSummary">Export</VerificationButton>
            </div>
            <div class="w-full rounded-[8px] border border-[#e5e6ea] overflow-hidden">
              <div
                v-for="(row, i) in summaryRows"
                :key="row.label"
                class="flex items-center min-h-[58px] px-[32px]"
                :class="row.total
                  ? 'bg-[#03102f]'
                  : ['border-b-[0.5px] border-[#cbcdd4]', i % 2 ? 'bg-white' : 'bg-[#fcfcfd]']"
              >
                <p class="flex-1 min-w-0 px-[12px] text-[14px] leading-[1.5] truncate" :class="row.total ? 'font-medium text-white' : 'text-[#03102f]'">{{ row.label }}</p>
                <p class="flex-1 min-w-0 px-[12px] text-[14px] leading-[1.5] text-right truncate" :class="row.total ? 'font-medium text-white' : 'text-[#03102f]'">{{ row.value }}</p>
              </div>
            </div>
          </section>

          <!-- Payment Methods -->
          <section class="flex flex-col gap-[24px]">
            <div class="flex items-center gap-[32px]">
              <div class="flex flex-1 min-w-0 flex-col gap-[4px]">
                <p class="text-[16px] font-medium text-[#03102f] leading-[1.4]">Payment Methods</p>
                <p class="text-[12px] text-[#61667c] leading-[1.5]">Summarizes number of payments, gross sales, net collected and fees across HitPay payment methods</p>
              </div>
              <VerificationButton variant="primary" :icon="downloadWhiteIcon" @click="exportMethods">Export</VerificationButton>
            </div>
            <div class="w-full rounded-[8px] border border-[#e5e6ea] overflow-x-auto">
              <table class="w-full min-w-[640px] table-fixed border-collapse">
                <colgroup>
                  <col />
                  <col class="w-[146px]" />
                  <col /><col /><col /><col />
                </colgroup>
                <thead>
                  <tr class="bg-[#fcfcfd]">
                    <th
                      v-for="h in methodHeaders"
                      :key="h"
                      class="px-[12px] py-[8px] border-b-[0.5px] border-[#cbcdd4] text-left text-[10px] font-medium text-[#61667c] leading-[18px] tracking-[0.3px] uppercase truncate"
                    >{{ h }}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="m in methodRows" :key="m.method" class="bg-white hover:bg-[#fcfcfd] transition-colors duration-150">
                    <td v-for="(cell, ci) in methodCells(m)" :key="ci" class="h-[58px] px-[12px] py-[8px] border-b-[0.5px] border-[#cbcdd4] text-[14px] text-[#03102f] leading-[1.5] truncate">{{ cell }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>
        </div>

        <div v-else class="flex flex-1 min-w-0 flex-col items-center justify-center gap-[4px] py-[96px] text-center">
          <p class="text-[16px] font-medium text-[#03102f] leading-[1.4]">{{ activeSub }}</p>
          <p class="text-[12px] text-[#61667c] leading-[1.5]">This report is coming soon.</p>
        </div>
      </div>

    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
// Dismissal survives navigating away and back within the session
const bannerDismissed = ref(false)
</script>

<script setup>
import { reactive, computed } from 'vue'
import { useRouter } from 'vue-router'
import { askAgent, openAgentStarter, agentPanelOpen } from '../../composables/useAgentPanel.js'
import VerificationButton from '../verification/VerificationButton.vue'
import PlusMenu from '../navigation/PlusMenu.vue'
import bannerChartIcon from '../../assets/icons/report-banner-chart.svg'
import aiChatWhiteIcon from '../../assets/icons/icon-ai-chat-white-16.svg'
import closeCircleIcon from '../../assets/icons/icon-x-circle-dark-20.svg'
import calendarIcon from '../../assets/icons/icon-calendar.svg'
import clearIcon from '../../assets/icons/icon-x-circle.svg'
import chevronDownIcon from '../../assets/icons/icon-chevron-down-18.svg'
import eyeIcon from '../../assets/icons/icon-eye-open-18.svg'
import downloadWhiteIcon from '../../assets/icons/icon-download-white-18.svg'

const router = useRouter()

const examplePrompt = 'What are my best selling products last month?'
const prompts = [
  examplePrompt,
  'Create a line chart of my monthly sales this year',
  'Create a bar chart of sales by payment method this quarter',
]

// ── Filters ──
const dateFrom = ref('20/11/2024')
const dateTo = ref('20/11/2024')

const filters = [
  { key: 'currency', label: 'Currency', options: ['SGD', 'USD', 'MYR', 'IDR', 'PHP'] },
  { key: 'location', label: 'Location', options: ['All locations', 'Orchard Road', 'Tampines Mall', 'Online store'] },
  { key: 'user', label: 'User', options: ['All users', 'Rizqi', 'Amanda Tan', 'Jason Lim'] },
  { key: 'channel', label: 'Channel', options: ['All channels', 'Point of Sale', 'Online Store', 'Payment Links', 'Invoices'] },
]
const filterValues = reactive(Object.fromEntries(filters.map((f) => [f.key, f.options[0]])))
const filterEls = {}
const openFilter = ref(null)
const menuWidth = ref(160)

function toggleFilter(key) {
  if (openFilter.value === key) { openFilter.value = null; return }
  // Menu matches the trigger's width so it lines up under it
  menuWidth.value = Math.max(filterEls[key]?.offsetWidth || 0, 140)
  openFilter.value = key
}

// ── Sub-menu ──
const subMenu = ['Payments', 'Product sales', 'Discounts', 'Category sales', 'Fee invoice']
const activeSub = ref('Payments')

// ── Data ──
const money = (n) => {
  const s = `${filterValues.currency} ${Math.abs(n).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
  return n < 0 ? `- ${s}` : s
}

const summaryRows = computed(() => [
  { label: 'Number of Sales', value: '42' },
  { label: 'Gross Sales', value: money(18880.03) },
  { label: 'Refunds', value: money(-100) },
  { label: 'Net Sales', value: money(18780.03) },
  { label: 'HitPay Fees', value: money(-446.36) },
  { label: 'Nett Collected', value: money(18333.67), total: true },
])

const methodHeaders = ['Payment method', '# Payments', 'Gross Sales', 'Refunds', 'Hitpay fees', 'Net collected']
const methodRows = [
  { method: 'Cash', count: 5, gross: 598.56, refunds: 0, fees: 0, net: 598.56 },
  { method: 'Card Present', count: 10, gross: 5.22, refunds: 5.22, fees: 5.22, net: 5.22 },
  { method: 'PayNow Online', count: 1, gross: 11.5, refunds: 0, fees: 0.2, net: 11.3 },
  { method: 'Card', count: 1, gross: 208.45, refunds: 5, fees: 6.72, net: 196.73 },
]
const methodCells = (m) => [m.method, m.count, money(m.gross), money(m.refunds), money(m.fees), money(m.net)]

// ── Export (CSV) ──
function downloadCsv(name, rows) {
  const csv = rows.map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(',')).join('\n')
  const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }))
  const a = document.createElement('a')
  a.href = url
  a.download = name
  a.click()
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}
const exportSummary = () => downloadCsv('payments-summary.csv', [['Metric', 'Value'], ...summaryRows.value.map((r) => [r.label, r.value])])
const exportMethods = () => downloadCsv('payment-methods.csv', [methodHeaders, ...methodRows.map(methodCells)])
</script>

<style scoped>
/* Input / select shell (Figma Input 1:658) */
.report-input {
  display: flex;
  align-items: center;
  gap: 8px;
  height: 36px;
  border: 1px solid #e5e6ea;
  border-radius: 8px;
  background: #fff;
  box-shadow: 0px 1px 3px 0px rgba(0,0,0,0.04), 0px 1.5px 1.5px 0px rgba(0,0,0,0.09);
  font-size: 14px;
  line-height: 1.5;
  transition: border-color 150ms ease;
}

/* Banner dismiss: collapses its height, fades out */
.banner-collapse {
  display: grid;
  grid-template-rows: 1fr;
  opacity: 1;
  transition: grid-template-rows 240ms cubic-bezier(0.4, 0, 0.2, 1), opacity 160ms ease-out;
}
.banner-collapse.is-closed {
  grid-template-rows: 0fr;
  opacity: 0;
  pointer-events: none;
}
@media (prefers-reduced-motion: reduce) {
  .banner-collapse { transition: none; }
}
</style>
