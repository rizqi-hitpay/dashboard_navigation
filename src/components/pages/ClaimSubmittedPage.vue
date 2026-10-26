<template>
  <!-- Claim submitted (Figma: 46:8996) — fills the main content area like the
       submit claim page it follows -->
  <div class="absolute inset-0 z-30 bg-white flex flex-col overflow-y-auto overflow-x-hidden">
    <button
      type="button"
      class="absolute right-[31px] top-[23px] z-10 flex items-center gap-[8px] h-[36px] px-[12px] rounded-[8px] cursor-pointer transition-colors duration-150 hover:bg-[#f6f7f9]"
      @click="emit('close')"
    >
      <img :src="closeIcon" width="18" height="18" alt="" class="shrink-0 -mx-[2px]" />
      <span class="text-[14px] font-medium text-[#61667c] leading-[1.5] whitespace-nowrap">Close</span>
    </button>

    <div class="flex flex-1 flex-col items-center justify-center gap-[24px] min-h-[560px] px-[24px] py-[64px]">
      <!-- Receipt with a success check -->
      <div class="receipt-rise relative h-[174px] w-[106.615px] shrink-0">
        <img :src="paperImage" alt="" width="166.615" height="234" class="absolute max-w-none" style="left: -30px; top: -24px;" />
        <span
          v-for="(l, i) in receiptLines"
          :key="i"
          class="absolute"
          :style="{ left: l[0] + 'px', top: l[1] + 'px', width: l[2] + 'px', height: l[3] + 'px', borderRadius: l[3] / 2 + 'px', background: l[4] ? '#a6b3cd' : '#e4e9f1' }"
        />
        <span
          class="check-pop absolute left-1/2 top-1/2 flex p-[10.105px] rounded-full bg-[#2bc37d]"
          style="filter: drop-shadow(0px 16px 3px rgba(21,121,83,0.03)) drop-shadow(0px 9px 2.5px rgba(21,121,83,0.09)) drop-shadow(0px 4px 2px rgba(21,121,83,0.15)) drop-shadow(0px 1px 1px rgba(21,121,83,0.17));"
        >
          <img :src="checkIcon" width="27.789" height="27.789" alt="" />
        </span>
      </div>

      <div class="flex flex-col items-center gap-[12px] max-w-[432px] text-center">
        <div class="flex flex-col items-center gap-[4px] text-[#03102f]">
          <h1 class="text-[18px] font-medium leading-[1.35]">Claim submitted!</h1>
          <p class="text-[13px] leading-[1.5]">
            {{ claim.merchant }} ・ <span class="font-semibold leading-[1.4]" style="font-family: 'Reddit Mono', ui-monospace, monospace;">{{ claim.currency }} {{ claim.amount }}</span>
          </p>
        </div>
        <p class="text-[16px] font-normal text-[#61667c] leading-[1.4]">We’ll review it and let you know by email within 3 working days.</p>
        <div class="flex flex-wrap items-start justify-center gap-[12px] pt-[12px]">
          <button
            type="button"
            class="flex items-center justify-center h-[36px] px-[12px] rounded-[8px] border border-[#f2f2f4] transition-[filter] duration-150 hover:brightness-95 active:translate-y-[1px]"
            style="background: linear-gradient(to bottom, #ffffff, #f2f2f2); box-shadow: 0px 1.5px 0px 0px #e5e5e5;"
            @click="emit('view', claim)"
          >
            <span class="text-[14px] font-medium text-[#61667c] leading-[1.5] whitespace-nowrap" style="text-shadow: 0px 1px 1px rgba(0,0,0,0.08);">View claim details</span>
          </button>
          <button
            type="button"
            class="flex items-center justify-center h-[36px] px-[12px] rounded-[8px] border border-[#2465de] transition-[filter] duration-150 hover:brightness-105 active:translate-y-[1px]"
            style="background: linear-gradient(to bottom, #4179e2, #1f5bcc); box-shadow: 0px 1.5px 0px 0px #1d5fd9;"
            @click="emit('submit-another')"
          >
            <span class="text-[14px] font-medium text-white leading-[1.5] whitespace-nowrap" style="text-shadow: 0px 1px 1px rgba(0,0,0,0.12);">Submit another claim</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, onUnmounted } from 'vue'
import paperImage from '../../assets/images/claims-success-paper.svg'
import checkIcon from '../../assets/images/claims-success-check.svg'
import closeIcon from '../../assets/images/claims-close.svg'

defineProps({
  claim: { type: Object, required: true },
})
const emit = defineEmits(['close', 'view', 'submit-another'])

// Receipt print lines (Figma: Receipt · torn paper): [left, top, width, height, dark?]
const perforations = (top) => Array.from({ length: 12 }, (_, i) => [11.25 + i * 7.2, top, 3.6, 1.2])
const ITEM_TOPS = [49.5, 60, 70.5, 81, 91.5, 102, 112.5, 123]
const ITEM_WIDTHS = [42, 33, 45, 28.5, 39, 31.5, 43.5, 36]
const receiptLines = [
  [32.31, 15, 42, 4.5, true],     // restaurant
  [26.31, 24, 54, 3.045],         // address
  [38.31, 30, 30, 3.045],         // date and table
  ...perforations(40.5),
  ...ITEM_TOPS.flatMap((top, i) => [[12, top, ITEM_WIDTHS[i], 3.045], [76.5, top, 18, 3.045]]),
  ...perforations(133.5),
  [12, 142.5, 30, 4.05, true],    // total label
  [70.5, 142.5, 24, 4.05, true],  // total amount
  [36, 157.5, 34.5, 3.045],       // thank you
]

function onKeydown(e) {
  if (e.key === 'Escape') emit('close')
}
onMounted(() => window.addEventListener('keydown', onKeydown))
onUnmounted(() => window.removeEventListener('keydown', onKeydown))
</script>

<style scoped>
/* Receipt rises in, then the check pops on top */
.receipt-rise { animation: receipt-rise 420ms cubic-bezier(0.32, 0.72, 0, 1) both; }
@keyframes receipt-rise {
  from { opacity: 0; transform: translateY(16px); }
}
.check-pop {
  transform: translate(-50%, -50%);
  animation: check-pop 360ms cubic-bezier(0.34, 1.56, 0.64, 1) 260ms both;
}
@keyframes check-pop {
  from { opacity: 0; transform: translate(-50%, -50%) scale(0.4); }
}

@media (prefers-reduced-motion: reduce) {
  .receipt-rise, .check-pop { animation: none; }
}
</style>
