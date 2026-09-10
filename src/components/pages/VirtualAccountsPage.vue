<template>
  <div class="relative bg-white flex flex-col h-full w-full overflow-y-auto overflow-x-hidden">
    <div class="flex flex-1 flex-col items-start w-full pt-[4px]">

      <!-- Page title + actions -->
      <div class="flex h-[60px] items-center justify-between gap-[32px] px-[24px] w-full shrink-0">
        <p class="font-medium text-[18px] text-[#03102f] leading-[1.35] whitespace-nowrap">Virtual Accounts</p>
        <div class="flex items-center gap-[8px] shrink-0">
          <button
            type="button"
            class="flex items-center justify-center gap-[8px] h-[36px] px-[12px] rounded-[8px] border border-[#f2f2f4] transition-[filter] duration-150 hover:brightness-95 active:translate-y-[1px]"
            style="background: linear-gradient(to bottom, #ffffff, #f2f2f2); box-shadow: 0px 1.5px 0px 0px #e5e5e5;"
          >
            <img :src="receiptIcon" width="16" height="16" alt="" class="shrink-0" />
            <span class="text-[14px] font-medium text-[#61667c] leading-[1.5] whitespace-nowrap" style="text-shadow: 0px 1px 1px rgba(0,0,0,0.08);">Create invoice</span>
          </button>
          <button
            type="button"
            class="flex items-center justify-center gap-[8px] h-[36px] px-[12px] rounded-[8px] border border-[#f2f2f4] transition-[filter] duration-150 hover:brightness-95 active:translate-y-[1px]"
            style="background: linear-gradient(to bottom, #ffffff, #f2f2f2); box-shadow: 0px 1.5px 0px 0px #e5e5e5;"
          >
            <img :src="downloadIcon" width="16" height="16" alt="" class="shrink-0" />
            <span class="text-[14px] font-medium text-[#61667c] leading-[1.5] whitespace-nowrap" style="text-shadow: 0px 1px 1px rgba(0,0,0,0.08);">Download PDF</span>
          </button>
        </div>
      </div>

      <!-- Transfer details card -->
      <div class="w-full px-[24px] pb-[12px]">
        <div class="w-full rounded-[8px]">
          <div class="bg-[#fcfcfd] border border-[#e5e6ea] rounded-t-[8px] p-[12px]">
            <div class="flex flex-wrap gap-x-[12px] gap-y-[16px] p-[12px]">
              <div v-for="d in details" :key="d.label" class="flex flex-col gap-[2px] w-[244px]">
                <div class="flex items-center gap-[4px]">
                  <span class="text-[14px] font-normal text-[#61667c] leading-[1.5] whitespace-nowrap">{{ d.label }}</span>
                  <img v-if="d.hint" :src="questionIcon" width="14" height="14" alt="" class="shrink-0" />
                </div>
                <!-- Chip values (currencies / transfer types) -->
                <div v-if="d.chips" class="flex items-start gap-[2px] pt-[2px]">
                  <span
                    v-for="chip in d.chips"
                    :key="chip"
                    class="inline-flex items-center justify-center min-h-[24px] min-w-[32px] px-[8px] py-[2px] rounded-[24px] bg-[#e5eeff] text-[12px] font-medium text-[#2465de] leading-[1.5] whitespace-nowrap"
                  >{{ chip }}</span>
                </div>
                <!-- Text value + copy -->
                <div v-else class="flex items-center gap-[8px]">
                  <span class="text-[14px] font-normal text-[#03102f] leading-[1.5]">{{ d.value }}</span>
                  <button
                    type="button"
                    class="relative flex items-center justify-center shrink-0 cursor-pointer hover:opacity-70 transition-opacity"
                    :aria-label="'Copy ' + d.label"
                    @click="copy(d)"
                  >
                    <img :src="copyIcon" width="14" height="14" alt="" />
                    <Transition name="copy-tip">
                      <span
                        v-if="copiedKey === d.label"
                        class="absolute left-1/2 -translate-x-1/2 bottom-[calc(100%+6px)] px-[8px] py-[4px] rounded-[4px] bg-[#fcfcfd] text-[12px] font-medium text-[#61667c] leading-[1.5] whitespace-nowrap pointer-events-none"
                        style="box-shadow: 0px 1px 3px 0px rgba(0,0,0,0.1), 0px 3px 22px 0px rgba(38,42,50,0.09);"
                      >Copied!</span>
                    </Transition>
                  </button>
                </div>
              </div>
            </div>
          </div>
          <!-- Share via + Copy as message (Figma: 2214:13510) -->
          <div class="flex items-center justify-between gap-[16px] bg-white border-b border-l border-r border-[#e5e6ea] rounded-b-[8px] px-[24px] py-[8px]">
            <div class="flex items-center gap-[16px]">
              <span class="text-[14px] font-normal text-[#03102f] leading-[1.5] whitespace-nowrap">Share via</span>
              <div class="flex items-center gap-[4px]">
                <div v-for="channel in channels" :key="channel.label" class="relative">
                  <button
                    type="button"
                    class="flex items-center justify-center p-[8px] rounded-[8px] hover:bg-[#f2f2f4] transition-colors duration-150"
                    :aria-label="'Share via ' + channel.label"
                    @mouseenter="hoveredChannel = channel.label"
                    @mouseleave="hoveredChannel = null"
                    @focus="hoveredChannel = channel.label"
                    @blur="hoveredChannel = null"
                  >
                    <img :src="channel.icon" width="18" height="18" alt="" />
                  </button>
                  <!-- Bottom tooltip (Figma: 2214:12474) -->
                  <Transition name="share-tooltip">
                    <span
                      v-if="hoveredChannel === channel.label"
                      class="absolute left-1/2 -translate-x-1/2 top-[calc(100%+8px)] px-[8px] py-[4px] rounded-[4px] bg-[#fcfcfd] text-[12px] font-medium text-[#61667c] leading-[1.5] whitespace-nowrap pointer-events-none z-10"
                      style="box-shadow: 0px 1px 3px 0px rgba(0,0,0,0.1), 0px 3px 22px 0px rgba(38,42,50,0.09);"
                      role="tooltip"
                    >
                      <img :src="tooltipArrowIcon" width="12" height="8" alt="" class="absolute left-1/2 -translate-x-1/2 top-[-7px] max-w-none" />
                      {{ channel.label }}
                    </span>
                  </Transition>
                </div>
              </div>
            </div>
            <button
              type="button"
              class="flex items-center justify-center gap-[8px] h-[36px] rounded-[8px] cursor-pointer hover:opacity-75 transition-opacity duration-150"
              @click="copyAsMessage"
            >
              <img :src="copyBlueIcon" width="16" height="16" alt="" class="shrink-0" />
              <span class="text-[14px] font-medium text-[#2465de] leading-[1.5] whitespace-nowrap">{{ messageCopied ? 'Copied!' : 'Copy as message' }}</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Received transfers -->
      <div class="flex flex-col gap-[16px] w-full px-[24px] pt-[12px] pb-[12px]">
        <p class="text-[16px] font-medium text-[#03102f] leading-[1.4]">Received transfers</p>

        <!-- Table card -->
        <div class="w-full rounded-[8px] border border-[#e5e6ea] overflow-hidden bg-white">

          <!-- Toolbar: segmented controls + search / filter -->
          <div class="flex items-center justify-between gap-[8px] min-h-[44px] px-[12px] py-[8px] bg-white border-b-[0.5px] border-[#cbcdd4]">
            <div class="flex items-start gap-[4px] shrink-0">
              <button
                v-for="t in tabs"
                :key="t"
                type="button"
                class="flex items-center justify-center min-w-[48px] px-[8px] py-[4px] rounded-[8px] text-[12px] leading-[1.5] whitespace-nowrap transition-colors duration-150"
                :class="activeTab === t ? 'bg-[#e5e6ea] font-medium text-[#03102f]' : 'font-normal text-[#61667c] hover:bg-[#f6f7f9]'"
                @click="activeTab = t"
              >{{ t }}</button>
            </div>
            <div class="flex items-center justify-end gap-[8px] flex-1 min-w-0">
              <!-- Expanding search (Figma: Action Search Open=True) -->
              <template v-if="searchOpen">
                <div class="flex items-center gap-[8px] h-[28px] max-w-[311px] flex-1 min-w-0 px-[8px] rounded-[8px] bg-white border border-[#e5e6ea]" style="box-shadow: 0px 0px 0px 3px #e5e6ea;">
                  <svg class="shrink-0" width="14" height="14" viewBox="0 0 16 16" fill="none"><circle cx="7" cy="7" r="4.5" stroke="#61667c" stroke-width="1.4" /><path d="M10.5 10.5L14 14" stroke="#61667c" stroke-width="1.4" stroke-linecap="round" /></svg>
                  <input
                    ref="searchInput"
                    v-model="search"
                    type="text"
                    placeholder="Search something here"
                    class="flex-1 min-w-0 bg-transparent border-none outline-none text-[13px] leading-[1.5] text-[#03102f] placeholder:text-[#9295a5]"
                    @keydown.esc="closeSearch"
                  />
                </div>
                <button
                  type="button"
                  class="text-[13px] font-medium text-[#61667c] leading-[1.5] whitespace-nowrap px-[4px] cursor-pointer hover:opacity-75 transition-opacity"
                  @click="closeSearch"
                >Clear</button>
              </template>
              <button
                v-else
                type="button"
                class="flex items-center justify-center size-[28px] rounded-[8px] border border-[#f2f2f4] shrink-0 transition-[filter] duration-150 hover:brightness-95 active:translate-y-[1px]"
                style="background: linear-gradient(to bottom, #ffffff, #f2f2f2); box-shadow: 0px 1.5px 0px 0px #e5e5e5;"
                aria-label="Search"
                @click="openSearch"
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="7" cy="7" r="4.5" stroke="#61667c" stroke-width="1.4" /><path d="M10.5 10.5L14 14" stroke="#61667c" stroke-width="1.4" stroke-linecap="round" /></svg>
              </button>
              <button
                type="button"
                class="flex items-center justify-center size-[28px] rounded-[8px] border border-[#f2f2f4] shrink-0 transition-[filter] duration-150 hover:brightness-95 active:translate-y-[1px]"
                style="background: linear-gradient(to bottom, #ffffff, #f2f2f2); box-shadow: 0px 1.5px 0px 0px #e5e5e5;"
                aria-label="Filter"
              >
                <img :src="filterIcon" width="16" height="16" alt="" />
              </button>
            </div>
          </div>

          <!-- Table -->
          <div class="w-full overflow-x-auto">
            <table class="w-full border-collapse min-w-[720px]" style="table-layout: fixed;">
              <colgroup>
                <col style="width: 155px;" />
                <col style="width: 170px;" />
                <col />
                <col style="width: 140px;" />
              </colgroup>
              <thead>
                <tr>
                  <th
                    v-for="(col, ci) in columns"
                    :key="col.key"
                    class="bg-[#fcfcfd] h-[34px] border-b border-[#e5e6ea] px-[12px] py-[8px] text-left align-middle"
                    :class="ci < columns.length - 1 ? 'border-r border-[#e5e6ea]' : ''"
                  >
                    <div class="flex items-center gap-[8px]">
                      <span class="flex-1 min-w-px text-[10px] font-medium uppercase tracking-[0.3px] leading-[18px] text-[#03102f] whitespace-nowrap overflow-hidden text-ellipsis">{{ col.label }}</span>
                      <svg v-if="col.sortable" class="shrink-0" width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M7 2.9v8.2M3.8 7.9L7 11.1l3.2-3.2" stroke="#61667c" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round" /></svg>
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="t in filteredTransfers"
                  :key="t.id"
                  class="transition-colors duration-150 hover:bg-[#fcfcfd] [&:last-child>td]:border-b-0"
                >
                  <!-- Date -->
                  <td class="h-[44px] px-[12px] py-[8px] align-middle border-b border-r border-[#e5e6ea]">
                    <span class="text-[13px] text-[#03102f] leading-[1.4] whitespace-nowrap" style="font-family: 'Reddit Mono', ui-monospace, monospace;">{{ t.date }}</span>
                  </td>
                  <!-- Amount -->
                  <td class="h-[44px] px-[12px] py-[8px] align-middle border-b border-r border-[#e5e6ea]">
                    <span class="text-[13px] font-semibold text-[#03102f] leading-[1.4] whitespace-nowrap" style="font-family: 'Reddit Mono', ui-monospace, monospace;">{{ t.amount }}</span>
                  </td>
                  <!-- Payer reference -->
                  <td class="h-[44px] px-[12px] py-[8px] align-middle border-b border-r border-[#e5e6ea]">
                    <p class="text-[13px] font-normal text-[#03102f] leading-[1.5] whitespace-nowrap overflow-hidden text-ellipsis">{{ t.reference }}</p>
                  </td>
                  <!-- Status -->
                  <td class="h-[44px] px-[12px] py-[8px] align-middle border-b border-[#e5e6ea]">
                    <span
                      class="inline-flex items-center justify-center min-h-[24px] min-w-[32px] px-[8px] py-[2px] rounded-[24px] text-[12px] font-medium leading-[1.5] whitespace-nowrap"
                      :style="{ background: STATUS[t.status].bg, color: STATUS[t.status].color }"
                    >{{ STATUS[t.status].label }}</span>
                  </td>
                </tr>
                <tr v-if="!filteredTransfers.length">
                  <td :colspan="columns.length" class="h-[88px] px-[12px] text-center align-middle">
                    <span class="text-[13px] font-normal text-[#61667c] leading-[1.5]">No transfers match your search</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Pagination -->
        <div class="flex items-center justify-between w-full px-[12px] shrink-0">
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
          <div class="flex items-center gap-[8px] h-[36px] w-[167px] px-[8px] rounded-[8px] border border-[#e5e6ea] bg-white cursor-pointer">
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
import { ref, computed, nextTick } from 'vue'
import receiptIcon from '../../assets/icons/icon-receipt.svg'
import downloadIcon from '../../assets/icons/icon-download.svg'
import filterIcon from '../../assets/icons/icon-filter.svg'
import copyIcon from '../../assets/icons/icon-copy.svg'
import questionIcon from '../../assets/icons/icon-question-circle.svg'
import copyBlueIcon from '../../assets/icons/icon-copy-blue.svg'
import tooltipArrowIcon from '../../assets/icons/icon-tooltip-arrow.svg'
import whatsappIcon from '../../assets/icons/icon-share-whatsapp.svg'
import chatIcon from '../../assets/icons/icon-share-chat.svg'
import emailIcon from '../../assets/icons/icon-share-email.svg'

