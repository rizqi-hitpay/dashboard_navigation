<template>
  <!-- Reimbursement details (Figma: Reimbursement - Details (and states), 137:42940) -->
  <div v-if="r" class="relative bg-white flex flex-col h-full w-full overflow-hidden" @click="menuOpen = false">
    <div class="flex-1 min-h-0 overflow-y-auto overflow-x-hidden">

      <!-- Page title -->
      <div class="flex items-center gap-[24px] px-[24px] py-[12px] pt-[16px] w-full">
        <div class="flex flex-1 flex-col gap-[8px] items-start justify-center min-w-0">
          <button type="button" class="flex items-center gap-[6px] h-[28px] text-[12px] font-medium text-[#484d61] leading-[1.5] transition-colors duration-150 hover:text-[#03102f]" @click="router.push('/claims/reimbursements')">
            <img :src="backIcon" width="16" height="16" alt="" class="-mx-[1px]" />
            Back
          </button>
          <div class="flex items-center gap-[8px] min-w-0 max-w-full">
            <h1 class="text-[18px] font-medium text-[#03102f] leading-[1.35] truncate">{{ r.title }}</h1>
            <span class="chip shrink-0" :style="{ background: statusStyle.bg, color: statusStyle.text }">{{ r.status }}</span>
          </div>
          <div class="flex items-center gap-[16px] min-w-0 max-w-full">
            <span class="flex items-center gap-[4px] shrink-0">
              <img :src="userIcon" width="14" height="14" alt="" />
              <span class="text-[12px] text-[#61667c] leading-[1.5] whitespace-nowrap">{{ r.recipient }}</span>
            </span>
            <span v-if="r.description" class="flex items-center gap-[4px] min-w-0">
              <img :src="descriptionIcon" width="14" height="14" alt="" class="shrink-0" />
              <span class="text-[12px] text-[#61667c] leading-[1.5] truncate">{{ r.description }}</span>
            </span>
          </div>
        </div>

        <!-- Amount -->
        <div class="flex flex-col gap-px min-w-[100px] max-w-[200px] p-[8px] shrink-0">
          <span class="text-[10px] font-medium uppercase tracking-[0.3px] text-[#9295a5] leading-[18px]">Amount</span>
          <span class="text-[18px] font-medium text-[#03102f] leading-[1.35] whitespace-nowrap mono">{{ r.amount }}</span>
        </div>

        <!-- Actions (Figma: Dropdown — items depend on the state) -->
        <div class="relative shrink-0" @click.stop>
          <button type="button" class="btn-icon" aria-label="Reimbursement actions" :aria-expanded="menuOpen" @click="menuOpen = !menuOpen">
            <img :src="dotsIcon" width="18" height="18" alt="" />
          </button>
          <Transition name="menu-pop">
            <div v-if="menuOpen" class="menu absolute right-0 top-[44px] z-30 w-[162px]" role="menu">
              <div class="flex flex-col p-[4px]">
                <button v-for="item in menuItems.filter((m) => !m.danger)" :key="item.label" type="button" class="menu-item" role="menuitem" @click="onMenu(item.action)">
                  <img :src="item.icon" width="16" height="16" alt="" />
                  <span>{{ item.label }}</span>
                </button>
              </div>
              <template v-if="menuItems.some((m) => m.danger)">
                <div class="h-px bg-[#e5e6ea]" />
                <div class="flex flex-col p-[4px]">
                  <button v-for="item in menuItems.filter((m) => m.danger)" :key="item.label" type="button" class="menu-item menu-item--danger" role="menuitem" @click="onMenu(item.action)">
                    <img :src="item.icon" width="16" height="16" alt="" />
                    <span>{{ item.label }}</span>
                  </button>
                </div>
              </template>
            </div>
          </Transition>
        </div>

        <!-- Previous / next reimbursement -->
        <div class="flex items-center gap-[2px] shrink-0">
          <button type="button" class="btn-icon" :disabled="!prevId" aria-label="Previous reimbursement" @click="go(prevId)"><img :src="prevIcon" width="18" height="18" alt="" /></button>
          <button type="button" class="btn-icon" :disabled="!nextId" aria-label="Next reimbursement" @click="go(nextId)"><img :src="nextIcon" width="18" height="18" alt="" /></button>
        </div>
      </div>

      <!-- Next step + progress -->
      <div class="px-[24px] pb-[12px]">
        <div class="flex flex-col gap-[8px] p-[4px] rounded-[8px] bg-[#f5f6f9]">
          <div class="flex items-center gap-[12px] px-[16px] py-[8px]">
            <div class="flex flex-1 flex-col gap-[4px] min-w-0 text-[14px] leading-[1.5]">
              <p class="font-medium text-[#03102f]">{{ banner.title }}</p>
              <p class="text-[#61667c]">{{ banner.text }}</p>
            </div>
            <button v-if="banner.action" type="button" class="btn-primary-sm" @click="openFundTransfer">{{ banner.action }}</button>
          </div>
          <div class="pt-[8px]">
            <ol class="flex items-start px-[8px] pb-[8px] rounded-[4px] bg-white" aria-label="Progress">
              <li v-for="(s, i) in steps" :key="s.key" class="relative flex flex-1 flex-col gap-[4px] min-w-0 px-[8px] pt-[16px]" :aria-current="s.current ? 'step' : undefined">
                <span class="absolute left-[8px] right-[-13px] top-[-8px] flex items-center">
                  <img :src="DOTS[s.dot]" width="18" height="18" alt="" class="shrink-0" />
                  <img v-if="i < steps.length - 1" :src="s.lineDone ? lineBlue : lineGrey" alt="" class="flex-1 min-w-0 h-px" />
                </span>
                <p class="text-[12px] font-medium leading-[1.5] truncate" :class="s.done ? 'text-[#03102f]' : 'text-[#9295a5]'">{{ s.label }}</p>
                <p v-if="s.sub" class="text-[12px] text-[#61667c] leading-[1.5] truncate">{{ s.sub }}</p>
                <p v-if="s.error" class="text-[12px] text-[#dc3545] leading-[1.5] truncate">{{ s.error }}</p>
                <span v-if="!s.sub && !s.error" class="h-[18px]" />
              </li>
            </ol>
          </div>
        </div>
      </div>

      <!-- Content -->
      <div class="flex flex-col gap-[24px] px-[24px] py-[12px]">

        <!-- Claims -->
        <section class="flex flex-col gap-[12px]">
          <h2 class="section-title">Claims</h2>
          <div>
            <div class="rounded-t-[8px] border border-[#e5e6ea] overflow-x-auto">
              <table class="w-full min-w-[860px] border-collapse" style="table-layout: fixed;">
                <colgroup>
                  <col style="width: 149px;" /><col style="width: 198px;" /><col style="width: 198px;" /><col /><col style="width: 150px;" />
                </colgroup>
                <thead>
                  <tr>
                    <th v-for="(col, ci) in CLAIM_COLS" :key="col" class="th" :class="ci < CLAIM_COLS.length - 1 ? 'border-r border-r-[#e5e6ea]' : ''">
                      <span class="flex items-center gap-[8px]">
                        <span class="flex-1 min-w-0 truncate">{{ col }}</span>
                        <img :src="sortIcon" width="14" height="14" alt="" class="shrink-0" />
                      </span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="c in r.items"
                    :key="c.id"
                    class="cursor-pointer transition-colors duration-150 [&:last-child>td]:border-b-0"
                    :class="openClaimId === c.id ? 'bg-[#f8f9fc]' : 'hover:bg-[#fcfcfd]'"
                    @click="openClaimId = openClaimId === c.id ? null : c.id"
                  >
                    <td class="td"><span class="text-[13px] text-[#03102f] leading-[1.4] whitespace-nowrap mono">{{ c.date }}</span></td>
                    <td class="td"><p class="text-[13px] text-[#03102f] leading-[1.5] truncate">{{ c.merchant }}</p></td>
                    <td class="td"><span class="category-chip">{{ c.category }}</span></td>
                    <td class="td"><p class="text-[13px] text-[#03102f] leading-[1.5] truncate">{{ c.description }}</p></td>
                    <td class="td !border-r-0">
                      <span class="flex items-center gap-[4px]">
                        <img v-if="c.fx" :src="exchangeIcon" width="16" height="16" alt="Foreign currency" class="shrink-0" />
                        <span class="flex-1 min-w-0 text-right text-[13px] font-semibold text-[#03102f] leading-[1.4] whitespace-nowrap truncate mono">{{ c.amount }}</span>
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div class="flex items-center gap-[8px] px-[12px] py-[8px] rounded-b-[8px] border border-[#03102f] bg-[#03102f]">
              <span class="flex-1 text-[12px] font-medium text-[#cbcdd4] leading-[1.5]">Total to pay</span>
              <span class="text-[18px] font-medium text-white leading-[1.35] whitespace-nowrap mono">{{ r.amount }}</span>
            </div>
          </div>
        </section>

        <!-- Payment method details (once paid) -->
        <section v-if="r.status === 'Paid' && r.payment" class="flex flex-col gap-[12px]">
          <h2 class="section-title">Payment method details</h2>
          <div class="rounded-[8px] border border-[#e5e6ea] overflow-hidden">
            <table class="w-full border-collapse" style="table-layout: fixed;">
              <thead>
                <tr>
                  <th class="th border-r border-r-[#e5e6ea]">Method</th>
                  <th class="th border-r border-r-[#e5e6ea]">Payment date</th>
                  <th class="th">Paid by</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td class="td !border-b-0">
                    <span class="flex items-center gap-[8px]">
                      <span class="method-logo"><img :src="methodLogo" alt="" /></span>
                      <span class="text-[12px] text-[#61667c] leading-[1.5] truncate">{{ r.payment.method }}</span>
                    </span>
                  </td>
                  <td class="td !border-b-0"><span class="text-[13px] text-[#03102f] leading-[1.4] whitespace-nowrap mono">{{ tableStamp(r.payment.at) }}</span></td>
                  <td class="td !border-b-0 !border-r-0"><p class="text-[13px] text-[#03102f] leading-[1.5] truncate">{{ r.payment.by }}</p></td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <div class="flex items-start gap-[16px] pb-[12px]">
          <!-- Recipient details -->
          <section class="flex flex-1 flex-col gap-[12px] min-w-0">
            <h2 class="section-title">Recipient details</h2>
            <dl class="flex flex-col py-[16px] rounded-[8px] border border-[#e5e6ea]">
              <div v-for="row in recipientRows" :key="row.label" class="flex items-start px-[24px] py-[8px]">
                <dt class="w-[160px] shrink-0 text-[14px] text-[#61667c] leading-[1.5]">{{ row.label }}</dt>
                <dd class="flex-1 min-w-0 text-[14px] text-[#03102f] leading-[1.5]">{{ row.value }}</dd>
              </div>
            </dl>
          </section>

          <!-- Timeline -->
          <section class="flex flex-1 flex-col gap-[12px] min-w-0">
            <div class="flex items-center justify-between">
              <h2 class="text-[16px] font-medium text-black leading-[1.4]">Timeline</h2>
              <div class="flex items-start gap-[8px]">
                <button type="button" class="btn-small gap-[6px]">
                  <img :src="addNoteIcon" width="16" height="16" alt="" class="-mx-[1px]" />
                  Add Note
                </button>
                <button type="button" class="btn-small !w-[28px] !px-0" :aria-label="timelineOpen ? 'Collapse timeline' : 'Expand timeline'" :aria-expanded="timelineOpen" @click="timelineOpen = !timelineOpen">
                  <img :src="chevronUpIcon" width="16" height="16" alt="" class="transition-transform duration-200" :class="timelineOpen ? '' : 'rotate-180'" />
                </button>
              </div>
            </div>
            <div class="flex flex-col pl-[20px] pr-[24px] py-[4px] rounded-[8px] bg-[#f8f9fc]">
              <div v-for="(e, i) in shownTimeline" :key="e.id" class="relative flex items-start gap-[4px] py-[12px]">
                <span v-if="i < shownTimeline.length - 1" class="absolute left-[11px] top-[35px] -bottom-[11px] w-px bg-[#cbcdd4]" />
                <img :src="i === 0 ? dotActiveIcon : dotIcon" width="23" height="23" alt="" class="shrink-0" />
                <div class="flex flex-col gap-[4px] flex-1 min-w-0">
                  <p class="text-[14px] text-[#03102f] leading-[1.5]">{{ e.at }}</p>
                  <p class="text-[12px] text-[#61667c] leading-[1.5]"><span v-if="e.label" class="text-[#dc3545]">{{ e.label }}</span>{{ e.label ? ' ' : '' }}{{ e.text }}</p>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>

    <!-- Claim details (Figma: 142:60007) — read-only inside a reimbursement -->
    <Transition name="detail-panel">
      <ClaimDetailPanel v-if="openClaim" :key="openClaim.id" :claim="openClaim" readonly @close="openClaimId = null" />
    </Transition>

    <!-- Snackbar -->
    <div class="absolute top-[24px] inset-x-0 z-50 flex justify-center pointer-events-none" :style="{ paddingRight: openClaim ? '504px' : '0' }">
      <Transition name="snackbar">
        <div v-if="toast" class="flex items-center gap-[4px] pl-[8px] pr-[12px] py-[8px] rounded-[8px] bg-[#e6f9f0] border border-[#b3eed2]" style="filter: drop-shadow(0px 8px 6px rgba(42,50,82,0.04));" role="status">
          <img :src="toastCheckIcon" width="16" height="16" alt="" class="shrink-0" />
          <span class="text-[12px] text-[#03102f] leading-[1.5] whitespace-nowrap">{{ toast }}</span>
        </div>
      </Transition>
    </div>

    <!-- Fund transfer (Figma: 141:27126 / multiple accounts 141:34726) -->
    <PaymentMethodModal
      v-model="fundOpen"
      title="Fund transfer"
      back-label="Cancel"
      :current="payMethod"
      :methods="PAY_METHODS"
      @confirm="onMethodChosen"
    >
      <template #before>
        <p class="text-[12px] font-medium text-[#61667c] leading-[1.5]">Send payment to</p>
        <div class="flex flex-col rounded-[8px] border border-[#e5e6ea] overflow-hidden">
          <div class="flex items-center gap-[8px] p-[8px]">
            <span class="avatar">{{ r.recipient[0] }}</span>
            <span class="flex flex-col min-w-0">
              <span class="text-[14px] font-medium text-[#03102f] leading-[1.5] truncate">{{ r.recipient }}</span>
              <span class="text-[12px] text-[#61667c] leading-[1.5]">{{ accounts.length > 1 ? 'Select bank account below' : `${r.account.bank} / ${r.account.number}` }}</span>
            </span>
          </div>
          <div v-if="accounts.length > 1" role="radiogroup" aria-label="Bank account">
            <button
              v-for="a in accounts"
              :key="a.number"
              type="button"
              role="radio"
              :aria-checked="a.number === r.account.number"
              class="flex items-center gap-[12px] w-full px-[12px] py-[8px] text-left border-t border-[#e5e6ea] transition-colors duration-150"
              :class="a.number === r.account.number ? 'bg-[#fcfcfd]' : 'hover:bg-[#fcfcfd]'"
              @click="r.account = a"
            >
              <span class="radio" :class="{ 'is-on': a.number === r.account.number }"><img v-if="a.number === r.account.number" :src="radioActive" alt="" class="radio-dot" /></span>
              <span class="text-[14px] text-[#03102f] leading-[1.5]">{{ a.bank }} / {{ a.number }}</span>
              <span class="currency-chip">{{ a.currency }}</span>
            </button>
          </div>
        </div>
      </template>
    </PaymentMethodModal>
    <ReimbursementPayModal
      :open="payOpen"
      :method="payMethod"
      :amount="payAmount"
      :fee="payFee"
      :currency="PAY_CURRENCY"
      :balance="HITPAY_BALANCE"
      show-back
      @close="payOpen = false"
      @back="payOpen = false; fundOpen = true"
      @paid="onPaid(false)"
      @pending="onPaid(true)"
    />

    <!-- Edit (Figma: Reimbursement - Edit, 158:96695) — covers the page, sidebar stays visible -->
    <Transition name="full-page">
      <EditReimbursementPage v-if="editOpen" :reimbursement="r" @close="editOpen = false" @update="saveEdit" />
    </Transition>

    <!-- Cancel confirmation -->
    <BaseModal :open="cancelOpen" :width="400" @close="cancelOpen = false">
      <div class="flex flex-col items-center gap-[16px] px-[24px] pt-[24px] pb-[8px] text-center">
        <span class="flex p-[12px] rounded-full bg-[#fdf2f3]"><img :src="cancelIcon" width="24" height="24" alt="" /></span>
        <div class="flex flex-col gap-[4px]">
          <p class="text-[16px] font-medium text-[#03102f] leading-[1.4]">Cancel this reimbursement?</p>
          <p class="text-[14px] text-[#61667c] leading-[1.5]">{{ r.items.length }} claim{{ r.items.length === 1 ? '' : 's' }} go back to {{ r.recipient }}’s approved claims, ready to add to a new reimbursement.</p>
        </div>
      </div>
      <div class="flex items-center gap-[8px] p-[16px]">
        <button type="button" class="btn-secondary flex-1" @click="cancelOpen = false">Keep it</button>
        <button type="button" class="btn-danger flex-1" @click="confirmCancel">Cancel reimbursement</button>
      </div>
    </BaseModal>
  </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import BaseModal from '../modals/BaseModal.vue'
