<template>
  <div class="relative bg-white flex flex-col h-full w-full overflow-y-auto overflow-x-hidden">
    <div class="flex flex-1 flex-col items-start w-full pt-[4px]">

      <!-- Page title -->
      <div class="flex items-center gap-[32px] px-[24px] py-[12px] w-full shrink-0">
        <p class="font-medium text-[18px] text-[#03102f] leading-[1.35] whitespace-nowrap">Bill Pay settings</p>
      </div>

      <!-- Side menu + content -->
      <div class="flex items-start gap-[24px] w-full px-[24px] pt-[12px] pb-[12px]">

        <!-- Settings side menu -->
        <div class="flex flex-col gap-[8px] w-[200px] shrink-0">
          <button
            v-for="item in menuItems"
            :key="item"
            type="button"
            class="flex items-center w-full px-[12px] py-[8px] rounded-[8px] text-left transition-colors duration-150"
            :class="activeMenu === item ? 'bg-[#f0f4fc]' : 'hover:bg-[#f6f7f9]'"
            @click="activeMenu = item"
          >
            <span
              class="text-[14px] leading-[1.5] whitespace-nowrap"
              :class="activeMenu === item ? 'font-medium text-[#002771]' : 'font-normal text-[#61667c]'"
            >{{ item }}</span>
          </button>
        </div>

        <!-- Categories section -->
        <div v-if="activeMenu === 'Categories'" class="flex flex-1 flex-col gap-[24px] min-w-0">

          <!-- Section header -->
          <div class="flex items-center justify-between gap-[16px] w-full">
            <p class="text-[16px] font-medium text-[#03102f] leading-[1.4] whitespace-nowrap">Categories</p>
            <div class="flex items-center gap-[8px] shrink-0">
              <button
                type="button"
                class="flex items-center justify-center h-[36px] px-[12px] rounded-[8px] border border-[#f2f2f4] transition-[filter] duration-150 hover:brightness-95 active:translate-y-[1px]"
                style="background: linear-gradient(to bottom, #ffffff, #f2f2f2); box-shadow: 0px 1.5px 0px 0px #e5e5e5;"
              >
                <span class="text-[14px] font-medium text-[#61667c] leading-[1.5] whitespace-nowrap" style="text-shadow: 0px 1px 1px rgba(0,0,0,0.08);">Map to Xero</span>
              </button>
              <button
                type="button"
                class="flex items-center justify-center h-[36px] px-[12px] rounded-[8px] border border-[#2465de] transition-[filter] duration-150 hover:brightness-105 active:translate-y-[1px]"
                style="background: linear-gradient(to bottom, #4179e2, #1f5bcc); box-shadow: 0px 1.5px 0px 0px #1d5fd9;"
              >
                <span class="text-[14px] font-medium text-white leading-[1.5] whitespace-nowrap" style="text-shadow: 0px 1px 1px rgba(0,0,0,0.12);">Add Category</span>
              </button>
            </div>
          </div>

          <!-- Stat cards -->
          <div class="flex items-start gap-[16px] w-full">
            <div
              v-for="stat in stats"
              :key="stat.label"
              class="flex flex-1 flex-col min-w-px rounded-[8px] border border-[#e5e6ea] bg-white overflow-hidden"
            >
              <div class="flex items-center gap-[8px] pl-[12px] pr-[16px] py-[8px] w-full border-b border-[#e5e6ea]">
                <p class="flex-1 min-w-px text-[12px] font-normal text-[#03102f] leading-[1.5]">{{ stat.label }}</p>
              </div>
              <div class="flex items-center gap-[8px] px-[16px] py-[12px] w-full">
                <p
                  class="flex-1 min-w-px text-[18px] font-medium leading-[1.35] whitespace-nowrap overflow-hidden text-ellipsis"
                  style="font-family: 'Reddit Mono', ui-monospace, monospace;"
                  :style="{ color: stat.color || '#03102f' }"
                >{{ stat.value }}</p>
              </div>
            </div>
          </div>

          <!-- Table card -->
          <div class="w-full rounded-[8px] border border-[#e5e6ea] overflow-hidden bg-white">

            <!-- Toolbar -->
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
              <table class="w-full border-collapse min-w-[720px]" style="table-layout: fixed;">
                <colgroup>
                  <col style="width: 25%;" />
                  <col style="width: 25%;" />
                  <col style="width: 18%;" />
                  <col />
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
                    v-for="c in filteredCategories"
                    :key="c.name"
                    class="cursor-pointer hover:bg-[#fcfcfd] transition-colors duration-150 [&:last-child>td]:border-b-0"
                    @click="openCategory(c)"
                  >
                    <td class="h-[44px] px-[12px] py-[8px] align-middle border-b border-r border-[#e5e6ea]">
                      <p class="text-[13px] font-normal text-[#03102f] leading-[1.5] whitespace-nowrap overflow-hidden text-ellipsis">{{ c.name }}</p>
                    </td>
                    <td class="h-[44px] px-[12px] py-[8px] align-middle border-b border-r border-[#e5e6ea]">
                      <span v-if="c.gl" class="block text-[13px] text-[#03102f] leading-[1.4] whitespace-nowrap overflow-hidden text-ellipsis" style="font-family: 'Reddit Mono', ui-monospace, monospace; font-weight: 500;">{{ c.gl }}</span>
                      <span v-else class="text-[13px] font-normal text-[#bd8400] leading-[1.5] whitespace-nowrap">Unmapped</span>
                    </td>
                    <td class="h-[44px] px-[12px] py-[8px] align-middle border-b border-r border-[#e5e6ea]">
                      <span class="text-[13px] text-[#03102f] leading-[1.4] whitespace-nowrap" style="font-family: 'Reddit Mono', ui-monospace, monospace; font-weight: 500;">{{ c.tax }}</span>
                    </td>
                    <td class="h-[44px] px-[12px] py-[8px] align-middle border-b border-[#e5e6ea]">
                      <div class="flex items-center justify-between gap-[8px]">
                        <span
                          class="flex items-center justify-center min-h-[24px] min-w-[32px] px-[8px] py-[2px] rounded-[24px]"
                          :style="c.active ? 'background: #e6f9f0;' : 'background: #f2f2f4;'"
                        >
                          <span class="text-[12px] font-medium leading-[1.5] text-center whitespace-nowrap" :style="c.active ? 'color: #238b5b;' : 'color: #484d61;'">{{ c.active ? 'Active' : 'Inactive' }}</span>
                        </span>
                        <a href="#" class="text-[13px] font-medium text-[#2465de] hover:underline cursor-pointer whitespace-nowrap" @click.prevent.stop="openCategory(c)">See details</a>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- Pagination -->
          <div class="flex items-center justify-between w-full shrink-0">
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
            <div class="flex justify-end shrink-0">
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

        <!-- Approval rules section -->
        <ApprovalRulesSection v-else-if="activeMenu === 'Approval rules'" />

        <!-- Bill Inbox section -->
        <BillInboxSection v-else-if="activeMenu === 'Bill Inbox'" />

        <!-- Integrations section -->
        <IntegrationsSection v-else-if="activeMenu === 'Integrations'" />

        <!-- Other sections: not designed yet -->
        <div v-else class="flex flex-1 items-center justify-center py-[64px]">
          <p class="text-[13px] font-normal text-[#8093b8] leading-[1.5]">{{ activeMenu }} is not part of this prototype yet</p>
        </div>
      </div>
    </div>

    <!-- Click-outside backdrop: anywhere off the drawer closes it -->
    <div v-if="detailCategory" class="absolute inset-0 z-40" @click="detailCategory = null" />

    <!-- Category detail drawer — slides in from the right -->
    <Transition name="drawer">
      <div
        v-if="detailCategory"
        class="absolute inset-y-0 right-0 z-50 w-[480px] max-w-full bg-white flex flex-col"
        style="box-shadow: -8px 0px 28px rgba(38,42,50,0.12);"
      >
        <!-- header -->
        <div class="shrink-0 flex items-start gap-[32px] border-b border-[#e5e6ea] p-[16px]">
          <p class="flex-1 pt-[2px] font-medium text-[16px] text-[#03102f] leading-[1.4]">{{ detailCategory.name }}</p>
          <button class="flex items-center justify-center size-[32px] rounded-[4px] shrink-0 transition-colors duration-150 hover:bg-[#f0f1f5]" @click="detailCategory = null">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M5 5L15 15M15 5L5 15" stroke="#61667c" stroke-width="1.6" stroke-linecap="round" /></svg>
          </button>
        </div>

        <!-- fields -->
        <div class="flex-1 overflow-y-auto flex flex-col gap-[16px] px-[16px] py-[12px]">
          <FieldRows :rows="drawerRows" :values="drawerValues" />

          <!-- OCR keywords -->
          <div class="flex flex-col gap-[4px] w-full">
            <span class="flex items-center h-[20px] font-medium text-[12px] text-[#61667c] leading-[1.5]">OCR keywords</span>
            <div
              class="flex flex-wrap items-center gap-[6px] w-full min-h-[40px] px-[8px] py-[6px] rounded-[8px] border border-[#e5e6ea] bg-white"
              style="box-shadow: 0px 1px 3px 0px rgba(0,0,0,0.04), 0px 1.5px 1.5px 0px rgba(0,0,0,0.09);"
            >
              <span
                v-for="kw in drawerKeywords"
                :key="kw"
                class="flex items-center gap-[4px] min-h-[24px] px-[8px] py-[2px] rounded-[24px] bg-[#e5eeff]"
              >
                <span class="text-[12px] font-medium text-[#2465de] leading-[1.5] whitespace-nowrap">{{ kw }}</span>
                <button type="button" class="flex items-center justify-center shrink-0" aria-label="Remove keyword" @click="removeKeyword(kw)">
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><circle cx="7" cy="7" r="6" fill="#2465de" /><path d="M4.9 4.9l4.2 4.2M9.1 4.9l-4.2 4.2" stroke="#fff" stroke-width="1.2" stroke-linecap="round" /></svg>
                </button>
              </span>
            </div>
          </div>

          <!-- divider -->
          <div class="flex justify-center w-full"><div class="h-px w-[120px] bg-[#e5e6ea]" /></div>

          <!-- status toggle -->
          <div class="flex flex-col gap-[4px] w-full">
            <span class="flex items-center h-[20px] font-medium text-[12px] text-[#61667c] leading-[1.5]">Status</span>
            <div class="flex items-center gap-[16px] w-full">
              <button
                type="button"
                class="relative flex items-center w-[40px] h-[24px] rounded-full shrink-0 transition-colors duration-150"
                :style="{ background: drawerActive ? '#2465de' : '#d4d8e2' }"
                role="switch"
                :aria-checked="drawerActive"
                @click="drawerActive = !drawerActive"
              >
                <span
                  class="absolute top-[2px] left-[2px] size-[20px] rounded-full bg-white transition-transform duration-150"
                  style="box-shadow: 0px 1px 2px rgba(16,24,40,0.1);"
                  :style="{ transform: drawerActive ? 'translateX(16px)' : 'translateX(0)' }"
                />
              </button>
              <span class="text-[14px] font-normal text-[#03102f] leading-[1.5]">{{ drawerActive ? 'Active' : 'Inactive' }}</span>
              <span class="flex-1 min-w-px text-[12px] font-normal text-[#61667c] leading-[1.5] text-right">Inactive categories are hidden from bill forms.</span>
            </div>
          </div>
        </div>

        <!-- footer -->
        <div class="shrink-0 border-t border-[#e5e6ea] flex items-center justify-between p-[16px]">
          <button
            class="btn-secondary flex h-[36px] items-center justify-center px-[12px] rounded-[8px] text-[14px] font-medium text-[#61667c]"
            style="text-shadow: 0px 1px 1px rgba(0,0,0,0.08);"
            @click="detailCategory = null"
          >Cancel</button>
          <button
            class="btn-primary flex h-[36px] items-center justify-center min-w-[100px] px-[12px] rounded-[8px] text-[14px] font-medium text-white"
            @click="saveCategory"
          >Save</button>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { useRoute } from 'vue-router'