// ── Transfer details (Figma: 2203:12844) ──
const details = [
  { label: 'Bank name', value: 'DBS Bank' },
  { label: 'Account name', value: 'HitPay Pte Ltd - MER12345' },
  { label: 'Account number', value: '123-456-7890' },
  { label: 'SWIFT/BIC', value: 'DBSSSGSG' },
  { label: 'Address', value: '1 Raffles Place, #01-01, Singapore 048616', hint: true },
  { label: 'Supported currencies', chips: ['SGD', 'USD', 'EUR'] },
  { label: 'Supported transfer types', chips: ['FAST', 'SWIFT'] },
]

// ── Share via + Copy as message (Figma: 2214:13510) ──
const channels = [
  { label: 'WhatsApp', icon: whatsappIcon },
  { label: 'SMS', icon: chatIcon },
  { label: 'Email', icon: emailIcon },
]

const hoveredChannel = ref(null)
const messageCopied = ref(false)
let messageTimer = null

// Only the text details go into the message, not the currency/transfer-type chips
function copyAsMessage() {
  const message = details.filter((d) => d.value).map((d) => `${d.label}: ${d.value}`).join('\n')
  navigator.clipboard?.writeText(message).catch(() => {})
  messageCopied.value = true
  clearTimeout(messageTimer)
  messageTimer = setTimeout(() => { messageCopied.value = false }, 1600)
}

