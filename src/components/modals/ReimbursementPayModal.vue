<template>
  <!-- Pay a reimbursement (Figma: Reimbusement - Create new › Payment, 148:78143) —
       one modal per method; HitPay balance continues to a 2FA step -->
  <BaseModal :open="open" :width="step === 'otp' ? 320 : 480" :step-key="step" @close="close">
    <template #header>
      <div class="flex items-start gap-[16px] p-[16px]" :class="step === 'otp' ? '' : 'border-b border-[#e5e6ea]'">
        <!-- Back to the method picker when opened from Fund transfer (Figma: 141:29399) -->
        <button v-if="showBack && step !== 'otp'" type="button" class="flex items-center justify-center size-[32px] -mr-[8px] rounded-[4px] shrink-0 transition-colors duration-150 hover:bg-[#f0f1f5]" aria-label="Back" @click="back">
          <img :src="backIcon" width="16" height="16" alt="" />
        </button>
        <p class="flex-1 min-w-0 pt-[2px] text-[16px] font-medium text-[#03102f] leading-[1.4]">{{ TITLES[step] }}</p>
        <button type="button" class="flex items-center justify-center size-[32px] rounded-[4px] shrink-0 transition-colors duration-150 hover:bg-[#f0f1f5]" aria-label="Close" @click="close">
          <img :src="closeIcon" width="20" height="20" alt="" />
        </button>
      </div>
    </template>

    <!-- 2FA code -->
    <template v-if="step === 'otp'">
      <div class="flex flex-col items-center gap-[24px] p-[16px]">
        <div class="flex flex-col items-center gap-[16px]">
          <span class="flex p-[12px] rounded-full bg-[#f5f6f9]"><img :src="lockIcon" width="24" height="24" alt="" /></span>
          <p class="w-[296px] max-w-full text-[14px] text-[#03102f] leading-[1.5] text-center">Please enter the confirmation code that has been sent to <span class="font-medium">{{ email }}</span>.</p>
        </div>
        <div class="flex items-center gap-[8px]" @paste.prevent="onPaste">
          <input
            v-for="(_, i) in code"
            :key="i"
            :ref="(el) => (codeEls[i] = el)"
            v-model="code[i]"
            type="text"
            inputmode="numeric"
            autocomplete="one-time-code"
            class="pay-field size-[36px] text-center text-[14px] text-[#03102f]"
            :aria-label="`Digit ${i + 1}`"
            @input="onDigit(i)"
            @keydown.backspace="onBackspace(i, $event)"
          />
        </div>
        <p class="w-[296px] max-w-full text-[14px] text-[#03102f] leading-[1.5] text-center">
          Didn’t receive the code?
          <button type="button" class="text-[#2465de] underline" @click="resend">{{ resent ? 'Sent again' : 'Resend' }}</button>
        </p>
      </div>
      <div class="flex items-center justify-center gap-[12px] px-[16px] pt-[20px] pb-[28px]">
        <button type="button" class="btn-secondary" @click="step = 'balance'">Cancel</button>
        <button type="button" class="btn-primary" :class="{ 'is-disabled': !codeComplete }" :aria-disabled="!codeComplete" @click="codeComplete && emit('paid', 'balance')">Submit</button>
      </div>
    </template>

    <template v-else>
      <div class="flex flex-col gap-[16px] p-[24px]">
        <!-- Amount -->
        <div class="flex flex-col items-center gap-[2px] p-[12px] rounded-[8px] bg-[#f8f9fc] text-center">
          <p class="text-[14px] font-medium text-[#61667c] leading-[1.5]">Amount</p>
          <p class="text-[24px] font-medium text-[#03102f] leading-[1.35] whitespace-nowrap" style="font-family: 'Reddit Mono', ui-monospace, monospace;">{{ currency }} {{ money(amount) }}</p>
          <p v-if="step === 'paynow' && fee" class="text-[14px] text-[#61667c] leading-[1.5]">+ {{ currency }} {{ money(fee) }} fee included</p>
        </div>

        <!-- PayNow QR -->
        <template v-if="step === 'paynow'">
          <div class="relative self-center size-[220px] overflow-hidden">
            <img :src="qrBase" alt="" class="absolute inset-0 size-full" />
            <img :src="qrModules" alt="PayNow QR code" class="absolute" style="inset: 3.57% 3.93% 3.93% 3.57%;" />
            <img :src="qrCenter" alt="" class="absolute object-cover" style="inset: 41.43% 41.79% 41.79% 41.43%;" />
            <span class="absolute left-[calc(50%+2.32px)] top-[calc(50%-0.7px)] -translate-x-1/2 -translate-y-1/2 h-[43.406px] w-[63.301px] rounded-[4px] overflow-hidden">
              <img :src="qrPaynow" alt="PayNow" class="absolute" style="inset: 20.83% 17.14% 17.22% 14.29%;" />
            </span>
          </div>
          <p class="text-[12px] font-medium text-[#61667c] leading-[1.5] text-center">Scan this PayNow QR to complete wallet top up</p>
        </template>

        <!-- HitPay balance -->
        <template v-else-if="step === 'balance'">
          <div class="flex items-start gap-[12px] min-h-[36px] p-[8px] rounded-[8px] border border-[#e5e6ea] bg-[#fcfcfd]" style="filter: drop-shadow(0px 3px 11px rgba(38,42,50,0.03));">
            <span class="flex items-center justify-center size-[40px] rounded-[8px] border border-[#e5e6ea] bg-white shrink-0">
              <img :src="hitpayLogogram" width="20.026" height="20" alt="" />
            </span>
            <div class="flex flex-col gap-[4px] flex-1 min-w-0 self-center">
              <p class="text-[12px] text-[#03102f] leading-[1.5]">HitPay balance</p>
              <p class="text-[12px] text-[#61667c] leading-[1.5]">Available: {{ currency }} {{ money(balance) }} → After: {{ currency }} {{ money(balance - amount) }}</p>
            </div>
            <span class="chip-instant self-center">Instant</span>
          </div>
          <p class="text-[12px] text-[#61667c] leading-[1.5] text-center">This deducts <span class="text-[#03102f]">{{ currency }} {{ money(amount) }}</span> from your HitPay balance now and sends the payments. You’ll confirm with 2FA.</p>
        </template>

        <!-- Bank transfer details -->
        <template v-else-if="step === 'bank'">
          <div class="flex flex-col gap-[4px] px-[16px]">
            <div v-for="row in BANK_ROWS" :key="row.label" class="group flex items-start gap-[8px]">
              <span class="text-[12px] font-medium text-[#61667c] leading-[1.5] whitespace-nowrap">{{ row.label }}</span>
              <span class="relative flex items-center gap-[8px]">
                <span class="text-[12px] text-[#03102f] leading-[1.5] whitespace-nowrap">{{ row.value }}</span>
                <button
                  type="button"
                  class="relative flex size-[16px] transition-opacity duration-150"
                  :class="row.copyable ? 'opacity-100' : 'opacity-0 group-hover:opacity-100 focus-visible:opacity-100'"
                  :aria-label="`Copy ${row.label.replace(':', '')}`"
                  @click="copy(row)"
                >
                  <img :src="copyIcon" width="16" height="16" alt="" />
                  <span
                    v-if="copied === row.label"
                    class="absolute left-1/2 -translate-x-1/2 bottom-[calc(100%+6px)] px-[8px] py-[4px] rounded-[4px] bg-[#fcfcfd] text-[12px] font-medium text-[#61667c] whitespace-nowrap"
                    style="box-shadow: 0px 1px 3px 0px rgba(0,0,0,0.1), 0px 3px 22px 0px rgba(38,42,50,0.09);"
                  >Copied !</span>
                </button>
              </span>
            </div>
          </div>
          <p class="flex items-center justify-center gap-[8px] h-[36px] text-[14px] font-medium text-[#61667c] leading-[1.5]">
            <span class="pay-spinner relative size-[18px]"><img :src="spinnerTrack" alt="" class="absolute inset-0 size-full" /><img :src="spinnerArc" alt="" class="absolute" style="inset: 8.33%;" /></span>
            Waiting for payment
          </p>
          <p class="pl-[8px] pr-[12px] py-[8px] rounded-[8px] border border-[#cbcdd4] bg-[#f2f2f4] text-[12px] text-[#03102f] leading-[1.5]">Bank transfer verification may take up to 1 hour. You can close this page after payment.</p>
        </template>

        <!-- Card -->
        <template v-else-if="step === 'card'">
          <div class="flex flex-col gap-[4px]">
            <span class="text-[12px] font-medium text-[#61667c] leading-[1.5]">Card number</span>
            <div class="pay-field flex items-center gap-[8px] h-[36px] px-[8px]">
              <img :src="bankCardIcon" width="16" height="16" alt="" class="shrink-0" />
              <input v-model="cardForm.number" inputmode="numeric" placeholder="4444 3333 2222 1111" class="pay-input" @input="formatCardNumber" />
            </div>
          </div>
          <div class="flex gap-[12px]">
            <label class="flex flex-col gap-[4px] flex-1 min-w-0">
              <span class="text-[12px] font-medium text-[#61667c] leading-[1.5]">Expiry date</span>
              <span class="pay-field flex items-center h-[36px] px-[8px]"><input v-model="cardForm.expiry" placeholder="MM/YY" maxlength="5" class="pay-input" /></span>
            </label>
            <label class="flex flex-col gap-[4px] flex-1 min-w-0">
              <span class="text-[12px] font-medium text-[#61667c] leading-[1.5]">Security code</span>
              <span class="pay-field flex items-center h-[36px] px-[8px]"><input v-model="cardForm.cvc" inputmode="numeric" placeholder="CVC" maxlength="4" class="pay-input" /></span>
            </label>
          </div>
        </template>
      </div>

      <!-- Footers -->
      <div class="flex items-center gap-[12px] px-[16px] py-[20px] border-t border-[#e5e6ea]">
        <template v-if="step === 'paynow'">
          <button type="button" class="btn-secondary" @click="close">Cancel</button>
          <p class="flex-1 flex items-center justify-end gap-[8px] px-[12px] text-[14px] font-medium text-[#61667c] leading-[1.5]">
            <span class="pay-spinner relative size-[18px]"><img :src="spinnerTrack" alt="" class="absolute inset-0 size-full" /><img :src="spinnerArc" alt="" class="absolute" style="inset: 8.33%;" /></span>
            Waiting for payment
          </p>
        </template>
        <template v-else-if="step === 'balance'">
          <button type="button" class="btn-secondary" @click="close">Cancel</button>
          <div class="flex-1" />
          <button type="button" class="btn-primary" @click="toOtp">Confirm</button>
        </template>
        <template v-else-if="step === 'bank'">
          <div class="flex-1" />
          <button type="button" class="btn-secondary !min-w-0" @click="emit('pending', 'bank')">Close</button>
        </template>
        <template v-else-if="step === 'card'">
          <label class="flex items-center gap-[8px] cursor-pointer select-none">
            <input v-model="cardForm.save" type="checkbox" class="sr-only peer" />
            <span class="flex items-center justify-center size-[16px] rounded-[4px] border transition-colors duration-150" :class="cardForm.save ? 'bg-[#2465de] border-[#2465de]' : 'bg-white border-[#e5e6ea]'" style="box-shadow: 0px 1px 3px 0px rgba(0,0,0,0.04), 0px 1.5px 1.5px 0px rgba(0,0,0,0.09);">
              <img v-if="cardForm.save" :src="checkIcon" width="10" height="10" alt="" />
            </span>
            <span class="text-[12px] text-[#03102f] leading-[1.5] whitespace-nowrap">Save this card for future usage</span>
          </label>
          <div class="flex-1" />
          <button type="button" class="btn-primary" :class="{ 'is-disabled': !cardComplete }" :aria-disabled="!cardComplete" @click="cardComplete && emit('paid', 'card')">Confirm</button>
        </template>
      </div>
    </template>
  </BaseModal>
