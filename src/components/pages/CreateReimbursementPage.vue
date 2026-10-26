<template>
  <!-- New reimbursement (Figma: Reimbusement - Create new, 116:51394) — fills the
       main content area; Select recipient → Select claims → Review & Pay -->
  <div class="absolute inset-0 z-30 bg-[#fcfcfd] flex flex-col overflow-hidden">

    <!-- Header: title, stepper, close -->
    <div class="relative flex items-center h-[74px] px-[24px] py-[12px] bg-white border-b border-[#e5e6ea] shrink-0">
      <p class="text-[18px] font-medium text-[#03102f] leading-[1.35] whitespace-nowrap">Reimbursement</p>
      <ol class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-start gap-[8px]" aria-label="Steps">
        <li v-for="(label, i) in STEPS" :key="label" class="flex flex-col items-center gap-[8px] w-[100px]" :aria-current="i === step ? 'step' : undefined">
          <span class="relative h-[4px] w-full rounded-[16px] overflow-hidden">
            <span class="absolute inset-0 bg-[#2465de] opacity-[0.12]" />
            <span class="absolute inset-y-0 left-0 bg-[#2465de] rounded-[16px] transition-[width] duration-300 ease-out" :style="{ width: i <= step ? '100%' : '0%' }" />
          </span>
          <span class="text-[12px] leading-[1.5] whitespace-nowrap transition-colors duration-300" :class="i <= step ? 'text-[#03102f]' : 'text-[#9295a5]'">{{ label }}</span>
        </li>
      </ol>
      <button type="button" class="absolute right-[24px] top-1/2 -translate-y-1/2 flex items-center gap-[8px] h-[36px] px-[12px] rounded-[8px] transition-colors duration-150 hover:bg-[#f6f7f9]" @click="emit('close')">
        <img :src="closeIcon" width="16" height="16" alt="" />
        <span class="text-[12px] font-medium text-[#61667c] leading-[1.5]">Close</span>
      </button>
    </div>

    <!-- ───── Step 1: Select recipient ───── -->
    <div v-if="step === 0" class="flex flex-1 min-h-0 justify-center">
      <div class="relative flex flex-col w-[566px] max-w-full bg-white border-x border-[#e5e6ea]">
        <div class="flex flex-col gap-[16px] flex-1 min-h-0 px-[24px] pt-[24px] pb-[16px]">
          <p class="text-[16px] font-medium text-[#03102f] leading-[1.4]">Please select recipient</p>
          <label class="field flex items-center gap-[8px] h-[36px] px-[8px] shrink-0">
            <img :src="searchIcon" width="16" height="16" alt="" class="shrink-0" />
            <input v-model="recipientQuery" type="search" placeholder="Search recipients" class="field-input" aria-label="Search recipients" />
          </label>
          <div class="flex flex-col gap-[8px] flex-1 min-h-0 overflow-y-auto -mx-[4px] px-[4px] py-[4px]" role="radiogroup" aria-label="Recipients">
            <button
              v-for="r in shownRecipients"
              :key="r.name"
              type="button"
              role="radio"
              :aria-checked="recipient?.name === r.name"
              class="recipient-card flex items-center gap-[12px] px-[12px] py-[8px] w-full text-left rounded-[8px] bg-white"
              :class="{ 'is-selected': recipient?.name === r.name }"
              @click="pickRecipient(r)"
            >
              <span class="radio" :class="{ 'is-on': recipient?.name === r.name }"><img v-if="recipient?.name === r.name" :src="radioActive" alt="" class="radio-dot" /></span>
              <span class="avatar size-[32px] text-[14px]">{{ r.name[0] }}</span>
              <span class="flex flex-col flex-1 min-w-0">
                <span class="flex items-center gap-[4px]">
                  <span class="text-[14px] font-medium text-[#03102f] leading-[1.5] truncate">{{ r.name }}</span>
                  <span class="currency-chip">{{ r.accounts[0].currency }}</span>
                </span>
                <span class="text-[12px] font-medium text-[#61667c] leading-[1.5]">{{ r.accounts[0].bank }} ****{{ r.accounts[0].number.slice(-4) }}<template v-if="r.accounts.length > 1"> · +{{ r.accounts.length - 1 }} account</template></span>
              </span>
            </button>
            <p v-if="!shownRecipients.length" class="py-[24px] text-center text-[14px] text-[#61667c]">No recipients match “{{ recipientQuery }}”.</p>
          </div>
        </div>
        <div class="flex items-center justify-between px-[40px] py-[16px] border-t border-[#e5e6ea] shrink-0">
          <button type="button" class="btn-secondary" @click="emit('close')">Cancel</button>
          <button type="button" class="btn-primary" :class="{ 'is-disabled': !recipient }" :aria-disabled="!recipient" @click="recipient && (step = 1)">Next</button>
        </div>
      </div>
    </div>

    <!-- ───── Step 2: Select claims ───── -->
    <div v-else-if="step === 1" class="flex flex-col flex-1 min-h-0">
      <div class="flex flex-1 min-h-0 bg-white">
        <ReimbursementClaimsTable
          v-model="selectedIds"
          :title="`${recipient.name} claims`"
          :claims="payable"
          :empty-text="`${recipient.name} has no approved claims waiting to be paid.`"
        />
        <aside class="relative flex flex-col w-[491px] shrink-0 border-l border-[#e5e6ea] bg-white">
          <ReimbursementClaimsPanel
            v-model:name="name"
            v-model:description="description"
            :claims="selectedClaims"
            :total="totalSgd"
            :currency="PAY_CURRENCY"
            :loading="loadingClaims"
            @remove="toggleClaim"
          />
        </aside>
      </div>

      <div class="relative flex items-center justify-between px-[40px] py-[16px] bg-white border-t border-[#e5e6ea] shrink-0">
        <button type="button" class="btn-secondary" @click="step = 0">Back</button>
        <p v-if="selectedIds.length" class="absolute left-1/2 -translate-x-1/2 flex items-center gap-[16px] text-[12px] leading-[1.5]">
          <span class="font-medium text-[#03102f]">{{ selectedIds.length }} row{{ selectedIds.length === 1 ? '' : 's' }} selected</span>
          <button type="button" class="font-medium text-[#9295a5] hover:text-[#61667c]" @click="selectedIds = []">Clear</button>
        </p>
        <button type="button" class="btn-primary" :class="{ 'is-disabled': !selectedIds.length }" :aria-disabled="!selectedIds.length" @click="selectedIds.length && (step = 2)">Next</button>
      </div>
    </div>

    <!-- ───── Step 3: Review & Pay ───── -->
    <div v-else class="flex flex-1 min-h-0 justify-center">
      <div class="relative flex flex-col w-[566px] max-w-full bg-white border-x border-[#e5e6ea]">
        <div class="flex flex-col gap-[16px] flex-1 min-h-0 overflow-y-auto p-[24px]">
          <p class="text-[16px] font-medium text-[#03102f] leading-[1.4]">Review &amp; Pay</p>
          <div class="flex flex-col gap-[4px] p-[4px] rounded-[8px] border border-[#e5e6ea] bg-[#f2f2f4]">
            <div class="flex flex-col bg-white rounded-[4px]">
              <div class="review-row">
                <span class="review-label">Reimbursement name</span>
                <span class="text-[14px] font-medium text-[#03102f] leading-[1.5] text-right">{{ name || '—' }}</span>
              </div>
              <div v-if="description.trim()" class="review-row gap-[16px]">
                <span class="review-label">Description</span>
                <span class="flex-1 min-w-0 text-[14px] font-medium text-[#03102f] leading-[1.5] text-right">{{ description }}</span>
              </div>

              <!-- Recipient (+ bank account choice when they have several) -->
              <div class="flex flex-col gap-[2px] py-[8px] border-b border-[#e5e6ea]">
                <span class="review-label px-[12px]">Recipient</span>
                <div class="flex items-center gap-[8px] px-[12px]">
                  <span class="avatar size-[40px] text-[16px]">{{ recipient.name[0] }}</span>
                  <span class="flex flex-col min-w-0">
                    <span class="flex items-center gap-[4px]">
                      <span class="text-[14px] font-medium text-[#03102f] leading-[1.5]">{{ recipient.name }}</span>
                      <span class="currency-chip">{{ account.currency }}</span>
                    </span>
                    <span class="text-[12px] font-medium text-[#61667c] leading-[1.5]">{{ recipient.accounts.length > 1 ? 'Select bank account' : `${account.bank} / ${account.number}` }}</span>
                  </span>
                </div>
                <div v-if="recipient.accounts.length > 1" class="mx-[12px] mt-[8px] rounded-[8px] border border-[#e5e6ea] overflow-hidden" role="radiogroup" aria-label="Bank account">
                  <button
                    v-for="(a, i) in recipient.accounts"
                    :key="a.number"
                    type="button"
                    role="radio"
                    :aria-checked="accountIndex === i"
                    class="flex items-center gap-[12px] w-full px-[12px] py-[8px] text-left transition-colors duration-150 hover:bg-[#fcfcfd]"
                    :class="{ 'border-t border-[#e5e6ea]': i > 0 }"
                    @click="accountIndex = i"
                  >
                    <span class="radio" :class="{ 'is-on': accountIndex === i }"><img v-if="accountIndex === i" :src="radioActive" alt="" class="radio-dot" /></span>
                    <span class="text-[14px] text-[#03102f] leading-[1.5]">{{ a.bank }} / {{ a.number }}</span>
                    <span class="currency-chip">{{ a.currency }}</span>
                  </button>
                </div>
              </div>

              <button type="button" class="review-row w-full hover:bg-[#fcfcfd]" @click="claimsModalOpen = true">
                <span class="review-label">Total claims</span>
                <span class="flex items-center gap-[2px]"><span class="review-value">{{ selectedClaims.length }}</span><img :src="chevronRight" width="16" height="16" alt="" /></span>
              </button>
              <div class="review-row">
                <span class="review-label">Recipient gets</span>
                <span class="review-value">{{ account.currency }} {{ money(recipientGets) }}</span>
              </div>
              <div class="review-row">
                <span class="review-label">Amount to pay</span>
                <span class="flex flex-col items-end">
                  <span class="review-value">{{ PAY_CURRENCY }} {{ money(totalSgd) }}</span>
                  <span v-if="account.currency !== PAY_CURRENCY" class="text-[12px] text-[#61667c] leading-[1.5] mono">{{ account.currency }} 1 = {{ PAY_CURRENCY }} {{ rateText }}</span>
                </span>
              </div>

              <!-- Paying with -->
              <div class="flex flex-col gap-[2px] py-[8px] border-b border-[#e5e6ea]">
                <span class="review-label px-[12px]">Paying with</span>
                <div class="flex items-center gap-[8px] px-[12px]">
                  <span class="flex items-center justify-center size-[40px] rounded-[8px] border border-[#e5e6ea] bg-white shrink-0">
                    <img :src="method.img" :alt="method.name" class="max-w-[28px] max-h-[24px]" />
                  </span>
                  <span class="flex flex-col gap-[4px] flex-1 min-w-0">
                    <span class="text-[12px] text-[#03102f] leading-[1.5]">{{ method.name }}</span>
                    <span class="text-[12px] text-[#61667c] leading-[1.5]">{{ method.detail || `Fee = ${PAY_CURRENCY} ${money(method.feeValue)}` }}</span>
                  </span>
                  <button type="button" class="flex items-center gap-[6px] h-[28px] text-[12px] font-medium text-[#2465de] leading-[1.5] hover:opacity-80" @click="methodModalOpen = true">
                    <img :src="changeIcon" width="16" height="16" alt="" /> Change
                  </button>
                </div>
              </div>

              <button type="button" class="review-row w-full hover:bg-[#fcfcfd]" @click="feesModalOpen = true">
                <span class="review-label">Total fees</span>
                <span class="flex items-center gap-[2px]"><span class="review-value">{{ PAY_CURRENCY }} {{ money(totalFees) }}</span><img :src="chevronRight" width="16" height="16" alt="" /></span>
              </button>
              <div class="review-row !border-b-0">
                <span class="review-label">Transfer Type</span>
                <span class="text-[14px] font-medium text-[#03102f] leading-[1.5]">{{ isLocal ? 'LOCAL' : 'INTERNATIONAL' }}</span>
              </div>
            </div>
            <div class="total-bar rounded-[4px]">
              <span class="flex-1 text-[12px] font-medium text-[#cbcdd4] leading-[1.5]">You will pay</span>
              <span class="pt-[4px] text-[12px] font-medium text-[#cbcdd4] leading-[1.5]">{{ PAY_CURRENCY }}</span>
              <span class="text-[24px] font-medium text-white leading-[1.35] whitespace-nowrap mono">{{ money(youPay) }}</span>
            </div>
          </div>
        </div>
        <div class="flex items-center justify-between px-[40px] py-[16px] border-t border-[#e5e6ea] shrink-0">
          <button type="button" class="btn-secondary" @click="step = 1">Back</button>
          <div class="flex items-center gap-[8px]">
            <button type="button" class="flex items-center h-[36px] px-[12px] rounded-[8px] text-[14px] font-medium text-[#2465de] leading-[1.5] hover:bg-[#f0f5ff]" @click="finish('later')">Save &amp; pay later</button>
            <button type="button" class="btn-primary" @click="payOpen = true">Pay</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modals -->
    <BaseModal :open="claimsModalOpen" :width="480" @close="claimsModalOpen = false">
      <template #header>
        <div class="flex items-start gap-[16px] p-[16px] border-b border-[#e5e6ea]">
          <p class="flex-1 pt-[2px] text-[16px] font-medium text-[#03102f] leading-[1.4]">Selected claims ({{ selectedClaims.length }})</p>
          <button type="button" class="flex items-center justify-center size-[32px] rounded-[4px] hover:bg-[#f0f1f5]" aria-label="Close" @click="claimsModalOpen = false"><img :src="modalCloseIcon" width="20" height="20" alt="" /></button>
        </div>
      </template>
      <div class="flex flex-col gap-[8px] p-[24px] max-h-[554px] overflow-y-auto">
        <div v-for="c in selectedClaims" :key="c.id" class="flex items-center gap-[16px] p-[8px] rounded-[8px] border border-[#e5e6ea]">
          <div class="flex flex-col gap-[4px] flex-1 min-w-0">
            <p class="text-[14px] font-medium text-[#03102f] leading-[1.5] truncate">{{ c.merchant }}</p>
            <p class="text-[12px] text-[#61667c] leading-[1.5] truncate">{{ c.date }} • {{ c.category }}</p>
          </div>
          <span class="text-[14px] font-semibold text-[#03102f] leading-[1.4] whitespace-nowrap mono">{{ c.amount }}</span>
        </div>
      </div>
    </BaseModal>
    <TotalFeesModal v-model="feesModalOpen" :rows="feeRows" :total="`${PAY_CURRENCY} ${money(totalFees)}`" />
    <PaymentMethodModal v-model="methodModalOpen" :current="methodId" :methods="METHODS" hide-back @confirm="(m) => (methodId = m.id)" />
    <ReimbursementPayModal
      :open="payOpen"
      :method="methodId"
      :amount="youPay"
      :fee="totalFees"
      :currency="PAY_CURRENCY"
      :balance="HITPAY_BALANCE"
      @close="payOpen = false"
      @paid="finish('paid')"
      @pending="finish('bank')"
    />
  </div>
