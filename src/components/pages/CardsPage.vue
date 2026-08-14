<template>
  <div class="relative bg-white flex flex-col h-full w-full overflow-x-hidden" :class="createCardOpen ? 'overflow-y-hidden' : 'overflow-y-auto'">
    <div class="flex flex-1 flex-col items-start w-full pt-[4px]">

      <!-- Page title + actions -->
      <div class="flex h-[60px] items-center justify-between gap-[32px] px-[24px] w-full shrink-0">
        <p class="font-medium text-[18px] text-[#03102f] leading-[1.35] whitespace-nowrap">Cards</p>
        <button
          type="button"
          class="flex items-center justify-center gap-[8px] h-[36px] px-[12px] rounded-[8px] border border-[#2465de] transition-[filter] duration-150 hover:brightness-105 active:translate-y-[1px]"
          style="background: linear-gradient(to bottom, #4179e2, #1f5bcc); box-shadow: 0px 1.5px 0px 0px #1d5fd9;"
          @click="createCardOpen = true"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 3.5v9M3.5 8h9" stroke="#fff" stroke-width="1.5" stroke-linecap="round" /></svg>
          <span class="text-[14px] font-medium text-white leading-[1.5] whitespace-nowrap" style="text-shadow: 0px 1px 1px rgba(0,0,0,0.12);">Create card</span>
        </button>
      </div>

      <Transition name="cards-fade" mode="out-in">

      <!-- Empty state (Figma: 266:18620) -->
      <div v-if="isEmpty" key="empty" class="bg-white flex flex-1 flex-col gap-[40px] items-center justify-center min-h-[600px] px-[24px] py-[12px] w-full">

        <!-- Paper card — hovering fans the card stack out (Figma: 75:15391) -->
        <div
          class="empty-hero bg-white border border-[#e5e6ea] flex flex-col items-center justify-end p-[32px] rounded-[12px] shrink-0 w-full max-w-[900px]"
          style="filter: drop-shadow(0px 16px 16px rgba(0,0,0,0.05));"
        >
          <div class="flex gap-[24px] items-center justify-center w-full shrink-0">

            <!-- Left: copy + CTA -->
            <div class="flex flex-1 flex-col gap-[24px] items-start justify-center min-w-px">
              <div class="flex flex-col gap-[8px] items-start w-full shrink-0">
                <p class="font-medium text-[18px] text-[#03102f] leading-[1.35] w-full">Spend management</p>
                <p class="font-normal text-[16px] text-[#61667c] leading-[1.4] w-full">You can pay your vendors and suppliers directly from HitPay using the HitPay balance</p>
              </div>
              <div class="flex items-start justify-center pt-[12px] shrink-0">
                <button
                  type="button"
                  class="flex items-center justify-center h-[36px] px-[12px] rounded-[8px] border border-[#2465de] transition-[filter] duration-150 hover:brightness-105 active:translate-y-[1px]"
                  style="background: linear-gradient(to bottom, #4179e2, #1f5bcc); box-shadow: 0px 1.5px 0px 0px #1d5fd9;"
                  @click="createCardOpen = true"
                >
                  <span class="text-[14px] font-medium text-white leading-[1.5] whitespace-nowrap" style="text-shadow: 0px 1px 1px rgba(0,0,0,0.12);">Create your first card</span>
                </button>
              </div>
            </div>

            <!-- Right: floating card illustration (Figma: 266:18956) -->
            <div class="relative hidden md:block w-[411px] h-[184px] shrink-0 overflow-hidden rounded-[8px]">
              <!-- Blurred backdrop crossfades to the warm/mint variant on hover (Figma: 75:15400) -->
              <img :src="emptyBlurImg" alt="" aria-hidden="true" class="empty-blur empty-blur--idle absolute pointer-events-none select-none max-w-none" style="width: 820px; height: 590px; left: -115px; top: -96px;" />
              <img :src="emptyBlurHoverImg" alt="" aria-hidden="true" class="empty-blur empty-blur--hover absolute pointer-events-none select-none max-w-none" style="width: 820px; height: 590px; left: -115px; top: -96px;" />
              <!-- Back cards — tucked behind the front card, fan out on hover (Figma: 75:15404) -->
              <div
                v-for="fan in ['empty-fan--a', 'empty-fan--b']"
                :key="fan"
                class="empty-fan absolute left-1/2 top-[48px] w-[144px] h-[88px] bg-white rounded-[10px] border border-white"
                :class="fan"
                style="box-shadow: 0px 1px 2px 0px rgba(0,0,0,0.05), 0px 5px 24px 0px rgba(38,42,50,0.06);"
              >
                <img :src="emptyLogoImg" alt="" class="absolute left-[7px] top-[7px]" width="23" height="15" />
                <img :src="emptyChipImg" alt="" class="absolute right-[7px] top-[7px]" width="19" height="14" />
                <div class="absolute left-[7px] top-[53px] w-[86px] h-[5px] rounded-full bg-[#61667c]" />
                <div class="absolute left-[7px] top-[66px] w-[23px] h-[5px] rounded-full bg-[#e5e6ea]" />
                <div class="absolute left-[33px] top-[66px] w-[23px] h-[5px] rounded-full bg-[#e5e6ea]" />
                <div class="absolute left-[59px] top-[66px] w-[23px] h-[5px] rounded-full bg-[#e5e6ea]" />
              </div>

              <!-- Card with a gradient border that circles around it (Figma: 266:18994) -->
              <div
                class="card-ring absolute left-1/2 -translate-x-1/2 top-[48px] w-[147px] h-[91px] rounded-[11.5px] overflow-hidden"
                style="box-shadow: 0px 1px 2px 0px rgba(0,0,0,0.05), 0px 5px 24px 0px rgba(38,42,50,0.06);"
              >
                <div class="card-ring__spin absolute left-1/2 top-1/2" aria-hidden="true" />
                <div class="absolute inset-[1.5px] bg-white rounded-[10px]">
                  <img :src="emptyLogoImg" alt="" class="absolute left-[7px] top-[7px]" width="23" height="15" />
                  <img :src="emptyChipImg" alt="" class="absolute right-[7px] top-[7px]" width="19" height="14" />
                  <div class="absolute left-[7px] top-[53px] w-[86px] h-[5px] rounded-full bg-[#61667c]" />
                  <div class="absolute left-[7px] top-[66px] w-[23px] h-[5px] rounded-full bg-[#e5e6ea]" />
                  <div class="absolute left-[33px] top-[66px] w-[23px] h-[5px] rounded-full bg-[#e5e6ea]" />
                  <div class="absolute left-[59px] top-[66px] w-[23px] h-[5px] rounded-full bg-[#e5e6ea]" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- How it works — same recipe as BillsPage -->
        <div class="flex flex-col gap-[16px] items-center pb-[24px] shrink-0 w-full max-w-[1084px]">
          <div class="flex items-center justify-center px-[32px] w-full shrink-0">
            <p class="flex-1 font-medium text-[16px] text-[#03102f] text-center leading-[1.4] min-w-px">How it works</p>
          </div>
          <div class="flex h-[158px] items-start w-full max-w-[960px] px-[2px] rounded-[8px] border border-[#e5e6ea] shrink-0">
            <div
              v-for="(step, i) in steps"
              :key="step.title"
              class="flex flex-1 h-full items-start min-w-px overflow-hidden pt-[32px] pb-[8px] px-[32px]"
              :class="i < steps.length - 1 ? 'border-r border-[#e5e6ea]' : ''"
            >
              <div class="flex flex-1 flex-col gap-[12px] items-start min-w-px">
                <div class="bg-[#f5f6f9] flex flex-col items-center justify-center p-[8px] rounded-[8px] shrink-0 size-[38px]">
                  <p class="font-medium text-[16px] text-[#03102f] text-center leading-[1.4] w-full">{{ i + 1 }}</p>
                </div>
                <div class="flex flex-col gap-[2px] items-start w-full shrink-0">
                  <p class="font-medium text-[14px] text-[#000501] leading-[1.5]">{{ step.title }}</p>
                  <p class="font-normal text-[12px] text-[#61667c] opacity-75 leading-[1.5] w-full">{{ step.desc }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>

      <!-- Content -->
      <div v-else key="filled" class="flex flex-col gap-[24px] w-full px-[24px] pt-[12px] pb-[12px]">

        <!-- Table card -->
        <div class="w-full rounded-[8px] border border-[#e5e6ea] overflow-hidden bg-white">

          <!-- Toolbar: segmented controls + search / filter -->
          <div class="flex items-center justify-between gap-[8px] h-[44px] px-[12px] py-[8px] bg-white border-b-[0.5px] border-[#cbcdd4]">
            <div class="flex items-start gap-[4px]">
              <button
                v-for="t in tabs"
                :key="t"
                type="button"
                class="flex items-center justify-center min-w-[48px] px-[8px] py-[4px] rounded-[8px] text-[12px] leading-[1.5] whitespace-nowrap transition-colors duration-150"
                :class="activeTab === t ? 'bg-[#e5e6ea] font-medium text-[#03102f]' : 'font-normal text-[#61667c] hover:bg-[#f6f7f9]'"
                @click="activeTab = t"
              >{{ t }}</button>
            </div>
            <div class="flex items-center gap-[8px] shrink-0">
              <button
                type="button"
                class="flex items-center justify-center size-[28px] rounded-[8px] border border-[#f2f2f4] shrink-0 transition-[filter] duration-150 hover:brightness-95 active:translate-y-[1px]"
                style="background: linear-gradient(to bottom, #ffffff, #f2f2f2); box-shadow: 0px 1.5px 0px 0px #e5e5e5;"
                aria-label="Search"
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="7" cy="7" r="4.5" stroke="#61667c" stroke-width="1.4" /><path d="M10.5 10.5L14 14" stroke="#61667c" stroke-width="1.4" stroke-linecap="round" /></svg>
              </button>
              <button
                type="button"
                class="flex items-center justify-center size-[28px] rounded-[8px] border border-[#f2f2f4] shrink-0 transition-[filter] duration-150 hover:brightness-95 active:translate-y-[1px]"
                :class="filterOpen ? 'brightness-95' : ''"
                style="background: linear-gradient(to bottom, #ffffff, #f2f2f2); box-shadow: 0px 1.5px 0px 0px #e5e5e5;"
                aria-label="Filter"
                @click.stop="toggleFilter"
              >
                <img :src="filterIcon" width="16" height="16" alt="" />
              </button>
            </div>
          </div>

          <!-- Applied filters (Figma: Search for chips) -->
          <div v-if="filterChips.length" class="flex items-center flex-wrap gap-[8px] px-[12px] py-[8px] bg-white border-b-[0.5px] border-[#cbcdd4]">
            <span class="text-[12px] font-normal text-[#61667c] leading-[1.5] whitespace-nowrap">Search for:</span>
            <span
              v-for="chip in filterChips"
              :key="chip.key"
              class="inline-flex items-center gap-[6px] min-h-[24px] px-[8px] py-[2px] rounded-[24px] bg-[#f2f2f4] text-[12px] font-medium text-[#484d61] leading-[1.5] whitespace-nowrap"
            >
              {{ chip.label }}
              <button type="button" class="flex items-center justify-center shrink-0 cursor-pointer hover:opacity-70 transition-opacity" :aria-label="'Remove ' + chip.label" @click="removeChip(chip)">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><circle cx="7" cy="7" r="5.6" stroke="#9295a5" stroke-width="1.1" /><path d="M5.2 5.2l3.6 3.6M8.8 5.2l-3.6 3.6" stroke="#9295a5" stroke-width="1.1" stroke-linecap="round" /></svg>
              </button>
            </span>
            <button type="button" class="text-[12px] font-medium text-[#2465de] leading-[1.5] whitespace-nowrap px-[4px] cursor-pointer hover:opacity-75 transition-opacity" @click="clearFilters">Clear all</button>
          </div>

          <!-- Table -->
          <div class="w-full overflow-x-auto">
            <table class="w-full border-collapse min-w-[640px]" style="table-layout: fixed;">
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
                  v-for="card in filteredCards"
                  :key="card.id"
                  class="cursor-pointer transition-colors duration-150 hover:bg-[#fcfcfd] [&:last-child>td]:border-b-0"
                  @click="viewCard(card)"
                >
                  <!-- Nickname -->
                  <td class="h-[44px] px-[12px] py-[8px] align-middle border-b border-r border-[#e5e6ea]">
                    <div class="flex items-center gap-[8px]">
                      <span class="flex items-center justify-center w-[23.33px] h-[16px] rounded-[4px] bg-white shrink-0" style="box-shadow: 0px 0px 0px 0.5px #e5e6ea;">
                        <img :src="mastercardLogo" width="15" height="9" alt="Mastercard" />
                      </span>
                      <p class="text-[13px] font-normal text-[#03102f] leading-[1.5] whitespace-nowrap overflow-hidden text-ellipsis">{{ card.nickname }}</p>
                    </div>
                  </td>
                  <!-- Card holder -->
                  <td class="h-[44px] px-[12px] py-[8px] align-middle border-b border-r border-[#e5e6ea]">
                    <p class="text-[13px] font-normal text-[#03102f] leading-[1.5] whitespace-nowrap overflow-hidden text-ellipsis">{{ card.holder }}</p>
                  </td>
                  <!-- Spent this month -->
                  <td class="h-[44px] px-[12px] py-[8px] align-middle border-b border-r border-[#e5e6ea]">
                    <span class="text-[13px] font-semibold text-[#03102f] leading-[1.4] whitespace-nowrap" style="font-family: 'Reddit Mono', ui-monospace, monospace;">{{ card.spent }}</span>
                  </td>
                  <!-- Status -->
                  <td class="h-[44px] px-[12px] py-[8px] align-middle border-b border-[#e5e6ea]">
                    <span
                      class="inline-flex items-center justify-center min-h-[24px] min-w-[32px] px-[8px] py-[2px] rounded-[24px] text-[12px] font-medium leading-[1.5] whitespace-nowrap"
                      :style="{ background: STATUS[card.status].bg, color: STATUS[card.status].color }"
                    >{{ STATUS[card.status].label }}</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

      </div>
      </Transition>
    </div>

    <!-- Floating preview switcher: empty state ↔ cards list (same recipe as BillsPage) -->
    <div
      v-if="!createCardOpen"
      class="fixed bottom-6 left-1/2 -translate-x-1/2 z-[60] flex items-center gap-[4px] p-[4px] rounded-full bg-white border border-[#e5e6ea]"
      style="box-shadow: 0px 8px 24px rgba(3,16,47,0.16);"
    >
      <span class="px-[8px] text-[11px] font-medium text-[#8093b8] select-none">Preview</span>
      <button
        type="button"
        class="px-[12px] h-[28px] rounded-full text-[12px] font-medium transition-colors duration-150"
        :class="isEmpty ? 'bg-[#2465de] text-white' : 'text-[#61667c] hover:bg-[#f0f1f5]'"
        @click="isEmpty = true"
      >Empty state</button>
      <button
        type="button"
        class="px-[12px] h-[28px] rounded-full text-[12px] font-medium transition-colors duration-150"
        :class="!isEmpty ? 'bg-[#2465de] text-white' : 'text-[#61667c] hover:bg-[#f0f1f5]'"
        @click="isEmpty = false"
      >With cards</button>
    </div>

    <!-- Create card page — fills the main content area so the sidebar stays visible -->
    <Transition name="full-page">
      <CreateCardPage v-if="createCardOpen" @close="createCardOpen = false" @create="onCardCreated" />
    </Transition>

    <!-- Filter popover (Figma: Cards filter) -->
    <Teleport to="body">
      <div v-if="filterOpen" class="fixed inset-0 z-40" @click="filterOpen = false" />
      <Transition name="filter-pop">
        <div
          v-if="filterOpen"
          class="fixed z-50 w-[290px] rounded-[8px] bg-white flex flex-col gap-[12px] p-[12px]"
          style="box-shadow: 0px 1px 3px 0px rgba(0,0,0,0.1), 0px 3px 22px 0px rgba(38,42,50,0.09);"
          :style="{ left: filterPos.left + 'px', top: filterPos.top + 'px' }"
        >
          <!-- Card holder (multi — DES-912 feedback) -->
          <div class="flex flex-col gap-[4px]">
            <span class="text-[12px] font-medium text-[#61667c] leading-[1.5]">Card holder (Staff)</span>
            <MultiSelect v-model="draft.holders" :options="holders" placeholder="Select staff" />
          </div>

          <!-- Status (multi) -->
          <div class="flex flex-col gap-[4px]">
            <span class="text-[12px] font-medium text-[#61667c] leading-[1.5]">Status</span>
            <MultiSelect v-model="draft.statuses" :options="statusOptions" placeholder="All statuses" :searchable="false" />
          </div>

          <!-- Date created -->
          <div class="flex flex-col gap-[4px]">
            <span class="text-[12px] font-medium text-[#61667c] leading-[1.5]">Date created</span>
            <div class="flt-control gap-[6px] px-[8px]">
              <img :src="calendarIcon" width="16" height="16" alt="" class="shrink-0" />
              <input v-model="draft.dateFrom" type="text" placeholder="Start date" class="flt-input min-w-0 flex-1" />
              <span class="text-[12px] text-[#9295a5] shrink-0">To</span>
              <input v-model="draft.dateTo" type="text" placeholder="End date" class="flt-input min-w-0 flex-1" />
            </div>
          </div>

          <!-- Amount -->
          <div class="flex flex-col gap-[4px]">
            <span class="text-[12px] font-medium text-[#61667c] leading-[1.5]">Amount</span>
            <div class="flex items-center gap-[8px]">
              <div class="flt-control flt-control--half gap-[4px] px-[8px]">
                <span class="text-[14px] text-[#9295a5] shrink-0">From:</span>
                <input v-model="draft.amountFrom" type="text" placeholder="200" class="flt-input min-w-0 flex-1" />
              </div>
              <div class="flt-control flt-control--half gap-[4px] px-[8px]">
                <span class="text-[14px] text-[#9295a5] shrink-0">To:</span>
                <input v-model="draft.amountTo" type="text" placeholder="1,500" class="flt-input min-w-0 flex-1" />
              </div>
            </div>
          </div>

          <!-- Actions -->
          <div class="flex items-center gap-[8px] pt-[4px]">
            <button
              type="button"
              class="flex-1 flex items-center justify-center h-[36px] px-[12px] rounded-[8px] border border-[#f2f2f4] text-[14px] font-medium text-[#61667c] transition-[filter] duration-150 hover:brightness-95 active:translate-y-[1px]"
              style="background: linear-gradient(to bottom, #ffffff, #f2f2f2); box-shadow: 0px 1.5px 0px 0px #e5e5e5; text-shadow: 0px 1px 1px rgba(0,0,0,0.08);"
              @click="filterOpen = false"
            >Cancel</button>
            <button
              type="button"
              class="flex-1 flex items-center justify-center h-[36px] px-[12px] rounded-[8px] border border-[#2465de] text-[14px] font-medium text-white transition-[filter] duration-150 hover:brightness-105 active:translate-y-[1px]"
              style="background: linear-gradient(to bottom, #4179e2, #1f5bcc); box-shadow: 0px 1.5px 0px 0px #1d5fd9; text-shadow: 0px 1px 1px rgba(0,0,0,0.12);"
              @click="applyFilters"
            >Apply</button>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- Success snackbar (Figma: Snackbar/Default) -->
    <Teleport to="body">
      <div class="fixed top-[24px] inset-x-0 z-[80] flex justify-center pointer-events-none">
        <Transition name="snackbar">
          <div
            v-if="toast"
            class="flex items-center gap-[8px] p-[12px] rounded-[8px] bg-[#e6f9f0] border border-[#b3eed2] pointer-events-auto"
            style="filter: drop-shadow(0px 8px 6px rgba(42,50,82,0.04));"
          >
            <img :src="snackbarCheckIcon" width="24" height="24" alt="" class="shrink-0" />
            <span class="text-[14px] font-normal text-[#03102f] leading-[1.5] whitespace-nowrap">{{ toast }}</span>
          </div>
        </Transition>
      </div>
    </Teleport>

  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { cards, addCard, pendingToast } from '../../composables/useCards.js'
import calendarIcon from '../../assets/icons/icon-calendar.svg'
import CreateCardPage from './CreateCardPage.vue'
import MultiSelect from '../forms/MultiSelect.vue'
import mastercardLogo from '../../assets/icons/logo-mastercard.svg'
import filterIcon from '../../assets/icons/icon-filter.svg'
import snackbarCheckIcon from '../../assets/icons/icon-snackbar-check.svg'
import emptyBlurImg from '../../assets/images/cards-empty-blur.svg'
import emptyBlurHoverImg from '../../assets/images/cards-empty-blur-hover.svg'
import emptyChipImg from '../../assets/images/cards-empty-chip.svg'
import emptyLogoImg from '../../assets/images/cards-empty-logo.svg'

// Preview switcher: true = empty/onboarding state, false = cards list (Figma: 266:18620)
const isEmpty = ref(true)

const steps = [
  { title: 'Upload invoice', desc: 'Upload a file or enter detail manually' },
  { title: 'Review and approve', desc: 'Route bill for approve if required' },
  { title: 'Pay or schedule', desc: 'Pay instantly or set future date' },
]

// Toolbar segmented controls — canceled cards only show under their own tab,
// which only appears once at least one card has been canceled
const tabs = computed(() =>
  cards.some((c) => c.status === 'canceled') ? ['All', 'Frozen', 'Canceled'] : ['All', 'Frozen'],
)
const activeTab = ref('All')

const columns = [
  { key: 'nickname', label: 'Nickname', sortable: true },
  { key: 'holder', label: 'Card holder', sortable: true },
  { key: 'spent', label: 'Spent this month', sortable: true },
  { key: 'status', label: 'Status', sortable: false },
]

const STATUS = {
  active: { label: 'Active', bg: '#e6f9f0', color: '#238b5b' },
  frozen: { label: 'Frozen', bg: '#f2f2f4', color: '#484d61' },
  canceled: { label: 'Canceled', bg: '#f9e9e9', color: '#c20a1c' },
}

const filteredCards = computed(() => {
  let list
  if (activeTab.value === 'Frozen') list = cards.filter((c) => c.status === 'frozen')
  else if (activeTab.value === 'Canceled') list = cards.filter((c) => c.status === 'canceled')
  else list = cards.filter((c) => c.status !== 'canceled')

  const f = appliedFilters.value
  if (!f) return list
  if (f.holders.length) list = list.filter((c) => f.holders.includes(c.holder))
  if (f.statuses.length) list = list.filter((c) => f.statuses.includes(c.status))
  const from = parseAmount(f.amountFrom)
  const to = parseAmount(f.amountTo)
  if (from != null) list = list.filter((c) => c.stats.monthlySpent >= from)
  if (to != null) list = list.filter((c) => c.stats.monthlySpent <= to)
  return list
})

// ── Filter popover (Figma: Cards filter) ──
const filterOpen = ref(false)
const filterPos = ref({ left: 0, top: 0 })
const statusMenuOpen = ref(false)

const emptyFilters = () => ({ holders: [], statuses: [], dateFrom: '', dateTo: '', amountFrom: '', amountTo: '' })
const draft = reactive(emptyFilters())
const appliedFilters = ref(null)

const holders = computed(() => [...new Set(cards.map((c) => c.holder))])
const statusOptions = Object.entries(STATUS).map(([value, meta]) => ({ value, label: meta.label, dot: meta.color }))

function parseAmount(v) {
  const n = parseFloat(String(v).replace(/[^0-9.]/g, ''))
  return Number.isFinite(n) && String(v).trim() !== '' ? n : null
}

function toggleFilter(event) {
  if (filterOpen.value) {
    filterOpen.value = false
    return
  }
  const rect = event.currentTarget.getBoundingClientRect()
  filterPos.value = { left: rect.right - 290, top: rect.bottom + 4 }
  statusMenuOpen.value = false
  filterOpen.value = true
}

function applyFilters() {
  const hasAny = draft.holders.length || draft.statuses.length || draft.dateFrom || draft.dateTo || draft.amountFrom || draft.amountTo
  appliedFilters.value = hasAny ? { ...draft, holders: [...draft.holders], statuses: [...draft.statuses] } : null
  filterOpen.value = false
  statusMenuOpen.value = false
}

const filterChips = computed(() => {
  const f = appliedFilters.value
  if (!f) return []
  const chips = []
  if (f.holders.length) chips.push({ key: 'holders', label: `Card holder: ${f.holders.join(', ')}` })
  if (f.statuses.length) chips.push({ key: 'statuses', label: `Status: ${f.statuses.map((s) => STATUS[s].label).join(', ')}` })
  if (f.dateFrom || f.dateTo) chips.push({ key: 'date', label: `Date created: ${f.dateFrom || '…'} - ${f.dateTo || '…'}` })
  if (f.amountFrom || f.amountTo) chips.push({ key: 'amount', label: `Amount: ${f.amountFrom || '0'} - ${f.amountTo || '∞'}` })
  return chips
})

function removeChip(chip) {
  const f = { ...appliedFilters.value, holders: [...appliedFilters.value.holders], statuses: [...appliedFilters.value.statuses] }
  if (chip.key === 'holders') f.holders = []
  else if (chip.key === 'statuses') f.statuses = []
  else if (chip.key === 'date') { f.dateFrom = ''; f.dateTo = '' }
  else if (chip.key === 'amount') { f.amountFrom = ''; f.amountTo = '' }
  const hasAny = f.holders.length || f.statuses.length || f.dateFrom || f.dateTo || f.amountFrom || f.amountTo
  appliedFilters.value = hasAny ? f : null
  Object.assign(draft, f, { holders: [...f.holders], statuses: [...f.statuses] })
}

function clearFilters() {
  appliedFilters.value = null
  Object.assign(draft, emptyFilters(), { holders: [], statuses: [] })
}

// Row click → card details page
const router = useRouter()
function viewCard(card) {
  router.push({ path: '/cards/details', query: { id: card.id } })
}

// Create card full-page overlay
const createCardOpen = ref(false)

// New card lands in the table; snackbar confirms and fades after a moment
const toast = ref('')
let toastTimer = null

function onCardCreated({ nickname, holder, number }) {
  addCard({ nickname, holder, number })
  createCardOpen.value = false
  isEmpty.value = false // a card now exists — show the list
  showToast(`${nickname} has been created successfully`)
}

function showToast(message) {
  toast.value = message
  clearTimeout(toastTimer)
  toastTimer = setTimeout(() => { toast.value = '' }, 3000)
}

// Arriving with a queued message (e.g. after cancelling a card) shows it here
onMounted(() => {
  if (pendingToast.value) {
    showToast(pendingToast.value)
    pendingToast.value = ''
  }
})

onUnmounted(() => clearTimeout(toastTimer))
</script>

<style scoped>
/* ── Filter popover controls (Figma: Input / State=Default) ── */
.flt-control {
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
  height: 36px;
  background: white;
  border: 1px solid #e5e6ea;
  border-radius: 8px;
  box-shadow: 0px 1px 3px 0px rgba(0, 0, 0, 0.04), 0px 1.5px 1.5px 0px rgba(0, 0, 0, 0.09);
  transition: border-color 150ms ease, box-shadow 150ms ease;
}
.flt-control--half {
  width: auto;
  flex: 1;
  min-width: 0;
}
.flt-control:focus-within {
  border-color: #2465de;
  box-shadow: 0px 0px 0px 3px #b3cdfe, inset 0px 2px 4px 0px rgba(0, 0, 0, 0.24);
}
.flt-select {
  appearance: none;
  -webkit-appearance: none;
  width: 100%;
  height: 100%;
  background: transparent;
  border: none;
  outline: none;
  padding: 0 32px 0 8px;
  font-size: 14px;
  line-height: 1.5;
  color: #03102f;
  cursor: pointer;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
}
.flt-select.flt-placeholder { color: #9295a5; }
.flt-chevron {
  position: absolute;
  right: 8px;
  top: 50%;
  transform: translateY(-50%);
  pointer-events: none;
}
.flt-input {
  height: 100%;
  background: transparent;
  border: none;
  outline: none;
  font-size: 14px;
  line-height: 1.5;
  color: #03102f;
}
.flt-input::placeholder { color: #9295a5; }

/* Filter popover motion — same as the row menus */
.filter-pop-enter-active { transition: opacity 140ms ease-out, transform 140ms ease-out; transform-origin: top right; }
.filter-pop-leave-active { transition: opacity 100ms ease-in; transform-origin: top right; }
.filter-pop-enter-from { opacity: 0; transform: scale(0.96) translateY(-2px); }
.filter-pop-leave-to { opacity: 0; }

/* Create card full page: gentle rise + fade in, quicker fade out */
.full-page-enter-active {
  transition: opacity 400ms cubic-bezier(0.32, 0.72, 0, 1), transform 400ms cubic-bezier(0.32, 0.72, 0, 1);
  will-change: opacity, transform;
}
.full-page-leave-active {
  transition: opacity 220ms ease, transform 220ms ease;
  will-change: opacity, transform;
}
.full-page-enter-from { opacity: 0; transform: translateY(24px); }
.full-page-leave-to   { opacity: 0; transform: translateY(12px); }

/* Snackbar motion — same as the Approval Rules success snackbar */
/* Gradient ring circling the empty-state card — a conic gradient (coral →
   violet → blue, sampled from the design) on an oversized layer that rotates
   behind the white card face, leaving only the 1.5px rim visible */
.card-ring__spin {
  width: 220px;
  height: 220px;
  margin: -110px 0 0 -110px;
  background: conic-gradient(
    from 0deg,
    #ffffff 0deg,
    #ffffff 30deg,
    #f8837d 80deg,
    #e2a2ce 115deg,
    #8b93e6 145deg,
    #5b74e8 175deg,
    #ffffff 230deg,
    #ffffff 360deg
  );
  animation: card-ring-spin 5s linear infinite;
  will-change: transform;
}
@keyframes card-ring-spin {
  to { transform: rotate(360deg); }
}
@media (prefers-reduced-motion: reduce) {
  .card-ring__spin { animation: none; }
}

/* Blurred backdrop: grey-and-blue at rest, mint-and-amber on hover */
.empty-blur {
  transition: opacity 400ms ease;
}
.empty-blur--hover { opacity: 0; }
.empty-hero:hover .empty-blur--idle { opacity: 0; }
.empty-hero:hover .empty-blur--hover { opacity: 1; }

/* Back cards start hidden exactly behind the front card, then fan out on
   hover with the springy back-out curve (Figma: 75:15391 hover state) */
.empty-fan {
  transform: translateX(-50%);
  transition: transform 400ms cubic-bezier(0.34, 1.56, 0.64, 1);
  will-change: transform;
}
.empty-hero:hover .empty-fan--a {
  transform: translateX(calc(-50% - 9px)) translateY(-15px) rotate(-13.91deg);
}
.empty-hero:hover .empty-fan--b {
  transform: translateX(calc(-50% + 9px)) translateY(15px) rotate(13.95deg);
}
@media (prefers-reduced-motion: reduce) {
  .empty-fan { transition: none; }
}

/* Empty ↔ cards-list state swap (preview switcher, same as BillsPage) */
.cards-fade-enter-active { transition: opacity 220ms ease-out, transform 220ms ease-out; }
.cards-fade-leave-active { transition: opacity 130ms ease-in, transform 130ms ease-in; }
.cards-fade-enter-from { opacity: 0; transform: translateY(8px); }
.cards-fade-leave-to { opacity: 0; transform: translateY(-6px); }
@media (prefers-reduced-motion: reduce) {
  .cards-fade-enter-active, .cards-fade-leave-active { transition: none; }
  .cards-fade-enter-from, .cards-fade-leave-to { transform: none; }
}

.snackbar-enter-active { transition: opacity 200ms ease-out, transform 200ms ease-out; }
.snackbar-leave-active { transition: opacity 150ms ease-in, transform 150ms ease-in; }
.snackbar-enter-from,
.snackbar-leave-to { opacity: 0; transform: translateY(-16px); }

@media (prefers-reduced-motion: reduce) {
  .full-page-enter-active, .full-page-leave-active,
  .filter-pop-enter-active, .filter-pop-leave-active,
  .snackbar-enter-active, .snackbar-leave-active { transition: none; }
  .full-page-enter-from, .filter-pop-enter-from { transform: none; }
}
</style>
