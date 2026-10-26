<template>
  <!-- Reimbursements (Figma: 158:90288) — the create wizard covers this list, sidebar stays visible -->
  <div class="relative bg-white flex flex-col h-full w-full overflow-hidden">
    <div class="flex flex-1 min-h-0 flex-col items-start w-full pt-[4px] overflow-y-auto overflow-x-hidden">

      <!-- Page title + actions -->
      <div class="flex items-center justify-between gap-[32px] px-[24px] py-[12px] w-full shrink-0">
        <div class="flex flex-col gap-[8px] min-w-px">
          <p class="font-medium text-[18px] text-[#03102f] leading-[1.35] whitespace-nowrap">Reimbursements</p>
          <p class="text-[12px] leading-[1.5] text-[#61667c]">Group claims together and pay your team in one go</p>
        </div>
        <button
          type="button"
          class="flex items-center justify-center gap-[8px] h-[36px] px-[12px] rounded-[8px] border border-[#2465de] transition-[filter] duration-150 hover:brightness-105 active:translate-y-[1px]"
          style="background: linear-gradient(to bottom, #4179e2, #1f5bcc); box-shadow: 0px 1.5px 0px 0px #1d5fd9;"
          @click="openCreate()"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 3.5v9M3.5 8h9" stroke="#fff" stroke-width="1.5" stroke-linecap="round" /></svg>
          <span class="text-[14px] font-medium text-white leading-[1.5] whitespace-nowrap" style="text-shadow: 0px 1px 1px rgba(0,0,0,0.12);">New Reimbursement</span>
        </button>
      </div>

      <div class="flex flex-col gap-[24px] w-full px-[24px] pt-[12px] pb-[12px]">
        <!-- Table card -->
        <div class="w-full rounded-[8px] border border-[#e5e6ea] overflow-hidden bg-white">

          <!-- Toolbar: All / Pending / Paid + search / filter (same as Claims) -->
          <div class="flex items-center justify-between gap-[8px] h-[44px] px-[12px] py-[8px] bg-white border-b-[0.5px] border-[#cbcdd4]">
            <div class="flex items-start gap-[4px]">
              <button
                v-for="t in TABS"
                :key="t"
                type="button"
                class="flex items-center justify-center gap-[8px] min-w-[48px] px-[8px] py-[4px] rounded-[8px] text-[12px] leading-[1.5] whitespace-nowrap transition-colors duration-150"
                :class="activeTab === t ? 'bg-[#e5e6ea] font-medium text-[#03102f]' : 'font-normal text-[#61667c] hover:bg-[#f6f7f9]'"
                @click="activeTab = t"
              >
                {{ t }}
                <span v-if="t === 'Pending' && pendingCount" class="inline-flex items-center justify-center min-w-[20px] h-[20px] px-[6px] rounded-full bg-[#2465de] text-[10px] font-medium text-white leading-none">{{ pendingCount }}</span>
              </button>
            </div>
            <div class="flex items-center gap-[8px] shrink-0">
              <button type="button" class="tool-btn" aria-label="Search">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="7" cy="7" r="4.5" stroke="#61667c" stroke-width="1.4" /><path d="M10.5 10.5L14 14" stroke="#61667c" stroke-width="1.4" stroke-linecap="round" /></svg>
              </button>
              <button ref="filterBtn" type="button" class="tool-btn" :class="{ 'brightness-95': filterOpen }" aria-label="Filter" :aria-expanded="filterOpen" @click.stop="toggleFilter">
                <img :src="filterIcon" alt="" width="16" height="16" />
              </button>
            </div>
          </div>

          <!-- Applied filters (same as Claims) -->
          <div v-if="filterChips.length" class="flex items-center flex-wrap gap-[8px] px-[12px] py-[8px] bg-white border-b-[0.5px] border-[#cbcdd4]">
            <span class="text-[12px] font-normal text-[#61667c] leading-[1.5] whitespace-nowrap">Search for:</span>
            <span
              v-for="chip in filterChips"
              :key="chip.key"
              class="inline-flex items-center gap-[6px] min-h-[24px] px-[8px] py-[2px] rounded-[24px] bg-[#f2f2f4] text-[12px] font-medium text-[#484d61] leading-[1.5] whitespace-nowrap"
            >
              {{ chip.label }}
              <button type="button" class="flex items-center justify-center shrink-0 cursor-pointer hover:opacity-70 transition-opacity" :aria-label="'Remove ' + chip.label" @click="removeChip(chip.key)">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><circle cx="7" cy="7" r="5.6" stroke="#9295a5" stroke-width="1.1" /><path d="M5.2 5.2l3.6 3.6M8.8 5.2l-3.6 3.6" stroke="#9295a5" stroke-width="1.1" stroke-linecap="round" /></svg>
              </button>
            </span>
            <button type="button" class="text-[12px] font-medium text-[#2465de] leading-[1.5] whitespace-nowrap px-[4px] cursor-pointer hover:opacity-75 transition-opacity" @click="clearFilters">Clear all</button>
          </div>

          <div class="w-full overflow-x-auto">
            <table class="w-full border-collapse min-w-[1000px]" style="table-layout: fixed;">
              <colgroup>
                <col style="width: 149px;" />
                <col />
                <col style="width: 198px;" />
                <col style="width: 126px;" />
                <col style="width: 149px;" />
                <col style="width: 198px;" />
                <col style="width: 32px;" />
              </colgroup>
              <thead>
                <tr>
                  <th
                    v-for="(col, ci) in COLUMNS"
                    :key="col.key"
                    class="bg-[#fcfcfd] h-[34px] border-b-[0.5px] border-[#cbcdd4] px-[12px] py-[8px] text-left align-middle"
                    :class="ci < COLUMNS.length - 1 ? 'border-r border-r-[#e5e6ea]' : ''"
                  >
                    <div class="flex items-center gap-[8px]">
                      <span class="flex-1 min-w-px text-[10px] font-medium uppercase tracking-[0.3px] leading-[18px] text-[#03102f] whitespace-nowrap overflow-hidden text-ellipsis">{{ col.label }}</span>
                      <img v-if="col.sortable" :src="sortIcon" width="14" height="14" alt="" class="shrink-0" />
                    </div>
                  </th>
                </tr>
              </thead>
              <TransitionGroup tag="tbody" name="row">
                <tr
                  v-for="r in shown"
                  :key="r.id"
                  class="cursor-pointer transition-colors duration-150 [&:last-child>td]:border-b-0"
                  :class="menuFor?.id === r.id ? 'bg-[#f8f9fc]' : 'hover:bg-[#fcfcfd]'"
                  @click="router.push(`/claims/reimbursements/${r.id}`)"
                >
                  <td class="cell"><span class="text-[13px] text-[#03102f] leading-[1.4] whitespace-nowrap mono">{{ r.submitted }}</span></td>
                  <td class="cell"><p class="text-[13px] text-[#03102f] leading-[1.5] truncate">{{ r.title }}</p></td>
                  <td class="cell"><p class="text-[13px] text-[#03102f] leading-[1.5] truncate">{{ r.recipient }}</p></td>
                  <td class="cell"><span class="text-[13px] text-[#03102f] leading-[1.5]">{{ r.claims }}</span></td>
                  <td class="cell">
                    <div class="flex items-center gap-[4px]">
                      <img v-if="r.fx" :src="exchangeIcon" alt="Paid in another currency" width="16" height="16" class="shrink-0" />
                      <span class="flex-1 min-w-px text-right text-[13px] font-semibold text-[#03102f] leading-[1.4] whitespace-nowrap truncate mono">{{ r.amount }}</span>
                    </div>
                  </td>
                  <td class="cell">
                    <span
                      class="inline-flex items-center justify-center min-h-[24px] min-w-[32px] px-[8px] py-[2px] rounded-[24px] text-[12px] font-medium leading-[1.5] whitespace-nowrap"
                      :style="{ background: REIMBURSEMENT_STATUS[r.status].bg, color: REIMBURSEMENT_STATUS[r.status].text }"
                    >{{ r.status }}</span>
                  </td>
                  <td class="cell !border-r-0 !p-0">
                    <button
                      type="button"
                      class="flex items-center justify-center w-full h-[44px] transition-colors duration-150 hover:bg-[#f0f1f5]"
                      :aria-label="`More actions for ${r.title}`"
                      :aria-expanded="menuFor?.id === r.id"
                      @click.stop="toggleMenu($event, r)"
                    >
                      <img :src="moreIcon" width="16" height="16" alt="" />
                    </button>
                  </td>
                </tr>
              </TransitionGroup>
            </table>
            <p v-if="!shown.length" class="py-[32px] text-center text-[14px] text-[#61667c]">{{ appliedFilters ? 'No reimbursements match these filters.' : 'No reimbursements here yet.' }}</p>
          </div>
        </div>

        <!-- Pagination (same as Claims) -->
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

    <!-- Filter popover (Figma: Dropdown/Filter, 159:100360) -->
    <Teleport to="body">
      <div v-if="filterOpen" class="fixed inset-0 z-40" @click="filterOpen = false" />
      <Transition name="filter-pop">
        <div
          v-if="filterOpen"
          class="fixed z-50 w-[326px] rounded-[8px] bg-white flex flex-col gap-[24px] p-[16px]"
          style="box-shadow: 0px 1px 3px 0px rgba(0,0,0,0.1), 0px 3px 22px 0px rgba(38,42,50,0.09);"
          :style="{ left: filterPos.left + 'px', top: filterPos.top + 'px' }"
          role="dialog"
          aria-label="Filter reimbursements"
        >
          <div class="flex flex-col gap-[12px]">
            <div class="flex flex-col gap-[4px]">
              <span class="text-[12px] font-medium text-[#61667c] leading-[1.5]">Status</span>
              <MultiSelect v-model="fDraft.statuses" :options="statusOptions" placeholder="All statuses" :searchable="false" />
            </div>

            <div class="flex flex-col gap-[4px]">
              <span class="text-[12px] font-medium text-[#61667c] leading-[1.5]">Date submitted</span>
              <div class="claim-field gap-[8px] px-[8px]">
                <img :src="calendarIcon" width="16" height="16" alt="" class="shrink-0" />
                <input v-model="fDraft.date" type="text" placeholder="Select date" class="claim-input min-w-0 flex-1" />
              </div>
            </div>

            <div class="flex flex-col gap-[4px]">
              <span class="text-[12px] font-medium text-[#61667c] leading-[1.5]">Recipient</span>
              <MultiSelect v-model="fDraft.recipients" :options="recipientOptions" placeholder="Select recipient" />
            </div>

            <div class="flex flex-col gap-[4px]">
              <span class="text-[12px] font-medium text-[#61667c] leading-[1.5]">Amount</span>
              <div class="flex items-center gap-[8px]">
                <div class="claim-field flex-1 gap-[4px] px-[8px]">
                  <span class="text-[14px] text-[#9295a5] shrink-0">From:</span>
                  <input v-model="fDraft.amountFrom" type="text" inputmode="decimal" placeholder="200" class="claim-input min-w-0 flex-1" />
                </div>
                <div class="claim-field flex-1 gap-[4px] px-[8px]">
                  <span class="text-[14px] text-[#9295a5] shrink-0">To:</span>
                  <input v-model="fDraft.amountTo" type="text" inputmode="decimal" placeholder="1,000" class="claim-input min-w-0 flex-1" />
                </div>
              </div>
            </div>
          </div>

          <div class="flex items-center gap-[16px]">
            <button
              type="button"
              class="flex-1 flex items-center justify-center h-[36px] px-[12px] rounded-[8px] border border-[#f2f2f4] text-[14px] font-medium text-[#61667c] transition-[filter] duration-150 hover:brightness-95 active:translate-y-[1px]"
              style="background: linear-gradient(to bottom, #ffffff, #f2f2f2); box-shadow: 0px 1.5px 0px 0px #e5e5e5; text-shadow: 0px 1px 1px rgba(0,0,0,0.08);"
              @click="cancelFilters"
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

    <!-- Row actions (Figma: Dropdown) — teleported so the scrolling table can't clip it -->
    <Teleport to="body">
      <div v-if="menuFor" class="fixed inset-0 z-40" @click="menuFor = null" />
      <Transition name="menu-pop">
        <div v-if="menuFor" class="menu fixed z-50 w-[162px]" :style="{ left: menuPos.left + 'px', top: menuPos.top + 'px' }" role="menu">
          <div class="flex flex-col p-[4px]">
            <button v-for="item in menuItems.filter((m) => !m.danger)" :key="item.label" type="button" class="menu-item" role="menuitem" @click="onMenu(item.action)">
              <img :src="MENU_ICONS[item.action]" width="16" height="16" alt="" />
              <span>{{ item.label }}</span>
            </button>
          </div>
          <template v-if="menuItems.some((m) => m.danger)">
            <div class="h-px bg-[#e5e6ea]" />
            <div class="flex flex-col p-[4px]">
              <button v-for="item in menuItems.filter((m) => m.danger)" :key="item.label" type="button" class="menu-item menu-item--danger" role="menuitem" @click="onMenu(item.action)">
                <img :src="MENU_ICONS[item.action]" width="16" height="16" alt="" />
                <span>{{ item.label }}</span>
              </button>
            </div>
          </template>
        </div>
      </Transition>
    </Teleport>

    <!-- New reimbursement (Figma: 116:51394) -->
    <Transition name="full-page">
      <CreateReimbursementPage
        v-if="createOpen"
        :key="createKey"
        :initial-staff="createFrom.staff"
        :initial-claim-ids="createFrom.claimIds"
        @close="closeCreate"
        @done="onDone"
      />
    </Transition>

    <!-- Snackbar -->
    <div class="absolute top-[24px] inset-x-0 z-50 flex justify-center pointer-events-none">
      <Transition name="snackbar">
        <div
          v-if="toast"
          class="flex items-center gap-[4px] pl-[8px] pr-[12px] py-[8px] rounded-[8px] bg-[#e6f9f0] border border-[#b3eed2]"
          style="filter: drop-shadow(0px 8px 6px rgba(42,50,82,0.04));"
          role="status"
        >
          <img :src="toastCheckIcon" width="16" height="16" alt="" class="shrink-0" />
          <span class="text-[12px] text-[#03102f] leading-[1.5] whitespace-nowrap">{{ toast }}</span>
        </div>
      </Transition>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import CreateReimbursementPage from './CreateReimbursementPage.vue'