</template>

<script setup>
import { computed, nextTick, reactive, ref, watch } from 'vue'
import BaseModal from './BaseModal.vue'
import { money } from '../../composables/useFx.js'
import closeIcon from '../../assets/images/claims-panel-close.svg'
import lockIcon from '../../assets/images/reimb-lock.svg'
import copyIcon from '../../assets/images/reimb-copy.svg'
import hitpayLogogram from '../../assets/images/reimb-hitpay-logogram.svg'
import checkIcon from '../../assets/images/reimb-check-white.svg'
import qrBase from '../../assets/images/paynow-qr-base.svg'
import qrModules from '../../assets/images/reimb-qr-modules.svg'
import qrCenter from '../../assets/images/reimb-qr-center.png'
import qrPaynow from '../../assets/images/reimb-qr-paynow.svg'
import spinnerTrack from '../../assets/icons/icon-loading.svg'
import spinnerArc from '../../assets/images/reimb-spinner-arc.png'
import bankCardIcon from '../../assets/icons/icon-bank-card-grey.svg'
import backIcon from '../../assets/images/reimb-back.svg'

const props = defineProps({
  open: { type: Boolean, default: false },
  // 'paynow' | 'balance' | 'bank' | 'cards'
  method: { type: String, default: 'paynow' },
  amount: { type: Number, default: 0 },
  fee: { type: Number, default: 0 },
  currency: { type: String, default: 'SGD' },
  balance: { type: Number, default: 0 },
  email: { type: String, default: 'alexturner@aaaamonkey.com' },
  showBack: { type: Boolean, default: false },
})
// paid: money has left (PayNow / balance / card); pending: waiting on the bank transfer
const emit = defineEmits(['close', 'paid', 'pending', 'back'])

