<template>
  <Teleport to="body">
    <Transition name="pm-backdrop">
      <div
        v-if="modelValue"
        class="fixed inset-0 z-[100] flex items-center justify-center p-4"
        style="background: rgba(3, 16, 47, 0.45); backdrop-filter: blur(4px);"
        @click.self="close"
      >
        <Transition name="pm-card">
          <div
            v-if="modelValue"
            class="relative bg-white flex flex-col overflow-hidden"
            style="width: 480px; max-width: 100%; border-radius: 16px; box-shadow: 0px 3px 11px rgba(38,42,50,0.09), 0px 0px 0px 1px rgba(3,16,47,0.04);"
            role="dialog"
            aria-modal="true"
          >
            <!-- Header -->
            <div class="flex items-start gap-8 p-[16px] border-b border-[#e5e6ea]">
              <div class="flex-1 min-w-px pt-[2px]">
                <p class="text-[16px] font-medium leading-[1.4] text-[#03102f]">How would you like to pay?</p>
              </div>
              <button
                class="flex items-center justify-center size-[32px] rounded-[4px] shrink-0 transition-colors duration-150 hover:bg-[#f0f1f5]"
                aria-label="Close"
                @click="close"
              >
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M5 5L15 15M15 5L5 15" stroke="#61667c" stroke-width="1.6" stroke-linecap="round" />
                </svg>
              </button>
            </div>

            <!-- Content -->
            <div class="flex flex-col gap-[8px] p-[24px]">
              <button
                v-for="m in methods"
                :key="m.id"
                type="button"
                class="flex gap-[12px] items-start p-[8px] w-full text-left rounded-[8px] transition-[border-color,background-color] duration-150"
                :class="selected === m.id
                  ? 'bg-[#fcfcfd] border-2 border-[#2465de]'
                  : 'bg-white border border-[#e5e6ea] hover:border-[#cdd5e4]'"
                :style="selected === m.id
                  ? 'box-shadow: 0px 3px 11px rgba(38,42,50,0.03);'
                  : 'box-shadow: 0px 1px 1.5px rgba(0,0,0,0.04), 0px 1.5px 0.75px rgba(0,0,0,0.09);'"
                @click="selected = m.id"
              >
                <!-- Icon -->
                <span class="flex items-center justify-center size-[40px] rounded-[8px] border border-[#e5e6ea] bg-white shrink-0 overflow-hidden">
                  <img v-if="m.img" :src="m.img" :alt="m.name" class="w-[24px] h-auto object-contain" />
                  <span v-else class="w-[22px] h-[22px] flex items-center justify-center" v-html="m.icon" />
                </span>

                <!-- Content -->
                <span class="flex flex-1 flex-col gap-[4px] items-start justify-center min-w-px self-center">
                  <span class="flex gap-[6px] items-center flex-wrap">
                    <span class="text-[12px] font-normal leading-[1.5] text-[#03102f]">{{ m.name }}</span>
                    <span v-if="m.cards" class="flex gap-[2px] items-center">
                      <span
                        v-for="(badge, bi) in m.cards"
                        :key="bi"
                        class="inline-flex items-center justify-center h-[20px] w-[29px] rounded-[3px] overflow-hidden bg-white"
                        v-html="badge"
                      />
                    </span>
                  </span>
                  <span class="text-[12px] font-normal leading-[1.5] text-[#61667c]">Fee = {{ m.fee }}</span>
                </span>

                <!-- Chip -->
                <span
                  class="flex items-center justify-center min-h-[24px] min-w-[32px] px-[8px] py-[2px] rounded-[24px] border bg-white shrink-0 self-center"
                  :style="{ borderColor: chipStyles[m.chip.variant].border }"
                >
                  <span class="text-[12px] font-medium leading-[1.5]" :style="{ color: chipStyles[m.chip.variant].text }">{{ m.chip.label }}</span>
                </span>
              </button>
            </div>

            <!-- Footer -->
            <div class="flex items-center justify-between gap-4 px-[16px] py-[20px] border-t border-[#e5e6ea]">
              <button
                type="button"
                class="flex items-center justify-center h-[36px] min-w-[112px] px-[12px] rounded-[8px] border border-[#f2f2f4] transition-transform duration-100 active:translate-y-[1px]"
                style="background: linear-gradient(to bottom, #ffffff, #f2f2f2); box-shadow: 0px 1.5px 0px 0px #e5e5e5;"
                @click="close"
              >
                <span class="text-[14px] font-medium leading-[1.5] text-[#61667c]" style="text-shadow: 0px 1px 1px rgba(0,0,0,0.08);">Back</span>
              </button>
              <button
                type="button"
                class="flex items-center justify-center h-[36px] min-w-[112px] px-[12px] rounded-[8px] border border-[#2465de] transition-transform duration-100 active:translate-y-[1px]"
                style="background: linear-gradient(to bottom, #4179e2, #1f5bcc); box-shadow: 0px 1.5px 0px 0px #1d5fd9;"
                @click="confirm"
              >
                <span class="text-[14px] font-medium leading-[1.5] text-white" style="text-shadow: 0px 1px 1px rgba(0,0,0,0.12);">Continue</span>
              </button>
            </div>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, watch } from 'vue'