import MultiSelect from '../forms/MultiSelect.vue'
import {
  reimbursements, REIMBURSEMENT_STATUS, PENDING_STATUSES, addReimbursement, startPayment,
  exportReimbursementPdf, reimbursementActions,
} from '../../composables/useReimbursements.js'
import exchangeIcon from '../../assets/icons/icon-exchange.svg'
import filterIcon from '../../assets/icons/icon-filter.svg'
import calendarIcon from '../../assets/icons/icon-calendar.svg'
import moreIcon from '../../assets/icons/icon-dots-vertical.svg'
import sortIcon from '../../assets/images/reimb-sort-down.svg'
import downloadIcon from '../../assets/images/reimb-menu-download.svg'
import pencilIcon from '../../assets/icons/icon-pencil.svg'
import cancelIcon from '../../assets/images/reimb-menu-cancel.svg'
import toastCheckIcon from '../../assets/icons/icon-check-circle-green.svg'

const route = useRoute()
const router = useRouter()

const TABS = ['All', 'Pending', 'Paid']
const activeTab = ref('All')
const COLUMNS = [
  { key: 'submitted', label: 'Submitted', sortable: true },
  { key: 'title', label: 'Title', sortable: true },
  { key: 'recipient', label: 'Recipient', sortable: true },
  { key: 'claims', label: 'Claims', sortable: true },
  { key: 'amount', label: 'Amount', sortable: true },
  { key: 'status', label: 'Status', sortable: true },
  { key: 'actions', label: '', sortable: false },
]

