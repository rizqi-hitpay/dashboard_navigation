<template>
  <div class="bg-white flex flex-col h-full w-full overflow-y-auto overflow-x-hidden">
    <div class="flex flex-1 flex-col items-start w-full pt-[4px]">

      <!-- Page title + actions -->
      <div class="flex h-[60px] items-center justify-between gap-[32px] px-[24px] w-full shrink-0">
        <p class="font-medium text-[18px] text-[#03102f] leading-[1.35] whitespace-nowrap">Vendors</p>
        <div class="flex items-center gap-[8px] shrink-0">
          <button
            type="button"
            class="flex items-center justify-center gap-[8px] h-[36px] px-[12px] rounded-[8px] border border-[#f2f2f4] transition-[filter] duration-150 hover:brightness-95 active:translate-y-[1px]"
            style="background: linear-gradient(to bottom, #ffffff, #f2f2f2); box-shadow: 0px 1.5px 0px 0px #e5e5e5;"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 10V3M5.2 5.6L8 2.8l2.8 2.8" stroke="#61667c" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" /><path d="M3 10.5v1.5a1.5 1.5 0 001.5 1.5h7a1.5 1.5 0 001.5-1.5v-1.5" stroke="#61667c" stroke-width="1.4" stroke-linecap="round" /></svg>
            <span class="text-[14px] font-medium text-[#61667c] leading-[1.5] whitespace-nowrap" style="text-shadow: 0px 1px 1px rgba(0,0,0,0.08);">Export</span>
          </button>
          <button
            type="button"
            class="flex items-center justify-center gap-[8px] h-[36px] px-[12px] rounded-[8px] border border-[#2465de] transition-[filter] duration-150 hover:brightness-105 active:translate-y-[1px]"
            style="background: linear-gradient(to bottom, #4179e2, #1f5bcc); box-shadow: 0px 1.5px 0px 0px #1d5fd9;"
            @click="addVendorOpen = true"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 3.5v9M3.5 8h9" stroke="#fff" stroke-width="1.5" stroke-linecap="round" /></svg>
            <span class="text-[14px] font-medium text-white leading-[1.5] whitespace-nowrap" style="text-shadow: 0px 1px 1px rgba(0,0,0,0.12);">Vendor</span>
          </button>
        </div>
      </div>

      <!-- Content -->
      <div class="flex flex-col gap-[24px] w-full px-[24px] pt-[12px] pb-[12px]">

        <!-- Table card -->
        <div class="w-full rounded-[8px] border border-[#e5e6ea] overflow-hidden bg-white">

          <!-- Toolbar: segmented controls + search -->
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
            <button
              type="button"
              class="flex items-center justify-center size-[28px] rounded-[8px] border border-[#f2f2f4] shrink-0 transition-[filter] duration-150 hover:brightness-95 active:translate-y-[1px]"
              style="background: linear-gradient(to bottom, #ffffff, #f2f2f2); box-shadow: 0px 1.5px 0px 0px #e5e5e5;"
              aria-label="Search"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="7" cy="7" r="4.5" stroke="#61667c" stroke-width="1.4" /><path d="M10.5 10.5L14 14" stroke="#61667c" stroke-width="1.4" stroke-linecap="round" /></svg>
            </button>
          </div>

          <!-- Table -->
          <div class="w-full overflow-x-auto">
            <table class="w-full border-collapse min-w-[1000px]" style="table-layout: fixed;">
              <colgroup>
                <col style="width: 151px;" />
                <col />
                <col style="width: 254px;" />
                <col style="width: 146px;" />
                <col style="width: 146px;" />
                <col style="width: 56px;" />
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
                  v-for="v in filteredVendors"
                  :key="v.id"
                  class="group cursor-pointer transition-colors duration-150 [&:last-child>td]:border-b-0"
                  :class="openMenuId === v.id ? 'bg-[#fcfcfd]' : 'hover:bg-[#fcfcfd]'"
                  @click="viewVendor(v)"
                >
                  <!-- Name -->
                  <td class="h-[44px] px-[12px] py-[8px] align-middle border-b border-r border-[#e5e6ea]">
                    <p class="text-[13px] font-normal text-[#03102f] leading-[1.5] whitespace-nowrap overflow-hidden text-ellipsis">{{ v.starred ? '⭐ ' : '' }}{{ v.name }}</p>
                  </td>
                  <!-- Email -->
                  <td class="h-[44px] px-[12px] py-[8px] align-middle border-b border-r border-[#e5e6ea]">
                    <p class="text-[13px] font-normal text-[#03102f] leading-[1.5] whitespace-nowrap overflow-hidden text-ellipsis">{{ v.email }}</p>
                  </td>
                  <!-- Payment details -->
                  <td class="h-[44px] px-[12px] py-[8px] align-middle border-b border-r border-[#e5e6ea]">
                    <div v-if="v.missing" class="flex items-center gap-[4px]">
                      <svg class="shrink-0" width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 2.6L14.4 13.4H1.6L8 2.6z" stroke="#bd8400" stroke-width="1.2" stroke-linejoin="round" /><path d="M8 6.6v3" stroke="#bd8400" stroke-width="1.2" stroke-linecap="round" /><circle cx="8" cy="11.4" r="0.7" fill="#bd8400" /></svg>
                      <span class="text-[13px] font-normal text-[#bd8400] leading-[1.5] whitespace-nowrap">Missing</span>
                    </div>
                    <p v-else class="text-[13px] font-normal text-[#03102f] leading-[1.5] whitespace-nowrap overflow-hidden text-ellipsis">
                      {{ v.payment }}<template v-if="v.more">
                        <span
                          class="text-[#2465de] cursor-pointer"
                          @mouseenter="showMoreTooltip($event, v.id)"
                          @mouseleave="moreTooltipId = null"
                        > + {{ v.more }} more</span>
                      </template>
                    </p>
                  </td>
                  <!-- Last payment -->
                  <td class="h-[44px] px-[12px] py-[8px] align-middle border-b border-r border-[#e5e6ea]">
                    <span class="text-[13px] text-[#03102f] leading-[1.4] whitespace-nowrap" style="font-family: 'Reddit Mono', ui-monospace, monospace;">{{ v.lastPayment }}</span>
                  </td>
                  <!-- Added on -->
                  <td class="h-[44px] px-[12px] py-[8px] align-middle border-b border-r border-[#e5e6ea]">
                    <span class="text-[13px] text-[#03102f] leading-[1.4] whitespace-nowrap" style="font-family: 'Reddit Mono', ui-monospace, monospace;">{{ v.addedOn }}</span>
                  </td>
                  <!-- Row actions -->
                  <td class="h-[44px] px-[12px] py-[8px] align-middle border-b border-[#e5e6ea]">
                    <button
                      type="button"
                      class="flex items-center justify-center size-[24px] rounded-[4px] transition-opacity duration-150 hover:bg-[#f0f1f5]"
                      :class="openMenuId === v.id ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'"
                      aria-label="Vendor actions"
                      @click.stop="toggleMenu($event, v.id)"
                    >
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="3.2" cy="8" r="1.3" fill="#61667c" /><circle cx="8" cy="8" r="1.3" fill="#61667c" /><circle cx="12.8" cy="8" r="1.3" fill="#61667c" /></svg>
                    </button>
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

    <!-- Add New Vendor full page -->
    <Teleport to="body">
      <Transition name="full-page">
        <AddVendorPage v-if="addVendorOpen" @close="addVendorOpen = false" />
      </Transition>
    </Teleport>

    <!-- Row-actions dropdown (teleported: the table card clips overflow) -->
    <Teleport to="body">
      <div v-if="openMenuId !== null" class="fixed inset-0 z-40" @click="openMenuId = null" />
      <Transition name="vendor-menu">
        <div
          v-if="openMenuId !== null"
          class="fixed z-50 w-[162px] rounded-[8px] bg-white overflow-hidden"
          style="box-shadow: 0px 1px 3px 0px rgba(0,0,0,0.1), 0px 3px 22px 0px rgba(38,42,50,0.09);"
          :style="{ left: menuPos.left + 'px', top: menuPos.top + 'px' }"
        >
          <div class="flex flex-col p-[4px] w-full">
            <button type="button" class="flex items-center gap-[8px] p-[8px] rounded-[4px] w-full text-left hover:bg-[#f5f6f9] transition-colors duration-100" @click="viewMenuVendor">
              <svg class="shrink-0" width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M1.9 8S4.1 3.9 8 3.9 14.1 8 14.1 8 11.9 12.1 8 12.1 1.9 8 1.9 8z" stroke="#03102f" stroke-width="1.2" stroke-linejoin="round" /><circle cx="8" cy="8" r="1.9" stroke="#03102f" stroke-width="1.2" /></svg>
              <span class="flex-1 text-[12px] font-normal text-[#03102f] leading-[1.5]">Details</span>
            </button>
            <button type="button" class="flex items-center gap-[8px] p-[8px] rounded-[4px] w-full text-left hover:bg-[#f5f6f9] transition-colors duration-100" @click="openMenuId = null">
              <svg class="shrink-0" width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M11.2 2.6a1.4 1.4 0 012 2L5.4 12.4l-2.7.7.7-2.7 7.8-7.8z" stroke="#03102f" stroke-width="1.2" stroke-linejoin="round" /></svg>
              <span class="flex-1 text-[12px] font-normal text-[#03102f] leading-[1.5]">Edit</span>
            </button>
            <button type="button" class="flex items-center gap-[8px] p-[8px] rounded-[4px] w-full text-left hover:bg-[#fdf2f3] transition-colors duration-100" @click="openMenuId = null">
              <svg class="shrink-0" width="16" height="16" viewBox="0 0 16 16" fill="none"><rect x="2.2" y="3" width="11.6" height="3" rx="0.8" stroke="#dc3545" stroke-width="1.2" /><path d="M3.3 6v5.6a1.4 1.4 0 001.4 1.4h6.6a1.4 1.4 0 001.4-1.4V6" stroke="#dc3545" stroke-width="1.2" /><path d="M6.5 8.6h3" stroke="#dc3545" stroke-width="1.2" stroke-linecap="round" /></svg>
              <span class="flex-1 text-[12px] font-normal text-[#dc3545] leading-[1.5]">Archive</span>
            </button>
          </div>
          <div class="h-px w-full bg-[#e5e6ea]" />
          <div class="flex flex-col p-[4px] w-full">
            <button type="button" class="flex items-center gap-[8px] p-[8px] rounded-[4px] w-full text-left hover:bg-[#fdf2f3] transition-colors duration-100" @click="openMenuId = null">
              <svg class="shrink-0" width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M2.8 4.3h10.4" stroke="#dc3545" stroke-width="1.2" stroke-linecap="round" /><path d="M5.7 4.3V3.1a.9.9 0 01.9-.9h2.8a.9.9 0 01.9.9v1.2" stroke="#dc3545" stroke-width="1.2" /><path d="M4.2 4.3l.5 8.2a1.2 1.2 0 001.2 1.1h4.2a1.2 1.2 0 001.2-1.1l.5-8.2" stroke="#dc3545" stroke-width="1.2" stroke-linecap="round" /></svg>
              <span class="flex-1 text-[12px] font-normal text-[#dc3545] leading-[1.5]">Delete</span>
            </button>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- Extra payment methods tooltip on "+ N more" -->
    <Teleport to="body">
      <Transition name="more-tooltip">
        <div
          v-if="moreTooltipId !== null"
          class="fixed z-50 pointer-events-none"
          :style="{ left: moreTooltipPos.left + 'px', top: moreTooltipPos.top + 'px' }"
        >
          <div class="relative -translate-x-1/2">
            <div
              class="flex items-center justify-center px-[8px] py-[4px] rounded-[4px] bg-[#fcfcfd]"
              style="box-shadow: 0px 1px 3px 0px rgba(0,0,0,0.1), 0px 3px 22px 0px rgba(38,42,50,0.09);"
            >
              <ul class="list-disc ps-[18px] text-[12px] font-medium text-[#61667c] leading-[1.5] whitespace-nowrap">
                <li v-for="m in moreTooltipMethods" :key="m">{{ m }}</li>
              </ul>
            </div>
            <span class="more-tooltip__arrow" />
          </div>
        </div>
      </Transition>
    </Teleport>

  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { vendors } from '../../composables/useVendors.js'