const TITLES = {
  paynow: 'Pay with PayNow',
  balance: 'Pay with HitPay Balance',
  otp: 'Enter 2FA code',
  bank: 'Pay with Bank Transfer',
  card: 'Pay with Card',
}
const BANK_ROWS = [
  { label: 'Account name:', value: 'My Company LLC' },
  { label: 'Country:', value: 'Singapore' },
  { label: 'Currency:', value: 'Singapore Dollar' },
  { label: 'SWIFT code:', value: 'CHASSGSG' },
  { label: 'Bank code:', value: '7153' },
  { label: 'Branch code:', value: '001' },
  { label: 'Account number:', value: '716229208178', copyable: true },
  { label: 'Payment reference:', value: '9B2876BB12D80', copyable: true },
]

const step = ref('paynow')
const code = reactive(['', '', '', '', ''])
const codeEls = []
const resent = ref(false)
const copied = ref(null)
const cardForm = reactive({ number: '', expiry: '', cvc: '', save: true })

const codeComplete = computed(() => code.every((d) => /^\d$/.test(d)))
const cardComplete = computed(() =>
  cardForm.number.replace(/\s/g, '').length >= 12 && /^\d{2}\/\d{2}$/.test(cardForm.expiry) && /^\d{3,4}$/.test(cardForm.cvc)
)