</template>

<script setup>
import { computed, ref, watch, onMounted, onUnmounted } from 'vue'
import BaseModal from '../modals/BaseModal.vue'
import TotalFeesModal from '../modals/TotalFeesModal.vue'
import PaymentMethodModal from '../modals/PaymentMethodModal.vue'
import ReimbursementPayModal from '../modals/ReimbursementPayModal.vue'
import ReimbursementClaimsTable from '../content/ReimbursementClaimsTable.vue'
import ReimbursementClaimsPanel from '../content/ReimbursementClaimsPanel.vue'
import { recipients, payableClaims, PAY_CURRENCY, HITPAY_BALANCE, PAY_METHODS } from '../../composables/useReimbursements.js'
import { convert, rate, money, splitAmount } from '../../composables/useFx.js'
import closeIcon from '../../assets/images/reimb-close.svg'
import modalCloseIcon from '../../assets/images/claims-panel-close.svg'
import searchIcon from '../../assets/images/reimb-search.svg'
import radioActive from '../../assets/images/reimb-radio-active.svg'
import chevronRight from '../../assets/images/reimb-chevron-right.svg'
import changeIcon from '../../assets/images/reimb-change.svg'

const props = defineProps({
  // Opened from an approved claim: start on that person's claims with it ticked
  initialStaff: { type: String, default: '' },
  initialClaimIds: { type: Array, default: () => [] },
})
const emit = defineEmits(['close', 'done'])