import AddVendorPage from './AddVendorPage.vue'

// Add New Vendor full-page overlay
const addVendorOpen = ref(false)

// Vendor details page (row click or dropdown "Details")
const router = useRouter()
function viewVendor(v) {
  router.push({ path: '/vendors/details', query: { id: v.id } })
}
function viewMenuVendor() {
  const v = vendors.find((x) => x.id === openMenuId.value)
  openMenuId.value = null
  if (v) viewVendor(v)
}

// Toolbar segmented controls
const tabs = ['All', 'Active', 'Inactive', 'Archive']
const activeTab = ref('All')

const columns = [
  { key: 'name', label: 'Name', sortable: true },
  { key: 'email', label: 'Email', sortable: true },
  { key: 'payment', label: 'Payment details', sortable: false },
  { key: 'lastPayment', label: 'Last payment', sortable: true },
  { key: 'addedOn', label: 'Added on', sortable: true },
  { key: 'action', label: '', sortable: false },
]

const filteredVendors = computed(() => {
  if (activeTab.value === 'All') return vendors
  return vendors.filter((v) => v.status === activeTab.value)
})

// Row-actions dropdown, anchored below-right of the clicked ⋯ button
const openMenuId = ref(null)
const menuPos = ref({ left: 0, top: 0 })