import EditReimbursementPage from './EditReimbursementPage.vue'
import PaymentMethodModal from '../modals/PaymentMethodModal.vue'
import ReimbursementPayModal from '../modals/ReimbursementPayModal.vue'
import ClaimDetailPanel from '../content/ClaimDetailPanel.vue'
import {
  reimbursements, getReimbursement, accountsFor, REIMBURSEMENT_STATUS, PAY_METHODS, PAY_CURRENCY, HITPAY_BALANCE,
  shortStamp, tableStamp, startPayment, cancelReimbursement, editReimbursement, exportReimbursementPdf, reimbursementActions, EDITABLE_STATUSES,
} from '../../composables/useReimbursements.js'
import { money } from '../../composables/useFx.js'
import backIcon from '../../assets/images/reimb-back.svg'
import userIcon from '../../assets/images/reimb-user.svg'
import descriptionIcon from '../../assets/images/reimb-description.svg'
import dotsIcon from '../../assets/icons/icon-dots-vertical.svg'
import prevIcon from '../../assets/images/reimb-prev.svg'
import nextIcon from '../../assets/images/reimb-next.svg'
import dotBlue from '../../assets/images/reimb-step-dot-blue.svg'
import dotGrey from '../../assets/images/reimb-step-dot-grey.svg'
import dotRed from '../../assets/images/reimb-step-dot-red.svg'
import dotGreen from '../../assets/images/reimb-step-dot-green.svg'
import lineBlue from '../../assets/images/reimb-step-line-blue.svg'
import lineGrey from '../../assets/images/reimb-step-line-grey.svg'
import sortIcon from '../../assets/images/reimb-sort-down.svg'
import exchangeIcon from '../../assets/icons/icon-exchange.svg'
import addNoteIcon from '../../assets/images/claims-add-note.svg'
import chevronUpIcon from '../../assets/images/reimb-chevron-up.svg'
import dotActiveIcon from '../../assets/images/claims-timeline-dot-active.svg'
import dotIcon from '../../assets/images/claims-timeline-dot.svg'
import downloadIcon from '../../assets/images/reimb-menu-download.svg'
import pencilIcon from '../../assets/icons/icon-pencil.svg'
import cancelIcon from '../../assets/images/reimb-menu-cancel.svg'
import paynowMini from '../../assets/images/reimb-paynow-mini.svg'
import radioActive from '../../assets/images/reimb-radio-active.svg'
import modalCloseIcon from '../../assets/images/claims-panel-close.svg'
import toastCheckIcon from '../../assets/icons/icon-check-circle-green.svg'

