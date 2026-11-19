<template>
  <!-- Enter 2FA code (Figma BillPay 16017:11375) — the same step ReimbursementPayModal uses,
       as a standalone modal. BaseModal gives the shared motion: backdrop fade + card rise. -->
  <BaseModal :open="open" :width="320" @close="close">
    <template #header>
      <div class="flex items-start gap-[32px] p-[16px]">
        <p class="flex-1 min-w-0 pt-[2px] text-[16px] font-medium text-[#03102f] leading-[1.4]">Enter 2FA code</p>
        <button type="button" class="flex items-center justify-center size-[32px] rounded-[4px] shrink-0 transition-colors duration-150 hover:bg-[#f0f1f5]" aria-label="Close" @click="close">
          <img :src="closeIcon" width="20" height="20" alt="" />
        </button>
      </div>
    </template>

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
          class="code-box size-[36px] text-center text-[14px] text-[#03102f]"
          :aria-label="`Digit ${i + 1}`"
          @input="onDigit(i)"
          @keydown.backspace="onBackspace(i, $event)"
          @keydown.enter="submit"
        />
      </div>
      <p class="w-[296px] max-w-full text-[14px] text-[#03102f] leading-[1.5] text-center">
        Didn’t receive the code?
        <button type="button" class="text-[#2465de] underline" @click="resend">{{ resent ? 'Sent again' : 'Resend' }}</button>
      </p>
    </div>
    <div class="flex items-center justify-center gap-[12px] px-[16px] pt-[20px] pb-[28px]">
      <button type="button" class="btn-secondary" @click="close">Cancel</button>
      <button type="button" class="btn-primary" :class="{ 'is-disabled': !codeComplete }" :aria-disabled="!codeComplete" @click="submit">Submit</button>
    </div>
  </BaseModal>
</template>

<script setup>
import { computed, reactive, ref, watch } from 'vue'
import BaseModal from './BaseModal.vue'
import closeIcon from '../../assets/images/claims-panel-close.svg'
import lockIcon from '../../assets/images/reimb-lock.svg'

const props = defineProps({
  open: { type: Boolean, default: false },
  email: { type: String, default: 'alexturner@aaaamonkey.com' },
})
const emit = defineEmits(['close', 'submit'])

const code = reactive(['', '', '', '', ''])
const codeEls = []
const resent = ref(false)
const codeComplete = computed(() => code.every((d) => /^\d$/.test(d)))

// Fresh, focused code boxes every time it opens (boxes mount after the modal's enter)
watch(() => props.open, (open) => {
  if (!open) return
  code.fill('')
  resent.value = false
  focusFirstBox()
}, { immediate: true })
function focusFirstBox(tries = 12) {
  const el = codeEls[0]
  if (el?.isConnected) el.focus()
  else if (tries) setTimeout(() => focusFirstBox(tries - 1), 50)
}

function close() { emit('close') }
function submit() { if (codeComplete.value) emit('submit', code.join('')) }

// One digit per box: typing moves forward, backspace on an empty box moves back.
// Overtyping a filled box replaces it; one-time-code autofill spreads across the boxes.
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

/* Code box (Figma: Input / State=Default → Focused) */
.code-box {
  background: white;
  border: 1px solid #e5e6ea;
  border-radius: 8px;
  box-shadow: 0px 1px 3px 0px rgba(0, 0, 0, 0.04), 0px 1.5px 1.5px 0px rgba(0, 0, 0, 0.09);
  outline: none;
  transition: border-color 150ms ease, box-shadow 150ms ease;
}
.code-box:focus {
  border-color: #2465de;
  box-shadow: 0px 0px 0px 3px #b3cdfe, inset 0px 2px 4px 0px rgba(0, 0, 0, 0.24);
}
</style>