const pendingCount = computed(() => reimbursements.value.filter((r) => PENDING_STATUSES.includes(r.status)).length)
const shown = computed(() => {
  let list = reimbursements.value.filter((r) =>
    activeTab.value === 'All' ||
    (activeTab.value === 'Pending' && PENDING_STATUSES.includes(r.status)) ||
    (activeTab.value === 'Paid' && r.status === 'Paid')
  )
  const f = appliedFilters.value
  if (!f) return list
  if (f.statuses.length) list = list.filter((r) => f.statuses.includes(r.status))
  if (f.date) list = list.filter((r) => r.submitted.toLowerCase().includes(f.date.trim().toLowerCase()))
  if (f.recipients.length) list = list.filter((r) => f.recipients.includes(r.recipient))
  const from = parseAmount(f.amountFrom)
  const to = parseAmount(f.amountTo)
  if (from != null) list = list.filter((r) => amountOf(r) >= from)
  if (to != null) list = list.filter((r) => amountOf(r) <= to)
  return list
})

// ── Filter popover (Figma: Dropdown/Filter, 159:100360) — same pattern as Claims ──
const filterOpen = ref(false)
const filterPos = ref({ left: 0, top: 0 })
const filterBtn = ref(null)

const MULTI_KEYS = ['statuses', 'recipients']
const emptyFilters = () => ({ statuses: [], date: '', recipients: [], amountFrom: '', amountTo: '' })
const fDraft = reactive(emptyFilters())
const appliedFilters = ref(null)