const route = useRoute()
const router = useRouter()

const r = computed(() => getReimbursement(route.params.id))
// Unknown id (e.g. a stale link) → back to the list
watch(r, (v) => { if (!v) router.replace('/claims/reimbursements') }, { immediate: true })

const statusStyle = computed(() => REIMBURSEMENT_STATUS[r.value.status])
const accounts = computed(() => accountsFor(r.value.recipient))

// ── Previous / next follow the list order ──
const index = computed(() => reimbursements.value.findIndex((x) => x.id === r.value?.id))
const prevId = computed(() => reimbursements.value[index.value - 1]?.id)
const nextId = computed(() => reimbursements.value[index.value + 1]?.id)
function go(id) {
  if (!id) return
  openClaimId.value = null
  router.push(`/claims/reimbursements/${id}`)
}

// ── Banner + progress per state ──
const lowerFirst = (s) => s.charAt(0).toLowerCase() + s.slice(1)
const banner = computed(() => ({
  Draft: { title: 'Submit this reimbursement', text: 'Submit and pay this reimbursement', action: 'Submit and Pay' },
  'Awaiting for payment': { title: 'Awaiting for fund', text: 'Fund the transfer to pay this reimbursement', action: 'Fund transfer' },
  Processing: { title: 'Payment has been processed', text: 'Please wait for completing this payment' },
  Paid: { title: 'Reimbursement has been paid', text: `Nice! ${r.value.title} has been paid.` },
  // "Can’t find bank account" → "We can’t find bank account"
  Failed: { title: 'Payment failed', text: `We ${lowerFirst(r.value.failure?.reason ?? 'Couldn’t complete the transfer')}`, action: 'Retry' },
  Canceled: { title: 'Reimbursement canceled', text: 'Its claims went back to the recipient’s approved claims.' },
}[r.value.status]))

