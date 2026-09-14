<template>
  <div class="relative bg-white flex flex-col h-full w-full overflow-hidden">
    <div class="flex flex-1 flex-col items-start w-full pt-[4px] overflow-y-auto overflow-x-hidden">

      <!-- Page title (Figma: 2227:20374) -->
      <div class="flex flex-col gap-[8px] justify-center px-[24px] py-[12px] w-full shrink-0">
        <p class="font-medium text-[18px] text-[#03102f] leading-[1.35] whitespace-nowrap">Virtual Accounts</p>
        <p class="text-[12px] font-normal text-[#61667c] leading-[1.5]">Collect business payments into an account issued in your name, reconciled automatically in your HitPay wallet with the rest of your sales.</p>
      </div>

      <!-- Intro hero (Figma: 2236:67741) -->
      <div v-if="bannerVisible" class="w-full px-[24px] pt-[12px]">
        <div class="group relative flex items-center gap-[40px] w-full rounded-[12px] border border-[#e5e6ea] bg-white px-[32px] py-[32px] overflow-hidden">
          <!-- Close — revealed on hover (Figma: 2240:138336) -->
          <button
            type="button"
            class="absolute top-[4px] right-[12px] z-10 flex items-center justify-center h-[28px] px-[8px] rounded-[8px] opacity-0 group-hover:opacity-100 focus-visible:opacity-100 transition-opacity duration-150 hover:bg-[#f0f1f5]"
            @click="bannerVisible = false"
          >
            <span class="text-[12px] font-medium text-[#484d61] leading-[1.5] whitespace-nowrap">Close</span>
          </button>
          <div class="flex flex-col gap-[24px] max-w-[568px] shrink min-w-0 py-[8px]">
            <div class="flex flex-col gap-[8px]">
              <p class="text-[18px] font-medium text-[#03102f] leading-[1.35]">Get paid like a local</p>
              <p class="text-[14px] font-normal text-[#61667c] leading-[1.5]">Selling to businesses overseas? Share a virtual account based in their country. They pay in their own currency, through their normal local rails — no international fees and faster settlement for you.</p>
            </div>
            <button
              type="button"
              class="flex items-center gap-[8px] h-[36px] rounded-[8px] cursor-pointer hover:opacity-75 transition-opacity duration-150 self-start"
            >
              <span class="text-[14px] font-medium text-[#2465de] leading-[1.5] whitespace-nowrap">Learn more</span>
              <svg class="shrink-0" width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M2.5 8h11M9.5 4l4 4-4 4" stroke="#2465de" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" /></svg>
            </button>
          </div>
          <VaGlobeAnimation class="hidden md:flex ml-auto" />
        </div>
      </div>

      <!-- Bank locations table (Figma: 2229:52021) -->
      <div class="flex flex-col w-full px-[24px] pt-[24px] pb-[24px]">
        <div class="w-full rounded-[8px] border border-[#e5e6ea] overflow-hidden bg-white">
          <div class="w-full overflow-x-auto">
            <table class="w-full border-collapse min-w-[900px]" style="table-layout: fixed;">
              <colgroup>
                <col style="width: 183px;" />
                <col />
                <col style="width: 263px;" />
                <col style="width: 200px;" />
              </colgroup>
              <thead>
                <tr>
                  <th
                    v-for="(col, ci) in columns"
                    :key="col"
                    class="bg-[#fcfcfd] h-[34px] border-b border-[#e5e6ea] px-[12px] py-[8px] text-left align-middle"
                    :class="ci < columns.length - 1 ? 'border-r border-[#e5e6ea]' : ''"
                  >
                    <span class="text-[10px] font-medium uppercase tracking-[0.3px] leading-[18px] text-[#03102f] whitespace-nowrap">{{ col }}</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="loc in locations"
                  :key="loc.name"
                  class="cursor-pointer transition-colors duration-150 [&:last-child>td]:border-b-0"
                  :class="detailLocation && detailLocation.name === loc.name ? 'bg-[#fcfcfd]' : 'hover:bg-[#fcfcfd]'"
                  @click="detailLocation = loc"
                >
                  <!-- Bank location -->
                  <td class="h-[44px] px-[12px] py-[8px] align-middle border-b border-r border-[#e5e6ea]">
                    <div class="flex items-center gap-[8px]">
                      <img :src="loc.flag" width="24" height="16" alt="" class="shrink-0 rounded-[2px]" style="box-shadow: 0px 0px 0px 0.5px rgba(3,16,47,0.08);" />
                      <span class="text-[13px] font-normal text-[#03102f] leading-[1.5] whitespace-nowrap">{{ loc.name }}</span>
                    </div>
                  </td>
                  <!-- Currency chips -->
                  <td class="h-[44px] px-[12px] py-[8px] align-middle border-b border-r border-[#e5e6ea]">
                    <div class="flex items-center gap-[2px] flex-wrap">
                      <span
                        v-for="c in loc.currencies"
                        :key="c"
                        class="inline-flex items-center justify-center min-h-[24px] min-w-[32px] px-[8px] py-[2px] rounded-[24px] bg-[#e5eeff] text-[12px] font-medium text-[#2465de] leading-[1.5] whitespace-nowrap"
                      >{{ c }}</span>
                    </div>
                  </td>
                  <!-- Settlement -->
                  <td class="h-[44px] px-[12px] py-[8px] align-middle border-b border-r border-[#e5e6ea]">
                    <span class="text-[13px] font-normal text-[#03102f] leading-[1.5] whitespace-nowrap">{{ loc.settlement }}</span>
                  </td>
                  <!-- Status: dot + colored label for requested rows (Figma: 2236:75489) -->
                  <td class="h-[44px] px-[12px] py-[8px] align-middle border-b border-[#e5e6ea]">
                    <span v-if="loc.status" class="flex items-center gap-[8px]">
                      <span class="size-[5px] rounded-full" :style="{ background: STATUS_META[loc.status].color }" />
                      <span class="text-[12px] font-medium leading-[1.5] whitespace-nowrap" :style="{ color: STATUS_META[loc.status].color }">{{ STATUS_META[loc.status].label }}</span>
                    </span>
                    <button
                      v-else
                      type="button"
                      class="flex items-center justify-center h-[28px] px-[8px] rounded-[8px] border border-[#f2f2f4] transition-[filter] duration-150 hover:brightness-95 active:translate-y-[1px]"
                      style="background: linear-gradient(to bottom, #ffffff, #f2f2f2); box-shadow: 0px 1.5px 0px 0px rgba(0,0,0,0.1);"
                      @click.stop="requestLocation = loc"
                    >
                      <span class="text-[12px] font-medium text-[#61667c] leading-[1.5] whitespace-nowrap" style="text-shadow: 0px 1px 1px rgba(0,0,0,0.08);">Request Account</span>
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

    </div>

    <!-- Click-outside backdrop: anywhere off the drawer closes it -->
    <div v-if="detailLocation" class="absolute inset-0 z-40" @click="detailLocation = null" />

    <!-- Off-canvas detail view (Figma: 2239:103156) — same recipe as the settings drawer -->
    <Transition name="drawer">
      <div
        v-if="detailLocation"
        class="absolute inset-y-0 right-0 z-50 w-[480px] max-w-full bg-white flex flex-col"
        style="box-shadow: -8px 0px 28px rgba(38,42,50,0.12);"
      >
        <!-- Header: flag + country -->
        <div class="shrink-0 flex items-center gap-[32px] border-b border-[#e5e6ea] p-[16px]">
          <div class="flex-1 flex items-center gap-[8px] min-w-0">
            <img :src="detailLocation.flag" width="24" height="16" alt="" class="shrink-0 rounded-[1px]" style="box-shadow: 0px 0px 0px 0.5px rgba(3,16,47,0.08);" />
            <p class="font-medium text-[18px] text-[#03102f] leading-[1.35] truncate">{{ detailLocation.name }}</p>
            <!-- Active accounts carry the status in the header (Figma: 2236:85958) -->
            <span v-if="detailLocation.status === 'active'" class="flex items-center gap-[6px] shrink-0 pl-[2px]">
              <span class="size-[5px] rounded-full bg-[#238b5b]" />
              <span class="text-[12px] font-medium text-[#238b5b] leading-[1.5] whitespace-nowrap">Active</span>
            </span>
          </div>
          <button class="flex items-center justify-center size-[32px] rounded-[4px] shrink-0 transition-colors duration-150 hover:bg-[#f0f1f5]" aria-label="Close" @click="detailLocation = null">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M5 5L15 15M15 5L5 15" stroke="#61667c" stroke-width="1.6" stroke-linecap="round" /></svg>
          </button>
        </div>

        <!-- Body -->
        <div class="flex-1 overflow-y-auto flex flex-col gap-[16px] px-[16px] py-[16px]">

          <!-- Active account: details list replaces the preview card (Figma: 2236:85958) -->
          <div v-if="detailLocation.status === 'active'" class="flex flex-col gap-[12px]">
            <div class="flex items-center justify-between gap-[16px]">
              <p class="text-[16px] font-medium text-[#03102f] leading-[1.4]">Account details</p>
              <button
                type="button"
                class="flex items-center justify-center gap-[6px] h-[28px] px-[8px] rounded-[8px] border border-[#f2f2f4] transition-[filter] duration-150 hover:brightness-95 active:translate-y-[1px]"
                style="background: linear-gradient(to bottom, #ffffff, #f2f2f2); box-shadow: 0px 1.5px 0px 0px rgba(0,0,0,0.1);"
                @click="copyDetailsAsMessage"
              >
                <img :src="copyIcon" width="14" height="14" alt="" class="shrink-0" />
                <span class="text-[12px] font-medium text-[#61667c] leading-[1.5] whitespace-nowrap" style="text-shadow: 0px 1px 1px rgba(0,0,0,0.08);">{{ detailsCopied ? 'Copied!' : 'Copy as message' }}</span>
              </button>
            </div>
            <div class="flex flex-col gap-[4px]">
              <div
                v-for="f in activeFields"
                :key="f.label"
                class="relative flex flex-col gap-[2px] rounded-[8px] border border-[#e5e6ea] bg-white px-[12px] py-[9px]"
              >
                <span class="text-[12px] font-normal text-[#61667c] leading-[1.5]">{{ f.label }}</span>
                <span class="text-[14px] font-normal text-[#03102f] leading-[1.5]">{{ f.value }}</span>
                <button
                  type="button"
                  class="absolute right-[12px] top-[9px] flex items-center justify-center cursor-pointer hover:opacity-70 transition-opacity"
                  :aria-label="'Copy ' + f.label"
                  @click="copyField(f)"
                >
                  <img :src="copyIcon" width="14" height="14" alt="" />
                  <Transition name="copy-tip">
                    <span
                      v-if="copiedField === f.label"
                      class="absolute right-0 bottom-[calc(100%+6px)] px-[8px] py-[4px] rounded-[4px] bg-[#fcfcfd] text-[12px] font-medium text-[#61667c] leading-[1.5] whitespace-nowrap pointer-events-none z-10"
                      style="box-shadow: 0px 1px 3px 0px rgba(0,0,0,0.1), 0px 3px 22px 0px rgba(38,42,50,0.09);"
                    >Copied!</span>
                  </Transition>
                </button>
              </div>
            </div>
            <button
              type="button"
              class="self-center flex items-center gap-[6px] h-[28px] cursor-pointer hover:opacity-75 transition-opacity"
              @click="router.push('/transactions')"
            >
              <span class="text-[13px] font-medium text-[#2465de] leading-[1.5] whitespace-nowrap">View transactions</span>
              <svg class="shrink-0" width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M2.5 8h11M9.5 4l4 4-4 4" stroke="#2465de" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" /></svg>
            </button>
          </div>

          <!-- Account preview card — exact 300×176 layout from Figma (2239:101723) -->
          <div v-else class="flex flex-col items-center gap-[12px]">
            <div class="va-card-ring" :class="{ 'va-card-ring--on': detailLocation.status === 'processing' }">
            <div
              class="relative w-[300px] h-[176px] rounded-[12px] overflow-hidden border"
              :class="detailLocation.status === 'rejected' ? 'bg-[#fdf2f2] border-[#e08790]' : 'bg-[#f6f6f5] border-white'"
            >
              <!-- Ellipses 42/43: #D4DADA at 25% — the overlap doubles the tint (Figma: 2239:101906/101914) -->
              <span class="absolute rounded-full" :class="detailLocation.status === 'rejected' ? 'bg-[#e08790]/20' : 'bg-[#d4dada]/25'" style="width: 270px; height: 271px; left: -105px; top: 64px;" />
              <span class="absolute rounded-full" :class="detailLocation.status === 'rejected' ? 'bg-[#e08790]/20' : 'bg-[#d4dada]/25'" style="width: 270px; height: 271px; left: 126px; top: 64px;" />
              <div class="absolute left-[16px] top-[16px] flex items-center gap-[4px]">
                <img :src="virtualAccountIcon" width="18" height="18" alt="" class="shrink-0 opacity-85" />
                <span class="text-[12px] font-normal text-[#61667c] leading-[1.5] whitespace-nowrap">Virtual account</span>
              </div>
              <span class="absolute right-[16px] top-[12px] flex items-center gap-[8px] h-[24px]">
                <span class="size-[5px] rounded-full" :style="{ background: detailStatus.color }" />
                <span class="text-[12px] font-medium leading-[1.5] whitespace-nowrap" :style="{ color: detailStatus.color }">{{ detailStatus.label }}</span>
              </span>
              <div class="absolute left-[18px] top-[108px] flex flex-col gap-[4px]">
                <span class="text-[12px] font-normal text-[#61667c] leading-[1.5]">Account name</span>
                <span
                  class="text-[14px] font-medium text-[#4a4f63] leading-[1.5]"
                  :class="detailLocation.status === 'active' ? '' : 'select-none'"
                  :style="detailLocation.status === 'active' ? {} : { filter: 'blur(5px)' }"
                  :aria-hidden="detailLocation.status !== 'active'"
                >1111 2222 3333 4444</span>
              </div>
            </div>
            </div>
            <p v-if="detailLocation.status === 'processing'" class="w-full text-[12px] font-normal text-[#bd8400] leading-[1.5] text-center">
              We're reviewing your {{ detailLocation.name }} account request with the selected provider. This usually takes 1–2 business days, and we'll email you once it's approved.
            </p>
            <!-- Rejected: error snackbar (Figma: 2239:112747) -->
            <div
              v-else-if="detailLocation.status === 'rejected'"
              class="w-full rounded-[8px] border border-[#f1b8bd] bg-[#fbeaea] px-[12px] py-[8px]"
            >
              <p class="text-[12px] font-normal text-[#03102f] leading-[1.5] text-center">
                This request was rejected. Contact
                <a href="mailto:support@hit-pay.com" class="underline" style="text-underline-position: from-font;">support@hit-pay.com</a>
                to find out what went wrong.
              </p>
            </div>
            <button
              v-else
              type="button"
              class="flex items-center justify-center h-[28px] px-[12px] rounded-[8px] border border-[#2465de] transition-[filter] duration-150 hover:brightness-105 active:translate-y-[1px]"
              style="background: linear-gradient(to bottom, #4179e2, #1f5bcc); box-shadow: 0px 1.5px 0px 0px #1d5fd9;"
              @click="requestLocation = detailLocation"
            >
              <span class="text-[12px] font-medium text-white leading-[1.5] whitespace-nowrap" style="text-shadow: 0px 1px 1px rgba(0,0,0,0.12);">Request {{ detailLocation.name }} Account</span>
            </button>
          </div>

          <!-- How customer pay you -->
          <div class="flex flex-col gap-[12px] rounded-[12px] border border-[#e5e6ea] p-[12px]">
            <span class="text-[10px] font-medium uppercase tracking-[0.3px] text-[#61667c] leading-[18px]">How customer pay you</span>
            <div class="flex flex-col gap-[12px]">
              <div v-for="rail in detailLocation.rails" :key="rail.name" class="flex flex-col gap-[4px]">
                <p class="text-[12px] font-medium text-[#03102f] leading-[1.5]">{{ rail.tier }} — {{ rail.name }}</p>
                <p class="text-[12px] font-normal text-[#61667c] leading-[1.5]">{{ rail.desc }}</p>
              </div>
            </div>
          </div>

          <!-- Supported currencies -->
          <div class="flex flex-col gap-[12px] rounded-[12px] border border-[#e5e6ea] p-[12px]">
            <span class="text-[10px] font-medium uppercase tracking-[0.3px] text-[#61667c] leading-[18px]">Supported currencies ({{ detailLocation.currencies.length }})</span>
            <div class="flex items-center gap-[2px] flex-wrap">
              <span
                v-for="c in detailLocation.currencies"
                :key="c"
                class="inline-flex items-center justify-center min-h-[24px] min-w-[32px] px-[8px] py-[2px] rounded-[24px] bg-[#e5eeff] text-[12px] font-medium text-[#2465de] leading-[1.5] whitespace-nowrap"
              >{{ c }}</span>
            </div>
          </div>

        </div>
      </div>
    </Transition>

    <!-- Request account modal (Figma: 2240:130402) -->
    <RequestAccountModal
      :open="!!requestLocation"
      :location="requestLocation"
      @close="requestLocation = null"
      @submit="onRequestSubmitted"
    />
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { useRouter } from 'vue-router'
import VaGlobeAnimation from '../content/VaGlobeAnimation.vue'
import RequestAccountModal from '../modals/RequestAccountModal.vue'
import flagSg from '../../assets/images/flag-sg.png'
import flagIn from '../../assets/images/flag-in.png'
import flagAu from '../../assets/images/flag-au.png'
import flagPh from '../../assets/images/flag-ph.png'
import flagEu from '../../assets/images/flag-eu.png'
import flagUs from '../../assets/images/flag-us.png'
import virtualAccountIcon from '../../assets/icons/icon-virtual-account.svg'
import copyIcon from '../../assets/icons/icon-copy.svg'