const copiedKey = ref(null)
let copyTimer = null

function copy(d) {
  navigator.clipboard?.writeText(d.value).catch(() => {})
  copiedKey.value = d.label
  clearTimeout(copyTimer)
  copyTimer = setTimeout(() => { copiedKey.value = null }, 1600)
}

// ── Received transfers table ──
const tabs = ['All', 'Completed', 'Pending', 'Failed']
const activeTab = ref('All')

const columns = [
  { key: 'date', label: 'Date', sortable: true },
  { key: 'amount', label: 'Amount', sortable: true },
  { key: 'reference', label: 'Payer reference', sortable: false },
  { key: 'status', label: 'Status', sortable: false },
]

const STATUS = {
  completed: { label: 'Completed', bg: '#e6f9f0', color: '#238b5b' },
  pending: { label: 'Pending', bg: '#fff9ec', color: '#bd8400' },
  failed: { label: 'Failed', bg: '#f9e9e9', color: '#c20a1c' },
}

const transfers = [
  { id: 1, date: '31 Dec 2024', amount: 'SGD 2,345.67', reference: 'Consulting Fee', status: 'completed' },
  { id: 2, date: '30 Nov 2024', amount: 'SGD 3,456.78', reference: 'Monthly Subscription', status: 'pending' },
  { id: 3, date: '29 Oct 2024', amount: 'SGD 4,567.89', reference: 'Payment for Services', status: 'completed' },
  { id: 4, date: '28 Sep 2024', amount: 'SGD 5,678.90', reference: 'Project Payment', status: 'completed' },
  { id: 5, date: '27 Aug 2024', amount: 'SGD 6,789.01', reference: 'Consulting Fee', status: 'failed' },
  { id: 6, date: '26 Jul 2024', amount: 'SGD 7,890.12', reference: 'Monthly Subscription', status: 'completed' },
  { id: 7, date: '25 Jun 2024', amount: 'SGD 8,901.23', reference: 'Payment for Services', status: 'pending' },
  { id: 8, date: '24 May 2024', amount: 'SGD 9,012.34', reference: 'Project Payment', status: 'completed' },
  { id: 9, date: '23 Apr 2024', amount: 'SGD 10,123.45', reference: 'Consulting Fee', status: 'completed' },
  { id: 10, date: '22 Mar 2024', amount: 'SGD 11,234.56', reference: 'Monthly Subscription', status: 'completed' },
]

