<template>
  <div>
    <!-- Head: title + prev/next + close -->
    <div class="flex items-center justify-between" style="height: 40px; margin-bottom: 4px;">
      <div class="flex items-center" style="gap: 8px;">
        <span class="text-[16px] font-medium text-[#03102f]" style="line-height: 1.4;">Explore HitPay</span>

        <!-- Prev / Next -->
        <div class="flex items-center">
          <button
            class="flex items-center justify-center rounded-[8px] transition-colors duration-150"
            style="width: 28px; height: 28px;"
            :class="canScrollPrev ? 'hover:bg-[#f8f9fc]' : 'opacity-40 cursor-default'"
            @click="scrollByCard(-1)"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M10 3.5L5.5 8L10 12.5" stroke="#03102f" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
          <button
            class="flex items-center justify-center rounded-[8px] transition-colors duration-150"
            style="width: 28px; height: 28px;"
            :class="canScrollNext ? 'hover:bg-[#f8f9fc]' : 'opacity-40 cursor-default'"
            @click="scrollByCard(1)"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M6 3.5L10.5 8L6 12.5" stroke="#03102f" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
        </div>
      </div>

      <!-- Close -->
      <button
        class="flex items-center rounded-[8px] text-[12px] font-medium text-[#61667c] hover:bg-[#f8f9fc] transition-colors duration-150"
        style="height: 28px; padding: 0 8px; gap: 6px;"
        @click="$emit('close')"
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M12 4L4 12M4 4L12 12" stroke="#61667c" stroke-width="1.5" stroke-linecap="round"/>
        </svg>
        Close
      </button>
    </div>

    <!-- Card list: bleeds past the page padding so cards clip at the content edge (Figma: cut on "Content") -->
    <div
      ref="listEl"
      class="flex hide-scrollbar"
      style="gap: 12px; overflow-x: auto; scroll-behavior: smooth; margin: 0 -28px; padding: 0 28px;"
      @scroll.passive="updateScrollState"
    >
      <div
        v-for="card in cards"
        :key="card.title"
        class="flex items-center bg-white rounded-[8px] shrink-0"
        style="width: 500px; padding: 16px; gap: 16px; border: 1px solid #e5e6ea;"
      >
        <!-- Illustration -->
        <img :src="card.image" alt="" class="shrink-0 rounded-[16px]" style="width: 132px; height: 112px;" />

        <!-- Content -->
        <div class="flex flex-col flex-1 min-w-0" style="gap: 8px; min-height: 112px;">
          <div class="flex items-center" style="gap: 8px;">
            <span class="text-[16px] font-medium text-[#03102f] whitespace-nowrap" style="line-height: 1.4;">{{ card.title }}</span>
            <span
              class="flex items-center justify-center bg-white text-[12px] font-medium rounded-[24px] shrink-0"
              :style="{
                minHeight: '24px',
                minWidth: '32px',
                padding: '2px 8px',
                border: `1px solid ${card.chipBorder}`,
                color: card.chipColor,
              }"
            >{{ card.chip }}</span>
          </div>
          <p class="text-[14px] text-[#61667c]" style="line-height: 1.5;">{{ card.description }}</p>
          <button class="self-start text-[14px] font-medium text-[#2465de] hover:opacity-80 transition-opacity" style="line-height: 1.5;">
            Learn more →
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import introInvoiceImg from '../../assets/images/intro-invoice.webp'
import introPaymentLinkImg from '../../assets/images/intro-payment-link.webp'
import introStaticQrImg from '../../assets/images/intro-static-qr.webp'
import introPosImg from '../../assets/images/intro-pos.webp'
import introSendMoneyImg from '../../assets/images/intro-send-money.webp'

defineEmits(['close'])

// Chip palettes (Figma: primary/purple/success 300 borders + 500/600 text)
const PAYMENT  = { chip: 'Payment',  chipBorder: '#80acfe', chipColor: '#2465de' }
const COMMERCE = { chip: 'Commerce', chipBorder: '#d8a4f6', chipColor: '#7d1ab7' }
const FINANCE  = { chip: 'Finance',  chipBorder: '#81e3b6', chipColor: '#238b5b' }

const cards = [
  {
    title: 'Professional Invoicing',
    description: 'Send branded invoices with online payment options. Auto-reminders help you get paid faster.',
    image: introInvoiceImg,
    ...PAYMENT,
  },
  {
    title: 'Create Payment Links',
    description: 'Share a link and get paid instantly — no website or app needed. Works via WhatsApp, email, or SMS.',
    image: introPaymentLinkImg,
    ...PAYMENT,
  },
  {
    title: 'Static QR Payments',
    description: 'Print a QR code and place it anywhere. Customers scan and pay via PayNow or other methods.',
    image: introStaticQrImg,
    ...PAYMENT,
  },
  {
    title: 'POS & Online Store Builder',
    description: 'Turn any device into a point-of-sale terminal, or launch a full online storefront in minutes.',
    image: introPosImg,
    ...COMMERCE,
  },
  {
    title: 'Send Money',
    description: 'Pay vendors, suppliers and staff directly from your HitPay balance with instant bank transfers.',
    image: introSendMoneyImg,
    ...FINANCE,
  },
]

// ── Scrolling ──
const CARD_STEP = 512 // 500px card + 12px gap

const listEl = ref(null)
const canScrollPrev = ref(false)
const canScrollNext = ref(true)

function updateScrollState() {
  const el = listEl.value
  if (!el) return
  canScrollPrev.value = el.scrollLeft > 0
  canScrollNext.value = el.scrollLeft < el.scrollWidth - el.clientWidth - 1
}

function scrollByCard(dir) {
  listEl.value?.scrollBy({ left: dir * CARD_STEP })
}

onMounted(updateScrollState)
</script>

<style scoped>
.hide-scrollbar {
  scrollbar-width: none;       /* Firefox */
}
.hide-scrollbar::-webkit-scrollbar {
  display: none;               /* Chrome / Safari */
}
</style>
