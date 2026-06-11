<template>
  <div class="fixed inset-0 z-50 flex flex-col bg-white">
    <!-- Top bar -->
    <div class="flex items-stretch shrink-0" style="border-bottom: 1px solid #e5e6ea;">
      <div class="flex items-center flex-1 min-w-0" style="padding: 16px 24px;">
        <span class="text-[16px] font-medium text-[#03102f]" style="line-height: 1.4;">Add bank account</span>
      </div>
      <button
        class="flex items-center justify-center hover:bg-[#f8f9fc] transition-colors duration-150"
        style="border-left: 1px solid #e5e6ea; padding: 8px 24px; gap: 8px;"
        @click="$emit('close')"
      >
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
          <path fill-rule="evenodd" clip-rule="evenodd" d="M9 10.0608L13.2426 14.3035C13.5355 14.5964 14.0104 14.5964 14.3033 14.3035C14.5961 14.0105 14.5961 13.5357 14.3033 13.2427L10.0607 9.00015L14.3033 4.75751C14.5961 4.46462 14.5961 3.98974 14.3033 3.69685C14.0104 3.40396 13.5355 3.40396 13.2426 3.69685L9 7.9395L4.75732 3.69684C4.46443 3.40395 3.98955 3.40395 3.69666 3.69684C3.40377 3.98974 3.40377 4.46461 3.69666 4.7575L7.93928 9.00015L3.69666 13.2428C3.40377 13.5357 3.40377 14.0105 3.69666 14.3035C3.98955 14.5964 4.46443 14.5964 4.75732 14.3035L9 10.0608Z" fill="#61667C"/>
        </svg>
        <span class="text-[14px] font-medium text-[#61667c]" style="line-height: 1.5;">Close</span>
      </button>
    </div>

    <!-- Content -->
    <div class="flex-1 overflow-y-auto">
      <div class="flex justify-center" style="padding: 24px;">
        <!-- Wrap -->
        <div class="rounded-[8px]" style="background: #f8f9fc; padding: 4px;">
          <!-- Card -->
          <div
            class="flex flex-col bg-white rounded-[8px]"
            style="width: 600px; padding-top: 16px; gap: 24px; box-shadow: 0px 1px 4px 0px rgba(0,0,0,0.06), 0px 1px 1px 0px rgba(0,0,0,0.06);"
          >
            <div class="flex flex-col" style="padding: 0 16px; gap: 16px;">

              <!-- Snackbar -->
              <div
                class="flex items-center w-full rounded-[8px]"
                style="background: #e5eeff; border: 1px solid #b3cdfe; padding: 8px 12px 8px 8px; gap: 4px;"
              >
                <span class="text-[12px] text-[#03102f]" style="line-height: 1.5;">
                  Please note payouts are only available for bank accounts under the registered business name.
                </span>
              </div>

              <!-- Field rows -->
              <div
                v-for="(row, ri) in fieldRows"
                :key="ri"
                class="flex w-full"
                :class="row.some(f => f.helper) ? 'items-start' : 'items-center'"
                style="gap: 12px;"
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

              <!-- Proof of ownership upload -->
              <div class="flex flex-col w-full" style="gap: 4px;">
                <span class="flex items-center text-[12px] font-medium text-[#61667c]" style="height: 20px; line-height: 1.5;">
                  Proof ownership (e.g. bank account statement)
                </span>
                <div
                  class="flex items-center w-full bg-white rounded-[8px]"
                  style="border: 1px solid #e5e6ea; padding: 4px 4px 4px 8px; gap: 16px; filter: drop-shadow(0px 1px 1.5px rgba(0,0,0,0.04)) drop-shadow(0px 1.5px 0.75px rgba(0,0,0,0.09));"
                >
                  <span class="flex-1 min-w-0 text-[12px] text-[#61667c]" style="line-height: 1.5;">
                    Choose file from your computer or drag here
                  </span>
                  <button
                    class="btn-secondary flex items-center justify-center rounded-[8px] shrink-0"
                    style="height: 28px; padding: 8px; gap: 6px;"
                  >
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path fill-rule="evenodd" clip-rule="evenodd" d="M7.66667 2.66667C5.90089 2.66667 4.49269 4.25391 4.68486 5.99949C4.72196 6.33647 4.50339 6.6452 4.17901 6.7264C3.30979 6.94393 2.66667 7.731 2.66667 8.66667C2.66667 9.77127 3.5621 10.6667 4.66667 10.6667H5.33333C5.70152 10.6667 6 10.9651 6 11.3333C6 11.7015 5.70152 12 5.33333 12H4.66667C2.82572 12 1.33333 10.5076 1.33333 8.66667C1.33333 7.29907 2.15645 6.12499 3.33369 5.61076C3.36362 3.24329 5.29209 1.33333 7.66667 1.33333C9.52373 1.33333 11.1067 2.50103 11.7237 4.14132C13.42 4.60511 14.6667 6.15641 14.6667 8C14.6667 10.2091 12.8758 12 10.6667 12C10.2985 12 10 11.7015 10 11.3333C10 10.9651 10.2985 10.6667 10.6667 10.6667C12.1394 10.6667 13.3333 9.47273 13.3333 8C13.3333 6.67633 12.3683 5.57683 11.1035 5.36883C10.8435 5.32609 10.6318 5.13549 10.5627 4.88034C10.2173 3.60442 9.05067 2.66667 7.66667 2.66667ZM8.66667 8.27747L9.52893 9.13847C9.78953 9.3986 10.2116 9.39827 10.4718 9.13773C10.7319 8.87713 10.7316 8.45507 10.4711 8.19487L8.5888 6.31561C8.26347 5.99079 7.73653 5.99079 7.4112 6.31561L5.52897 8.19487C5.26841 8.45507 5.26808 8.87713 5.52823 9.13773C5.78837 9.39827 6.21048 9.3986 6.47103 9.13847L7.33333 8.27747V14C7.33333 14.3682 7.6318 14.6667 8 14.6667C8.3682 14.6667 8.66667 14.3682 8.66667 14V8.27747Z" fill="#61667C"/>
                    </svg>
                    <span class="text-[12px] font-medium text-[#61667c]" style="line-height: 1.5; text-shadow: 0px 1px 1px rgba(0,0,0,0.08);">Upload</span>
                  </button>
                </div>
              </div>

              <!-- HitPay password -->
              <div class="flex flex-col w-full" style="gap: 4px;">
                <span class="flex items-center text-[12px] font-medium text-[#61667c]" style="height: 20px; line-height: 1.5;">
                  Enter HitPay password
                </span>
                <div class="aba-control" style="gap: 8px;">
                  <input
                    v-model="password"
                    :type="passwordVisible ? 'text' : 'password'"
                    placeholder="HitPay password"
                    class="aba-input"
                  />
                  <button
                    class="shrink-0 flex items-center justify-center transition-opacity duration-150"
                    style="margin-right: 8px;"
                    :style="{ opacity: passwordVisible ? 1 : 0.75 }"
                    @click="passwordVisible = !passwordVisible"
                  >
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path fill-rule="evenodd" clip-rule="evenodd" d="M2.66701 8.0008L2.66688 8L2.66701 7.9992C2.66865 7.9888 2.67794 7.93 2.72992 7.81447C2.78711 7.68727 2.87988 7.527 3.01261 7.34253C3.27778 6.97407 3.6744 6.54805 4.17568 6.14409C5.18475 5.33091 6.54152 4.66667 8 4.66667C9.45847 4.66667 10.8153 5.33091 11.8243 6.14409C12.3256 6.54805 12.7222 6.97407 12.9874 7.34253C13.1201 7.527 13.2129 7.68727 13.2701 7.81447C13.3221 7.93 13.3313 7.9888 13.333 7.9992L13.3331 8L13.333 8.0008C13.3313 8.0112 13.3221 8.07 13.2701 8.18553C13.2129 8.31273 13.1201 8.473 12.9874 8.65747C12.7222 9.02593 12.3256 9.45193 11.8243 9.85593C10.8153 10.6691 9.45847 11.3333 8 11.3333C6.54152 11.3333 5.18475 10.6691 4.17568 9.85593C3.6744 9.45193 3.27778 9.02593 3.01261 8.65747C2.87988 8.473 2.78711 8.31273 2.72992 8.18553C2.67794 8.07 2.66865 8.0112 2.66701 8.0008ZM8 3.33333C6.14477 3.33333 4.50153 4.16909 3.33904 5.10591C2.75453 5.57695 2.27247 6.0884 1.93041 6.5637C1.75952 6.80113 1.61653 7.03933 1.51388 7.2676C1.41565 7.486 1.33333 7.74127 1.33333 8C1.33333 8.25873 1.41565 8.514 1.51388 8.7324C1.61653 8.96067 1.75952 9.19887 1.93041 9.43627C2.27247 9.9116 2.75453 10.4231 3.33904 10.8941C4.50153 11.8309 6.14477 12.6667 8 12.6667C9.8552 12.6667 11.4985 11.8309 12.6609 10.8941C13.2455 10.4231 13.7275 9.9116 14.0696 9.43627C14.2405 9.19887 14.3835 8.96067 14.4861 8.7324C14.5843 8.514 14.6667 8.25873 14.6667 8C14.6667 7.74127 14.5843 7.486 14.4861 7.2676C14.3835 7.03933 14.2405 6.80113 14.0696 6.5637C13.7275 6.0884 13.2455 5.57695 12.6609 5.10591C11.4985 4.16909 9.8552 3.33333 8 3.33333ZM7.33333 8C7.33333 7.6318 7.6318 7.33333 8 7.33333C8.3682 7.33333 8.66667 7.6318 8.66667 8C8.66667 8.3682 8.3682 8.66667 8 8.66667C7.6318 8.66667 7.33333 8.3682 7.33333 8ZM8 6C6.8954 6 6 6.8954 6 8C6 9.1046 6.8954 10 8 10C9.1046 10 10 9.1046 10 8C10 6.8954 9.1046 6 8 6Z" fill="#61667C"/>
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            <!-- Button group (design keeps an invisible Back for spacing) -->
            <div class="flex items-center justify-between w-full" style="border-top: 1px solid #e5e6ea; padding: 16px;">
              <div style="visibility: hidden;">
                <button class="btn-secondary flex items-center justify-center rounded-[8px] text-[14px] font-medium text-[#61667c]" style="height: 36px; min-width: 100px; padding: 8px 12px;">Back</button>
              </div>
              <button
                class="btn-primary flex items-center justify-center rounded-[8px] text-[14px] font-medium text-white"
                style="height: 36px; min-width: 100px; padding: 8px 12px;"
                @click="$emit('close')"
              >Submit</button>
            </div>

          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, onUnmounted } from 'vue'