// Intro banner dismisses via the hover Close button (resets on reload — prototype only)
const bannerVisible = ref(true)

const columns = ['Bank location', 'Currency', 'Settlement', 'Status']

// Requested-location statuses: dot + colored label (Figma: 2236:75489)
const STATUS_META = {
  active: { label: 'Active', color: '#238b5b' },
  processing: { label: 'Processing', color: '#bd8400' },
  rejected: { label: 'Rejected', color: '#c20a1c' },
}

const locations = reactive([
  {
    name: 'Singapore', flag: flagSg, status: 'active', currencies: ['SGD', 'AUD', 'CAD', 'EUR', 'GBP', 'HKD', 'NZD', 'CHF', 'USD'], settlement: 'FAST, SWIFT',
    account: { name: 'HitPay Store', number: '8855891210891', swift: 'DBSSSGSG', bank: 'DBS Bank', location: 'Singapore', address: '123 Orchard Road, Singapore 238888' },
    rails: [
      { tier: 'Local', name: 'FAST', desc: 'Real-time local transfers within Singapore, 24/7.' },
      { tier: 'International', name: 'SWIFT', desc: 'Receive from anywhere in the world in 9 currencies.' },
    ],
    providers: [
      { name: 'Banking Circle', settles: 'Settles in 0–2 business days', rails: ['FAST', 'SWIFT'] },
      { name: 'DBS Bank', settles: 'Settles in 0–2 business days', rails: ['FAST'] },
    ],
  },
  {
    name: 'India', flag: flagIn, status: 'processing', currencies: ['INR'], settlement: 'IMPS, NEFT, RTGS',
    rails: [
      { tier: 'Local', name: 'IMPS', desc: 'Instant local transfers within India, 24/7.' },
      { tier: 'Local', name: 'NEFT', desc: 'Batched local transfers within India, settled in hours.' },
      { tier: 'Local', name: 'RTGS', desc: 'High-value local transfers within India, settled in real time.' },
    ],
    providers: [
      { name: 'Union Bank', settles: 'Settles in 0–2 business days', rails: ['IMPS', 'NEFT', 'RTGS'] },
    ],
  },
  {
    name: 'Australia', flag: flagAu, status: 'rejected', currencies: ['AUD'], settlement: 'NPP, BECS, SWIFT',
    rails: [
      { tier: 'Local', name: 'NPP', desc: 'Real-time local transfers within Australia, 24/7.' },
      { tier: 'Local', name: 'BECS', desc: 'Batch local transfers within Australia, settled same day.' },
      { tier: 'International', name: 'SWIFT', desc: 'Receive from anywhere in the world in 1 currency.' },
    ],
    providers: [
      { name: 'Banking Circle', settles: 'Settles in 0–2 business days', rails: ['NPP', 'BECS', 'SWIFT'] },
    ],
  },
  {
    name: 'Philippines', flag: flagPh, currencies: ['PHP'], settlement: 'INSTAPAY, PESONET',
    rails: [
      { tier: 'Local', name: 'INSTAPAY', desc: 'Real-time local transfers within the Philippines, 24/7.' },
      { tier: 'Local', name: 'PESONET', desc: 'Batch local transfers within the Philippines, settled same day.' },
    ],
    providers: [
      { name: 'Union Bank', settles: 'Settles in 0–2 business days', rails: ['INSTAPAY', 'PESONET'] },
      { name: 'Netbank', settles: 'Settles in 0–2 business days', rails: ['INSTAPAY'] },
    ],
  },
  {
    name: 'Europe', flag: flagEu, currencies: ['GBP', 'EUR'], settlement: 'FPS, CHAPS, SEPA, SWIFT',
    rails: [
      { tier: 'Local', name: 'FPS', desc: 'Real-time local transfers within Europe, 24/7.' },
      { tier: 'Local', name: 'CHAPS', desc: 'Same-day, high-value local transfers within Europe.' },
      { tier: 'Regional', name: 'SEPA', desc: 'Transfers across the Single Euro Payments Area, settled within hours.' },
      { tier: 'International', name: 'SWIFT', desc: 'Receive from anywhere in the world in 2 currencies.' },
    ],
    providers: [
      { name: 'Banking Circle', settles: 'Settles in 0–2 business days', rails: ['FPS', 'CHAPS', 'SEPA', 'SWIFT'] },
      { name: 'Union Bank', settles: 'Settles in 0–2 business days', rails: ['SEPA', 'SWIFT'] },
    ],
  },
  {
    name: 'United States', flag: flagUs, currencies: ['USD'], settlement: 'ACH, FEDWIRE',
    rails: [
      { tier: 'Local', name: 'ACH', desc: 'Batch local transfers within the United States, settled in 1–2 days.' },
      { tier: 'Local', name: 'FEDWIRE', desc: 'Same-day, high-value local transfers within the United States.' },
    ],
    providers: [
      { name: 'Banking Circle', settles: 'Settles in 0–2 business days', rails: ['ACH', 'FEDWIRE'] },
      { name: 'Community Federal Savings Bank', settles: 'Settles in 0–2 business days', rails: ['ACH'] },
    ],
  },
])

