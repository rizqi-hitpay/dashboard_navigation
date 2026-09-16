<template>
  <!-- Virtual account is active (Figma: 2309:14092) -->
  <Teleport to="body">
    <Transition name="active-modal">
      <div v-if="open" class="fixed inset-0 z-[90] flex items-center justify-center p-[16px]">
        <div class="absolute inset-0" style="background: rgba(3,16,47,0.4); backdrop-filter: blur(6px);" @click="$emit('close')" />
        <div
          class="active-modal__card relative bg-white rounded-[16px] w-[640px] max-w-full flex flex-col"
          style="box-shadow: 0px 3px 22px 0px rgba(38,42,50,0.09);"
        >
          <!-- Header -->
          <div class="flex items-start justify-between gap-[16px] p-[16px] border-b border-[#e5e6ea]">
            <p class="text-[16px] font-medium text-[#03102f] leading-[1.4] pt-[2px]">Virtual account is active</p>
            <button type="button" class="flex items-center justify-center size-[32px] rounded-[4px] hover:bg-[#f0f1f5] transition-colors duration-150" aria-label="Close" @click="$emit('close')">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M5.5 5.5l9 9m0-9l-9 9" stroke="#61667c" stroke-width="1.5" stroke-linecap="round" /></svg>
            </button>
          </div>

          <!-- Content -->
          <div class="flex flex-col gap-[16px] p-[24px]">
            <div class="flex flex-col items-center gap-[12px]">
              <span class="flex items-center justify-center p-[12px] rounded-full" style="background: rgba(77,171,128,0.1);">
                <img :src="checkGreenIcon" width="24" height="24" alt="" />
              </span>
              <div class="flex flex-col items-center gap-[2px]">
                <p class="text-[14px] font-medium text-[#03102f] leading-[1.5] text-center">Your {{ location?.name }} virtual account is now active!</p>
                <p class="text-[12px] font-normal text-[#61667c] leading-[1.5] text-center">Share the account details below to begin receiving payments.</p>
              </div>
            </div>

            <!-- Account details, two columns -->
            <div class="grid grid-cols-2 gap-[8px]">
              <div
                v-for="f in fields"
                :key="f.label"
                class="flex flex-col gap-[2px] rounded-[8px] border border-[#e5e6ea] bg-white px-[12px] py-[9px] min-w-0"
              >
                <span class="text-[12px] font-normal text-[#61667c] leading-[1.5]">{{ f.label }}</span>
                <span class="text-[14px] font-normal text-[#03102f] leading-[1.5] truncate">{{ f.value }}</span>
              </div>
            </div>
          </div>

          <!-- Footer -->
          <div class="flex items-center justify-end gap-[12px] px-[16px] py-[20px] border-t border-[#e5e6ea]">
            <button
              type="button"
              class="flex items-center justify-center min-w-[112px] h-[36px] px-[12px] rounded-[8px] border border-[#f2f2f4] transition-[filter] duration-150 hover:brightness-95 active:translate-y-[1px]"
              style="background: linear-gradient(to bottom, #ffffff, #f2f2f2); box-shadow: 0px 1.5px 0px 0px #e5e5e5;"
              @click="$emit('close')"
            >
              <span class="text-[14px] font-medium text-[#61667c] leading-[1.5] whitespace-nowrap" style="text-shadow: 0px 1px 1px rgba(0,0,0,0.08);">Close</span>
            </button>
            <button
              type="button"
              class="flex items-center justify-center gap-[8px] min-w-[112px] h-[36px] px-[12px] rounded-[8px] border border-[#2465de] transition-[filter] duration-150 hover:brightness-105 active:translate-y-[1px]"
              style="background: linear-gradient(to bottom, #4179e2, #1f5bcc); box-shadow: 0px 1.5px 0px 0px #1d5fd9;"
              @click="copyAsMessage"
            >
              <img :src="copyWhiteIcon" width="16" height="16" alt="" class="shrink-0" style="filter: brightness(0) invert(1);" />
              <span class="text-[14px] font-medium text-white leading-[1.5] whitespace-nowrap" style="text-shadow: 0px 1px 1px rgba(0,0,0,0.12);">{{ copied ? 'Copied!' : 'Copy as message' }}</span>
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import checkGreenIcon from '../../assets/icons/icon-check-green-lg.svg'
import copyWhiteIcon from '../../assets/icons/icon-copy-blue.svg'

const props = defineProps({
  open: { type: Boolean, default: false },
  location: { type: Object, default: null },
})

defineEmits(['close'])

const fields = computed(() => {
  const a = props.location?.account
  if (!a) return []
  return [
    { label: 'Account name', value: a.name },
    { label: 'Account number', value: a.number },
    { label: 'SWIFT / BIC', value: a.swift },
    { label: 'Bank name', value: a.bank },
    { label: 'Location', value: a.location },
    { label: 'Address', value: a.address },
  ]
})

const copied = ref(false)
let copiedTimer = null

function copyAsMessage() {
  const message = fields.value.map((f) => `${f.label}: ${f.value}`).join('\n')
  navigator.clipboard?.writeText(message).catch(() => {})
  copied.value = true
  clearTimeout(copiedTimer)
  copiedTimer = setTimeout(() => { copied.value = false }, 1600)
}

watch(() => props.open, () => {
  copied.value = false
  clearTimeout(copiedTimer)
})
</script>

<style scoped>
/* Same motion recipe as the other modals */
.active-modal-enter-active { transition: opacity 200ms cubic-bezier(0.4, 0, 0.2, 1); }
.active-modal-leave-active { transition: opacity 150ms ease-in; }
.active-modal-enter-from,
.active-modal-leave-to { opacity: 0; }
.active-modal-enter-active .active-modal__card { transition: transform 200ms cubic-bezier(0.4, 0, 0.2, 1); }
.active-modal-enter-from .active-modal__card { transform: translateY(12px); }

@media (prefers-reduced-motion: reduce) {
  .active-modal-enter-active, .active-modal-leave-active { transition: none; }
  .active-modal-enter-from .active-modal__card { transform: none; }
}
</style>
