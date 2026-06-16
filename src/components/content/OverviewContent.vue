<template>
  <div class="h-full overflow-y-auto bg-white" style="padding: 24px 28px;">

    <!-- Page header -->
    <div class="flex items-center justify-between shrink-0 mb-5">
      <h1 class="text-[18px] font-medium text-[#03102f]">Overview</h1>
    </div>

    <!-- Product intro carousel (new users only, dismissible) — reveals on first load -->
    <div
      v-if="isNewUser && !productIntroDismissed"
      class="intro-reveal"
      :class="{ 'intro-reveal--open': introOpen, 'intro-reveal--done': introDone }"
    >
      <div class="intro-reveal__inner">
        <div style="padding-bottom: 32px;">
          <ProductIntroCarousel :play="introOpen" @close="productIntroDismissed = true" />
        </div>
      </div>
    </div>

    <!-- Stat cards row -->
    <div class="grid grid-cols-4 gap-3 shrink-0 mb-5">
      <OverviewCard
        v-for="card in statCards"
        :key="card.label"
        :label="card.label"
        :value="card.value"
        :trend="card.trend"
        :direction="card.direction || 'up'"
      />
    </div>

    <!-- Transactions + Sales chart row -->
    <div class="grid grid-cols-2 gap-4 mb-4">
      <!-- Recent Transactions -->
      <RecentTransactionsTable :rows="recentTransactions" />

      <!-- Your Sales bar chart -->
      <SalesBarChart :empty="isNewUser" />
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
        :empty="isNewUser"
      />
      <DonutChartCard
        title="Sales by Channels"
        :segments="channelSegments"
        total="SGD 18,470"
        center-label="Total"
        :empty="isNewUser"
      />
    </div>

    <!-- Recent Payouts table -->
    <div class="mb-5">
      <RecentPayoutsTable :rows="recentPayouts" />
    </div>

    <!-- "More on HitPay" separator -->
    <div v-if="!smallBannerDismissed || !largeBannerDismissed" class="flex items-center gap-3 mb-4 shrink-0">
      <div class="flex-1 h-px bg-[#f0f1f5]"></div>
      <span class="text-[12px] text-[#61667c] shrink-0">More on HitPay</span>
      <div class="flex-1 h-px bg-[#f0f1f5]"></div>
    </div>

    <!-- Small promo banner -->
    <div v-if="!smallBannerDismissed" class="flex items-center rounded-[8px] mb-3 shrink-0" style="background: #f8f9fc; padding: 16px 24px; gap: 16px;">
      <!-- Icon box: white bg + border -->
      <div class="shrink-0 flex items-center justify-center rounded-[8px]" style="width: 40px; height: 40px; background: white; border: 1px solid #e5e6ea;">
        <img :src="paletteIcon" style="width: 24px; height: 24px;" />
      </div>
      <!-- Content: text + buttons -->
      <div class="flex items-center flex-1 min-w-0" style="gap: 24px;">
        <div class="flex flex-col flex-1 min-w-0" style="gap: 4px;">
          <div class="text-[16px] font-medium text-[#03102f]">Make your checkout page match your brand!</div>
          <div class="text-[12px] text-[#61667c]">Explore how HitPay's customizable checkout page reflects your brand.</div>
        </div>
        <!-- Button group -->
        <div class="flex items-center shrink-0" style="gap: 8px;">
          <!-- Dismiss -->
          <button
            class="flex items-center h-7 rounded-[8px] text-[12px] font-medium text-[#61667c] hover:bg-white transition-colors duration-150"
            style="padding: 0 8px;"
            @click="smallBannerDismissed = true"
          >Dismiss</button>
          <!-- Vertical divider -->
          <div style="width: 1px; height: 20px; background: #cbcdd4; flex-shrink: 0;"></div>
          <!-- Checkout Customisation -->
          <button class="flex items-center h-7 rounded-[8px] text-[12px] font-medium text-[#2364dd] hover:opacity-80 transition-opacity" style="padding: 0 8px;">
            Checkout Customisation →
          </button>
        </div>
      </div>
    </div>

    <!-- Large promo banner -->
    <div v-if="!largeBannerDismissed" class="relative rounded-[8px] overflow-hidden shrink-0 mb-2" style="background: #f8f9fc; padding: 32px 40px 0 40px;">
      <button
        class="absolute rounded-[8px] text-[12px] font-medium text-[#61667c] hover:bg-black/5 transition-colors duration-150"
        style="top: 8px; right: 8px; padding: 5px 8px;"
        @click="largeBannerDismissed = true"
      >Close</button>
      <div class="flex" style="gap: 48px;">

        <!-- Payment Links -->
        <div class="flex flex-col flex-1 min-w-0" style="gap: 16px;">
          <div class="flex flex-col" style="gap: 4px;">
            <div class="text-[16px] font-medium text-[#03102f]">Create Payment Links to sell anywhere, anytime.</div>
            <button class="self-start text-[12px] font-medium text-[#2364dd] hover:opacity-80 transition-opacity">
              Create Payment Link →
            </button>
          </div>
          <div class="overflow-hidden" style="height: 196px; border-radius: 8px 8px 0 0;">
            <img :src="promoPaymentLinksImg" class="w-full" style="height: 196px; object-fit: cover; object-position: top;" />
          </div>
        </div>

        <!-- Invoice -->
        <div class="flex flex-col flex-1 min-w-0" style="gap: 16px;">
          <div class="flex flex-col" style="gap: 4px;">
            <div class="text-[16px] font-medium text-[#03102f]">Create professional invoices in just minutes.</div>
            <button class="self-start text-[12px] font-medium text-[#2364dd] hover:opacity-80 transition-opacity">
              Create Invoice →
            </button>
          </div>
          <div class="overflow-hidden" style="height: 196px; border-radius: 8px 8px 0 0;">
            <img :src="promoInvoiceImg" class="w-full" style="height: 196px; object-fit: cover; object-position: top;" />
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
import { ref, computed, onMounted } from 'vue'
import OverviewCard from './OverviewCard.vue'
import ProductIntroCarousel from './ProductIntroCarousel.vue'
import RecentTransactionsTable from './RecentTransactionsTable.vue'
import SalesBarChart from './SalesBarChart.vue'
import DonutChartCard from './DonutChartCard.vue'
import RecentPayoutsTable from './RecentPayoutsTable.vue'
import paletteIcon from '../../assets/icons/icon-palette.svg'
import promoPaymentLinksImg from '../../assets/images/promo-payment-links.webp'
import promoInvoiceImg from '../../assets/images/promo-invoice.webp'
import { useNewUser } from '../../composables/useNewUser'