import FieldRows from '../forms/FieldRows.vue'
import ApprovalRulesSection from '../content/ApprovalRulesSection.vue'
import BillInboxSection from '../content/BillInboxSection.vue'
import IntegrationsSection from '../content/IntegrationsSection.vue'

const menuItems = ['Categories', 'Approval rules', 'Bill Inbox', 'Integrations']

// Deep-linkable sections, e.g. /settings?section=bill-inbox
const sectionSlugs = {
  'categories': 'Categories',
  'approval-rules': 'Approval rules',
  'bill-inbox': 'Bill Inbox',
  'integrations': 'Integrations',
}
const route = useRoute()
const activeMenu = ref(sectionSlugs[route.query.section] ?? 'Categories')

const stats = [
  { label: 'Total categories', value: '16' },
  { label: 'Mapped to Xero', value: '11', color: '#238b5b' },
  { label: 'Unmapped', value: '4', color: '#c20a1c' },
  { label: 'Inactive', value: '1' },
]

const tabs = ['All', 'Active', 'Inactive']
const activeTab = ref('All')

const columns = [
  { key: 'name', label: 'Category', sortable: true },
  { key: 'gl', label: 'GL Code - Account name', sortable: false },
  { key: 'tax', label: 'Tax rate', sortable: false },
  { key: 'status', label: 'Status', sortable: false },
]

