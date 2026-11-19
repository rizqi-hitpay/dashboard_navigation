<template>
  <!-- Bill amount breakdown (Figma BillPay "Amount Info") — shared by the bill detail page
       and the Compare-with-original-invoice modal -->
  <div class="flex flex-col gap-[4px] p-[4px] rounded-[8px] border border-[#e5e6ea] bg-[#f2f2f4] w-full">
    <div class="flex flex-col bg-white rounded-[4px] w-full overflow-hidden">
      <div class="flex items-start justify-between px-[12px] py-[8px] border-b border-[#e5e6ea]">
        <span class="lbl">Recipient gets</span>
        <span class="val">{{ recipientGetsText }}</span>
      </div>
      <div class="flex items-start justify-between px-[12px] py-[8px] border-b border-[#e5e6ea]">
        <span class="lbl">Amount to pay</span>
        <span class="flex flex-col items-end">
          <span class="val">SGD {{ money(amountToPay) }}</span>
          <span v-if="fxRate" class="text-[12px] text-[#61667c] leading-[1.5] mono">USD 1 = SGD {{ fxRate }}</span>
        </span>
      </div>
      <!-- Funding method: HitPay Balance -->
      <div class="flex flex-col gap-[2px] py-[8px] border-b border-[#e5e6ea]">
        <span class="px-[12px] lbl">Funding method</span>
        <div class="flex gap-[8px] items-center px-[12px]">
          <span class="flex items-center justify-center size-[40px] rounded-[8px] border border-[#e5e6ea] bg-white shrink-0">
            <img :src="hitpayLogogram" width="25.1072" height="25.0747" alt="HitPay" />
          </span>
          <span class="flex flex-col gap-[2px]">
            <span class="text-[12px] font-medium text-[#03102f] leading-[1.5]">HitPay Balance</span>
            <span class="text-[12px] text-[#61667c] leading-[1.5]">Available: SGD 1,000.00</span>
          </span>
        </div>
      </div>
      <!-- Total fees (expandable breakdown) -->
      <div class="flex flex-col gap-[4px] px-[12px] py-[8px] border-b border-[#e5e6ea]">
        <button type="button" class="flex items-center justify-between w-full text-left" :aria-expanded="feesOpen" @click="feesOpen = !feesOpen">
          <span class="lbl">Total fees</span>
          <span class="flex items-center gap-[2px]">
            <span class="val">SGD {{ money(feesTotal) }}</span>
            <img :src="chevronDownGrey" width="16" height="16" alt="" class="transition-transform duration-200" :class="feesOpen ? '' : '-rotate-90'" />
          </span>
        </button>
        <template v-if="feesOpen">
          <div v-for="f in fees" :key="f.label" class="flex items-center justify-between pr-[18px]">
            <span class="text-[12px] text-[#61667c] leading-[1.5]">{{ f.label }}</span>
            <span class="text-[12px] text-[#61667c] leading-[1.5] mono">SGD {{ money(f.amount) }}</span>
          </div>
        </template>
      </div>
      <div class="flex items-start justify-between px-[12px] py-[8px]">
        <span class="lbl">Transfer Type</span>
        <span class="text-[14px] font-medium text-[#03102f] leading-[1.5]">LOCAL</span>
      </div>
    </div>
    <!-- You will pay -->
    <div class="flex gap-[8px] items-center px-[12px] py-[8px] rounded-[4px] bg-[#03102f]">
      <span class="flex-1 text-[12px] font-medium text-[#cbcdd4] leading-[1.5]">You will pay</span>
      <span class="flex gap-[8px] items-start">
        <span class="pt-[4px] text-[12px] font-medium text-[#cbcdd4] leading-[1.5]">SGD</span>
        <span class="text-[24px] font-medium text-white leading-[1.35] mono">{{ money(youWillPay) }}</span>
      </span>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import hitpayLogogram from '../../assets/icons/upload-bill/review-logogram.svg'
import chevronDownGrey from '../../assets/icons/bill-detail/chevron-down-grey.svg'

const props = defineProps({
  recipientGetsText: { type: String, required: true },
  amountToPay: { type: Number, required: true },
  // USD→SGD rate to show under "Amount to pay"; omit for local SGD bills
  fxRate: { type: Number, default: null },
  fees: { type: Array, required: true }, // [{ label, amount }]
})

const feesOpen = ref(true)
const feesTotal = computed(() => props.fees.reduce((s, f) => s + f.amount, 0))
const youWillPay = computed(() => props.amountToPay + feesTotal.value)
const money = (n) => n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
</script>

<style scoped>
.mono { font-family: 'Reddit Mono', ui-monospace, monospace; }
.lbl { font-size: 12px; font-weight: 500; line-height: 1.5; color: #61667c; white-space: nowrap; }
.val { font-family: 'Reddit Mono', ui-monospace, monospace; font-size: 14px; font-weight: 600; line-height: 1.4; color: #03102f; white-space: nowrap; }
</style>