const statusOptions = Object.keys(REIMBURSEMENT_STATUS).map((s) => ({ value: s, label: s, dot: REIMBURSEMENT_STATUS[s].text }))
const recipientOptions = computed(() => [...new Set(reimbursements.value.map((r) => r.recipient))].sort())

// Every reimbursement is paid in SGD, so amounts compare directly
const amountOf = (r) => parseFloat(r.amount.split(' ')[1].replace(/,/g, ''))
function parseAmount(v) {
  const n = parseFloat(String(v).replace(/[^0-9.]/g, ''))
  return Number.isFinite(n) && String(v).trim() !== '' ? n : null
}

function toggleFilter() {
  if (filterOpen.value) {
    filterOpen.value = false
    return
  }
  const rect = filterBtn.value.getBoundingClientRect()
  filterPos.value = { left: Math.max(8, Math.min(rect.right - 326, window.innerWidth - 334)), top: rect.bottom + 4 }
  filterOpen.value = true
}

const copyFilters = (f) => {
  const copy = { ...f }
  for (const k of MULTI_KEYS) copy[k] = [...f[k]]
  return copy
}
const hasFilters = (f) => Object.values(f).some((v) => (Array.isArray(v) ? v.length : v !== ''))

function applyFilters() {
  const snapshot = copyFilters(fDraft)
  appliedFilters.value = hasFilters(snapshot) ? snapshot : null
  filterOpen.value = false
}
// Cancel drops unapplied edits so the next open shows what's actually applied
function cancelFilters() {
  Object.assign(fDraft, appliedFilters.value ? copyFilters(appliedFilters.value) : emptyFilters())
  filterOpen.value = false
}

