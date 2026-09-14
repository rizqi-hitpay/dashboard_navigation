<template>
  <!-- Request virtual account — provider picker (Figma: 2240:130402) -->
  <Teleport to="body">
    <Transition name="request-modal">
      <div v-if="open" class="fixed inset-0 z-[90] flex items-center justify-center p-[16px]">
        <div class="absolute inset-0" style="background: rgba(3,16,47,0.4); backdrop-filter: blur(6px);" @click="$emit('close')" />
        <div
          class="request-modal__card relative bg-white rounded-[16px] max-w-full flex flex-col"
          :style="{ width: submitted ? '320px' : '640px', boxShadow: '0px 3px 22px 0px rgba(38,42,50,0.09)', transition: 'width 280ms cubic-bezier(0.4, 0, 0.2, 1)' }"
        >
          <!-- Header — the success state drops the divider (Figma: 2244:152799) -->
          <div class="flex items-start justify-between gap-[16px] p-[16px]" :class="submitted ? '' : 'border-b border-[#e5e6ea]'">
            <p class="text-[16px] font-medium text-[#03102f] leading-[1.4] pt-[2px] whitespace-nowrap">Request {{ location?.name }} Account</p>
            <button type="button" class="flex items-center justify-center size-[32px] rounded-[4px] hover:bg-[#f0f1f5] transition-colors duration-150" aria-label="Close" @click="$emit('close')">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M5.5 5.5l9 9m0-9l-9 9" stroke="#61667c" stroke-width="1.5" stroke-linecap="round" /></svg>
            </button>
          </div>

          <Transition name="modal-swap" mode="out-in">

          <!-- Success state (Figma: 2244:152799) -->
          <div v-if="submitted" key="success" class="flex flex-col">
            <div class="flex flex-col items-center gap-[12px] px-[16px] py-[16px]">
              <span class="flex items-center justify-center p-[12px] rounded-full" style="background: rgba(77,171,128,0.1);">
                <img :src="checkGreenIcon" width="24" height="24" alt="" />
              </span>
              <p class="text-[14px] font-normal text-[#03102f] leading-[1.5] text-center">
                Your {{ location?.currencies[0] }} virtual account with {{ selected }} is under review. We'll email you once it's approved, usually within 1–2 business days.
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

          <!-- Provider picker state -->
          <div v-else key="picker" class="flex flex-col">
          <div class="flex flex-col gap-[16px] p-[24px]">
            <div class="flex flex-col gap-[2px]">
              <p class="text-[14px] font-medium text-[#03102f] leading-[1.5]">Choose a payment provider</p>
              <p class="text-[12px] font-normal text-[#61667c] leading-[1.5]">
                {{ location?.currencies[0] }} can be served by {{ providers.length }} provider{{ providers.length === 1 ? '' : 's' }}. Pick the one you want to receive funds with.
              </p>
            </div>

            <!-- Provider options -->
            <div class="flex flex-col gap-[8px]">
              <button
                v-for="p in providers"
                :key="p.name"
                type="button"
                class="flex flex-col gap-[8px] w-full px-[12px] py-[8px] rounded-[8px] border text-left transition-colors duration-150"
                :class="selected === p.name ? 'bg-[#e5eeff] border-[#2465de]' : 'bg-white border-[#e5e6ea] hover:bg-[#fcfcfd]'"
                style="filter: drop-shadow(0px 1px 1.5px rgba(0,0,0,0.04)) drop-shadow(0px 1.5px 0.75px rgba(0,0,0,0.09));"
                role="radio"
                :aria-checked="selected === p.name"
                @click="selected = p.name"
              >
                <div class="flex items-start gap-[8px] w-full">
                  <div class="flex-1 flex flex-col gap-[4px] min-w-0">
                    <p class="text-[14px] font-medium text-[#03102f] leading-[1.5] whitespace-nowrap">{{ p.name }}</p>
                    <p class="text-[12px] font-normal text-[#61667c] leading-[1.5] whitespace-nowrap">{{ p.settles }}</p>
                  </div>
                  <!-- Radio -->
                  <svg v-if="selected === p.name" class="shrink-0" width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <circle cx="8" cy="8" r="8" fill="#2465de" />
                    <circle cx="8" cy="8" r="3" fill="white" />
                  </svg>
                  <svg v-else class="shrink-0" width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <circle cx="8" cy="8" r="7.5" fill="white" stroke="#cbcdd4" />
                  </svg>
                </div>
                <div class="flex items-center gap-[2px] flex-wrap">
                  <span
                    v-for="rail in p.rails"
                    :key="rail"
                    class="inline-flex items-center justify-center min-h-[24px] min-w-[32px] px-[8px] py-[2px] rounded-[24px] text-[12px] font-medium text-[#2465de] leading-[1.5] whitespace-nowrap"
                    :class="selected === p.name ? 'bg-white' : 'bg-[#e5eeff]'"
                  >{{ rail }}</span>
                </div>
              </button>
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
              <span class="text-[14px] font-medium text-[#61667c] leading-[1.5] whitespace-nowrap" style="text-shadow: 0px 1px 1px rgba(0,0,0,0.08);">Cancel</span>
            </button>
            <button
              type="button"
              class="flex items-center justify-center min-w-[112px] h-[36px] px-[12px] rounded-[8px] border border-[#2465de] transition-[filter] duration-150 hover:brightness-105 active:translate-y-[1px]"
              style="background: linear-gradient(to bottom, #4179e2, #1f5bcc); box-shadow: 0px 1.5px 0px 0px #1d5fd9;"
              @click="submitRequest"
            >
              <span class="text-[14px] font-medium text-white leading-[1.5] whitespace-nowrap" style="text-shadow: 0px 1px 1px rgba(0,0,0,0.12);">Submit request</span>
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
import { ref, computed, watch } from 'vue'
import checkGreenIcon from '../../assets/icons/icon-check-green-lg.svg'

