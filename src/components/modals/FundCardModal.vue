<template>
  <!-- Fund to Card Balance — 3-step flow (Figma: 88:15262 → 94:37032 → 94:38125) -->
  <Teleport to="body">
    <Transition name="fund-modal">
      <div v-if="open" class="fixed inset-0 z-[90] flex items-center justify-center p-[16px]">
        <div class="absolute inset-0" style="background: rgba(3,16,47,0.4); backdrop-filter: blur(6px);" @click="close" />
        <div
          class="fund-modal__card relative bg-white rounded-[16px] max-w-full flex flex-col"
          :class="step === 1 ? 'w-[640px]' : 'w-[480px]'"
          style="box-shadow: 0px 3px 22px 0px rgba(38,42,50,0.09);"
        >
          <!-- Header -->
          <div class="flex items-start justify-between gap-[16px] p-[16px] border-b border-[#e5e6ea]">
            <p class="text-[16px] font-medium text-[#03102f] leading-[1.4] pt-[2px]">{{ stepTitle }}</p>
            <button type="button" class="flex items-center justify-center size-[32px] rounded-[4px] hover:bg-[#f0f1f5] transition-colors duration-150" aria-label="Close" @click="close">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M5.5 5.5l9 9m0-9l-9 9" stroke="#61667c" stroke-width="1.5" stroke-linecap="round" /></svg>
            </button>
          </div>

          <!-- Step 1: amount (Figma: 88:15651) -->
          <template v-if="step === 1">
            <div class="flex flex-col gap-[16px] p-[24px]">
              <div class="relative flex items-start gap-[8px] w-full">
                <div
                  class="flex w-[calc(50%-4px)] min-w-0 flex-col gap-[12px] p-[12px] rounded-[12px] bg-white"
                  style="border: 3px solid #f2f2f4; box-shadow: 0px 3px 11px 0px rgba(38,42,50,0.09);"
                >
                  <div class="flex items-center gap-[12px] w-full">
                    <div class="flex items-center justify-center shrink-0 size-[38px] rounded-full bg-[#f2f2f4]">
                      <img :src="sgFlagIcon" width="22" height="16" alt="" class="rounded-[1px]" />
                    </div>
                    <div class="flex flex-col gap-[2px] min-w-0">
                      <p class="text-[10px] font-medium uppercase tracking-[0.3px] text-[#9295a5] leading-[18px] whitespace-nowrap">HitPay balance</p>
                      <p class="text-[18px] font-medium text-[#03102f] leading-[1.35] whitespace-nowrap overflow-hidden text-ellipsis" style="font-family: 'Reddit Mono', ui-monospace, monospace;">{{ fmtSGD(hitpayBalance) }}</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    class="flex items-center justify-center gap-[6px] w-full h-[28px] px-[8px] rounded-[8px] border border-[#f2f2f4] transition-[filter] duration-150 hover:brightness-95 active:translate-y-[1px]"
                    style="background: linear-gradient(to bottom, #ffffff, #f2f2f2); box-shadow: 0px 1.5px 0px 0px rgba(0,0,0,0.1);"
                  >
                    <img :src="arrowTopIcon" width="16" height="16" alt="" class="shrink-0" />
                    <span class="text-[12px] font-medium text-[#61667c] leading-[1.5] whitespace-nowrap" style="text-shadow: 0px 1px 1px rgba(0,0,0,0.08);">Top up</span>
                  </button>
                </div>
                <div
                  class="flex w-[calc(50%-4px)] min-w-0 items-center gap-[12px] py-[12px] pl-[24px] pr-[12px] rounded-[12px] bg-white"
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
                <!-- Cards differ in height here, so the arrow pins to the first row's center like the design -->
                <div
                  class="absolute left-1/2 -translate-x-1/2 top-[16.5px] flex items-center justify-center size-[36px] rounded-full bg-[#2465de]"
                  style="border: 3px solid #f2f2f4;"
                >
                  <img :src="arrowRightIcon" width="18" height="18" alt="" />
                </div>
              </div>

              <div class="flex items-start gap-[8px] w-full">
                <div class="flex flex-1 min-w-0 flex-col gap-[4px]">
                  <p class="text-[12px] font-medium text-[#61667c] leading-[1.5]">Transfer from HitPay Balance to Merchant Card Balance</p>
                  <div class="fund-amount flex items-center gap-[8px] h-[36px] px-[8px] w-full bg-white rounded-[8px]">
                    <div class="flex items-center self-stretch pr-[8px] border-r border-[#e5e6ea] shrink-0">
                      <span class="text-[12px] font-medium text-[#61667c] leading-[1.5] min-w-[24px]">SGD</span>
                    </div>
                    <input
                      v-model="amount"
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
                    @click="setMax"
                  >
                    <span class="text-[14px] font-medium text-[#61667c] leading-[1.5] whitespace-nowrap" style="text-shadow: 0px 1px 1px rgba(0,0,0,0.08);">Max</span>
                  </button>
                </div>
              </div>
            </div>

            <div class="flex items-center justify-end gap-[12px] px-[16px] py-[20px] border-t border-[#e5e6ea]">
              <button type="button" class="fund-btn-secondary min-w-[112px]" @click="close">
                <span>Cancel</span>
              </button>
              <button
                type="button"
                class="fund-btn-primary min-w-[112px]"
                :class="amountValue > 0 ? '' : 'opacity-50 cursor-not-allowed'"
                @click="confirmAmount"
              >
                <span>Confirm</span>
              </button>
            </div>
          </template>

          <!-- Step 2: payment method (Figma: 94:37989) -->
          <template v-else-if="step === 2">
            <div class="flex flex-col gap-[16px] p-[24px]">
              <button
                v-for="m in METHODS"
                :key="m.key"
                type="button"
                class="fund-method flex items-start gap-[12px] w-full p-[8px] rounded-[8px] text-left"
                :class="{ 'fund-method--selected': method === m.key }"
                @click="method = m.key"
              >
                <div class="flex items-center justify-center shrink-0 size-[40px] rounded-[8px] bg-white border border-[#e5e6ea]">
                  <img :src="m.icon" :width="m.iconW" :height="m.iconH" alt="" />
                </div>
                <span class="flex-1 min-w-0 self-center text-[12px] font-normal text-[#03102f] leading-[1.5]">{{ m.label }}</span>
                <span
                  class="flex items-center justify-center self-center min-h-[24px] min-w-[32px] px-[8px] py-[2px] rounded-[24px] bg-white border text-[12px] font-medium leading-[1.5] whitespace-nowrap"
                  :class="m.instant ? 'border-[#80acfe] text-[#2465de]' : 'border-[#ffe0a2] text-[#bd8400]'"
                >{{ m.chip }}</span>
              </button>
            </div>

            <div class="flex items-center justify-between gap-[12px] px-[16px] py-[20px] border-t border-[#e5e6ea]">
              <button type="button" class="fund-btn-secondary min-w-[112px]" @click="step = 1">
                <span>Back</span>
              </button>
              <button type="button" class="fund-btn-primary min-w-[112px]" @click="step = 3">
                <span>Continue</span>
              </button>
            </div>
          </template>

          <!-- Step 3: PayNow QR / waiting (Figma: 94:39068) -->
          <template v-else>
            <div class="flex flex-col items-center gap-[16px] p-[24px]">
              <div class="flex flex-col items-center gap-[2px] w-full p-[12px] rounded-[8px] bg-[#f8f9fc] text-center">
                <p class="text-[14px] font-medium text-[#61667c] leading-[1.5]">Amount</p>
                <p class="text-[24px] font-medium text-[#03102f] leading-[1.35]" style="font-family: 'Reddit Mono', ui-monospace, monospace;">{{ fmtSGD(amountValue) }}</p>
                <p class="text-[14px] font-normal text-[#61667c] leading-[1.5]">+ SGD 3.50 fee included</p>
              </div>

              <div class="relative size-[220px] bg-white shrink-0">
                <img :src="qrPattern" alt="" class="absolute" style="inset: 3.6%;" />
                <div class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center w-[63px] h-[43px] bg-white rounded-[4px]">
                  <img :src="paynowQrLogo" width="43" height="27" alt="PayNow" />
                </div>
              </div>

              <p class="text-[12px] font-medium text-[#61667c] leading-[1.5] text-center w-full">Scan this PayNow QR to complete wallet top up</p>
            </div>

            <div class="flex items-center justify-between gap-[12px] px-[16px] py-[20px] border-t border-[#e5e6ea]">
              <button type="button" class="fund-btn-secondary min-w-[112px]" @click="close">
                <span>Cancel</span>
              </button>
              <div class="flex items-center gap-[8px] h-[36px] px-[12px]">
                <svg class="fund-spinner shrink-0" width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <g stroke="#9295a5" stroke-width="1.5" stroke-linecap="round">
                    <line x1="9" y1="1.5" x2="9" y2="4.5" />
                    <line x1="14.3" y1="3.7" x2="12.2" y2="5.8" opacity="0.85" />
                    <line x1="16.5" y1="9" x2="13.5" y2="9" opacity="0.7" />
                    <line x1="14.3" y1="14.3" x2="12.2" y2="12.2" opacity="0.55" />
                    <line x1="9" y1="16.5" x2="9" y2="13.5" opacity="0.4" />
                    <line x1="3.7" y1="14.3" x2="5.8" y2="12.2" opacity="0.3" />
                    <line x1="1.5" y1="9" x2="4.5" y2="9" opacity="0.2" />
                    <line x1="3.7" y1="3.7" x2="5.8" y2="5.8" opacity="0.1" />
                  </g>
                </svg>
                <span class="text-[14px] font-medium text-[#61667c] leading-[1.5] whitespace-nowrap">Waiting for payment</span>
              </div>
            </div>
          </template>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, computed, watch, onUnmounted } from 'vue'