import paynow from '../../assets/images/billreview/paynow.svg'

const props = defineProps({
  modelValue: { type: Boolean, default: false },
  current: { type: String, default: 'paynow' },
})
const emit = defineEmits(['update:modelValue', 'confirm'])

const chipStyles = {
  instant: { border: '#80acfe', text: '#2465de' },
  warning: { border: '#ffe0a2', text: '#bd8400' },
}

// Compact inline card-network badges (self-contained, no external assets)
const visa = `<svg viewBox="0 0 40 26" width="100%" height="100%"><rect width="40" height="26" rx="4" fill="#fff"/><text x="20" y="17.5" text-anchor="middle" font-family="Arial, sans-serif" font-size="11" font-style="italic" font-weight="700" fill="#1434CB" letter-spacing="0.3">VISA</text></svg>`
const mastercard = `<svg viewBox="0 0 40 26" width="100%" height="100%"><rect width="40" height="26" rx="4" fill="#fff"/><circle cx="17" cy="13" r="7" fill="#EB001B"/><circle cx="24" cy="13" r="7" fill="#F79E1B" fill-opacity="0.9"/></svg>`
const amex = `<svg viewBox="0 0 40 26" width="100%" height="100%"><rect width="40" height="26" rx="4" fill="#006FCF"/><text x="20" y="16.5" text-anchor="middle" font-family="Arial, sans-serif" font-size="8" font-weight="700" fill="#fff" letter-spacing="0.2">AMEX</text></svg>`
const unionpay = `<svg viewBox="0 0 40 26" width="100%" height="100%"><rect width="40" height="26" rx="4" fill="#fff"/><path d="M8 5h9l-3 16H5z" fill="#E21836"/><path d="M16 5h9l-3 16h-9z" fill="#00447C"/><path d="M24 5h8l-3 16h-8z" fill="#007B84"/></svg>`
const jcb = `<svg viewBox="0 0 40 26" width="100%" height="100%"><rect width="40" height="26" rx="4" fill="#fff"/><rect x="7" y="6" width="8" height="14" rx="2" fill="#0B4EA2"/><rect x="16" y="6" width="8" height="14" rx="2" fill="#BE1833"/><rect x="25" y="6" width="8" height="14" rx="2" fill="#28874B"/></svg>`

const bankIcon = `<svg viewBox="0 0 24 24" fill="none" width="100%" height="100%"><path d="M3 9.5L12 4l9 5.5" stroke="#03102f" stroke-width="1.6" stroke-linejoin="round"/><path d="M5 10.5v7M9 10.5v7M15 10.5v7M19 10.5v7" stroke="#03102f" stroke-width="1.6" stroke-linecap="round"/><path d="M3.5 20.5h17" stroke="#03102f" stroke-width="1.6" stroke-linecap="round"/></svg>`
const cardIcon = `<svg viewBox="0 0 24 24" fill="none" width="100%" height="100%"><rect x="3" y="5.5" width="18" height="13" rx="2.5" stroke="#03102f" stroke-width="1.6"/><path d="M3.5 9.5h17" stroke="#03102f" stroke-width="1.6"/><path d="M6.5 14.5h4" stroke="#03102f" stroke-width="1.6" stroke-linecap="round"/></svg>`

const methods = [
  { id: 'paynow', name: 'PayNow', img: paynow, fee: 'SGD 3.50', chip: { label: 'Instant', variant: 'instant' } },
  { id: 'bank', name: 'Bank transfer', icon: bankIcon, fee: 'SGD 3.50', chip: { label: '1 hour', variant: 'warning' } },
  { id: 'cards', name: 'Cards', icon: cardIcon, fee: 'SGD 20.00', chip: { label: 'Instant', variant: 'instant' }, cards: [visa, mastercard, amex, unionpay, jcb] },
]

const selected = ref(props.current)

// Re-sync selection to the current method each time the modal opens.
watch(() => props.modelValue, (open) => {
  if (open) selected.value = props.current
})

function close() {
  emit('update:modelValue', false)
}
function confirm() {
  const m = methods.find((x) => x.id === selected.value)
  emit('confirm', m)
  emit('update:modelValue', false)
}
</script>

<style scoped>
/* Backdrop fade — matches the project modal motion (see /motion) */
.pm-backdrop-enter-active { transition: opacity 220ms ease-out; }
.pm-backdrop-leave-active { transition: opacity 160ms ease-in; }
.pm-backdrop-enter-from,
.pm-backdrop-leave-to { opacity: 0; }

/* Panel: scale up with a gentle back-out overshoot on enter */
.pm-card-enter-active {
  transition: opacity 240ms ease-out, transform 240ms cubic-bezier(0.34, 1.3, 0.64, 1);
}
.pm-card-leave-active {
  transition: opacity 160ms ease-in, transform 160ms ease-in;
}
.pm-card-enter-from,
.pm-card-leave-to {
  opacity: 0;
  transform: scale(0.96) translateY(8px);
}

@media (prefers-reduced-motion: reduce) {
  .pm-backdrop-enter-active, .pm-backdrop-leave-active,
  .pm-card-enter-active, .pm-card-leave-active { transition: none; }
  .pm-card-enter-from, .pm-card-leave-to { transform: none; }
}
</style>