const filterChips = computed(() => {
  const f = appliedFilters.value
  if (!f) return []
  const chips = []
  if (f.statuses.length) chips.push({ key: 'statuses', label: `Status: ${f.statuses.join(', ')}` })
  if (f.date) chips.push({ key: 'date', label: `Date submitted: ${f.date}` })
  if (f.recipients.length) chips.push({ key: 'recipients', label: `Recipient: ${f.recipients.join(', ')}` })
  if (f.amountFrom || f.amountTo) chips.push({ key: 'amount', label: `Amount: ${f.amountFrom || '0'} - ${f.amountTo || '∞'}` })
  return chips
})

function removeChip(key) {
  const f = copyFilters(appliedFilters.value)
  if (key === 'amount') { f.amountFrom = ''; f.amountTo = '' }
  else if (key === 'date') f.date = ''
  else f[key] = []
  appliedFilters.value = hasFilters(f) ? f : null
  Object.assign(fDraft, f)
}

function clearFilters() {
  appliedFilters.value = null
  Object.assign(fDraft, emptyFilters())
}

// ── Row actions ──
const MENU_ICONS = { export: downloadIcon, edit: pencilIcon, cancel: cancelIcon }
const menuFor = ref(null)
const menuPos = ref({ left: 0, top: 0 })
const menuItems = computed(() => (menuFor.value ? reimbursementActions(menuFor.value.status) : []))