const emit = defineEmits(['close'])

const password = ref('')
const passwordVisible = ref(false)

// Two fields per row; selects carry `options`, text inputs don't
const fieldRows = [
  [
    { label: 'Wallet', required: true, placeholder: 'Select wallet', options: ['SGD Wallet', 'USD Wallet', 'EUR Wallet'] },
    { label: 'Country', required: true, placeholder: 'Select country', options: ['Singapore', 'Malaysia', 'Philippines', 'Indonesia', 'Thailand'] },
  ],
  [
    { label: 'Currency', required: true, placeholder: 'Select currency', options: ['SGD', 'USD', 'EUR', 'MYR', 'PHP'] },
    { label: 'Transfer method', required: true, placeholder: 'Select transfer method', options: ['FAST', 'GIRO', 'Wire transfer'] },
  ],
  [
    { label: 'Account holder name', placeholder: 'Enter account holder name', helper: 'The account name should be the same as your SEC/DTI and BIR registration' },
    { label: 'Entity type', required: true, placeholder: 'Select entity type', options: ['Individual', 'Sole-proprietorship', 'Company', 'Partnership'] },
  ],
  [
    { label: 'Bank name', required: true, placeholder: 'Select bank name', options: ['DBS Bank', 'OCBC Bank', 'UOB Bank', 'Citibank', 'Standard Chartered'] },
    { label: 'Account number', placeholder: 'Enter account number' },
  ],
]

// One reactive bag keyed by label — selects start empty so the placeholder option shows
const values = reactive(Object.fromEntries(
  fieldRows.flat().map(f => [f.label, ''])
))

function onKeydown(e) {
  if (e.key === 'Escape') emit('close')
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
