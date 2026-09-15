<template>
  <!-- Close virtual account — confirm (Figma: 2269:39091) → success (2269:67980) -->
  <Teleport to="body">
    <Transition name="close-modal">
      <div v-if="open" class="fixed inset-0 z-[90] flex items-center justify-center p-[16px]">
        <div class="absolute inset-0" style="background: rgba(3,16,47,0.4); backdrop-filter: blur(6px);" @click="$emit('close')" />
        <div
          class="close-modal__card relative bg-white rounded-[16px] max-w-full flex flex-col"
          :style="{ width: done ? '320px' : '640px', boxShadow: '0px 3px 22px 0px rgba(38,42,50,0.09)', transition: 'width 280ms cubic-bezier(0.4, 0, 0.2, 1)' }"
        >
          <!-- Header — the success state drops the divider -->
          <div class="flex items-start justify-between gap-[16px] p-[16px]" :class="done ? '' : 'border-b border-[#e5e6ea]'">
            <p class="text-[16px] font-medium text-[#03102f] leading-[1.4] pt-[2px]">{{ done ? 'Account closed successfully' : 'You are about to close this virtual account' }}</p>
            <button type="button" class="flex items-center justify-center size-[32px] rounded-[4px] hover:bg-[#f0f1f5] transition-colors duration-150" aria-label="Close" @click="$emit('close')">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M5.5 5.5l9 9m0-9l-9 9" stroke="#61667c" stroke-width="1.5" stroke-linecap="round" /></svg>
            </button>
          </div>

          <Transition name="close-swap" mode="out-in">

          <!-- Success state -->
          <div v-if="done" key="success" class="flex flex-col">
            <div class="flex flex-col items-center gap-[12px] px-[16px] py-[16px]">
              <span class="flex items-center justify-center p-[12px] rounded-full" style="background: rgba(77,171,128,0.1);">
                <img :src="checkGreenIcon" width="24" height="24" alt="" />
              </span>
              <p class="text-[14px] font-normal text-[#03102f] leading-[1.5] text-center">
                {{ location?.name }} ({{ location?.account?.number }}) has been closed. A confirmation email has been sent to steph@hit-pay.com.
              </p>
            </div>
            <div class="flex items-center justify-center px-[16px] pt-[20px] pb-[20px]">
              <button
                type="button"
                class="flex items-center justify-center min-w-[112px] h-[36px] px-[12px] rounded-[8px] border border-[#2465de] transition-[filter] duration-150 hover:brightness-105 active:translate-y-[1px]"
                style="background: linear-gradient(to bottom, #4179e2, #1f5bcc); box-shadow: 0px 1.5px 0px 0px #1d5fd9;"
                @click="$emit('close')"
              >
                <span class="text-[14px] font-medium text-white leading-[1.5] whitespace-nowrap" style="text-shadow: 0px 1px 1px rgba(0,0,0,0.12);">Done</span>
              </button>
            </div>
          </div>

          <!-- Confirmation state -->
          <div v-else key="confirm" class="flex flex-col">
            <div class="flex flex-col gap-[16px] p-[24px]">
              <p class="text-[14px] font-normal text-[#03102f] leading-[1.5]">
                This Virtual Account will no longer receive funds once it's closed. Any pending transactions may also be affected.
              </p>
              <div class="flex flex-col gap-[8px] rounded-[8px] border border-[#e5e6ea] p-[12px]">
                <div class="flex items-center gap-[8px]">
                  <img :src="location?.flag" width="24" height="16" alt="" class="shrink-0 rounded-[1px]" style="box-shadow: 0px 0px 0px 0.5px rgba(3,16,47,0.08);" />
                  <span class="text-[14px] font-medium text-[#03102f] leading-[1.5]">{{ location?.name }} ({{ location?.account?.number }})</span>
                </div>
                <div class="flex items-center gap-[2px] flex-wrap">
                  <span
                    v-for="c in location?.currencies || []"
                    :key="c"
                    class="inline-flex items-center justify-center min-h-[24px] min-w-[32px] px-[8px] py-[2px] rounded-[24px] bg-[#e5eeff] text-[12px] font-medium text-[#2465de] leading-[1.5] whitespace-nowrap"
                  >{{ c }}</span>
                </div>
              </div>
            </div>
            <div class="flex items-center justify-end gap-[12px] px-[16px] py-[20px] border-t border-[#e5e6ea]">
              <button
                type="button"
                class="flex items-center justify-center min-w-[112px] h-[36px] px-[12px] rounded-[8px] border border-[#f2f2f4] transition-[filter] duration-150 hover:brightness-95 active:translate-y-[1px]"
                style="background: linear-gradient(to bottom, #ffffff, #f2f2f2); box-shadow: 0px 1.5px 0px 0px #e5e5e5;"
                @click="$emit('close')"
              >
                <span class="text-[14px] font-medium text-[#61667c] leading-[1.5] whitespace-nowrap" style="text-shadow: 0px 1px 1px rgba(0,0,0,0.08);">Cancel</span>
              </button>
              <button
                type="button"
                class="flex items-center justify-center min-w-[112px] h-[36px] px-[12px] rounded-[8px] border border-[#c20a1c] transition-[filter] duration-150 hover:brightness-105 active:translate-y-[1px]"
                style="background: linear-gradient(to bottom, #e0474d, #c22026); box-shadow: 0px 1.5px 0px 0px #a81b20;"
                @click="confirmClose"
              >
                <span class="text-[14px] font-medium text-white leading-[1.5] whitespace-nowrap" style="text-shadow: 0px 1px 1px rgba(0,0,0,0.12);">Close account</span>
              </button>
            </div>
          </div>

          </Transition>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, watch } from 'vue'
import checkGreenIcon from '../../assets/icons/icon-check-green-lg.svg'

const props = defineProps({
  open: { type: Boolean, default: false },
  location: { type: Object, default: null },
})

const emit = defineEmits(['close', 'closed'])

const done = ref(false)

// Reset to the confirmation step whenever the modal opens
watch(() => props.open, (open) => {
  if (open) done.value = false
})

// The card morphs into the success confirmation
function confirmClose() {
  done.value = true
  emit('closed', props.location)
}
</script>

<style scoped>
/* Same motion recipe as the other modals */
.close-modal-enter-active { transition: opacity 200ms cubic-bezier(0.4, 0, 0.2, 1); }
.close-modal-leave-active { transition: opacity 150ms ease-in; }
.close-modal-enter-from,
.close-modal-leave-to { opacity: 0; }
.close-modal-enter-active .close-modal__card { transition: transform 200ms cubic-bezier(0.4, 0, 0.2, 1); }
.close-modal-enter-from .close-modal__card { transform: translateY(12px); }

/* Confirm → success content swap, alongside the card width morph */
.close-swap-enter-active { transition: opacity 180ms ease-out, transform 180ms ease-out; }
.close-swap-leave-active { transition: opacity 120ms ease-in; }
.close-swap-enter-from { opacity: 0; transform: translateY(8px); }
.close-swap-leave-to { opacity: 0; }

@media (prefers-reduced-motion: reduce) {
  .close-modal-enter-active, .close-modal-leave-active { transition: none; }
  .close-modal-enter-from .close-modal__card { transform: none; }
  .close-swap-enter-active, .close-swap-leave-active { transition: none; }
  .close-swap-enter-from { transform: none; }
  .close-modal__card { transition: none !important; }
}
</style>
