<template>
  <!-- Finance Overview (Figma 6429:16657) -->
  <div class="h-full overflow-y-auto bg-white">

    <!-- "Top Title" -->
    <div class="flex items-center gap-8 px-6 py-3">
      <div class="flex flex-1 min-w-0 flex-col justify-center gap-2">
        <h1 class="text-[18px] font-medium leading-[1.35] text-[#03102f]">Overview</h1>
        <p class="text-[12px] leading-[1.5] text-[#61667c]">Your cash, what's going out, and what needs your approval.</p>
      </div>
      <!-- Period filter -->
      <button
        type="button"
        class="flex items-center gap-2 h-9 px-2 rounded-lg border border-[#e5e6ea] bg-white shrink-0"
        style="box-shadow: 0px 1px 3px 0px rgba(0,0,0,0.04), 0px 1.5px 1.5px 0px rgba(0,0,0,0.09);"
      >
        <img :src="calendarIcon" alt="" width="16" height="16" class="size-4 shrink-0" />
        <span class="text-[14px] leading-[1.5] text-[#03102f] whitespace-nowrap">This month</span>
      </button>
    </div>

    <!-- "Finance overview" -->
    <div class="flex flex-col gap-6 px-6 pt-2 pb-6">

      <!-- Cash and approvals -->
      <div class="flex gap-6 items-stretch">

        <!-- Cash position -->
        <section class="card flex flex-1 min-w-0 flex-col gap-6 p-4">
          <div class="flex items-center gap-3">
            <h2 class="card-title flex-1 min-w-0">Cash position</h2>
            <button type="button" class="link-btn" @click="go('/cards/balance', 'Balance')">View balances</button>
          </div>

          <div class="flex flex-col gap-4">
            <div class="flex gap-8 items-start">
              <div class="flex flex-1 min-w-0 flex-col gap-1">
                <p class="text-[13px] leading-[1.5] text-[#61667c]">Free to use</p>
                <p class="mono-display text-[#03102f]">SGD 183,200.00</p>
                <p class="text-[12px] leading-[1.5] text-[#61667c]">After S$ 38,110.00 committed in the next 14 days</p>
              </div>
              <div class="flex flex-col gap-1 w-[258px] shrink-0 whitespace-nowrap">
                <p class="text-[13px] leading-[1.5] text-[#61667c]">Incoming settlements</p>
                <p class="mono-display text-[#238b5b]">SGD 22,150.00</p>
                <p class="text-[12px] leading-[1.5] text-[#61667c]">Arriving by Fri, 27 Nov</p>
              </div>
            </div>

            <!-- Cash allocation -->
            <div class="flex h-[10px] rounded-[5px] overflow-hidden">
              <div class="flex-1 min-w-0 bg-[#2465de]" />
              <div class="shrink-0 bg-[#eaa00c]" style="width: 17.2%" />
            </div>

            <div class="flex gap-5">
              <span class="legend"><i class="dot bg-[#2465de]" />Free S$ 183,200.00</span>
              <span class="legend"><i class="dot bg-[#eaa00c]" />Committed S$ 38,110.00</span>
            </div>
          </div>

          <!-- Balance details -->
          <div class="flex gap-3">
            <div v-for="b in balances" :key="b.label" class="flex flex-1 min-w-0 flex-col gap-1 p-3 rounded-lg bg-[#f8f9fc]">
              <p class="text-[12px] leading-[1.5] text-[#61667c]">{{ b.label }}</p>
              <p class="mono-semibold text-[13px] text-[#03102f] whitespace-nowrap">{{ b.value }}</p>
              <p class="text-[12px] leading-[1.5]" :class="b.warn ? 'text-[#bd8400]' : 'text-[#61667c]'">{{ b.note }}</p>
            </div>
          </div>
        </section>

        <!-- Needs your action -->
        <section class="card flex flex-col w-[384px] shrink-0">
          <div class="flex items-center gap-3 p-4">
            <h2 class="card-title flex-1 min-w-0">Needs your action</h2>
            <span class="flex items-center justify-center size-6 rounded-[20px] bg-[#fff3da] text-[10px] font-medium leading-[18px] tracking-[0.3px] text-[#bd8400]">15</span>
          </div>
          <div class="flex flex-col border-t border-[#f2f2f4]">
            <button
              v-for="(a, i) in actions"
              :key="a.title"
              type="button"
              class="action-row flex items-center gap-3 px-4 py-3 text-left"
              :class="i < actions.length - 1 ? 'border-b border-[#f2f2f4]' : ''"
              @click="go(a.url, a.item)"
            >
              <span class="relative shrink-0 size-8 rounded-[40px]" :style="{ background: a.tone }">
                <img :src="a.icon" alt="" width="16" height="16" class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 size-4" />
              </span>
              <span class="flex flex-1 min-w-0 flex-col gap-0.5">
                <span class="text-[13px] leading-[1.5]" :class="a.warn ? 'text-[#bd8400]' : 'text-[#03102f]'">{{ a.title }}</span>
                <span class="text-[12px] leading-[1.5] text-[#61667c]">{{ a.source }} · <span class="font-mono-r">{{ a.amount }}</span></span>
              </span>
              <img :src="chevronRightIcon" alt="" width="14" height="14" class="size-[14px] shrink-0" />
            </button>
          </div>
        </section>
      </div>

      <!-- Spend and upcoming activity -->
      <div class="flex gap-6 items-stretch">

        <!-- Money out -->
        <section class="card flex flex-1 min-w-0 flex-col gap-4 p-4">
          <div class="flex flex-col gap-1">
            <h2 class="card-title">Money out</h2>
            <p class="mono-display text-[#03102f]">S$ 142,380.00</p>
            <p class="text-[12px] leading-[1.5] text-[#61667c]">This month · 8% more than October</p>
          </div>

          <!-- Stacked bar chart -->
          <div ref="chartEl" class="relative h-[186px]">
            <!-- Y axis -->
            <div class="absolute left-0 top-4 bottom-[25px] flex flex-col justify-between">
              <span v-for="y in ['1.5K', '1.0K', '0.5K', '0']" :key="y" class="axis-label w-8 p-1">{{ y }}</span>
            </div>
            <!-- Bars: hovering one dims the rest and shows its breakdown (Figma 6435:17647) -->
            <div
              class="absolute left-0 right-0 top-4 bottom-[26px] flex items-stretch gap-4 pl-[52px] pr-4"
              @mouseleave="hoveredBar = null"
            >
              <div
                v-for="(bar, i) in bars"
                :key="i"
                class="flex flex-1 min-w-0 flex-col justify-end"
                :class="bar.length ? 'cursor-pointer' : ''"
                @mouseenter="showBarDetail(i, $event)"
              >
                <div
                  class="flex flex-col transition-opacity duration-150"
                  :style="{ opacity: hoveredBar === null || hoveredBar === i ? 1 : 0.25 }"
                >
                  <div v-for="(h, s) in bar" :key="s" :style="{ height: h + 'px', background: SEGMENT_COLORS[s] }" />
                </div>
              </div>
            </div>
            <!-- Hover detail -->
            <div
              v-if="hoveredBar !== null"
              class="bar-detail absolute z-10 flex flex-col gap-2 p-3 rounded-lg bg-[#fcfcfd] pointer-events-none"
              :style="{ left: detailLeft + 'px', top: '-48px' }"
            >
              <div class="flex flex-col">
                <span class="axis-label self-start whitespace-nowrap">{{ barDetails[hoveredBar].date }}</span>
                <span class="mono-semibold text-[14px] leading-[1.4] text-[#03102f] whitespace-nowrap">{{ barDetails[hoveredBar].total }}</span>
              </div>
              <div class="flex flex-col gap-1 w-[220px]">
                <div v-for="row in barDetails[hoveredBar].rows" :key="row.label" class="flex items-center justify-between">
                  <div class="flex items-center gap-1 w-[110px]">
                    <img :src="row.dot" alt="" width="8" height="8" class="block shrink-0" />
                    <span class="text-[12px] leading-[1.5] text-[#03102f] whitespace-nowrap">{{ row.label }}</span>
                  </div>
                  <span class="font-mono-r text-[12px] leading-[1.5] text-[#03102f] whitespace-nowrap">{{ row.amount }}</span>
                </div>
              </div>
            </div>
            <!-- Baseline + months -->
            <div class="absolute left-0 right-0 bottom-0">
              <img :src="chartLine" alt="" class="absolute left-14 right-4 top-0 block h-px" style="width: calc(100% - 72px)" />
              <div class="flex items-center gap-4 pl-[52px] pr-4">
                <span v-for="m in months" :key="m" class="axis-label flex-1 min-w-0 p-1">{{ m }}</span>
              </div>
            </div>
          </div>

          <div class="flex gap-[14px] flex-wrap">
            <span v-for="c in spendCategories" :key="c.label" class="legend !text-[#03102f]"><i class="dot" :style="{ background: c.color }" />{{ c.label }}</span>
          </div>
        </section>

        <!-- Coming up -->
        <section class="card flex flex-col w-[384px] shrink-0 h-[354px]">
          <div class="flex items-center gap-3 p-4 border-b border-[#f2f2f4]">
            <h2 class="card-title flex-1 min-w-0">Coming up</h2>
            <span class="text-[12px] leading-[1.5] text-[#61667c] whitespace-nowrap">Next 14 days</span>
          </div>
          <div class="flex flex-1 min-h-0 flex-col gap-0.5 py-3 overflow-hidden text-[12px] leading-[1.5]">
            <div v-for="u in upcoming" :key="u.date + u.label" class="flex items-start gap-2 px-4 py-1">
              <span class="w-12 shrink-0 text-[#61667c]">{{ u.date }}</span>
              <span class="flex-1 min-w-0 text-[#03102f]">{{ u.label }}</span>
              <span class="font-mono-r whitespace-nowrap" :class="u.amount.startsWith('+') ? 'text-[#238b5b]' : 'text-[#03102f]'">{{ u.amount }}</span>
            </div>
          </div>
          <div class="flex items-center gap-2 p-4 border-t border-[#e5e6ea]">
            <span class="flex-1 min-w-0 text-[12px] leading-[1.5] text-[#61667c]">Projected balance on 9 Dec</span>
            <span class="mono-semibold text-[14px] text-[#03102f] whitespace-nowrap">S$ 205,350.00</span>
          </div>
        </section>
      </div>

      <!-- By product -->
      <div class="flex flex-col gap-4">
        <h2 class="card-title">By product</h2>
        <div class="flex gap-4 items-stretch">
          <section v-for="p in products" :key="p.title" class="card flex flex-1 min-w-0 flex-col">
            <div class="flex items-center gap-2 px-3 py-2 border-b border-[#f2f2f4]">
              <img :src="p.icon" alt="" width="18" height="18" class="size-[18px] shrink-0" />
              <span class="flex-1 min-w-0 text-[14px] font-medium leading-[1.5] text-[#03102f]">{{ p.title }}</span>
              <span v-if="p.isNew" class="min-w-9 px-1 rounded-3xl bg-[#f7edfd] text-center text-[12px] font-medium leading-[1.5] text-[#7d1ab7]">New</span>
            </div>
            <div class="flex flex-1 flex-col py-2 text-[12px] leading-[1.5]">
              <!-- Cards: spend vs monthly limit -->
              <div v-if="p.usage" class="flex flex-col gap-2 px-3 py-1">
                <div class="flex items-start gap-1.5">
                  <span class="flex-1 min-w-0 text-[#61667c]">Spent this month</span>
                  <span class="font-mono-r text-[#03102f] whitespace-nowrap">SGD 27,620.00</span>
                </div>
                <div class="flex h-1.5 rounded-[3px] overflow-hidden bg-[#f2f2f4]">
                  <div class="bg-[#2465de]" style="width: 69%" />
                </div>
                <p class="text-[#61667c]"><span class="font-mono-r text-[#03102f]">69%</span> of <span class="font-mono-r text-[#03102f]">SGD 40,000.00</span> monthly limit</p>
              </div>
              <div v-for="r in p.rows" :key="r.label" class="flex items-start gap-1.5 px-3 py-1">
                <span class="flex-1 min-w-0 text-[#61667c]">{{ r.label }}</span>
                <span class="font-mono-r whitespace-nowrap" :class="r.error ? 'text-[#dc3545]' : 'text-[#03102f]'">{{ r.value }}</span>
              </div>
            </div>
            <div class="flex justify-center px-3 py-2 border-t border-[#f2f2f4]">
              <button type="button" class="link-btn" @click="go(p.url, p.item)">{{ p.cta }}</button>
            </div>
          </section>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { activeItems } from '../../composables/useSidebarActiveItem.js'