// ── Off-canvas detail view (Figma: 2239:103156) ──
const detailLocation = ref(null)

// Card chip: the location's status, or Available when not yet requested
const detailStatus = computed(() =>
  STATUS_META[detailLocation.value?.status] || { label: 'Available', color: '#002771' },
)

// ── Active account details (Figma: 2236:85958) ──
const router = useRouter()

const activeFields = computed(() => {
  const a = detailLocation.value?.account
  if (!a) return []
  return [
    { label: 'Account name', value: a.name },
    { label: 'Account number', value: a.number },
    { label: 'SWIFT / BIC', value: a.swift },
    { label: 'Bank name', value: a.bank },
    { label: 'Location', value: a.location },
    { label: 'Address', value: a.address },
  ]
})

const copiedField = ref(null)
const detailsCopied = ref(false)
let fieldTimer = null
let detailsTimer = null

function copyField(f) {
  navigator.clipboard?.writeText(f.value).catch(() => {})
  copiedField.value = f.label
  clearTimeout(fieldTimer)
  fieldTimer = setTimeout(() => { copiedField.value = null }, 1600)
}

function copyDetailsAsMessage() {
  const message = activeFields.value.map((f) => `${f.label}: ${f.value}`).join('\n')
  navigator.clipboard?.writeText(message).catch(() => {})
  detailsCopied.value = true
  clearTimeout(detailsTimer)
  detailsTimer = setTimeout(() => { detailsCopied.value = false }, 1600)
}