function toggleMenu(e, r) {
  if (menuFor.value?.id === r.id) {
    menuFor.value = null
    return
  }
  const rect = e.currentTarget.getBoundingClientRect()
  const height = reimbursementActions(r.status).length * 34 + 16
  const below = rect.bottom + 4
  menuPos.value = {
    left: Math.max(8, rect.right - 162),
    top: below + height > window.innerHeight - 8 ? rect.top - height - 4 : below,
  }
  menuFor.value = r
}

function onMenu(action) {
  const r = menuFor.value
  menuFor.value = null
  if (action === 'export') {
    exportReimbursementPdf(r)
    showToast('PDF exported')
    return
  }
  // Edit / Cancel happen on the detail page, which opens the edit page or the confirm dialog
  router.push({ path: `/claims/reimbursements/${r.id}`, query: { action } })
}

// ── Create wizard ──
const createOpen = ref(false)
const createKey = ref(0)
const createFrom = ref({ staff: '', claimIds: [] })

function openCreate(from = { staff: '', claimIds: [] }) {
  createFrom.value = from
  createKey.value++
  createOpen.value = true
}
function closeCreate() {
  createOpen.value = false
  if (route.query.new) router.replace({ query: {} })
}

// "Create reimbursement" on an approved claim lands here with ?new=1&staff=…&claim=…
if (route.query.new) {
  const id = Number(route.query.claim)
  openCreate({ staff: String(route.query.staff ?? ''), claimIds: Number.isFinite(id) ? [id] : [] })
}

// Saved for later → Draft; paid now → Processing, then Paid
function onDone({ payment, method, ...details }) {
  const r = addReimbursement({ ...details, status: payment === 'later' ? 'Draft' : 'Awaiting for payment' })
  if (payment !== 'later') startPayment(r, method, { slow: payment === 'bank' })
  closeCreate()
  activeTab.value = 'All'
  showToast({
    later: 'Saved as draft — submit and pay it from its details page',
    paid: 'Payment sent — the reimbursement is processing',
    bank: 'Bank transfer submitted — we’ll confirm it once it arrives',
  }[payment])
}

const toast = ref('')
let toastTimer = null
function showToast(message) {
  toast.value = message
  clearTimeout(toastTimer)
  toastTimer = setTimeout(() => { toast.value = '' }, 3000)
}
</script>

