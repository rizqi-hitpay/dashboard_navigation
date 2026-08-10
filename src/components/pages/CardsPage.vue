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

      <!-- Content -->
      <div class="flex flex-col gap-[24px] w-full px-[24px] pt-[12px] pb-[12px]">

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
          <!-- Card holder -->
          <div class="flex flex-col gap-[4px]">
            <span class="text-[12px] font-medium text-[#61667c] leading-[1.5]">Card holder (Staff)</span>
            <div class="flt-control">
              <select v-model="draft.holder" class="flt-select" :class="{ 'flt-placeholder': !draft.holder }">
                <option value="">Select staff</option>
                <option v-for="h in holders" :key="h" :value="h">{{ h }}</option>
              </select>
              <svg class="flt-chevron" width="16" height="16" viewBox="0 0 16 16" fill="none"><path fill-rule="evenodd" clip-rule="evenodd" d="M8.4714 10.4715C8.21107 10.7318 7.78893 10.7318 7.5286 10.4715L3.75736 6.7002C3.49701 6.43988 3.49701 6.01777 3.75736 5.75742C4.01771 5.49707 4.43982 5.49707 4.70017 5.75742L8 9.05727L11.2998 5.75742C11.5602 5.49707 11.9823 5.49707 12.2427 5.75742C12.503 6.01777 12.503 6.43988 12.2427 6.7002L8.4714 10.4715Z" fill="#61667C"/></svg>
            </div>
          </div>

          <!-- Status (multi) -->
          <div class="flex flex-col gap-[4px] relative">
            <span class="text-[12px] font-medium text-[#61667c] leading-[1.5]">Status</span>
            <button type="button" class="flt-control flex items-center gap-[4px] px-[8px] text-left cursor-pointer flex-wrap" style="height: auto; min-height: 36px; padding-top: 4px; padding-bottom: 4px;" @click="statusMenuOpen = !statusMenuOpen">
              <template v-if="draft.statuses.length">
                <span
                  v-for="s in draft.statuses"
                  :key="s"
                  class="inline-flex items-center gap-[4px] min-h-[22px] px-[6px] rounded-[24px] bg-[#f2f2f4] text-[12px] font-medium text-[#484d61] leading-[1.5] whitespace-nowrap"
                >
                  <span class="size-[6px] rounded-full shrink-0" :style="{ background: STATUS[s].color }" />
                  {{ STATUS[s].label }}
                  <span class="flex items-center justify-center cursor-pointer hover:opacity-70" @click.stop="toggleStatus(s)">
                    <svg width="12" height="12" viewBox="0 0 14 14" fill="none"><circle cx="7" cy="7" r="5.6" stroke="#9295a5" stroke-width="1.1" /><path d="M5.2 5.2l3.6 3.6M8.8 5.2l-3.6 3.6" stroke="#9295a5" stroke-width="1.1" stroke-linecap="round" /></svg>
                  </span>
                </span>
              </template>
              <span v-else class="text-[14px] text-[#9295a5] leading-[1.5]">All statuses</span>
            </button>
            <div v-if="statusMenuOpen" class="absolute top-full left-0 mt-[2px] w-full rounded-[8px] bg-white p-[4px] z-10" style="box-shadow: 0px 1px 3px 0px rgba(0,0,0,0.1), 0px 3px 22px 0px rgba(38,42,50,0.09);">
              <button
                v-for="(meta, key) in STATUS"
                :key="key"
                type="button"
                class="flex items-center gap-[8px] p-[8px] rounded-[4px] w-full text-left hover:bg-[#f5f6f9] transition-colors duration-100"
                @click="toggleStatus(key)"
              >
                <span class="size-[6px] rounded-full shrink-0" :style="{ background: meta.color }" />
                <span class="flex-1 text-[12px] font-normal text-[#03102f] leading-[1.5]">{{ meta.label }}</span>
                <svg v-if="draft.statuses.includes(key)" width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2.9 7.3l2.8 2.8 5.4-5.9" stroke="#2465de" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" /></svg>
              </button>
            </div>
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
import mastercardLogo from '../../assets/icons/logo-mastercard.svg'
import filterIcon from '../../assets/icons/icon-filter.svg'
import snackbarCheckIcon from '../../assets/icons/icon-snackbar-check.svg'

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
  if (f.holder) list = list.filter((c) => c.holder === f.holder)
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

const emptyFilters = () => ({ holder: '', statuses: [], dateFrom: '', dateTo: '', amountFrom: '', amountTo: '' })
const draft = reactive(emptyFilters())
const appliedFilters = ref(null)

const holders = computed(() => [...new Set(cards.map((c) => c.holder))])

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

function toggleStatus(key) {
  const i = draft.statuses.indexOf(key)
  if (i === -1) draft.statuses.push(key)
  else draft.statuses.splice(i, 1)
}

function applyFilters() {
  const hasAny = draft.holder || draft.statuses.length || draft.dateFrom || draft.dateTo || draft.amountFrom || draft.amountTo
  appliedFilters.value = hasAny ? { ...draft, statuses: [...draft.statuses] } : null
  filterOpen.value = false
  statusMenuOpen.value = false
}

const filterChips = computed(() => {
  const f = appliedFilters.value
  if (!f) return []
  const chips = []
  if (f.holder) chips.push({ key: 'holder', label: `Card holder: ${f.holder}` })
  for (const s of f.statuses) chips.push({ key: 'status:' + s, label: `Status: ${STATUS[s].label}` })
  if (f.dateFrom || f.dateTo) chips.push({ key: 'date', label: `Date created: ${f.dateFrom || '…'} - ${f.dateTo || '…'}` })
  if (f.amountFrom || f.amountTo) chips.push({ key: 'amount', label: `Amount: ${f.amountFrom || '0'} - ${f.amountTo || '∞'}` })
  return chips
})

function removeChip(chip) {
  const f = { ...appliedFilters.value, statuses: [...appliedFilters.value.statuses] }
  if (chip.key === 'holder') f.holder = ''
  else if (chip.key.startsWith('status:')) f.statuses = f.statuses.filter((s) => s !== chip.key.slice(7))
  else if (chip.key === 'date') { f.dateFrom = ''; f.dateTo = '' }
  else if (chip.key === 'amount') { f.amountFrom = ''; f.amountTo = '' }
  const hasAny = f.holder || f.statuses.length || f.dateFrom || f.dateTo || f.amountFrom || f.amountTo
  appliedFilters.value = hasAny ? f : null
  Object.assign(draft, f, { statuses: [...f.statuses] })
}

function clearFilters() {
  appliedFilters.value = null
  Object.assign(draft, emptyFilters(), { statuses: [] })
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