// ── Request account modal (Figma: 2240:130402) ──
const requestLocation = ref(null)

// Submitted requests flip the location into the processing state (Figma: 2236:90943)
function onRequestSubmitted({ location }) {
  const loc = locations.find((l) => l.name === location)
  if (loc) loc.status = 'processing'
}
</script>

<style scoped>
/* Copied! tooltip on the account detail fields */
.copy-tip-enter-active { transition: opacity 140ms ease-out, transform 140ms ease-out; }
.copy-tip-leave-active { transition: opacity 100ms ease-in; }
.copy-tip-enter-from { opacity: 0; transform: translateY(2px); }
.copy-tip-leave-to { opacity: 0; }

/* Processing card: thin 1px gold border with a rotating sweep (Figma: 2236:91351) */
.va-card-ring {
  position: relative;
  padding: 1px;
  border-radius: 13px;
  overflow: hidden;
}
.va-card-ring--on::before {
  content: '';
  position: absolute;
  left: 50%;
  top: 50%;
  width: 420px;
  height: 420px;
  margin: -210px 0 0 -210px;
  background: conic-gradient(
    from 0deg,
    transparent 0deg,
    rgba(189, 132, 0, 0.15) 20deg,
    #e2b13c 42deg,
    #bd8400 55deg,
    rgba(189, 132, 0, 0.15) 78deg,
    transparent 100deg
  );
  animation: va-ring-spin 3.2s linear infinite;
}
.va-card-ring--on::after {
  /* Static gold outline under the sweep, matching the design's thin border */
  content: '';
  position: absolute;
  inset: 0;
  border-radius: 13px;
  border: 1px solid rgba(189, 132, 0, 0.25);
}
.va-card-ring > div { position: relative; z-index: 1; }
@keyframes va-ring-spin {
  to { transform: rotate(360deg); }
}

@media (prefers-reduced-motion: reduce) {
  .va-card-ring--on::before { animation: none; background: rgba(189, 132, 0, 0.45); }
  .copy-tip-enter-active, .copy-tip-leave-active { transition: none; }
  .copy-tip-enter-from { transform: none; }
}

/* Slide-over drawer — same motion as the settings drawer */
.drawer-enter-active { transition: transform 280ms cubic-bezier(0.4, 0, 0.2, 1); }
.drawer-leave-active { transition: transform 200ms cubic-bezier(0.4, 0, 0.2, 1); }
.drawer-enter-from,
.drawer-leave-to { transform: translateX(100%); }

@media (prefers-reduced-motion: reduce) {
  .drawer-enter-active, .drawer-leave-active { transition: none; }
}
</style>
