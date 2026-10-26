<template>
  <!-- Approve / reject a claim (Figma: [Admin] Claim Details — _Confirmation, 80:16048) -->
  <BaseModal :open="open" :width="480" @close="emit('close')">
    <template #header>
      <div class="flex items-start gap-[16px] p-[16px] border-b border-[#e5e6ea]">
        <p class="flex-1 min-w-0 pt-[2px] text-[16px] font-medium text-[#03102f] leading-[1.4]">{{ isReject ? 'Reject this claim?' : 'Approve this claim?' }}</p>
        <button type="button" class="flex items-center justify-center size-[32px] rounded-[4px] shrink-0 transition-colors duration-150 hover:bg-[#f0f1f5]" aria-label="Close" @click="emit('close')">
          <img :src="closeIcon" width="20" height="20" alt="" />
        </button>
      </div>
    </template>

    <div class="flex flex-col items-center gap-[12px] p-[24px]">
      <span class="flex p-[12px] rounded-full" :class="isReject ? 'bg-[#fff9ec]' : 'bg-[#f5f6f9]'">
        <img :src="isReject ? alertIcon : questionIcon" width="24" height="24" alt="" />
      </span>
      <p class="w-[296px] max-w-full text-[14px] text-[#03102f] leading-[1.5] text-center">Do you want to {{ isReject ? 'reject' : 'approve' }} this claim?</p>

      <!-- Claim summary + amount -->
      <div class="flex flex-col gap-[8px] w-full">
        <div class="flex flex-col gap-[4px] px-[12px] py-[8px] rounded-[8px] border border-[#e5e6ea] bg-white">
          <p class="text-[14px] font-medium text-[#03102f] leading-[1.5]">{{ claim.merchant }}</p>
          <div class="flex flex-col gap-[2px] text-[12px] leading-[1.5]">
            <p v-for="row in summary" :key="row.label"><span class="text-[#61667c]">{{ row.label }}:</span> <span class="text-[#03102f]">{{ row.value }}</span></p>
          </div>
        </div>
        <div class="flex items-center gap-[8px] px-[12px] py-[8px] rounded-[8px] bg-[#03102f]">
          <p class="flex-1 text-[12px] font-medium text-[#cbcdd4] leading-[1.5]">Amount</p>
          <p class="pt-[4px] text-[12px] font-medium text-[#cbcdd4] leading-[1.5]">{{ amount.currency }}</p>
          <p class="text-[24px] font-medium text-white leading-[1.35] whitespace-nowrap" style="font-family: 'Reddit Mono', ui-monospace, monospace;">{{ amount.value }}</p>
        </div>
      </div>

      <!-- Reject needs a reason, which the claimant sees on the timeline -->
      <div v-if="isReject" class="flex flex-col items-center gap-[8px] pt-[8px] w-full">
        <label for="claim-reject-reason" class="w-[296px] max-w-full text-[14px] text-[#03102f] leading-[1.5] text-center">Please provide the reason why you reject it.</label>
        <textarea
          id="claim-reject-reason"
          ref="reasonEl"
          v-model="reason"
          rows="3"
          placeholder="Tell us the reason"
          class="reason-input w-full h-[100px] px-[8px] py-[8px] rounded-[8px] border border-[#e5e6ea] bg-white text-[14px] text-[#03102f] leading-[1.5] resize-none outline-none"
        />
      </div>
    </div>

    <div class="flex items-start justify-end gap-[12px] px-[16px] py-[20px] border-t border-[#e5e6ea]">
      <button
        type="button"
        class="flex items-center justify-center h-[36px] min-w-[112px] px-[12px] rounded-[8px] border border-[#f2f2f4] transition-[filter] duration-150 hover:brightness-95 active:translate-y-[1px]"
        style="background: linear-gradient(to bottom, #ffffff, #f2f2f2); box-shadow: 0px 1.5px 0px 0px rgba(0,0,0,0.1);"
        @click="emit('close')"
      >
        <span class="text-[14px] font-medium text-[#61667c] leading-[1.5]" style="text-shadow: 0px 1px 1px rgba(0,0,0,0.08);">Cancel</span>
      </button>
      <button
        type="button"
        class="flex items-center justify-center h-[36px] w-[112px] px-[12px] rounded-[8px] border transition-[filter,opacity] duration-150"
        :class="[isReject ? 'border-[#dc3545]' : 'border-[#2465de]', canConfirm ? 'hover:brightness-105 active:translate-y-[1px]' : 'opacity-50 cursor-not-allowed']"
        :style="isReject
          ? { background: 'linear-gradient(to bottom, #e25563, #cc2436)', boxShadow: '0px 1.5px 0px 0px #c8303f' }
          : { background: 'linear-gradient(to bottom, #4179e2, #1f5bcc)', boxShadow: '0px 1.5px 0px 0px #1d5fd9' }"
        :aria-disabled="!canConfirm"
        @click="confirm"
      >
        <span class="text-[14px] font-medium text-white leading-[1.5]" style="text-shadow: 0px 1px 1px rgba(0,0,0,0.12);">{{ isReject ? 'Reject' : 'Approve' }}</span>
      </button>
    </div>
  </BaseModal>
</template>

<script setup>
import { computed, nextTick, ref, watch } from 'vue'
import BaseModal from './BaseModal.vue'
import closeIcon from '../../assets/images/claims-panel-close.svg'
import questionIcon from '../../assets/images/claims-confirm-question.svg'
import alertIcon from '../../assets/images/claims-confirm-alert.svg'

const props = defineProps({
  open: { type: Boolean, default: false },
  // 'approve' | 'reject'
  kind: { type: String, default: 'approve' },
  claim: { type: Object, required: true },
  // { currency, value } shown in the dark amount bar
  amount: { type: Object, required: true },
})
const emit = defineEmits(['close', 'confirm'])

const isReject = computed(() => props.kind === 'reject')
const summary = computed(() => [
  { label: 'Date', value: props.claim.date },
  { label: 'Category', value: props.claim.category },
  { label: 'Submitted by', value: props.claim.staff },
])

const reason = ref('')
const reasonEl = ref(null)
const canConfirm = computed(() => !isReject.value || reason.value.trim().length > 0)

// Fresh reason each time; focus it so the admin can type straight away
watch(() => props.open, async (open) => {
  if (!open) return
  reason.value = ''
  await nextTick()
  if (isReject.value) reasonEl.value?.focus()
})

function confirm() {
  if (!canConfirm.value) return
  emit('confirm', reason.value.trim())
}
</script>

<style scoped>
/* Textarea (Figma: TheTextarea) — default shadow, blue focus ring like the form inputs */
.reason-input {
  box-shadow: 0px 1px 3px 0px rgba(0, 0, 0, 0.04), 0px 1.5px 1.5px 0px rgba(0, 0, 0, 0.09);
  transition: border-color 150ms ease, box-shadow 150ms ease;
}
.reason-input::placeholder { color: #9295a5; }
.reason-input:focus {
  border-color: #2465de;
  box-shadow: 0px 0px 0px 3px #b3cdfe, inset 0px 2px 4px 0px rgba(0, 0, 0, 0.24);
}
</style>