const STEPS = ['Select recipient', 'Select claims', 'Review & Pay']
const INTERNATIONAL_FEE = 17

const METHODS = PAY_METHODS

const step = ref(0)

// ── Step 1: recipient ──
const recipientQuery = ref('')
const recipient = ref(null)
const accountIndex = ref(0)
const shownRecipients = computed(() => {
  const q = recipientQuery.value.trim().toLowerCase()
  if (!q) return recipients
  return recipients.filter((r) => r.name.toLowerCase().includes(q) || r.accounts.some((a) => a.bank.toLowerCase().includes(q)))
})
function pickRecipient(r) {
  if (recipient.value?.name !== r.name) {
    selectedIds.value = []
    accountIndex.value = 0
  }
  recipient.value = r
}

// ── Step 2: claims ──
const payable = computed(() => (recipient.value ? payableClaims(recipient.value.name) : []))
const selectedIds = ref([])
const isSelected = (id) => selectedIds.value.includes(id)
const selectedClaims = computed(() => payable.value.filter((c) => isSelected(c.id)))

function toggleClaim(id) {
  selectedIds.value = isSelected(id) ? selectedIds.value.filter((x) => x !== id) : [...selectedIds.value, id]
}

// The first pick shows a brief loading state while "fetching" claim details
const loadingClaims = ref(false)
let loadTimer = null
watch(() => selectedIds.value.length, (n, prev) => {
  if (prev === 0 && n > 0) {
    loadingClaims.value = true
    clearTimeout(loadTimer)
    loadTimer = setTimeout(() => (loadingClaims.value = false), 600)
  }
})

