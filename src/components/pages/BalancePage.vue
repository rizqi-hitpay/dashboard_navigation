<template>
  <div class="bg-white flex flex-col h-full w-full overflow-y-auto overflow-x-hidden">
    <div class="flex flex-1 flex-col items-start w-full pt-[4px]">

      <!-- Page title + actions -->
      <div class="flex h-[60px] items-center justify-between gap-[32px] px-[24px] w-full shrink-0">
        <p class="font-medium text-[18px] text-[#03102f] leading-[1.35] whitespace-nowrap">Card balance</p>
        <div class="flex items-center gap-[8px] shrink-0">
          <button
            type="button"
            class="flex items-center justify-center gap-[8px] h-[36px] px-[12px] rounded-[8px] border border-[#f2f2f4] transition-[filter] duration-150 hover:brightness-95 active:translate-y-[1px]"
            style="background: linear-gradient(to bottom, #ffffff, #f2f2f2); box-shadow: 0px 1.5px 0px 0px #e5e5e5;"
            @click="openTransfer"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M4.5 11.5l7-7M6 4.2h5.8V10" stroke="#61667c" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" /></svg>
            <span class="text-[14px] font-medium text-[#61667c] leading-[1.5] whitespace-nowrap" style="text-shadow: 0px 1px 1px rgba(0,0,0,0.08);">Transfer to HitPay</span>
          </button>
          <button
            type="button"
            class="flex items-center justify-center gap-[8px] h-[36px] px-[12px] rounded-[8px] border border-[#2465de] transition-[filter] duration-150 hover:brightness-105 active:translate-y-[1px]"
            style="background: linear-gradient(to bottom, #4179e2, #1f5bcc); box-shadow: 0px 1.5px 0px 0px #1d5fd9;"
            @click="fundOpen = true"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M11.5 4.5l-7 7M10 11.8H4.2V6" stroke="#fff" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" /></svg>
            <span class="text-[14px] font-medium text-white leading-[1.5] whitespace-nowrap" style="text-shadow: 0px 1px 1px rgba(0,0,0,0.12);">Fund</span>
          </button>
        </div>
      </div>

      <!-- Info cards -->
      <div class="flex items-start gap-[16px] px-[24px] w-full shrink-0">
        <div
          v-for="card in infoCards"
          :key="card.label"
          class="flex flex-col w-[250px] rounded-[8px] border border-[#e5e6ea] bg-white overflow-hidden"
        >
          <div class="px-[12px] py-[8px] border-b border-[#f2f2f4]">
            <p class="text-[13px] font-normal text-[#03102f] leading-[1.5] whitespace-nowrap">{{ card.label }}</p>
          </div>
          <div class="px-[12px] py-[10px]">
            <p class="text-[16px] font-semibold text-[#03102f] leading-[1.4] whitespace-nowrap" style="font-family: 'Reddit Mono', ui-monospace, monospace;">{{ card.value }}</p>
          </div>
        </div>
      </div>

      <!-- Content -->
      <div class="flex flex-col gap-[24px] w-full px-[24px] pt-[24px] pb-[12px]">

        <!-- Table card -->
        <div class="w-full rounded-[8px] border border-[#e5e6ea] overflow-hidden bg-white">

          <!-- Toolbar: inline filters + export (Figma: 88:14484, active state 151:36980) -->
          <div class="flex items-center justify-between gap-[8px] min-h-[44px] px-[12px] py-[8px] bg-white border-b-[0.5px] border-[#cbcdd4]">
            <div class="flex items-center gap-[8px] min-w-0">
              <!-- Type: select when empty, filled chip when applied -->
              <div v-if="!typeFilter" class="bal-control w-[150px] shrink-0">
                <select v-model="typeFilter" class="bal-select">
                  <option value="">All types</option>
                  <option value="funded">Funded from HitPay</option>
                  <option value="transferred">Transferred to HitPay</option>
                </select>
                <svg class="bal-chevron" width="16" height="16" viewBox="0 0 16 16" fill="none"><path fill-rule="evenodd" clip-rule="evenodd" d="M8.4714 10.4715C8.21107 10.7318 7.78893 10.7318 7.5286 10.4715L3.75736 6.7002C3.49701 6.43988 3.49701 6.01777 3.75736 5.75742C4.01771 5.49707 4.43982 5.49707 4.70017 5.75742L8 9.05727L11.2998 5.75742C11.5602 5.49707 11.9823 5.49707 12.2427 5.75742C12.503 6.01777 12.503 6.43988 12.2427 6.7002L8.4714 10.4715Z" fill="#61667C"/></svg>
              </div>
              <div v-else class="bal-control bal-chip w-[171px] shrink-0">
                <span class="bal-chip__label">{{ TYPE_LABELS[typeFilter] }}</span>
                <button type="button" class="bal-chip__clear" @click="typeFilter = ''">
                  <img :src="xCircleIcon" width="16" height="16" alt="Clear" />
                </button>
              </div>

              <!-- Date range: inputs until both dates set, then filled chip -->
              <div v-if="!dateActive" class="bal-control w-[250px] shrink-0 gap-[6px] px-[8px]">
                <img :src="calendarIcon" width="16" height="16" alt="" class="shrink-0" />
                <input v-model="dateFrom" type="text" placeholder="Start date" class="bal-input min-w-0 flex-1" @change="maybeApplyDates" @keyup.enter="maybeApplyDates" />
                <span class="text-[12px] text-[#9295a5] shrink-0">To</span>
                <input v-model="dateTo" type="text" placeholder="End date" class="bal-input min-w-0 flex-1" @change="maybeApplyDates" @keyup.enter="maybeApplyDates" />
              </div>
              <div v-else class="bal-control bal-chip w-[252px] shrink-0">
                <img :src="calendarIcon" width="16" height="16" alt="" class="shrink-0" />
                <span class="flex-1 min-w-0 text-center text-[13px] text-[#03102f] leading-[1.5] whitespace-nowrap overflow-hidden text-ellipsis">{{ dateFrom }}</span>
                <span class="text-[14px] text-[#61667c] leading-[1.5] shrink-0">To</span>
                <span class="flex-1 min-w-0 text-center text-[13px] text-[#03102f] leading-[1.5] whitespace-nowrap overflow-hidden text-ellipsis">{{ dateTo }}</span>
                <button type="button" class="bal-chip__clear" @click="clearDates">
                  <img :src="xCircleIcon" width="16" height="16" alt="Clear" />
                </button>
              </div>

              <!-- Actioned by: select when empty, filled chip when applied -->
              <div v-if="!actionedFilter" class="bal-control w-[170px] shrink-0">
                <select v-model="actionedFilter" class="bal-select">
                  <option value="">Actioned by all</option>
                  <option v-for="a in actionedOptions" :key="a" :value="a">{{ a }}</option>
                </select>
                <svg class="bal-chevron" width="16" height="16" viewBox="0 0 16 16" fill="none"><path fill-rule="evenodd" clip-rule="evenodd" d="M8.4714 10.4715C8.21107 10.7318 7.78893 10.7318 7.5286 10.4715L3.75736 6.7002C3.49701 6.43988 3.49701 6.01777 3.75736 5.75742C4.01771 5.49707 4.43982 5.49707 4.70017 5.75742L8 9.05727L11.2998 5.75742C11.5602 5.49707 11.9823 5.49707 12.2427 5.75742C12.503 6.01777 12.503 6.43988 12.2427 6.7002L8.4714 10.4715Z" fill="#61667C"/></svg>
              </div>
              <div v-else class="bal-control bal-chip w-[171px] shrink-0">
                <span class="bal-chip__label">Actioned by {{ actionedFilter }}</span>
                <button type="button" class="bal-chip__clear" @click="actionedFilter = ''">
                  <img :src="xCircleIcon" width="16" height="16" alt="Clear" />
                </button>
              </div>

              <!-- Clear all — only when something is applied -->
              <button v-if="anyFilterActive" type="button" class="bal-clear-all shrink-0" @click="clearAllFilters">Clear all</button>
            </div>
            <button
              type="button"
              class="flex items-center justify-center gap-[6px] h-[28px] px-[8px] rounded-[8px] border border-[#f2f2f4] shrink-0 transition-[filter] duration-150 hover:brightness-95 active:translate-y-[1px]"
              style="background: linear-gradient(to bottom, #ffffff, #f2f2f2); box-shadow: 0px 1.5px 0px 0px #e5e5e5;"
            >
              <img :src="downloadIcon" width="14" height="14" alt="" class="shrink-0" />
              <span class="text-[12px] font-medium text-[#61667c] leading-[1.5] whitespace-nowrap">Export</span>
            </button>
          </div>

          <!-- Table -->
          <div class="w-full overflow-x-auto">
            <table class="w-full border-collapse min-w-[900px]" style="table-layout: fixed;">
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
                  v-for="entry in filteredEntries"
                  :key="entry.id"
                  class="cursor-pointer transition-colors duration-150 hover:bg-[#fcfcfd] [&:last-child>td]:border-b-0"
                >
                  <!-- Date -->
                  <td class="h-[44px] px-[12px] py-[8px] align-middle border-b border-r border-[#e5e6ea]">
                    <span class="text-[13px] text-[#03102f] leading-[1.4] whitespace-nowrap" style="font-family: 'Reddit Mono', ui-monospace, monospace;">{{ entry.date }}</span>
                  </td>
                  <!-- Type -->
                  <td class="h-[44px] px-[12px] py-[8px] align-middle border-b border-r border-[#e5e6ea]">
                    <div class="flex items-center gap-[8px]">
                      <svg v-if="entry.type === 'funded'" class="shrink-0" width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="6.4" stroke="#238b5b" stroke-width="1.2" /><path d="M9.8 6.2l-3.6 3.6M9.4 9.8H6.2V6.6" stroke="#238b5b" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round" /></svg>
                      <svg v-else class="shrink-0" width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="6.4" stroke="#002771" stroke-width="1.2" /><path d="M6.2 9.8l3.6-3.6M6.6 6.2h3.2v3.2" stroke="#002771" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round" /></svg>
                      <p class="text-[13px] font-normal text-[#03102f] leading-[1.5] whitespace-nowrap overflow-hidden text-ellipsis">{{ entry.type === 'funded' ? 'Funded from HitPay' : 'Transferred to HitPay' }}</p>
                    </div>
                  </td>
                  <!-- Actioned by -->
                  <td class="h-[44px] px-[12px] py-[8px] align-middle border-b border-r border-[#e5e6ea]">
                    <p class="text-[13px] font-normal text-[#03102f] leading-[1.5] whitespace-nowrap overflow-hidden text-ellipsis">{{ entry.actionedBy }}</p>
                  </td>
                  <!-- Amount -->
                  <td class="h-[44px] px-[12px] py-[8px] align-middle border-b border-[#e5e6ea]">
                    <span class="text-[13px] font-semibold text-[#03102f] leading-[1.4] whitespace-nowrap" style="font-family: 'Reddit Mono', ui-monospace, monospace;">{{ entry.amount }}</span>
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

    <!-- Transfer to HitPay Balance modal (Figma: 88:14872) -->
    <Teleport to="body">
      <Transition name="transfer-modal">
        <div v-if="transferOpen" class="fixed inset-0 z-[90] flex items-center justify-center p-[16px]">
          <div class="absolute inset-0" style="background: rgba(3,16,47,0.4); backdrop-filter: blur(6px);" @click="transferOpen = false" />
          <div
            class="transfer-modal__card relative bg-white rounded-[16px] w-[640px] max-w-full flex flex-col"
            style="box-shadow: 0px 3px 22px 0px rgba(38,42,50,0.09);"
          >
            <!-- Header -->
            <div class="flex items-start justify-between gap-[16px] p-[16px] border-b border-[#e5e6ea]">
              <p class="text-[16px] font-medium text-[#03102f] leading-[1.4] pt-[2px]">Transfer to HitPay Balance</p>
              <button type="button" class="flex items-center justify-center size-[32px] rounded-[4px] hover:bg-[#f0f1f5] transition-colors duration-150" aria-label="Close" @click="transferOpen = false">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M5.5 5.5l9 9m0-9l-9 9" stroke="#61667c" stroke-width="1.5" stroke-linecap="round" /></svg>
              </button>
            </div>

            <!-- Content -->
            <div class="flex flex-col gap-[16px] p-[24px]">
              <!-- Balances: card → hitpay -->
              <div class="relative flex items-stretch gap-[8px] w-full">
                <!-- Explicit half-widths (not flex-1): the right card's larger padding floor
                     would otherwise make it wider, pushing the gap off the arrow's center -->
                <div
                  class="flex w-[calc(50%-4px)] min-w-0 items-center gap-[12px] p-[12px] rounded-[12px] bg-white"
                  style="border: 3px solid #f2f2f4; box-shadow: 0px 3px 11px 0px rgba(38,42,50,0.09);"
                >
                  <div class="flex items-center justify-center shrink-0 size-[38px] rounded-full" style="background: rgba(36,101,222,0.1);">
                    <img :src="bankCardIcon" width="22" height="22" alt="" />
                  </div>
                  <div class="flex flex-col gap-[2px] min-w-0">
                    <p class="text-[10px] font-medium uppercase tracking-[0.3px] text-[#9295a5] leading-[18px] whitespace-nowrap">Card balance</p>
                    <p class="text-[18px] font-medium text-[#03102f] leading-[1.35] whitespace-nowrap overflow-hidden text-ellipsis" style="font-family: 'Reddit Mono', ui-monospace, monospace;">{{ fmtSGD(cardBalance) }}</p>
                  </div>
                </div>
                <div
                  class="flex w-[calc(50%-4px)] min-w-0 items-center gap-[12px] py-[12px] pl-[24px] pr-[12px] rounded-[12px] bg-white"
                  style="border: 3px solid #f2f2f4; box-shadow: 0px 3px 11px 0px rgba(38,42,50,0.09);"
                >
                  <div class="flex items-center justify-center shrink-0 size-[38px] rounded-full" style="background: rgba(0,39,113,0.04);">
                    <img :src="sgFlagIcon" width="22" height="16" alt="" class="rounded-[1px]" />
                  </div>
                  <div class="flex flex-col gap-[2px] min-w-0">
                    <p class="text-[10px] font-medium uppercase tracking-[0.3px] text-[#9295a5] leading-[18px] whitespace-nowrap">HitPay balance</p>
                    <p class="text-[18px] font-medium text-[#03102f] leading-[1.35] whitespace-nowrap overflow-hidden text-ellipsis" style="font-family: 'Reddit Mono', ui-monospace, monospace;">{{ fmtSGD(hitpayBalance) }}</p>
                  </div>
                </div>
                <div
                  class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center size-[36px] rounded-full bg-[#2465de]"
                  style="border: 3px solid #f2f2f4;"
                >
                  <img :src="arrowRightIcon" width="18" height="18" alt="" />
                </div>
              </div>

              <!-- Amount input + Max -->
              <div class="flex items-start gap-[8px] w-full">
                <div class="flex flex-1 min-w-0 flex-col gap-[4px]">
                  <p class="text-[12px] font-medium text-[#61667c] leading-[1.5]">Transfer from Merchant Card Balance to HitPay Balance</p>
                  <div class="transfer-amount flex items-center gap-[8px] h-[36px] px-[8px] w-full bg-white rounded-[8px]">
                    <div class="flex items-center self-stretch pr-[8px] border-r border-[#e5e6ea] shrink-0">
                      <span class="text-[12px] font-medium text-[#61667c] leading-[1.5] min-w-[24px]">SGD</span>
                    </div>
                    <input
                      v-model="transferAmount"
                      type="text"
                      inputmode="decimal"
                      placeholder="0.00"
                      class="flex-1 min-w-0 h-full bg-transparent border-none outline-none text-[14px] text-[#03102f] leading-[1.5] placeholder:text-[#9295a5]"
                    />
                  </div>
                </div>
                <div class="pt-[24px] shrink-0">
                  <button
                    type="button"
                    class="flex items-center justify-center h-[36px] px-[12px] rounded-[8px] border border-[#f2f2f4] transition-[filter] duration-150 hover:brightness-95 active:translate-y-[1px]"
                    style="background: linear-gradient(to bottom, #ffffff, #f2f2f2); box-shadow: 0px 1.5px 0px 0px #e5e5e5;"
                    @click="setMaxTransfer"
                  >
                    <span class="text-[14px] font-medium text-[#61667c] leading-[1.5] whitespace-nowrap" style="text-shadow: 0px 1px 1px rgba(0,0,0,0.08);">Max</span>
                  </button>
                </div>
              </div>
            </div>

            <!-- Footer -->
            <div class="flex items-center justify-end gap-[12px] px-[16px] py-[20px] border-t border-[#e5e6ea]">
              <button
                type="button"
                class="flex items-center justify-center min-w-[112px] h-[36px] px-[12px] rounded-[8px] border border-[#f2f2f4] transition-[filter] duration-150 hover:brightness-95 active:translate-y-[1px]"
                style="background: linear-gradient(to bottom, #ffffff, #f2f2f2); box-shadow: 0px 1.5px 0px 0px #e5e5e5;"
                @click="transferOpen = false"
              >
                <span class="text-[14px] font-medium text-[#61667c] leading-[1.5] whitespace-nowrap" style="text-shadow: 0px 1px 1px rgba(0,0,0,0.08);">Cancel</span>
              </button>
              <button
                type="button"
                class="flex items-center justify-center min-w-[112px] h-[36px] px-[12px] rounded-[8px] border border-[#2465de] transition-[filter] duration-150 hover:brightness-105 active:translate-y-[1px]"
                :class="transferValue > 0 ? '' : 'opacity-50 cursor-not-allowed'"
                style="background: linear-gradient(to bottom, #4179e2, #1f5bcc); box-shadow: 0px 1.5px 0px 0px #1d5fd9;"
                @click="confirmTransfer"
              >
                <span class="text-[14px] font-medium text-white leading-[1.5] whitespace-nowrap" style="text-shadow: 0px 1px 1px rgba(0,0,0,0.12);">Confirm</span>
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- Fund to Card Balance — 3-step flow (Figma: 88:15262 → 94:37032 → 94:38125) -->
    <FundCardModal
      :open="fundOpen"
      :hitpay-balance="hitpayBalance"
      :card-balance="cardBalance"
      @close="fundOpen = false"
      @funded="onFunded"
    />

    <!-- Success snackbar (same recipe as CardsPage) -->
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
import { ref, reactive, computed, onUnmounted } from 'vue'
import downloadIcon from '../../assets/icons/icon-download.svg'
import calendarIcon from '../../assets/icons/icon-calendar.svg'
import xCircleIcon from '../../assets/icons/icon-x-circle.svg'
import bankCardIcon from '../../assets/icons/icon-bank-card-blue.svg'
import sgFlagIcon from '../../assets/icons/flag-sg.svg'
import arrowRightIcon from '../../assets/icons/icon-arrow-right-white.svg'
import snackbarCheckIcon from '../../assets/icons/icon-snackbar-check.svg'
import FundCardModal from '../modals/FundCardModal.vue'

const cardBalance = ref(211170)
const hitpayBalance = ref(3500)

const fmtSGD = (n) => 'SGD ' + n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

const infoCards = computed(() => [
  { label: 'Available balance', value: fmtSGD(cardBalance.value) },
  { label: 'Active cards', value: '10' },
])

const columns = [
  { key: 'date', label: 'Date', sortable: true },
  { key: 'type', label: 'Type', sortable: true },
  { key: 'actionedBy', label: 'Actioned by', sortable: true },
  { key: 'amount', label: 'Amount', sortable: true },
]

const entries = reactive([
  { id: 1, date: '23/11/2026', type: 'funded', actionedBy: 'Danny', amount: 'SGD 1,487.65' },
  { id: 2, date: '15/10/2026', type: 'funded', actionedBy: 'Raymond', amount: 'SGD 1,024.39' },
  { id: 3, date: '04/12/2026', type: 'funded', actionedBy: 'Raymond', amount: 'SGD 1,789.22' },
  { id: 4, date: '29/08/2026', type: 'transferred', actionedBy: 'Alexa', amount: 'SGD 1,932.77' },
  { id: 5, date: '18/07/2026', type: 'funded', actionedBy: 'Raymond', amount: 'SGD 1,250.11' },
  { id: 6, date: '10/06/2026', type: 'transferred', actionedBy: 'Alexa', amount: 'SGD 1,678.54' },
  { id: 7, date: '02/05/2026', type: 'transferred', actionedBy: 'Danny', amount: 'SGD 1,089.33' },
  { id: 8, date: '25/04/2026', type: 'funded', actionedBy: 'Raymond', amount: 'SGD 1,345.90' },
  { id: 9, date: '17/03/2026', type: 'transferred', actionedBy: 'Danny', amount: 'SGD 1,712.08' },
  { id: 10, date: '07/09/2026', type: 'funded', actionedBy: 'Alexa', amount: 'SGD 1,156.48' },
])

// ── Transfer to HitPay Balance modal (Figma: 88:14872) ──
const transferOpen = ref(false)
const transferAmount = ref('')

const transferValue = computed(() => {
  const n = parseFloat(transferAmount.value.replace(/,/g, ''))
  return Number.isFinite(n) && n > 0 ? n : 0
})

function openTransfer() {
  transferAmount.value = ''
  transferOpen.value = true
}

function setMaxTransfer() {
  transferAmount.value = cardBalance.value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

function confirmTransfer() {
  const amt = Math.min(transferValue.value, cardBalance.value)
  if (!amt) return
  cardBalance.value -= amt
  hitpayBalance.value += amt
  const now = new Date()
  const date = `${String(now.getDate()).padStart(2, '0')}/${String(now.getMonth() + 1).padStart(2, '0')}/${now.getFullYear()}`
  entries.unshift({ id: Date.now(), date, type: 'transferred', actionedBy: 'Cherry', amount: fmtSGD(amt) })
  transferOpen.value = false
  showToast(`${fmtSGD(amt)} has been transferred to HitPay Balance`)
}

// ── Fund to Card Balance (Figma: 88:15262 → 94:37032 → 94:38125) ──
const fundOpen = ref(false)

function onFunded(amt) {
  fundOpen.value = false
  if (!amt) return
  cardBalance.value += amt
  const now = new Date()
  const date = `${String(now.getDate()).padStart(2, '0')}/${String(now.getMonth() + 1).padStart(2, '0')}/${now.getFullYear()}`
  entries.unshift({ id: Date.now(), date, type: 'funded', actionedBy: 'Cherry', amount: fmtSGD(amt) })
  showToast(`${fmtSGD(amt)} has been funded to Card Balance`)
}

// Snackbar — same one-shot toast recipe as CardsPage
const toast = ref('')
let toastTimer = null

function showToast(message) {
  toast.value = message
  clearTimeout(toastTimer)
  toastTimer = setTimeout(() => { toast.value = '' }, 3200)
}

onUnmounted(() => clearTimeout(toastTimer))

// ── Inline filters (Figma: 88:14484, active state 151:36980) ──
const typeFilter = ref('')
const actionedFilter = ref('')
const dateFrom = ref('')
const dateTo = ref('')
// The date pair collapses into a filled chip only once both ends are committed,
// so the second input isn't yanked away mid-typing
const dateActive = ref(false)

const TYPE_LABELS = { funded: 'Funded from HitPay', transferred: 'Transferred to HitPay' }

const actionedOptions = computed(() => [...new Set(entries.map((e) => e.actionedBy))])

const anyFilterActive = computed(() => !!(typeFilter.value || actionedFilter.value || dateActive.value))

function maybeApplyDates() {
  if (dateFrom.value.trim() && dateTo.value.trim()) dateActive.value = true
}

function clearDates() {
  dateFrom.value = ''
  dateTo.value = ''
  dateActive.value = false
}

function clearAllFilters() {
  typeFilter.value = ''
  actionedFilter.value = ''
  clearDates()
}

const filteredEntries = computed(() => {
  let list = entries
  if (typeFilter.value) list = list.filter((e) => e.type === typeFilter.value)
  if (actionedFilter.value) list = list.filter((e) => e.actionedBy === actionedFilter.value)
  return list
})
</script>

<style scoped>
/* ── Inline toolbar filter controls (Figma: Input / State=Default, compact) ── */
.bal-control {
  position: relative;
  display: flex;
  align-items: center;
  height: 28px;
  background: white;
  border: 1px solid #e5e6ea;
  border-radius: 8px;
  box-shadow: 0px 1px 3px 0px rgba(0, 0, 0, 0.04), 0px 1.5px 1.5px 0px rgba(0, 0, 0, 0.09);
  transition: border-color 150ms ease, box-shadow 150ms ease;
}
.bal-control:focus-within {
  border-color: #2465de;
  box-shadow: 0px 0px 0px 3px #b3cdfe, inset 0px 2px 4px 0px rgba(0, 0, 0, 0.24);
}
.bal-select {
  appearance: none;
  -webkit-appearance: none;
  width: 100%;
  height: 100%;
  background: transparent;
  border: none;
  outline: none;
  padding: 0 28px 0 8px;
  font-size: 13px;
  line-height: 1.5;
  color: #03102f;
  cursor: pointer;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
}
.bal-chevron {
  position: absolute;
  right: 8px;
  top: 50%;
  transform: translateY(-50%);
  pointer-events: none;
}
.bal-input {
  height: 100%;
  background: transparent;
  border: none;
  outline: none;
  font-size: 13px;
  line-height: 1.5;
  color: #03102f;
}
.bal-input::placeholder { color: #9295a5; }

/* Filled (applied) filter chip — Input / State=Filled (Figma: 151:36980) */
.bal-chip {
  gap: 8px;
  padding: 0 8px;
}
.bal-chip__label {
  flex: 1;
  min-width: 0;
  font-size: 13px;
  line-height: 1.5;
  color: #03102f;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.bal-chip__clear {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  cursor: pointer;
  transition: opacity 150ms ease;
}
.bal-chip__clear:hover { opacity: 0.65; }

.bal-clear-all {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 28px;
  padding: 0 8px;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 500;
  line-height: 1.5;
  color: #2465de;
  white-space: nowrap;
  cursor: pointer;
  transition: background-color 150ms ease;
}
.bal-clear-all:hover { background: #f0f4fd; }

/* Amount input — standard input recipe with focus ring on the wrapper */
.transfer-amount {
  border: 1px solid #e5e6ea;
  box-shadow: 0px 1px 3px 0px rgba(0, 0, 0, 0.04), 0px 1.5px 1.5px 0px rgba(0, 0, 0, 0.09);
  transition: border-color 150ms ease, box-shadow 150ms ease;
}
.transfer-amount:focus-within {
  border-color: #2465de;
  box-shadow: 0px 0px 0px 3px #b3cdfe, inset 0px 2px 4px 0px rgba(0, 0, 0, 0.24);
}

/* Transfer modal: backdrop fade + card rise (same motion as the card modals) */
.transfer-modal-enter-active { transition: opacity 200ms cubic-bezier(0.4, 0, 0.2, 1); }
.transfer-modal-leave-active { transition: opacity 150ms ease-in; }
.transfer-modal-enter-from,
.transfer-modal-leave-to { opacity: 0; }
.transfer-modal-enter-active .transfer-modal__card { transition: transform 200ms cubic-bezier(0.4, 0, 0.2, 1); }
.transfer-modal-enter-from .transfer-modal__card { transform: translateY(12px); }

/* Snackbar motion — same as CardsPage */
.snackbar-enter-active { transition: opacity 200ms ease-out, transform 200ms ease-out; }
.snackbar-leave-active { transition: opacity 150ms ease-in, transform 150ms ease-in; }
.snackbar-enter-from,
.snackbar-leave-to { opacity: 0; transform: translateY(-16px); }

@media (prefers-reduced-motion: reduce) {
  .bal-control, .bal-chip__clear, .bal-clear-all, .transfer-amount,
  .transfer-modal-enter-active, .transfer-modal-leave-active,
  .snackbar-enter-active, .snackbar-leave-active { transition: none; }
  .transfer-modal-enter-from .transfer-modal__card { transform: none; }
  .snackbar-enter-from, .snackbar-leave-to { transform: none; }
}
</style>