// PayNow has no button to press: the prototype "receives" the transfer after a few seconds
let paynowTimer = null
watch(() => [props.open, step.value], ([open, s]) => {
  clearTimeout(paynowTimer)
  if (open && s === 'paynow') paynowTimer = setTimeout(() => emit('paid', 'paynow'), 5000)
})

watch(() => props.open, (open) => {
  if (!open) return
  step.value = props.method === 'cards' ? 'card' : props.method
  code.fill('')
  resent.value = false
  Object.assign(cardForm, { number: '', expiry: '', cvc: '', save: true })
}, { immediate: true })

function close() {
  clearTimeout(paynowTimer)
  emit('close')
}
function back() {
  clearTimeout(paynowTimer)
  emit('back')
}

// The boxes mount after the step cross-fade; refs from an earlier open point at detached
// inputs, so wait until the first box is actually in the document
function focusFirstBox(tries = 12) {
  const el = codeEls[0]
  if (el?.isConnected) el.focus()
  else if (tries) setTimeout(() => focusFirstBox(tries - 1), 50)
}
async function toOtp() {
  step.value = 'otp'
  await nextTick()
  focusFirstBox()
}

// One digit per box: typing moves forward, backspace on an empty box moves back
// Typing keeps the last digit (so overtyping a filled box replaces it); one-time-code
// autofill drops the whole code into one box, so spread it forward
function onDigit(i) {
  const digits = code[i].replace(/\D/g, '')
  if (digits.length > 2) {
    for (let k = 0; k < digits.length && i + k < code.length; k++) code[i + k] = digits[k]
    codeEls[Math.min(i + digits.length, code.length - 1)]?.focus()
    return
  }
  code[i] = digits.slice(-1)
  if (code[i] && i < code.length - 1) codeEls[i + 1]?.focus()
}
function onBackspace(i, e) {
  if (!code[i] && i > 0) {
    e.preventDefault()
    code[i - 1] = ''
    codeEls[i - 1]?.focus()
  }
}
function onPaste(e) {
  const digits = (e.clipboardData?.getData('text') ?? '').replace(/\D/g, '').slice(0, code.length)
  digits.split('').forEach((d, i) => (code[i] = d))
  codeEls[Math.min(digits.length, code.length - 1)]?.focus()
}
function resend() {
  resent.value = true
  setTimeout(() => (resent.value = false), 3000)
}