const DOTS = { blue: dotBlue, grey: dotGrey, red: dotRed, green: dotGreen }
const steps = computed(() => {
  const s = r.value.status
  const reached = { Draft: 0, 'Awaiting for payment': 1, Processing: 2, Failed: 2, Canceled: 1, Paid: 3 }[s]
  const third = s === 'Failed'
    ? { label: 'Failed', dot: 'red', sub: shortStamp(r.value.failure.at), error: r.value.failure.reason }
    : s === 'Canceled'
      ? { label: 'Canceled', dot: 'red' }
      : { label: 'Payment', dot: reached >= 2 ? 'blue' : 'grey' }
  const list = [
    { key: 'created', label: `Created by ${r.value.createdBy}`, sub: shortStamp(r.value.createdAt), dot: 'blue' },
    { key: 'fund', label: 'Awaiting for fund', dot: reached >= 1 ? 'blue' : 'grey' },
    { key: 'payment', ...third },
    { key: 'done', label: 'Completed', dot: s === 'Paid' ? 'green' : 'grey' },
  ]
  return list.map((step, i) => ({
    ...step,
    done: step.dot !== 'grey',
    current: i === Math.min(reached, 3),
    // The line leaving a step is blue once the next step has been reached
    lineDone: i < reached && !(i === 1 && s === 'Canceled'),
  }))
})