<style scoped>
.mono { font-family: 'Reddit Mono', ui-monospace, monospace; }
.cell {
  height: 44px;
  padding: 8px 12px;
  vertical-align: middle;
  border-bottom: 1px solid #e5e6ea;
  border-right: 1px solid #e5e6ea;
}
.tool-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: 8px;
  border: 1px solid #f2f2f4;
  background: linear-gradient(to bottom, #ffffff, #f2f2f2);
  box-shadow: 0px 1.5px 0px 0px #e5e5e5;
  transition: filter 150ms ease;
}
.tool-btn:hover { filter: brightness(0.95); }

/* Filter text fields (Figma: Input / State=Default) — same as Claims */
.claim-field {
  display: flex;
  align-items: center;
  min-width: 0;
  height: 36px;
  background: white;
  border: 1px solid #e5e6ea;
  border-radius: 8px;
  box-shadow: 0px 1px 3px 0px rgba(0, 0, 0, 0.04), 0px 1.5px 1.5px 0px rgba(0, 0, 0, 0.09);
  transition: border-color 150ms ease, box-shadow 150ms ease;
}
.claim-field:focus-within {
  border-color: #2465de;
  box-shadow: 0px 0px 0px 3px #b3cdfe, inset 0px 2px 4px 0px rgba(0, 0, 0, 0.24);
}
.claim-input {
  height: 100%;
  background: transparent;
  border: none;
  outline: none;
  font-size: 14px;
  line-height: 1.5;
  color: #03102f;
}
.claim-input::placeholder { color: #9295a5; }

/* Filter popover: quick scale+fade from the button corner (same as Claims) */
.filter-pop-enter-active { transition: opacity 140ms ease-out, transform 140ms ease-out; transform-origin: top right; }
.filter-pop-leave-active { transition: opacity 100ms ease-in; transform-origin: top right; }
.filter-pop-enter-from { opacity: 0; transform: scale(0.96) translateY(-2px); }
.filter-pop-leave-to { opacity: 0; }
.tool-btn:active { transform: translateY(1px); }

/* Dropdown (Figma: Dropdown, Shadow/Tooltip) — same as the detail page */
.menu {
  overflow: hidden;
  border-radius: 8px;
  background: white;
  box-shadow: 0px 1px 3px 0px rgba(0, 0, 0, 0.1), 0px 3px 22px 0px rgba(38, 42, 50, 0.09);
}
.menu-item {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  padding: 8px;
  border-radius: 4px;
  font-size: 12px;
  line-height: 1.5;
  color: #03102f;
  text-align: left;
  transition: background-color 100ms ease;
}
.menu-item:hover { background: #f6f7f9; }
.menu-item--danger { color: #dc3545; }
.menu-item--danger:hover { background: #fdf2f3; }

/* New rows fade in at the top */
.row-enter-active { transition: opacity 300ms ease-out, background-color 1200ms ease-out; }
.row-enter-from { opacity: 0; background-color: #f0f5ff; }

/* Wizard: gentle rise + fade in, quicker fade out (same as Claims) */
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

.menu-pop-enter-active { transition: opacity 140ms ease-out, transform 140ms ease-out; }
.menu-pop-leave-active { transition: opacity 100ms ease-in; }
.menu-pop-enter-from { opacity: 0; transform: translateY(-4px); }
.menu-pop-leave-to { opacity: 0; }

.snackbar-enter-active { transition: opacity 200ms ease-out, transform 200ms ease-out; }
.snackbar-leave-active { transition: opacity 150ms ease-in, transform 150ms ease-in; }
.snackbar-enter-from,
.snackbar-leave-to { opacity: 0; transform: translateY(-16px); }

@media (prefers-reduced-motion: reduce) {
  .row-enter-active, .full-page-enter-active, .full-page-leave-active,
  .menu-pop-enter-active, .menu-pop-leave-active,
  .filter-pop-enter-active, .filter-pop-leave-active,
  .snackbar-enter-active, .snackbar-leave-active { transition: none; }
  .full-page-enter-from, .full-page-leave-to, .menu-pop-enter-from, .filter-pop-enter-from,
  .snackbar-enter-from, .snackbar-leave-to { transform: none; }
}
</style>
