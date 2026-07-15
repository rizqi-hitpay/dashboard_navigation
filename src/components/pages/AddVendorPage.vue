<template>
  <div class="fixed inset-0 z-50 bg-white flex flex-col overflow-x-hidden">

    <!-- Header: Close / esc + Cancel / Next -->
    <div class="flex items-center justify-between px-[24px] py-[12px] w-full border-b border-[#e5e6ea] shrink-0">
      <button type="button" class="flex items-start gap-[4px] cursor-pointer" @click="close">
        <span class="text-[14px] font-normal text-[#61667c] leading-[1.5]">Close</span>
        <span class="flex items-center justify-center px-[8px] py-[2px] rounded-[4px] border border-[#e5e6ea] bg-white">
          <span class="text-[12px] font-medium text-[#9295a5] leading-[1.5] whitespace-nowrap">esc</span>
        </span>
      </button>
      <div class="flex items-center gap-[8px] pl-[12px]">
        <button
          type="button"
          class="btn-secondary flex items-center justify-center rounded-[8px] text-[14px] font-medium text-[#61667c]"
          style="height: 36px; min-width: 100px; padding: 8px 12px;"
          @click="close"
        >Cancel</button>
        <button
          type="button"
          class="btn-primary flex items-center justify-center rounded-[8px] text-[14px] font-medium text-white"
          style="height: 36px; min-width: 100px; padding: 8px 12px;"
          @click="next"
        >{{ activeTab === 'Payment details' ? 'Save' : 'Next' }}</button>
      </div>
    </div>

    <!-- Centered form container -->
    <div class="flex-1 overflow-y-auto">
      <div class="flex justify-center w-full">
        <div class="flex flex-col w-[600px] max-w-full pt-[12px]">

          <!-- Title -->
          <div class="flex items-center px-[24px] py-[12px] w-full">
            <p class="text-[16px] font-medium text-[#03102f] leading-[1.4] whitespace-nowrap">Add New Vendor</p>
          </div>

          <!-- Tabs -->
          <div class="flex flex-col px-[24px] py-[12px] w-full">
            <div class="flex items-center justify-center w-full border-b border-[#e5e6ea]">
              <button
                v-for="t in formTabs"
                :key="t"
                type="button"
                class="flex items-center justify-center gap-[8px] min-w-[88px] px-[12px] pb-[8px] -mb-px transition-colors duration-150"
                :class="activeTab === t ? 'border-b-2 border-[#2465de]' : 'border-b-2 border-transparent'"
                @click="activeTab = t"
              >
                <span
                  class="text-[12px] leading-[1.5] whitespace-nowrap"
                  :class="activeTab === t ? 'font-medium text-[#03102f]' : 'font-normal text-[#61667c]'"
                >{{ t }}</span>
              </button>
            </div>
          </div>

          <!-- Field rows (shared design-system inputs) -->
          <div class="flex flex-col gap-[16px] px-[24px] py-[12px] w-full">
            <FieldRows
              :rows="fieldRows[activeTab]"
              :values="values"
              :inset="activeTab === 'Payment details'"
            />
          </div>

        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, onMounted, onUnmounted } from 'vue'
import FieldRows from '../forms/FieldRows.vue'

const emit = defineEmits(['close'])

const formTabs = ['Vendor details', 'Payment details']
const activeTab = ref('Vendor details')

// Rows of 1–2 fields per tab; selects carry `options`, the phone field carries `type`
const fieldRows = {
  'Vendor details': [
    [
      { label: 'Legal name', placeholder: 'Enter legal name' },
      { label: 'Email address', placeholder: 'Enter email address', helper: 'Used for matching incoming invoices from Bill Inbox' },
    ],
    [
      { label: 'Phone', type: 'phone', placeholder: '877 1261 8181' },
      { label: 'Tax ID', placeholder: 'Enter tax ID' },
    ],
    [
      { label: 'Street', placeholder: 'Customer address' },
    ],
    [
      { label: 'City', placeholder: 'City name' },
      { label: 'State', placeholder: 'State name' },
    ],
    [
      { label: 'Country', placeholder: 'Select country', options: ['Singapore', 'Malaysia', 'Philippines', 'Indonesia', 'Thailand'] },
      { label: 'Postal code', placeholder: 'Postal code' },
    ],
    [
      { label: 'Notes (optional)', placeholder: 'Internal notes about this vendor' },
    ],
  ],
  'Payment details': [
    [
      { label: 'Entity type', placeholder: 'Select entity type', options: ['Individual', 'Sole-proprietorship', 'Company', 'Partnership'], value: 'Company' },
    ],
    [
      { label: 'Country', placeholder: 'Select country', options: ['Singapore', 'Malaysia', 'Philippines', 'Indonesia', 'Thailand'], value: 'Singapore' },
      { label: 'Currency', placeholder: 'Select currency', options: ['Singapore Dollar ($)', 'US Dollar ($)', 'Euro (€)', 'Malaysian Ringgit (RM)'], value: 'Singapore Dollar ($)' },
    ],
    [
      { label: 'Transfer method', placeholder: 'Select transfer method', options: ['Bank transfer', 'PayNow', 'Wire transfer'], value: 'Bank transfer' },
      { label: 'Transfer type', placeholder: 'Select transfer type', options: ['FAST', 'GIRO', 'SWIFT'], value: 'FAST' },
    ],
    [
      { label: 'Account holder name', placeholder: 'Enter account holder name', value: 'Orion Ventures' },
      { label: 'Account number', placeholder: 'Enter account number', value: '16277188299' },
    ],
    [
      { label: 'Bank name', placeholder: 'Enter bank name', value: 'DBS Bank Singapore' },
    ],
  ],
}

// One reactive bag keyed by label — selects start empty so the placeholder option
// shows, unless the field declares a prefilled value
const values = reactive(Object.fromEntries(
  Object.values(fieldRows).flat(2).map(f => [f.label, f.value ?? ''])
))

function close() {
  emit('close')
}

// Next steps into payment details first, then Save closes back to the list
function next() {
  if (activeTab.value === 'Vendor details') {
    activeTab.value = 'Payment details'
  } else {
    emit('close')
  }
}

function onKeydown(e) {
  if (e.key === 'Escape') close()
}
onMounted(() => window.addEventListener('keydown', onKeydown))
onUnmounted(() => window.removeEventListener('keydown', onKeydown))
</script>

<style scoped>
/* ── Buttons (Figma: Button/Secondary, Button/Primary) ── */
.btn-secondary {
  background: linear-gradient(to bottom, #ffffff, #f2f2f2);
  border: 1px solid #f2f2f4;
  box-shadow: 0px 1.5px 0px 0px #e5e5e5;
  text-shadow: 0px 1px 1px rgba(0, 0, 0, 0.08);
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
  .btn-secondary,
  .btn-primary { transition: none; }
}
</style>