// ── Claims ──
const CLAIM_COLS = ['Date', 'Merchant', 'Category', 'Descriptions', 'Amount']
const openClaimId = ref(null)
const openClaim = computed(() => r.value?.items.find((c) => c.id === openClaimId.value) ?? null)
watch(() => route.params.id, () => { openClaimId.value = null })

const methodLogo = computed(() => (r.value.payment?.method === 'PayNow' ? paynowMini : PAY_METHODS.find((m) => m.name === r.value.payment?.method)?.img ?? paynowMini))

const recipientRows = computed(() => [
  { label: 'Recipient', value: r.value.recipient },
  { label: 'Account number', value: r.value.account.number },
  { label: 'Bank', value: r.value.account.bank },
])

// ── Timeline ──
const timelineOpen = ref(true)
const shownTimeline = computed(() => (timelineOpen.value ? r.value.timeline : r.value.timeline.slice(0, 1)))

// ── Actions menu (Figma: Dropdown 141:26976 / 141:27092 / 141:27010) ──
const menuOpen = ref(false)
const MENU_ICONS = { export: downloadIcon, edit: pencilIcon, cancel: cancelIcon }
const menuItems = computed(() => reimbursementActions(r.value.status).map((m) => ({ ...m, icon: MENU_ICONS[m.action] })))
function onMenu(action) {
  menuOpen.value = false
  if (action === 'export') exportPdf()
  if (action === 'edit') openEdit()
  if (action === 'cancel') cancelOpen.value = true
}