const categories = reactive([
  { name: 'Rent', gl: '237 - Account Receivable', tax: 'GST 9%', active: true, keywords: ['rent', 'lease', 'tenancy'] },
  { name: 'Training Programs', gl: '491 - Inventory Stock', tax: 'GST 9%', active: true, keywords: ['training', 'course'] },
  { name: 'Maintenance Costs', gl: '356 - Cash on Hand', tax: 'N/A', active: true, keywords: ['maintenance', 'repair'] },
  { name: 'Marketing Services', gl: '129 - Prepaid Expenses', tax: 'GST 9%', active: true, keywords: ['marketing', 'ads'] },
  { name: 'Legal Services', gl: '478 - Accounts Payable', tax: 'GST 9%', active: true, keywords: ['legal', 'counsel'] },
  { name: 'Equipment Rental', gl: '265 - Fixed Assets', tax: 'GST 9%', active: false, keywords: ['equipment', 'rental'] },
  { name: 'Utility Bills', gl: '', tax: 'Exempt', active: true, keywords: ['utility', 'electricity', 'water'] },
  { name: 'Software Licenses', gl: '399 - Long-term Liabilities', tax: 'GST 9%', active: false, keywords: ['software', 'license', 'saas'] },
  { name: 'Consulting Fees', gl: '182 - Client Payments', tax: 'GST 9%', active: true, keywords: ['consulting', 'advisory'] },
  { name: 'Travel Expenses', gl: '', tax: 'N/A', active: false, keywords: ['travel', 'flight', 'hotel'] },
  { name: 'Office Supplies', gl: '', tax: 'Exempt', active: false, keywords: ['office', 'stationery'] },
])