const props = defineProps({
  open: { type: Boolean, default: false },
  location: { type: Object, default: null },
})

const emit = defineEmits(['close', 'submit'])

const providers = computed(() => props.location?.providers || [])
const selected = ref(null)
const submitted = ref(false)

// Reset to the picker with the first provider whenever the modal opens
watch(() => props.open, (open) => {
  if (open) {
    selected.value = providers.value[0]?.name || null
    submitted.value = false
  }
})

// The card morphs into the confirmation state (Figma: 2244:152799)
function submitRequest() {
  submitted.value = true
  emit('submit', { location: props.location?.name, provider: selected.value })
}
</script>

<style scoped>
/* Same motion recipe as MatchReceiptsModal */
.request-modal-enter-active { transition: opacity 200ms cubic-bezier(0.4, 0, 0.2, 1); }
.request-modal-leave-active { transition: opacity 150ms ease-in; }
.request-modal-enter-from,
.request-modal-leave-to { opacity: 0; }
.request-modal-enter-active .request-modal__card { transition: transform 200ms cubic-bezier(0.4, 0, 0.2, 1); }
.request-modal-enter-from .request-modal__card { transform: translateY(12px); }

/* Picker → confirmation content swap, alongside the card width morph */
.modal-swap-enter-active { transition: opacity 180ms ease-out, transform 180ms ease-out; }
.modal-swap-leave-active { transition: opacity 120ms ease-in; }
.modal-swap-enter-from { opacity: 0; transform: translateY(8px); }
.modal-swap-leave-to { opacity: 0; }

@media (prefers-reduced-motion: reduce) {
  .request-modal-enter-active, .request-modal-leave-active { transition: none; }
  .request-modal-enter-from .request-modal__card { transform: none; }
  .modal-swap-enter-active, .modal-swap-leave-active { transition: none; }
  .modal-swap-enter-from { transform: none; }
  .request-modal__card { transition: none !important; }
}
</style>
