<template>
  <!-- Upload bills full-screen header: logo · title · stepper · AI chat · Close (Figma 13:18020).
       Shared by every step (Bill details → Review → Payment) so the chrome never changes. -->
  <header class="relative flex items-stretch w-full h-[64px] shrink-0 border-b border-[#e5e6ea] bg-white">
    <div class="flex flex-1 items-center gap-[12px] min-w-0 px-[24px]">
      <img :src="logogram" width="32" height="31.9585" alt="HitPay" class="shrink-0" />
      <span class="w-px h-[20px] bg-[#e5e6ea] shrink-0" />
      <p class="text-[16px] font-medium text-[#03102f] leading-[1.4] whitespace-nowrap">Upload bills</p>
    </div>

    <!-- Stepper (centered). Done + current steps are filled; the fill grows as you advance. -->
    <ol class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-start gap-[8px]" aria-label="Progress">
      <li
        v-for="(s, i) in STEPS"
        :key="s"
        class="flex flex-col items-center gap-[8px] w-[100px]"
        :aria-current="i === current ? 'step' : undefined"
      >
        <span class="relative h-[4px] w-full rounded-[16px] overflow-hidden">
          <span class="absolute inset-0 bg-[#2465de] opacity-[0.12]" />
          <span class="step-fill absolute inset-y-0 left-0 bg-[#2465de] rounded-[16px]" :style="{ width: i <= current ? '100%' : '0%' }" />
        </span>
        <span class="text-[12px] leading-[1.5] whitespace-nowrap" :class="i <= current ? 'text-[#03102f]' : 'text-[#9295a5]'">{{ s }}</span>
      </li>
    </ol>

    <div class="flex items-stretch shrink-0">
      <button
        v-if="!aiOpen"
        type="button"
        class="flex items-center justify-center w-[64px] border-l border-[#e5e6ea] hover:bg-[#fcfcfd] transition-colors duration-150"
        aria-label="Ask AI assistant"
        @click="$emit('open-ai')"
      >
        <img :src="aiChatIcon" width="18" height="18" alt="" />
      </button>
      <button type="button" class="flex items-center gap-[8px] px-[24px] border-l border-[#e5e6ea] hover:bg-[#fcfcfd] transition-colors duration-150" @click="$emit('close')">
        <img :src="closeIcon" width="18" height="18" alt="" />
        <span class="text-[14px] font-medium text-[#61667c] leading-[1.5]">Close</span>
      </button>
    </div>
  </header>
</template>

<script setup>
import logogram from '../../assets/icons/upload-bill/logogram.svg'
import aiChatIcon from '../../assets/icons/upload-bill/ai-chat.svg'
import closeIcon from '../../assets/icons/upload-bill/close-x.svg'

defineProps({
  // 0 = Bill details · 1 = Review · 2 = Payment
  current: { type: Number, default: 0 },
  // Hides the AI button while the AI panel is docked open
  aiOpen: { type: Boolean, default: false },
})
defineEmits(['open-ai', 'close'])

const STEPS = ['Bill details', 'Review', 'Payment']
</script>

<style scoped>
.step-fill { transition: width 280ms cubic-bezier(0.4, 0, 0.2, 1); }
@media (prefers-reduced-motion: reduce) {
  .step-fill { transition: none; }
}
</style>
