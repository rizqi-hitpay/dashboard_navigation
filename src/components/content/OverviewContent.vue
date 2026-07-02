<template>
  <div class="h-full overflow-y-auto bg-white" style="padding: 24px 28px;">

    <!-- Page header -->
    <div class="flex items-center justify-between shrink-0 mb-5">
      <h1 class="text-[18px] font-medium text-[#03102f]">Overview</h1>
    </div>

    <!-- Stat cards row — each card is its own fake API source -->
    <div class="grid grid-cols-4 gap-3 shrink-0 mb-5">
      <OverviewCard
        v-for="(card, i) in statCards"
        :key="card.label"
        :label="card.label"
        :value="card.value"
        :trend="card.trend"
        :direction="card.direction || 'up'"
        :loaded="isLoaded('stat-' + i)"
      />
    </div>

    <!-- Transactions + Sales chart row -->
    <div class="grid grid-cols-2 gap-4 mb-4">
      <!-- Recent Transactions -->
      <RecentTransactionsTable :rows="recentTransactions" :loaded="isLoaded('transactions')" />

      <!-- Your Sales bar chart -->
      <SalesBarChart :loaded="isLoaded('sales')" />
    </div>

    <!-- Donut charts row -->
    <div class="grid grid-cols-2 gap-4 mb-4">
      <DonutChartCard
        title="Sales by Payment Methods"
        :segments="paymentMethodSegments"
        total="SGD 11,170"
        center-label="Total"
        discover-text="Discover more methods"
        :tabs="[{ label: '7d' }, { label: '30d' }]"
        :loaded="isLoaded('payment-methods')"
      />
      <DonutChartCard
        title="Sales by Channels"
        :segments="channelSegments"
        total="SGD 18,470"
        center-label="Total"
        :loaded="isLoaded('channels')"
      />
    </div>

    <!-- Recent Payouts table -->
    <div class="mb-5">
      <RecentPayoutsTable :rows="recentPayouts" :loaded="isLoaded('payouts')" />
    </div>

    <!-- Product intro carousel (Explore HitPay), dismissible — reveals on first load -->
    <div
      v-if="!productIntroDismissed"
      class="intro-reveal"
      :class="{ 'intro-reveal--open': introOpen, 'intro-reveal--done': introDone }"
    >
      <div class="intro-reveal__inner">
        <div style="padding-top: 8px;">
          <ProductIntroCarousel :play="introOpen" @close="productIntroDismissed = true" />

          <!-- Chat box → opens the AI Assistant with the typed message.
               Hidden while the AI Assistant panel is open. -->
          <div v-if="!agentPanelOpen" class="flex justify-center" style="margin-top: 64px;">
            <AgentChatInput style="width: 500px;" />
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
// Persists across remounts so the intro reveal plays only on the first load
let introHasPlayed = false
</script>

<script setup>
import { ref, onMounted } from 'vue'
import OverviewCard from './OverviewCard.vue'
import ProductIntroCarousel from './ProductIntroCarousel.vue'
import AgentChatInput from './AgentChatInput.vue'
import { agentPanelOpen } from '../../composables/useAgentPanel.js'
import RecentTransactionsTable from './RecentTransactionsTable.vue'
import SalesBarChart from './SalesBarChart.vue'
import DonutChartCard from './DonutChartCard.vue'
import RecentPayoutsTable from './RecentPayoutsTable.vue'
import { useDashboardData } from '../../composables/useDashboardData.js'

const { isLoaded } = useDashboardData()

const productIntroDismissed = ref(false)

// One-time intro reveal: collapsed → expands (pushing the stat cards down) and
// the carousel cards stagger in. `done` drops the grid clip so hover shadows
// aren't cut once the reveal finishes.
const introOpen = ref(introHasPlayed)
const introDone = ref(introHasPlayed)
onMounted(() => {
  if (introHasPlayed) return
  introHasPlayed = true
  const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (reduce) { introOpen.value = true; introDone.value = true; return }
  setTimeout(() => { introOpen.value = true }, 600)
  setTimeout(() => { introDone.value = true }, 2500)
})

const statCards = [
  { label: 'Sales this month', value: 'SGD 398,152', trend: '+5%' },
  { label: 'Sales this week',  value: 'SGD 18,470',  trend: '+11%' },
  { label: 'Sales today',      value: 'SGD 2,760',   trend: '+39%' },
  { label: 'Wallet balance',   value: 'SGD 70,251',  trend: '+39%' },
]


const recentTransactions = [
  { date: 'MAY 20  09:14 AM', customer: 'james@wildadventures.com',    amount: 'SGD 1,200.00' },
  { date: 'MAY 20  02:30 PM', customer: 'sophia@urbanexplorers.net',   amount: 'SGD 2,345.67' },
  { date: 'MAY 19  06:45 PM', customer: 'michael@techinnovators.org',  amount: 'SGD 88.50'    },
  { date: 'MAY 19  09:00 AM', customer: 'linda@creativehorizons.com',  amount: 'SGD 4,567.89' },
  { date: 'MAY 18  02:30 PM', customer: 'jane.smith@example.com',      amount: 'SGD 3,456.78' },
]

const recentPayouts = [
  { date: 'MAY 20  09:00 AM', bank: 'DBS Bank',  bankSub: '•••• 4821', amount: 'SGD 12,400.00', status: 'Success'    },
  { date: 'MAY 19  02:15 PM', bank: 'OCBC Bank', bankSub: '•••• 7734', amount: 'SGD 8,760.00',  status: 'In-transit' },
  { date: 'MAY 18  11:30 AM', bank: 'UOB Bank',  bankSub: '•••• 2290', amount: 'SGD 5,200.00',  status: 'Success'    },
  { date: 'MAY 17  04:45 PM', bank: 'DBS Bank',  bankSub: '•••• 4821', amount: 'SGD 980.00',    status: 'Failed'     },
  { date: 'MAY 16  10:00 AM', bank: 'Citibank',  bankSub: '•••• 6603', amount: 'SGD 3,310.00',  status: 'Success'    },
]

const paymentMethodSegments = [
  { label: 'Cards',  pct: 68, color: '#346dff', value: 'SGD 7,595.60' },
  { label: 'Paynow', pct: 22, color: '#aec4ff', value: 'SGD 2,457.40' },
  { label: 'Others', pct: 10, color: '#86ffcc', value: 'SGD 1,117.00' },
]

const channelSegments = [
  { label: 'Payment Links', pct: 45, color: '#346dff', value: 'SGD 8,311.50' },
  { label: 'Invoices',      pct: 28, color: '#2bc37d', value: 'SGD 5,171.60' },
  { label: 'Web POS',       pct: 18, color: '#f4b840', value: 'SGD 3,324.60' },
  { label: 'API',           pct: 9,  color: '#aec4ff', value: 'SGD 1,662.30' },
]

</script>

<style scoped>
/* One-time intro reveal — height via grid rows (transform-free push of the
   stat cards), onboarding ease. After it settles, drop the grid so the
   carousel renders normally (overflow visible → hover shadows aren't clipped). */
.intro-reveal {
  display: grid;
  grid-template-rows: 0fr;
  transition: grid-template-rows 600ms cubic-bezier(0.32, 0.72, 0, 1);
}
.intro-reveal--open {
  grid-template-rows: 1fr;
}
.intro-reveal__inner {
  min-height: 0;
  overflow: hidden;
}
.intro-reveal--done {
  display: block;
}
.intro-reveal--done .intro-reveal__inner {
  overflow: visible;
}

@media (prefers-reduced-motion: reduce) {
  .intro-reveal { transition: none; }
}
</style>