const today = new Date()
const name = ref(`Reimbursement - ${today.getDate()} ${today.toLocaleString('en-US', { month: 'short' })} ${today.getFullYear()}`)
const description = ref('')

// ── Step 3: amounts ──
const account = computed(() => recipient.value?.accounts[accountIndex.value] ?? { currency: PAY_CURRENCY })
const totalSgd = computed(() => selectedClaims.value.reduce((sum, c) => {
  const { currency, value } = splitAmount(c.amount)
  return sum + convert(value, currency, PAY_CURRENCY)
}, 0))
const recipientGets = computed(() => convert(totalSgd.value, PAY_CURRENCY, account.value.currency))
const rateText = computed(() => {
  const r = rate(account.value.currency, PAY_CURRENCY)
  return r >= 0.01 ? money(r) : r.toPrecision(3)
})
const isLocal = computed(() => account.value.currency === PAY_CURRENCY)

const methodId = ref('paynow')
const method = computed(() => METHODS.find((m) => m.id === methodId.value))
const totalFees = computed(() => method.value.feeValue + (isLocal.value ? 0 : INTERNATIONAL_FEE))
const youPay = computed(() => totalSgd.value + totalFees.value)
const feeRows = computed(() => [
  { label: `${method.value.name} fee`, value: `${PAY_CURRENCY} ${money(method.value.feeValue)}` },
  { label: isLocal.value ? 'Local transfer fee' : 'International transfer fee', value: `${PAY_CURRENCY} ${money(isLocal.value ? 0 : INTERNATIONAL_FEE)}` },
])