import sgFlagIcon from '../../assets/icons/flag-sg.svg'
import bankCardIcon from '../../assets/icons/icon-bank-card-blue.svg'
import arrowRightIcon from '../../assets/icons/icon-arrow-right-white.svg'
import arrowTopIcon from '../../assets/icons/icon-arrow-top.svg'
import paynowLogo from '../../assets/icons/logo-paynow.svg'
import paynowQrLogo from '../../assets/icons/logo-paynow-qr.svg'
import bankIcon from '../../assets/icons/icon-bank-transfer.svg'
import bankCardDarkIcon from '../../assets/icons/icon-bank-card-dark.svg'
import qrPattern from '../../assets/images/paynow-qr-pattern.svg'

const props = defineProps({
  open: { type: Boolean, required: true },
  hitpayBalance: { type: Number, required: true },
  cardBalance: { type: Number, required: true },
})

const emit = defineEmits(['close', 'funded'])

const METHODS = [
  { key: 'paynow', label: 'PayNow', icon: paynowLogo, iconW: 27, iconH: 17, chip: 'Instant', instant: true },
  { key: 'bank', label: 'Bank transfer', icon: bankIcon, iconW: 16, iconH: 16, chip: '1 hour', instant: false },
  { key: 'card', label: 'Cards', icon: bankCardDarkIcon, iconW: 21, iconH: 21, chip: 'Instant', instant: true },
]