import calendarIcon from '../../assets/icons/finance-overview/calendar.svg'
import chevronRightIcon from '../../assets/icons/finance-overview/chevron-right.svg'
import check2Icon from '../../assets/icons/finance-overview/check-2.svg'
import alertIcon from '../../assets/icons/finance-overview/alert.svg'
import documentCheckIcon from '../../assets/icons/finance-overview/document-check.svg'
import sendMoneySmIcon from '../../assets/icons/finance-overview/send-money-sm.svg'
import chartLine from '../../assets/icons/finance-overview/chart-line.svg'
import dollarPaperIcon from '../../assets/icons/finance-overview/dollar-paper.svg'
import sendMoneyIcon from '../../assets/icons/finance-overview/send-money.svg'
import bankCardIcon from '../../assets/icons/finance-overview/bank-card.svg'
import billIcon from '../../assets/icons/finance-overview/bill.svg'
import dotBillPay from '../../assets/icons/finance-overview/dot-bill-pay.svg'
import dotSendMoney from '../../assets/icons/finance-overview/dot-send-money.svg'
import dotCard from '../../assets/icons/finance-overview/dot-card.svg'
import dotReimbursement from '../../assets/icons/finance-overview/dot-reimbursement.svg'

const router = useRouter()

// Navigate and highlight the matching Finance sidebar item
function go(url, item) {
  if (item) activeItems.finance.value = item
  router.push(url)
}

