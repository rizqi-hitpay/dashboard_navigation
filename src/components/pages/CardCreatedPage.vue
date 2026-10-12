<template>
  <!-- Card created success (Figma: Card-Issuing 467:17054) — fills the main
       content area like the create card page it follows -->
  <div class="absolute inset-0 z-30 bg-white flex flex-col overflow-y-auto overflow-x-hidden">
    <button
      type="button"
      class="absolute right-[32px] top-[24px] z-10 flex items-center gap-[8px] h-[36px] px-[12px] rounded-[8px] cursor-pointer transition-colors duration-150 hover:bg-[#f6f7f9]"
      @click="emit('close')"
    >
      <img :src="closeIcon" width="18" height="18" alt="" class="shrink-0 -mx-[2px]" />
      <span class="text-[14px] font-medium text-[#61667c] leading-[1.5] whitespace-nowrap">Close</span>
    </button>

    <div class="flex flex-1 flex-col items-center justify-center gap-[32px] min-h-[560px] px-[24px] py-[64px]">
      <!-- Card art — the stage reaches 40px past the card so the tilt picks
           up the cursor a little before it lands on the card -->
      <HitPayCard
        class="-m-[40px] p-[40px]"
        :nickname="card.nickname"
        :holder="card.holder"
        :number="card.number"
        @entered="cardEntered = true"
      />

      <!-- Sits above the card with a white backing while it rises in, so the
           card emerges from behind the text; clears once it has landed so the
           card's soft shadow isn't cut off -->
      <div
        class="relative z-[1] self-stretch flex flex-col items-center gap-[16px] text-center transition-colors duration-300"
        :class="cardEntered ? 'bg-transparent' : 'bg-white'"
      >
        <h1 class="text-[24px] font-medium text-[#03102f] leading-[1.35]">{{ card.nickname }} is ready!</h1>
        <p class="text-[16px] font-normal text-[#61667c] leading-[1.4]">Your card has been activated and is ready to use.</p>
        <div class="flex flex-wrap items-start justify-center gap-[12px] pt-[12px]">
          <button
            type="button"
            class="flex items-center justify-center h-[36px] px-[12px] rounded-[8px] border border-[#f2f2f4] transition-[filter] duration-150 hover:brightness-95 active:translate-y-[1px]"
            style="background: linear-gradient(to bottom, #ffffff, #f2f2f2); box-shadow: 0px 1.5px 0px 0px #e5e5e5;"
            @click="emit('view', card)"
          >
            <span class="text-[14px] font-medium text-[#61667c] leading-[1.5] whitespace-nowrap" style="text-shadow: 0px 1px 1px rgba(0,0,0,0.08);">View card details</span>
          </button>
          <button
            type="button"
            class="flex items-center justify-center h-[36px] px-[12px] rounded-[8px] border border-[#2465de] transition-[filter] duration-150 hover:brightness-105 active:translate-y-[1px]"
            style="background: linear-gradient(to bottom, #4179e2, #1f5bcc); box-shadow: 0px 1.5px 0px 0px #1d5fd9;"
            @click="emit('create-another')"
          >
            <span class="text-[14px] font-medium text-white leading-[1.5] whitespace-nowrap" style="text-shadow: 0px 1px 1px rgba(0,0,0,0.12);">Create another card</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import HitPayCard from '../content/HitPayCard.vue'
import closeIcon from '../../assets/images/cards-success-close.svg'

defineProps({
  card: { type: Object, required: true },
})
const emit = defineEmits(['close', 'view', 'create-another'])

const cardEntered = ref(false)

function onKeydown(e) {
  if (e.key === 'Escape') emit('close')
}
onMounted(() => window.addEventListener('keydown', onKeydown))
onUnmounted(() => window.removeEventListener('keydown', onKeydown))
</script>