function toggleMenu(event, id) {
  if (openMenuId.value === id) {
    openMenuId.value = null
    return
  }
  const rect = event.currentTarget.getBoundingClientRect()
  menuPos.value = { left: rect.right - 162, top: rect.bottom + 4 }
  openMenuId.value = id
}

// Extra payment methods tooltip under the hovered "+ N more"
const moreTooltipId = ref(null)
const moreTooltipPos = ref({ left: 0, top: 0 })
const moreTooltipMethods = computed(() => {
  const v = vendors.find((x) => x.id === moreTooltipId.value)
  return v?.moreMethods ?? []
})

function showMoreTooltip(event, id) {
  const rect = event.currentTarget.getBoundingClientRect()
  moreTooltipPos.value = { left: rect.left + rect.width / 2, top: rect.bottom + 10 }
  moreTooltipId.value = id
}

</script>

<style scoped>
/* Up-pointing arrow centered above the tooltip body */
.more-tooltip__arrow {
  position: absolute;
  left: 50%;
  top: -6px;
  transform: translateX(-50%);
  width: 0;
  height: 0;
  border-left: 6px solid transparent;
  border-right: 6px solid transparent;
  border-bottom: 6px solid #fcfcfd;
  filter: drop-shadow(0 -1px 1px rgba(0, 0, 0, 0.05));
}

/* Tooltip motion: fast in with a 4px slide toward the pointer, faster fade out */
.more-tooltip-enter-active { transition: opacity 140ms ease-out, transform 140ms ease-out; }
.more-tooltip-leave-active { transition: opacity 100ms ease-in; }
.more-tooltip-enter-from { opacity: 0; transform: translateY(-4px); }
.more-tooltip-leave-to { opacity: 0; }

/* Dropdown: quick scale+fade from the anchor corner */
.vendor-menu-enter-active { transition: opacity 140ms ease-out, transform 140ms ease-out; transform-origin: top right; }
.vendor-menu-leave-active { transition: opacity 100ms ease-in; transform-origin: top right; }
.vendor-menu-enter-from { opacity: 0; transform: scale(0.96) translateY(-2px); }
.vendor-menu-leave-to { opacity: 0; }

/* Add New Vendor full page: gentle rise + fade in, quicker fade out */
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

@media (prefers-reduced-motion: reduce) {
  .more-tooltip-enter-active, .more-tooltip-leave-active,
  .vendor-menu-enter-active, .vendor-menu-leave-active,
  .full-page-enter-active, .full-page-leave-active { transition: none; }
  .more-tooltip-enter-from, .vendor-menu-enter-from { transform: none; }
}
</style>