const smallBannerDismissed = ref(false)
const largeBannerDismissed = ref(false)
const productIntroDismissed = ref(false)

// New-user activation flow: all dashboard data starts empty
const { isNewUser } = useNewUser()

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
  // Hold until the overlay + setup-card entrance settles (~1.1s), then reveal
  setTimeout(() => { introOpen.value = true }, 1100)
  setTimeout(() => { introDone.value = true }, 3000)
})

// Empty state (Figma: Dashboard - Initial) — values zeroed, no trend badges
const emptyStatCards = [
  { label: 'Sales this month', value: 'SGD 0.00', trend: '' },
  { label: 'Sales this week',  value: 'SGD 0.00', trend: '' },
  { label: 'Sales today',      value: 'SGD 0.00', trend: '' },
  { label: 'Wallet balance',   value: 'SGD 0.00', trend: '' },
]

const filledStatCards = [
  { label: 'Sales this month', value: 'SGD 398,152', trend: '+5%' },
  { label: 'Sales this week',  value: 'SGD 18,470',  trend: '+11%' },
  { label: 'Sales today',      value: 'SGD 2,760',   trend: '+39%' },
  { label: 'Wallet balance',   value: 'SGD 70,251',  trend: '+39%' },
]

const statCards = computed(() => isNewUser.value ? emptyStatCards : filledStatCards)

const filledTransactions = [
  { date: 'MAY 20  09:14 AM', customer: 'james@wildadventures.com',    amount: 'SGD 1,200.00' },
  { date: 'MAY 20  02:30 PM', customer: 'sophia@urbanexplorers.net',   amount: 'SGD 2,345.67' },
  { date: 'MAY 19  06:45 PM', customer: 'michael@techinnovators.org',  amount: 'SGD 88.50'    },
  { date: 'MAY 19  09:00 AM', customer: 'linda@creativehorizons.com',  amount: 'SGD 4,567.89' },
  { date: 'MAY 18  02:30 PM', customer: 'jane.smith@example.com',      amount: 'SGD 3,456.78' },
]

const filledPayouts = [
  { date: 'MAY 20  09:00 AM', bank: 'DBS Bank',  bankSub: '•••• 4821', amount: 'SGD 12,400.00', status: 'Success'    },
  { date: 'MAY 19  02:15 PM', bank: 'OCBC Bank', bankSub: '•••• 7734', amount: 'SGD 8,760.00',  status: 'In-transit' },
  { date: 'MAY 18  11:30 AM', bank: 'UOB Bank',  bankSub: '•••• 2290', amount: 'SGD 5,200.00',  status: 'Success'    },
  { date: 'MAY 17  04:45 PM', bank: 'DBS Bank',  bankSub: '•••• 4821', amount: 'SGD 980.00',    status: 'Failed'     },
  { date: 'MAY 16  10:00 AM', bank: 'Citibank',  bankSub: '•••• 6603', amount: 'SGD 3,310.00',  status: 'Success'    },
]

const recentTransactions = computed(() => isNewUser.value ? [] : filledTransactions)
const recentPayouts      = computed(() => isNewUser.value ? [] : filledPayouts)

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