const balances = [
  { label: 'HitPay balance', value: 'S$ 182,400.00', note: 'From Payments' },
  { label: 'Card balance', value: 'S$ 38,910.00', note: 'Covers about 5 weeks of spend', warn: true },
  { label: 'Total across currencies', value: 'S$ 221,310.00', note: "SGD, USD, MYR at today's rate" },
]

const PURPLE = '#f7edfd'
const AMBER = '#fff9ec'
const actions = [
  { title: '4 bills to approve', source: 'Bill Pay', amount: 'SGD 18,450.00', icon: check2Icon, tone: PURPLE, url: '/bills', item: 'Bills' },
  { title: '2 bills overdue', source: 'Bill Pay', amount: 'SGD 3,120.00', icon: alertIcon, tone: AMBER, warn: true, url: '/bills', item: 'Bills' },
  { title: '6 claims to review', source: 'Claims', amount: 'SGD 1,240.00', icon: documentCheckIcon, tone: PURPLE, url: '/claims', item: 'Claims' },
  { title: '3 reimbursement awaiting for payment', source: 'Reimbursement', amount: 'SGD 1,240.00', icon: sendMoneySmIcon, tone: AMBER, url: '/claims/reimbursements', item: 'Reimbursements' },
]

// Stacked segments, top → bottom (heights in px, from Figma)
const SEGMENT_COLORS = ['#f4b840', '#b14aed', '#80acfe', '#002771']
const bars = [
  [29, 11, 13, 34],
  [12, 11, 35, 11],
  [11, 11, 23, 71],
  [11, 34, 23, 19],
  [32, 8, 23, 68],
  [11, 28, 16, 8],
  [32, 14.5, 23, 14.5],
  [5.33, 5.33, 5.34, 15],
  [32, 10.5, 23, 10.5],
  [44, 30, 23, 34],
  [],
  [],
]
const months = ['Jan’26', 'Feb’26', 'Mar’26', 'Apr’26', 'May’26', 'Jun’26', 'Jul’26', 'Aug’26', 'Sep’26', 'Oct’26', 'Nov’26', 'Dec’26']
const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