function copy(row) {
  navigator.clipboard?.writeText(row.value).catch(() => {})
  copied.value = row.label
  setTimeout(() => { if (copied.value === row.label) copied.value = null }, 1500)
}

function formatCardNumber() {
  cardForm.number = cardForm.number.replace(/\D/g, '').slice(0, 16).replace(/(\d{4})(?=\d)/g, '$1 ')
}
</script>

<style scoped>
/* Buttons (Figma: Button/Secondary + Button/Primary, 36px, min 112px) */
.btn-secondary,
.btn-primary {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 36px;
  min-width: 112px;
  padding: 0 12px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  line-height: 1.5;
  white-space: nowrap;
  transition: filter 150ms ease, opacity 150ms ease;
}
.btn-secondary {
  border: 1px solid #f2f2f4;
  background: linear-gradient(to bottom, #ffffff, #f2f2f2);
  box-shadow: 0px 1.5px 0px 0px #e5e5e5;
  color: #61667c;
  text-shadow: 0px 1px 1px rgba(0, 0, 0, 0.08);
}
.btn-primary {
  border: 1px solid #2465de;
  background: linear-gradient(to bottom, #4179e2, #1f5bcc);
  box-shadow: 0px 1.5px 0px 0px #1d5fd9;
  color: white;
  text-shadow: 0px 1px 1px rgba(0, 0, 0, 0.12);
}
.btn-secondary:hover { filter: brightness(0.95); }
.btn-primary:hover { filter: brightness(1.05); }
.btn-secondary:active, .btn-primary:active { transform: translateY(1px); }
.btn-primary.is-disabled { opacity: 0.5; cursor: not-allowed; filter: none; transform: none; }

.chip-instant {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 24px;
  min-width: 32px;
  padding: 2px 8px;
  border: 1px solid #80acfe;
  border-radius: 24px;
  background: white;
  font-size: 12px;
  font-weight: 500;
  line-height: 1.5;
  color: #2465de;
}

/* Inputs (Figma: Input / State=Default → Focused) */
.pay-field {
  background: white;
  border: 1px solid #e5e6ea;
  border-radius: 8px;
  box-shadow: 0px 1px 3px 0px rgba(0, 0, 0, 0.04), 0px 1.5px 1.5px 0px rgba(0, 0, 0, 0.09);
  outline: none;
  transition: border-color 150ms ease, box-shadow 150ms ease;
}
.pay-field:focus,
.pay-field:focus-within {
  border-color: #2465de;
  box-shadow: 0px 0px 0px 3px #b3cdfe, inset 0px 2px 4px 0px rgba(0, 0, 0, 0.24);
}
.pay-input {
  flex: 1;
  min-width: 0;
  height: 100%;
  border: none;
  outline: none;
  background: transparent;
  font-size: 14px;
  line-height: 1.5;
  color: #03102f;
}
.pay-input::placeholder { color: #9295a5; }

/* "Waiting for payment" spinner (Figma: Loading 2) */
.pay-spinner { animation: pay-spin 900ms linear infinite; }
@keyframes pay-spin { to { transform: rotate(360deg); } }
@media (prefers-reduced-motion: reduce) {
  .pay-spinner { animation-duration: 2400ms; }
}
</style>