function exportPdf() {
  exportReimbursementPdf(r.value)
  showToast('PDF exported')
}

// ── Edit ──
const editOpen = ref(false)
function openEdit() {
  openClaimId.value = null
  editOpen.value = true
}
function saveEdit(changes) {
  editReimbursement(r.value, changes)
  editOpen.value = false
  showToast('Reimbursement has been updated successfully')
}

// ── Cancel ──
const cancelOpen = ref(false)
function confirmCancel() {
  cancelReimbursement(r.value)
  cancelOpen.value = false
  showToast('Reimbursement has been canceled')
}

// Edit / Cancel picked from a list row's menu arrive as ?action=…
watch(() => [route.params.id, route.query.action], ([, action]) => {
  if (!r.value || !action) return
  if (action === 'edit' && EDITABLE_STATUSES.includes(r.value.status)) openEdit()
  if (action === 'cancel' && reimbursementActions(r.value.status).some((m) => m.action === 'cancel')) cancelOpen.value = true
  router.replace({ query: {} })
}, { immediate: true })

// ── Fund transfer → pay ──
const fundOpen = ref(false)
const payOpen = ref(false)
const payMethod = ref('balance')
const method = computed(() => PAY_METHODS.find((m) => m.id === payMethod.value))
const payFee = computed(() => method.value.feeValue)
const payAmount = computed(() => parseFloat(r.value.amount.split(' ')[1].replace(/,/g, '')) + payFee.value)