// Hover breakdown per bar. May uses the Figma figures; the other months are
// mock values scaled from their segment heights.
const BREAKDOWN = [
  { label: 'Bill Pay', dot: dotBillPay, segment: 3 },
  { label: 'Send Money', dot: dotSendMoney, segment: 1 },
  { label: 'Card', dot: dotCard, segment: 2 },
  { label: 'Reimbursement', dot: dotReimbursement, segment: 0 },
]
const FIGMA_MAY = [491.98, 892.11, 805.73, 25.73]
const FIGMA_MAY_TOTAL = 2189.82
const SGD_PER_PX = 16.7
const sgd = (n) => 'SGD ' + n.toLocaleString('en-SG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
const barDetails = bars.map((bar, i) => {
  const amounts = i === 4 ? FIGMA_MAY : BREAKDOWN.map((b) => (bar[b.segment] || 0) * SGD_PER_PX)
  return {
    date: `${MONTH_NAMES[i]} 2026`,
    total: i === 4 ? sgd(FIGMA_MAY_TOTAL) : sgd(amounts.reduce((a, b) => a + b, 0)),
    rows: BREAKDOWN.map((b, k) => ({ label: b.label, dot: b.dot, amount: sgd(amounts[k]) })),
  }
})

const chartEl = ref(null)
const hoveredBar = ref(null)
const detailLeft = ref(0)
const DETAIL_WIDTH = 244 // 220px rows + 12px padding each side
const DETAIL_GAP = 6
function showBarDetail(i, e) {
  if (!bars[i].length) { hoveredBar.value = null; return }
  const col = e.currentTarget
  const chartWidth = chartEl.value?.offsetWidth ?? 0
  const left = col.offsetLeft + col.offsetWidth + DETAIL_GAP
  // Flip to the bar's left when the card would run past the chart
  detailLeft.value = left + DETAIL_WIDTH > chartWidth ? col.offsetLeft - DETAIL_GAP - DETAIL_WIDTH : left
  hoveredBar.value = i
}

const spendCategories = [
  { label: 'Bills S$ 68,200', color: '#002771' },
  { label: 'Transfers S$ 41,500', color: '#2465de' },
  { label: 'Card spend S$ 27,620', color: '#b3cdfe' },
  { label: 'Reimbursements S$ 5,060', color: '#eaa00c' },
]

const upcoming = [
  { date: 'Thu 26', label: 'Bill · Kopi Supply Co.', amount: '−S$ 4,200.00' },
  { date: 'Fri 27', label: 'Settlement from Payments', amount: '+S$ 22,150.00' },
  { date: 'Mon 30', label: 'Transfer · 3 freelancers', amount: '−S$ 9,800.00' },
  { date: 'Tue 1', label: 'Bill · Office rent', amount: '−S$ 12,000.00' },
  { date: 'Wed 2', label: 'Reimbursements · 6 claims', amount: '−S$ 1,860.00' },
  { date: 'Fri 4', label: 'Bill · Cloud hosting', amount: '−S$ 10,250.00' },
  { date: 'Sat 5', label: 'Bill · Marketing campaign', amount: '−S$ 3,480.00' },
  { date: 'Mon 7', label: 'Settlement from Payments', amount: '+S$ 8,500.00' },
]

const products = [
  {
    title: 'Bill Pay', icon: dollarPaperIcon, cta: 'View bills →', url: '/bills', item: 'Bills',
    rows: [
      { label: 'Due this week', value: 'SGD 16,200.00' },
      { label: 'Overdue', value: 'SGD 3,120.00', error: true },
      { label: 'Paid this month', value: 'SGD 68,200.00' },
    ],
  },
  {
    title: 'Send Money', icon: sendMoneyIcon, cta: 'View transfers →', url: '/transfer-history', item: 'Transfer History',
    rows: [
      { label: 'Sent this month', value: 'SGD 41,500.00' },
      { label: 'Transfers', value: '14' },
      { label: 'Waiting for approval', value: '3' },
    ],
  },
  {
    title: 'Cards', icon: bankCardIcon, cta: 'View card spend →', url: '/cards/transactions', item: 'Transactions', usage: true,
    rows: [
      { label: 'Active cards', value: '12' },
      { label: 'Missing receipts', value: '3' },
    ],
  },
  {
    title: 'Claims', icon: billIcon, cta: 'View claims →', url: '/claims', item: 'Claims', isNew: true,
    rows: [
      { label: 'Submitted this month', value: '18' },
      { label: 'To review', value: '6' },
      { label: 'Reimbursed this month', value: 'S$ 5,060.00' },
    ],
  },
]
</script>

<style scoped>
/* Shadow/Tooltip */
.bar-detail {
  box-shadow: 0px 1px 3px 0px rgba(0, 0, 0, 0.1), 0px 3px 22px 0px rgba(38, 42, 50, 0.09);
}
.card {
  background: #ffffff;
  border: 1px solid #e5e6ea;
  border-radius: 8px;
}
/* Sans/Title Small/Medium */
.card-title {
  font-size: 16px;
  font-weight: 500;
  line-height: 1.4;
  color: #03102f;
}
/* Mono/Display/Medium */
.mono-display {
  font-family: 'Reddit Mono', ui-monospace, monospace;
  font-weight: 500;
  font-size: 24px;
  line-height: 1.35;
  white-space: nowrap;
}
/* Mono SemiBold (13 / 14) */
.mono-semibold {
  font-family: 'Reddit Mono', ui-monospace, monospace;
  font-weight: 600;
  line-height: 1.4;
}
/* Mono/Body Small/Regular */
.font-mono-r {
  font-family: 'Reddit Mono', ui-monospace, monospace;
  font-weight: 400;
}
/* Text button — Body Small/Medium, primary/500 */
.link-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 28px;
  min-width: 36px;
  padding: 0 8px;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 500;
  line-height: 1.5;
  color: #2465de;
  white-space: nowrap;
  transition: background-color 150ms;
}
.link-btn:hover {
  background: rgba(36, 101, 222, 0.06);
}
.action-row {
  transition: background-color 150ms;
}
.action-row:hover {
  background: #f8f9fc;
}
.legend {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  line-height: 1.5;
  color: #61667c;
  white-space: nowrap;
}
.dot {
  width: 8px;
  height: 8px;
  border-radius: 12px;
  flex-shrink: 0;
}
/* Smallest/Uppercase */
.axis-label {
  font-size: 10px;
  font-weight: 500;
  line-height: 18px;
  letter-spacing: 0.3px;
  text-transform: uppercase;
  text-align: center;
  color: #9295a5;
}
</style>