const claimsModalOpen = ref(false)
const feesModalOpen = ref(false)
const methodModalOpen = ref(false)
const payOpen = ref(false)

// payment: 'later' (Save & pay later) · 'paid' (money sent) · 'bank' (waiting on the transfer)
function finish(payment) {
  payOpen.value = false
  emit('done', {
    payment,
    title: name.value.trim() || 'Reimbursement',
    description: description.value.trim(),
    recipient: recipient.value.name,
    account: account.value,
    items: selectedClaims.value,
    fx: !isLocal.value,
    method: method.value.name,
  })
}

// Jump straight to claims when opened from an approved claim
if (props.initialStaff) {
  const r = recipients.find((x) => x.name === props.initialStaff)
  if (r) {
    recipient.value = r
    selectedIds.value = props.initialClaimIds.filter((id) => payableClaims(r.name).some((c) => c.id === id))
    step.value = 1
  }
}

function onKeydown(e) {
  const modalOpen = claimsModalOpen.value || feesModalOpen.value || methodModalOpen.value || payOpen.value
  if (e.key === 'Escape' && !modalOpen) emit('close')
}
onMounted(() => window.addEventListener('keydown', onKeydown))
onUnmounted(() => {
  window.removeEventListener('keydown', onKeydown)
  clearTimeout(loadTimer)
})
</script>

