<template>
  <!-- Match receipts — upload + auto-match flow (Figma: 154:44264 → 154:45583 → 213:22620) -->
  <Teleport to="body">
    <Transition name="match-modal">
      <div v-if="open" class="fixed inset-0 z-[90] flex items-center justify-center p-[16px]">
        <div class="absolute inset-0" style="background: rgba(3,16,47,0.4); backdrop-filter: blur(6px);" @click="$emit('close')" />
        <div
          class="match-modal__card relative bg-white rounded-[16px] w-[640px] max-w-full flex flex-col"
          style="box-shadow: 0px 3px 22px 0px rgba(38,42,50,0.09);"
        >
          <!-- Header -->
          <div class="flex items-start justify-between gap-[16px] p-[16px] border-b border-[#e5e6ea]">
            <p class="text-[16px] font-medium text-[#03102f] leading-[1.4] pt-[2px]">Match receipts</p>
            <button type="button" class="flex items-center justify-center size-[32px] rounded-[4px] hover:bg-[#f0f1f5] transition-colors duration-150" aria-label="Close" @click="$emit('close')">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M5.5 5.5l9 9m0-9l-9 9" stroke="#61667c" stroke-width="1.5" stroke-linecap="round" /></svg>
            </button>
          </div>

          <!-- Content -->
          <div class="flex flex-col gap-[16px] p-[24px]">
            <p class="text-[14px] font-normal text-[#03102f] leading-[1.5]">
              Upload card transaction receipts and we'll automatically match them to the correct transaction.
              You can also email receipts to <a href="mailto:receipts@hitpay.com" class="text-[#2465de] underline">receipts@hitpay.com</a>.
            </p>

            <div class="flex flex-col gap-[4px] w-full">
              <!-- Match progress — appears once files are added -->
              <div v-if="files.length" class="flex items-center gap-[4px] w-full">
                <svg v-if="!allMatched" class="match-spinner shrink-0" width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <g stroke="#9295a5" stroke-width="1.4" stroke-linecap="round">
                    <line x1="8" y1="1.5" x2="8" y2="4" />
                    <line x1="12.6" y1="3.4" x2="10.8" y2="5.2" opacity="0.85" />
                    <line x1="14.5" y1="8" x2="12" y2="8" opacity="0.7" />
                    <line x1="12.6" y1="12.6" x2="10.8" y2="10.8" opacity="0.55" />
                    <line x1="8" y1="14.5" x2="8" y2="12" opacity="0.4" />
                    <line x1="3.4" y1="12.6" x2="5.2" y2="10.8" opacity="0.3" />
                    <line x1="1.5" y1="8" x2="4" y2="8" opacity="0.2" />
                    <line x1="3.4" y1="3.4" x2="5.2" y2="5.2" opacity="0.1" />
                  </g>
                </svg>
                <p class="flex-1 min-w-0 text-[12px] font-medium text-[#03102f] leading-[1.5]">{{ matchedCount }}/{{ files.length }} receipts matched</p>
              </div>

              <VerificationDropzone v-model:files="files" :mock-files="MOCK_RECEIPTS" />
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
              :class="canConfirm ? '' : 'opacity-50 cursor-not-allowed'"
              style="background: linear-gradient(to bottom, #4179e2, #1f5bcc); box-shadow: 0px 1.5px 0px 0px #1d5fd9;"
              @click="confirm"
            >
              <span class="text-[14px] font-medium text-white leading-[1.5] whitespace-nowrap" style="text-shadow: 0px 1px 1px rgba(0,0,0,0.12);">Confirm</span>
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, computed, watch, onUnmounted } from 'vue'
import VerificationDropzone from '../verification/VerificationDropzone.vue'

const props = defineProps({
  open: { type: Boolean, required: true },
})

const emit = defineEmits(['close', 'matched'])

const MOCK_RECEIPTS = [
  { name: 'Fly_to_jakarta.pdf', kind: 'pdf', size: '128 KB' },
  { name: 'Hotel_booking.doc', kind: 'doc', size: '86 KB' },
  { name: 'Taxi_receipts.csv', kind: 'csv', size: '20 KB' },
]

const files = ref([])
const matchedNames = ref(new Set())
let matchTimers = []

// Each newly added file "matches" shortly after its upload finishes, staggered
// so the counter visibly ticks up 0 → n while the spinner runs
watch(
  () => files.value.map((f) => f.name),
  (names, oldNames = []) => {
    names.filter((n) => !oldNames.includes(n)).forEach((name, i) => {
      matchTimers.push(
        setTimeout(() => {
          if (files.value.some((f) => f.name === name)) {
            matchedNames.value = new Set([...matchedNames.value, name])
          }
        }, 1400 + i * 600),
      )
    })
    // Dropped files no longer count as matched
    matchedNames.value = new Set([...matchedNames.value].filter((n) => names.includes(n)))
  },
)

const matchedCount = computed(() => files.value.filter((f) => matchedNames.value.has(f.name)).length)
const allMatched = computed(() => files.value.length > 0 && matchedCount.value === files.value.length)
const canConfirm = computed(() => allMatched.value)

watch(
  () => props.open,
  (isOpen) => {
    if (isOpen) {
      files.value = []
      matchedNames.value = new Set()
      matchTimers.forEach(clearTimeout)
      matchTimers = []
    }
  },
)

function confirm() {
  if (!canConfirm.value) return
  emit('matched', [...files.value])
}

onUnmounted(() => matchTimers.forEach(clearTimeout))
</script>

<style scoped>
.match-spinner { animation: match-spin 1s steps(8) infinite; }
@keyframes match-spin {
  to { transform: rotate(360deg); }
}

/* Modal: backdrop fade + card rise — same motion as the other modals */
.match-modal-enter-active { transition: opacity 200ms cubic-bezier(0.4, 0, 0.2, 1); }
.match-modal-leave-active { transition: opacity 150ms ease-in; }
.match-modal-enter-from,
.match-modal-leave-to { opacity: 0; }
.match-modal-enter-active .match-modal__card { transition: transform 200ms cubic-bezier(0.4, 0, 0.2, 1); }
.match-modal-enter-from .match-modal__card { transform: translateY(12px); }

@media (prefers-reduced-motion: reduce) {
  .match-modal-enter-active, .match-modal-leave-active { transition: none; }
  .match-modal-enter-from .match-modal__card { transform: none; }
  .match-spinner { animation: none; }
}
</style>
