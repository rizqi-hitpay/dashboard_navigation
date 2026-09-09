<template>
  <!-- Share virtual account details (Figma: 2:19212) -->
  <Teleport to="body">
    <Transition name="share-modal">
      <div v-if="open" class="fixed inset-0 z-[90] flex items-center justify-center p-[16px]">
        <div class="absolute inset-0" style="background: rgba(3,16,47,0.4); backdrop-filter: blur(6px);" @click="$emit('close')" />
        <div
          class="share-modal__card relative bg-white rounded-[16px] w-[640px] max-w-full flex flex-col"
          style="box-shadow: 0px 3px 22px 0px rgba(38,42,50,0.09);"
        >
          <!-- Header -->
          <div class="flex items-start justify-between gap-[16px] p-[16px] border-b border-[#e5e6ea]">
            <p class="text-[16px] font-medium text-[#03102f] leading-[1.4] pt-[2px]">Share virtual account details</p>
            <button type="button" class="flex items-center justify-center size-[32px] rounded-[4px] hover:bg-[#f0f1f5] transition-colors duration-150" aria-label="Close" @click="$emit('close')">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M5.5 5.5l9 9m0-9l-9 9" stroke="#61667c" stroke-width="1.5" stroke-linecap="round" /></svg>
            </button>
          </div>

          <!-- Content -->
          <div class="p-[24px]">
            <div class="w-full rounded-[8px]">
              <div class="bg-[#fcfcfd] border border-[#e5e6ea] rounded-t-[8px] px-[8px]">
                <div class="flex flex-wrap gap-x-[12px] gap-y-[16px] p-[12px]">
                  <div v-for="d in details" :key="d.label" class="flex flex-col gap-[2px] w-[244px]">
                    <span class="text-[14px] font-normal text-[#61667c] leading-[1.5] whitespace-nowrap">{{ d.label }}</span>
                    <span class="text-[14px] font-normal text-[#03102f] leading-[1.5]">{{ d.value }}</span>
                  </div>
                </div>
              </div>
              <div class="flex items-center justify-end gap-[24px] bg-white border-b border-l border-r border-[#e5e6ea] rounded-b-[8px] px-[16px] py-[8px]">
                <span class="text-[13px] font-normal text-[#03102f] leading-[1.5] whitespace-nowrap">Share via</span>
                <div class="flex items-center gap-[4px]">
                  <div v-for="channel in channels" :key="channel.label" class="relative">
                    <button
                      type="button"
                      class="flex items-center justify-center p-[8px] rounded-[8px] hover:bg-[#f2f2f4] transition-colors duration-150"
                      :aria-label="'Share via ' + channel.label"
                      @mouseenter="hoveredChannel = channel.label"
                      @mouseleave="hoveredChannel = null"
                      @focus="hoveredChannel = channel.label"
                      @blur="hoveredChannel = null"
                    >
                      <img :src="channel.icon" width="18" height="18" alt="" />
                    </button>
                    <!-- Bottom tooltip (Figma: 2204:24540) -->
                    <Transition name="share-tooltip">
                      <span
                        v-if="hoveredChannel === channel.label"
                        class="absolute left-1/2 -translate-x-1/2 top-[calc(100%+8px)] px-[8px] py-[4px] rounded-[4px] bg-[#fcfcfd] text-[12px] font-medium text-[#61667c] leading-[1.5] whitespace-nowrap pointer-events-none z-10"
                        style="box-shadow: 0px 1px 3px 0px rgba(0,0,0,0.1), 0px 3px 22px 0px rgba(38,42,50,0.09);"
                        role="tooltip"
                      >
                        <img :src="tooltipArrowIcon" width="12" height="8" alt="" class="absolute left-1/2 -translate-x-1/2 top-[-7px] max-w-none" />
                        {{ channel.label }}
                      </span>
                    </Transition>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Footer -->
          <div class="flex items-center justify-between gap-[12px] px-[16px] py-[20px] border-t border-[#e5e6ea]">
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
              <img :src="copyWhiteIcon" width="16" height="16" alt="" class="shrink-0" />
              <span class="text-[14px] font-medium text-white leading-[1.5] whitespace-nowrap" style="text-shadow: 0px 1px 1px rgba(0,0,0,0.12);">{{ copied ? 'Copied!' : 'Copy as message' }}</span>
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, watch } from 'vue'
import whatsappIcon from '../../assets/icons/icon-share-whatsapp.svg'
import chatIcon from '../../assets/icons/icon-share-chat.svg'
import emailIcon from '../../assets/icons/icon-share-email.svg'
import copyWhiteIcon from '../../assets/icons/icon-copy-white.svg'
import tooltipArrowIcon from '../../assets/icons/icon-tooltip-arrow.svg'

const props = defineProps({
  open: { type: Boolean, default: false },
  details: { type: Array, default: () => [] },
})

defineEmits(['close'])

const channels = [
  { label: 'WhatsApp', icon: whatsappIcon },
  { label: 'SMS', icon: chatIcon },
  { label: 'Email', icon: emailIcon },
]

const hoveredChannel = ref(null)

const copied = ref(false)
let copiedTimer = null

function copyAsMessage() {
  const message = props.details.map((d) => `${d.label}: ${d.value}`).join('\n')
  navigator.clipboard?.writeText(message).catch(() => {})
  copied.value = true
  clearTimeout(copiedTimer)
  copiedTimer = setTimeout(() => { copied.value = false }, 1600)
}

// Reset the copy feedback whenever the modal reopens
watch(() => props.open, () => {
  copied.value = false
  clearTimeout(copiedTimer)
})
</script>

<style scoped>
/* Same motion recipe as MatchReceiptsModal */
.share-modal-enter-active { transition: opacity 200ms cubic-bezier(0.4, 0, 0.2, 1); }
.share-modal-leave-active { transition: opacity 150ms ease-in; }
.share-modal-enter-from,
.share-modal-leave-to { opacity: 0; }
.share-modal-enter-active .share-modal__card { transition: transform 200ms cubic-bezier(0.4, 0, 0.2, 1); }
.share-modal-enter-from .share-modal__card { transform: translateY(12px); }

/* Channel tooltip — same motion recipe as the page's copy tooltip */
.share-tooltip-enter-active { transition: opacity 140ms ease-out, transform 140ms ease-out; }
.share-tooltip-leave-active { transition: opacity 100ms ease-in; }
.share-tooltip-enter-from { opacity: 0; transform: translateX(-50%) translateY(-2px); }
.share-tooltip-leave-to { opacity: 0; }

@media (prefers-reduced-motion: reduce) {
  .share-modal-enter-active, .share-modal-leave-active { transition: none; }
  .share-modal-enter-from .share-modal__card { transform: none; }
  .share-tooltip-enter-active, .share-tooltip-leave-active { transition: none; }
  .share-tooltip-enter-from { transform: translateX(-50%); }
}
</style>