<style scoped>
.mono { font-family: 'Reddit Mono', ui-monospace, monospace; }

/* Buttons (Figma: Button/Secondary + Button/Primary, 36px) */
.btn-secondary,
.btn-primary {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 36px;
  min-width: 100px;
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

/* Inputs (Figma: Input / State=Default → Focused) */
.field {
  background: white;
  border: 1px solid #e5e6ea;
  border-radius: 8px;
  box-shadow: 0px 1px 3px 0px rgba(0, 0, 0, 0.04), 0px 1.5px 1.5px 0px rgba(0, 0, 0, 0.09);
  transition: border-color 150ms ease, box-shadow 150ms ease;
}
.field:focus-within,
textarea.field:focus {
  border-color: #2465de;
  box-shadow: 0px 0px 0px 3px #b3cdfe, inset 0px 2px 4px 0px rgba(0, 0, 0, 0.24);
  outline: none;
}
.field-input {
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
textarea.field-input { background: white; border: 1px solid #e5e6ea; }
.field-input::placeholder { color: #9295a5; }
textarea.field-input::placeholder { color: #b2b4bf; }

/* Recipient card (Figma: Customer Card — default / hover / selected) */
.recipient-card {
  border: 1px solid #e5e6ea;
  transition: border-color 150ms ease, box-shadow 150ms ease;
}
.recipient-card:hover:not(.is-selected) {
  border-color: #cbcdd4;
  box-shadow: 0px 0px 0px 0.5px #cbcdd4, 0px 3px 11px 0px rgba(38, 42, 50, 0.03);
}
.recipient-card.is-selected {
  border-color: #2465de;
  box-shadow: 0px 0px 0px 3px #b3cdfe;
}

.radio {
  position: relative;
  flex-shrink: 0;
  width: 16px;
  height: 16px;
  border-radius: 100px;
  background: white;
  border: 1px solid #e5e6ea;
  box-shadow: 0px 1px 3px 0px rgba(0, 0, 0, 0.04), 0px 1.5px 1.5px 0px rgba(0, 0, 0, 0.09);
}
.radio.is-on { border-color: transparent; box-shadow: none; background: transparent; }
.radio-dot { position: absolute; left: -3px; top: -2px; width: 22px; height: 22px; max-width: none; }

.avatar {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  border-radius: 8px;
  background: #002771;
  color: white;
  font-weight: 700;
  letter-spacing: 0.15px;
  text-shadow: 0px 0.5px 0.5px rgba(0, 0, 0, 0.06);
}
.currency-chip {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 24px;
  min-width: 32px;
  padding: 2px 8px;
  border-radius: 24px;
  background: #f5f6f9;
  font-size: 12px;
  font-weight: 500;
  line-height: 1.5;
  color: #002771;
}
.total-bar {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background: #03102f;
}

.review-row {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  padding: 8px 12px;
  border-bottom: 1px solid #e5e6ea;
  text-align: left;
  transition: background-color 150ms ease;
}
.review-label { font-size: 12px; font-weight: 500; line-height: 1.5; color: #61667c; white-space: nowrap; }
.review-value { font-family: 'Reddit Mono', ui-monospace, monospace; font-size: 14px; font-weight: 600; line-height: 1.4; color: #03102f; white-space: nowrap; }
</style>