const filteredCategories = computed(() => {
  if (activeTab.value === 'Active') return categories.filter((c) => c.active)
  if (activeTab.value === 'Inactive') return categories.filter((c) => !c.active)
  return categories
})

// ── Category detail drawer ──

const detailCategory = ref(null)
const drawerValues = reactive({})
const drawerKeywords = ref([])
const drawerActive = ref(true)

const GL_OPTIONS = [
  '129 - Prepaid Expenses',
  '182 - Client Payments',
  '237 - Account Receivable',
  '265 - Fixed Assets',
  '300 - Rent Expense',
  '356 - Cash on Hand',
  '399 - Long-term Liabilities',
  '478 - Accounts Payable',
  '491 - Inventory Stock',
]

const drawerRows = computed(() => [
  [{ label: 'Category name', required: true, placeholder: 'Select category name', options: [detailCategory.value?.name ?? ''] }],
  [{ label: 'Apply GL code', placeholder: 'Select GL code', options: GL_OPTIONS }],
  [{ label: 'Default tax rate', placeholder: 'Select tax rate', options: ['GST 9%', 'Exempt', 'N/A'] }],
])

function openCategory(c) {
  Object.assign(drawerValues, {
    'Category name': c.name,
    'Apply GL code': c.gl,
    'Default tax rate': c.tax,
  })
  drawerKeywords.value = [...c.keywords]
  drawerActive.value = c.active
  detailCategory.value = c
}

function removeKeyword(kw) {
  drawerKeywords.value = drawerKeywords.value.filter((k) => k !== kw)
}

function saveCategory() {
  const c = detailCategory.value
  if (c) {
    c.gl = drawerValues['Apply GL code']
    c.tax = drawerValues['Default tax rate']
    c.keywords = [...drawerKeywords.value]
    c.active = drawerActive.value
  }
  detailCategory.value = null
}
</script>

<style scoped>
/* Slide-over drawer — enters right→left on the standard curve, quicker exit. */
.drawer-enter-active { transition: transform 280ms cubic-bezier(0.4, 0, 0.2, 1); }
.drawer-leave-active { transition: transform 200ms cubic-bezier(0.4, 0, 0.2, 1); }
.drawer-enter-from,
.drawer-leave-to { transform: translateX(100%); }

/* ── Buttons (Figma: Button/Secondary, Button/Primary) ── */
.btn-secondary {
  background: linear-gradient(to bottom, #ffffff, #f2f2f2);
  border: 1px solid #f2f2f4;
  box-shadow: 0px 1.5px 0px 0px #e5e5e5;
  transition: filter 150ms ease, transform 150ms ease, box-shadow 150ms ease;
}
.btn-secondary:hover { filter: brightness(0.98); }
.btn-secondary:active {
  transform: translateY(1px);
  box-shadow: 0px 0.5px 0px 0px #e5e5e5;
}

.btn-primary {
  background: linear-gradient(to bottom, #4179e2, #1f5bcc);
  border: 1px solid #2465de;
  box-shadow: 0px 1.5px 0px 0px #1d5fd9;
  text-shadow: 0px 1px 1px rgba(0, 0, 0, 0.12);
  transition: filter 150ms ease, transform 150ms ease, box-shadow 150ms ease;
}
.btn-primary:hover { filter: brightness(1.05); }
.btn-primary:active {
  transform: translateY(1px);
  box-shadow: 0px 0.5px 0px 0px #1d5fd9;
}

@media (prefers-reduced-motion: reduce) {
  .drawer-enter-active,
  .drawer-leave-active,
  .btn-secondary,
  .btn-primary { transition: none; }
}
</style>