const step = ref(1)
const amount = ref('')
const method = ref('paynow')

const fmtSGD = (n) => 'SGD ' + n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

const amountValue = computed(() => {
  const n = parseFloat(amount.value.replace(/,/g, ''))
  return Number.isFinite(n) && n > 0 ? n : 0
})

const stepTitle = computed(() =>
  step.value === 1 ? 'Fund to Card Balance' : step.value === 2 ? 'How would you like to pay?' : 'Make a payment',
)

function setMax() {
  amount.value = props.hitpayBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

function confirmAmount() {
  if (amountValue.value > 0) step.value = 2
}

function close() {
  emit('close')
}

// Reset on open; on the QR step, simulate the payment arriving after a moment
let payTimer = null

watch(
  () => props.open,
  (isOpen) => {
    if (isOpen) {
      step.value = 1
      amount.value = ''
      method.value = 'paynow'
    } else {
      clearTimeout(payTimer)
    }
  },
)

watch(step, (s) => {
  clearTimeout(payTimer)
  if (s === 3) {
    payTimer = setTimeout(() => emit('funded', amountValue.value), 4000)
  }
})

onUnmounted(() => clearTimeout(payTimer))
</script>

<style scoped>
.fund-modal__card {
  transition: width 280ms cubic-bezier(0.4, 0, 0.2, 1);
}

/* Amount input — standard recipe with focus ring on the wrapper */
.fund-amount {
  border: 1px solid #e5e6ea;
  box-shadow: 0px 1px 3px 0px rgba(0, 0, 0, 0.04), 0px 1.5px 1.5px 0px rgba(0, 0, 0, 0.09);
  transition: border-color 150ms ease, box-shadow 150ms ease;
}
.fund-amount:focus-within {
  border-color: #2465de;
  box-shadow: 0px 0px 0px 3px #b3cdfe, inset 0px 2px 4px 0px rgba(0, 0, 0, 0.24);
}

/* Payment method rows — 1px border always; selection adds a second ring so layout never shifts */
.fund-method {
  background: white;
  border: 1px solid #e5e6ea;
  box-shadow: 0px 1px 3px 0px rgba(0, 0, 0, 0.04), 0px 1.5px 1.5px 0px rgba(0, 0, 0, 0.09);
  cursor: pointer;
  transition: border-color 150ms ease, box-shadow 150ms ease, background-color 150ms ease;
}
.fund-method:hover { border-color: #cbcdd4; }
.fund-method--selected {
  background: #fcfcfd;
  border-color: #2465de;
  box-shadow: 0px 0px 0px 1px #2465de, 0px 3px 11px 0px rgba(38, 42, 50, 0.03);
}

/* Footer button recipes */
.fund-btn-secondary {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 36px;
  padding: 0 12px;
  border-radius: 8px;
  border: 1px solid #f2f2f4;
  background: linear-gradient(to bottom, #ffffff, #f2f2f2);
  box-shadow: 0px 1.5px 0px 0px #e5e5e5;
  transition: filter 150ms ease;
}
.fund-btn-secondary:hover { filter: brightness(0.95); }
.fund-btn-secondary:active { transform: translateY(1px); }
.fund-btn-secondary > span {
  font-size: 14px;
  font-weight: 500;
  line-height: 1.5;
  color: #61667c;
  white-space: nowrap;
  text-shadow: 0px 1px 1px rgba(0, 0, 0, 0.08);
}

.fund-btn-primary {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 36px;
  padding: 0 12px;
  border-radius: 8px;
  border: 1px solid #2465de;
  background: linear-gradient(to bottom, #4179e2, #1f5bcc);
  box-shadow: 0px 1.5px 0px 0px #1d5fd9;
  transition: filter 150ms ease;
}
.fund-btn-primary:hover { filter: brightness(1.05); }
.fund-btn-primary:active { transform: translateY(1px); }
.fund-btn-primary > span {
  font-size: 14px;
  font-weight: 500;
  line-height: 1.5;
  color: white;
  white-space: nowrap;
  text-shadow: 0px 1px 1px rgba(0, 0, 0, 0.12);
}

/* Waiting-for-payment spinner */
.fund-spinner { animation: fund-spin 1s steps(8) infinite; }
@keyframes fund-spin {
  to { transform: rotate(360deg); }
}

/* Modal: backdrop fade + card rise */
.fund-modal-enter-active { transition: opacity 200ms cubic-bezier(0.4, 0, 0.2, 1); }
.fund-modal-leave-active { transition: opacity 150ms ease-in; }
.fund-modal-enter-from,
.fund-modal-leave-to { opacity: 0; }
.fund-modal-enter-active .fund-modal__card { transition: transform 200ms cubic-bezier(0.4, 0, 0.2, 1); }
.fund-modal-enter-from .fund-modal__card { transform: translateY(12px); }

@media (prefers-reduced-motion: reduce) {
  .fund-modal__card, .fund-amount, .fund-method,
  .fund-btn-secondary, .fund-btn-primary,
  .fund-modal-enter-active, .fund-modal-leave-active { transition: none; }
  .fund-modal-enter-from .fund-modal__card { transform: none; }
  .fund-spinner { animation: none; }
}
</style>