function openFundTransfer() {
  fundOpen.value = true
}
function onMethodChosen(m) {
  payMethod.value = m.id
  payOpen.value = true
}
function onPaid(slow) {
  payOpen.value = false
  startPayment(r.value, method.value.name, { slow })
  showToast(slow ? 'Bank transfer submitted — we’ll confirm it once it arrives' : `Payment of ${PAY_CURRENCY} ${money(payAmount.value)} sent`)
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
.section-title { font-size: 16px; font-weight: 500; line-height: 1.4; color: #03102f; }

.chip {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 24px;
  min-width: 32px;
  padding: 2px 8px;
  border-radius: 24px;
  font-size: 12px;
  font-weight: 500;
  line-height: 1.5;
  white-space: nowrap;
}

/* Buttons (Figma: Button/Secondary icon 36px, Button/Primary 28px, Small secondary 28px) */
.btn-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 8px;
  border: 1px solid #f2f2f4;
  background: linear-gradient(to bottom, #ffffff, #f2f2f2);
  box-shadow: 0px 1.5px 0px 0px rgba(0, 0, 0, 0.1);
  transition: filter 150ms ease, opacity 150ms ease;
}
.btn-icon:hover:not(:disabled) { filter: brightness(0.95); }
.btn-icon:active:not(:disabled) { transform: translateY(1px); }
.btn-icon:disabled { opacity: 0.45; cursor: not-allowed; }

.btn-primary-sm {
  display: inline-flex;
  align-items: center;
  height: 28px;
  padding: 0 16px;
  border-radius: 8px;
  border: 1px solid #2465de;
  background: linear-gradient(to bottom, #4179e2, #1f5bcc);
  box-shadow: 0px 1.5px 0px 0px #1d5fd9;
  font-size: 12px;
  font-weight: 500;
  line-height: 1.5;
  color: white;
  text-shadow: 0px 1px 1px rgba(0, 0, 0, 0.12);
  white-space: nowrap;
  flex-shrink: 0;
  transition: filter 150ms ease;
}
.btn-primary-sm:hover { filter: brightness(1.05); }
.btn-primary-sm:active { transform: translateY(1px); }

.btn-small {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 28px;
  padding: 0 8px;
  border-radius: 8px;
  border: 1px solid #f2f2f4;
  background: linear-gradient(to bottom, #ffffff, #f2f2f2);
  box-shadow: 0px 1.5px 0px 0px #e5e5e5;
  font-size: 12px;
  font-weight: 500;
  line-height: 1.5;
  color: #61667c;
  text-shadow: 0px 1px 1px rgba(0, 0, 0, 0.08);
  white-space: nowrap;
  transition: filter 150ms ease;
}
.btn-small:hover { filter: brightness(0.95); }

.btn-secondary,
.btn-danger {
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
.btn-danger {
  border: 1px solid #cc2436;
  background: linear-gradient(to bottom, #e25563, #cc2436);
  box-shadow: 0px 1.5px 0px 0px #b81f30;
  color: white;
  text-shadow: 0px 1px 1px rgba(0, 0, 0, 0.12);
}
.btn-secondary:hover { filter: brightness(0.95); }
.btn-danger:hover { filter: brightness(1.05); }
.btn-secondary:active, .btn-danger:active { transform: translateY(1px); }

/* Dropdown (Figma: Dropdown, Shadow/Tooltip) */
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

/* Tables (Figma: Table Header/Cell + Table Row/Cell) */
.th {
  height: 34px;
  padding: 8px 12px;
  background: #fcfcfd;
  border-bottom: 0.5px solid #cbcdd4;
  text-align: left;
  vertical-align: middle;
  font-size: 10px;
  font-weight: 500;
  line-height: 18px;
  letter-spacing: 0.3px;
  text-transform: uppercase;
  color: #03102f;
}
.td {
  height: 44px;
  padding: 8px 12px;
  border-bottom: 1px solid #e5e6ea;
  border-right: 1px solid #e5e6ea;
  vertical-align: middle;
  overflow: hidden;
}
.category-chip {
  display: inline-block;
  max-width: 100%;
  min-height: 24px;
  padding: 2px 8px;
  border: 1px solid #cbcdd4;
  border-radius: 24px;
  font-size: 12px;
  font-weight: 500;
  line-height: 1.5;
  color: #61667c;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  vertical-align: middle;
}

/* PayNow mark in the payment table (Figma: Logo 23.3 × 16) */
.method-logo {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 23.333px;
  height: 16px;
  border: 0.5px solid #cbcdd4;
  border-radius: 5.333px;
  background: white;
  overflow: hidden;
}
.method-logo img { width: 16px; height: 10px; object-fit: contain; }

/* Fund transfer recipient */
.avatar {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 32px;
  height: 32px;
  border-radius: 8px;
  background: #002771;
  color: white;
  font-size: 14px;
  font-weight: 700;
  letter-spacing: 0.15px;
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

/* Edit page: gentle rise + fade in, quicker fade out (same as Claims) */
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

/* Motion: dropdown pop, claim panel slide, snackbar drop (same as Bills / Claims) */
.menu-pop-enter-active { transition: opacity 140ms ease-out, transform 140ms ease-out; }
.menu-pop-leave-active { transition: opacity 100ms ease-in; }
.menu-pop-enter-from { opacity: 0; transform: translateY(-4px); }
.menu-pop-leave-to { opacity: 0; }

.detail-panel-enter-active { transition: opacity 220ms ease-out, transform 280ms cubic-bezier(0.32, 0.72, 0, 1); }
.detail-panel-leave-active { transition: opacity 150ms ease-in, transform 180ms ease-in; }
.detail-panel-enter-from,
.detail-panel-leave-to { opacity: 0; transform: translateX(32px); }

.snackbar-enter-active { transition: opacity 200ms ease-out, transform 200ms ease-out; }
.snackbar-leave-active { transition: opacity 150ms ease-in, transform 150ms ease-in; }
.snackbar-enter-from,
.snackbar-leave-to { opacity: 0; transform: translateY(-16px); }

@media (prefers-reduced-motion: reduce) {
  .full-page-enter-active, .full-page-leave-active,
  .menu-pop-enter-active, .menu-pop-leave-active,
  .detail-panel-enter-active, .detail-panel-leave-active,
  .snackbar-enter-active, .snackbar-leave-active { transition: none; }
  .full-page-enter-from, .full-page-leave-to,
  .menu-pop-enter-from, .detail-panel-enter-from, .detail-panel-leave-to,
  .snackbar-enter-from, .snackbar-leave-to { transform: none; }
}
</style>
