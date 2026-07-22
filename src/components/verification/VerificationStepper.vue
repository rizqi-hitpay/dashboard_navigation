<template>
  <div class="flex flex-row md:flex-col justify-center md:justify-start gap-[24px] md:gap-[4px] items-center md:items-start w-full md:w-[280px] shrink-0">
    <div
      v-for="(step, i) in steps"
      :key="step.key"
      class="flex gap-[8px] items-center md:w-full rounded-[8px] shrink-0"
      :class="i === currentIndex ? 'md:bg-[rgba(0,39,113,0.04)]' : ''"
      style="padding: 4px 8px; min-height: 32px;"
    >
      <span
        v-if="i < currentIndex"
        class="flex items-center justify-center shrink-0 rounded-full bg-[#2465de]"
        style="width: 24px; height: 24px;"
      >
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
          <path d="M2.5 6.5L5 9L9.5 3.5" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </span>
      <span
        v-else
        class="flex items-center justify-center shrink-0 rounded-full border"
        :class="i === currentIndex ? 'border-[#2465de]' : 'border-[#ccd0da]'"
        style="width: 24px; height: 24px;"
      >
        <span
          class="text-[12px] font-medium leading-none"
          :class="i === currentIndex ? 'text-[#2465de]' : 'text-[#9295a5]'"
        >{{ i + 1 }}</span>
      </span>
      <span
        class="hidden md:inline text-[14px] leading-[1.5] whitespace-nowrap"
        :class="i === currentIndex ? 'font-medium text-[#2465de]' : i < currentIndex ? 'text-[#03102f]' : 'text-[#9295a5]'"
      >{{ step.label }}</span>
    </div>
  </div>
</template>

<script setup>
defineProps({
  steps: { type: Array, required: true }, // [{ key, label }]
  currentIndex: { type: Number, required: true },
})
</script>
