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

          <!-- Field rows (same control system as AddBankAccountPage) -->
          <div class="flex flex-col gap-[16px] px-[24px] py-[12px] w-full">
            <div
              v-for="(row, ri) in fieldRows[activeTab]"
              :key="activeTab + ri"
              class="flex w-full"
              :class="row.some(f => f.helper) ? 'items-start' : 'items-center'"
              :style="{ gap: '12px', padding: activeTab === 'Payment details' ? '0 16px' : '0' }"
            >
              <div v-for="field in row" :key="field.label" class="flex flex-col flex-1 min-w-0" style="gap: 4px;">
                <!-- Label -->
                <span class="flex items-center" style="height: 20px; gap: 2px;">
                  <span class="text-[12px] font-medium text-[#61667c]" style="line-height: 1.5;">{{ field.label }}</span>
                  <span v-if="field.required" class="text-[14px] text-[#dc3545]" style="line-height: 20px; letter-spacing: 0.035px;">*</span>
                </span>

                <!-- Select -->
                <div v-if="field.options" class="aba-control">
                  <select
                    v-model="values[field.label]"
                    class="aba-select"
                    :class="{ 'aba-placeholder': !values[field.label] }"
                  >
                    <option value="" disabled>{{ field.placeholder }}</option>
                    <option v-for="opt in field.options" :key="opt" :value="opt">{{ opt }}</option>
                  </select>
                  <svg class="aba-chevron" width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M8.4714 10.4715C8.21107 10.7318 7.78893 10.7318 7.5286 10.4715L3.75736 6.7002C3.49701 6.43988 3.49701 6.01777 3.75736 5.75742C4.01771 5.49707 4.43982 5.49707 4.70017 5.75742L8 9.05727L11.2998 5.75742C11.5602 5.49707 11.9823 5.49707 12.2427 5.75742C12.503 6.01777 12.503 6.43988 12.2427 6.7002L8.4714 10.4715Z" fill="#61667C"/>
                  </svg>
                </div>

                <!-- Phone (dial-code prefix) -->
                <div v-else-if="field.type === 'phone'" class="aba-control">
                  <button type="button" class="flex items-center gap-[4px] h-full pl-[8px] pr-[8px] border-r border-[#e5e6ea] shrink-0 cursor-pointer">
                    <svg class="shrink-0 rounded-[2px]" width="22" height="15" viewBox="0 0 22 15" style="filter: drop-shadow(0px 1px 1.5px rgba(16,24,40,0.1));"><rect width="22" height="15" fill="#fff" /><rect width="22" height="7.5" fill="#EF3340" /><circle cx="4.6" cy="3.75" r="2.3" fill="#fff" /><circle cx="5.5" cy="3.75" r="2" fill="#EF3340" /><g fill="#fff"><circle cx="6.4" cy="2.1" r="0.4" /><circle cx="5" cy="3.1" r="0.4" /><circle cx="7.8" cy="3.1" r="0.4" /><circle cx="5.5" cy="4.7" r="0.4" /><circle cx="7.3" cy="4.7" r="0.4" /></g></svg>
                    <span class="text-[12px] font-medium text-[#61667c] leading-[1.5] whitespace-nowrap">+65</span>
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path fill-rule="evenodd" clip-rule="evenodd" d="M8.4714 10.4715C8.21107 10.7318 7.78893 10.7318 7.5286 10.4715L3.75736 6.7002C3.49701 6.43988 3.49701 6.01777 3.75736 5.75742C4.01771 5.49707 4.43982 5.49707 4.70017 5.75742L8 9.05727L11.2998 5.75742C11.5602 5.49707 11.9823 5.49707 12.2427 5.75742C12.503 6.01777 12.503 6.43988 12.2427 6.7002L8.4714 10.4715Z" fill="#61667C"/></svg>
                  </button>
                  <input
                    v-model="values[field.label]"
                    type="tel"
                    :placeholder="field.placeholder"
                    class="aba-input"
                  />
                </div>

                <!-- Text input -->
                <div v-else class="aba-control">
                  <input
                    v-model="values[field.label]"
                    type="text"
                    :placeholder="field.placeholder"
                    class="aba-input"
                  />
                </div>

                <!-- Helper -->
                <span v-if="field.helper" class="text-[12px] text-[#61667c] w-full" style="line-height: 1.5;">{{ field.helper }}</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, onMounted, onUnmounted } from 'vue'

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
/* ── Input control (Figma: Input / State=Default → Focused) ── */
.aba-control {
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
/* Focused: blue border + 3px ring + inner shadow (Figma: Input Shadow/Focused) */
.aba-control:focus-within {
  border-color: #2465de;
  box-shadow: 0px 0px 0px 3px #b3cdfe, inset 0px 2px 4px 0px rgba(0, 0, 0, 0.24);
}

.aba-select {
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
.aba-select.aba-placeholder {
  color: #9295a5;
}

.aba-chevron {
  position: absolute;
  right: 8px;
  top: 50%;
  transform: translateY(-50%);
  pointer-events: none;
}

.aba-input {
  flex: 1;
  min-width: 0;
  height: 100%;
  background: transparent;
  border: none;
  outline: none;
  padding: 0 8px;
  font-size: 14px;
  line-height: 1.5;
  color: #03102f;
}
.aba-input::placeholder {
  color: #9295a5;
}

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
  .aba-control,
  .btn-secondary,
  .btn-primary { transition: none; }
}
</style>