// ── Search (Figma: Action Search) ──
const searchOpen = ref(false)
const search = ref('')
const searchInput = ref(null)

function openSearch() {
  searchOpen.value = true
  nextTick(() => searchInput.value?.focus())
}

function closeSearch() {
  search.value = ''
  searchOpen.value = false
}

const filteredTransfers = computed(() => {
  let list = transfers
  if (activeTab.value !== 'All') list = list.filter((t) => STATUS[t.status].label === activeTab.value)
  const q = search.value.trim().toLowerCase()
  if (q) list = list.filter((t) => [t.date, t.amount, t.reference].some((v) => v.toLowerCase().includes(q)))
  return list
})
</script>

<style scoped>
/* Copied! tooltip — same motion recipe as the row menus */
.copy-tip-enter-active { transition: opacity 140ms ease-out, transform 140ms ease-out; }
.copy-tip-leave-active { transition: opacity 100ms ease-in; }
.copy-tip-enter-from { opacity: 0; transform: translateX(-50%) translateY(2px); }
.copy-tip-leave-to { opacity: 0; }

/* Share-channel tooltip — slides down into place */
.share-tooltip-enter-active { transition: opacity 140ms ease-out, transform 140ms ease-out; }
.share-tooltip-leave-active { transition: opacity 100ms ease-in; }
.share-tooltip-enter-from { opacity: 0; transform: translateX(-50%) translateY(-2px); }
.share-tooltip-leave-to { opacity: 0; }

@media (prefers-reduced-motion: reduce) {
  .copy-tip-enter-active, .copy-tip-leave-active { transition: none; }
  .copy-tip-enter-from { transform: translateX(-50%); }
  .share-tooltip-enter-active, .share-tooltip-leave-active { transition: none; }
  .share-tooltip-enter-from { transform: translateX(-50%); }
}
</style>
