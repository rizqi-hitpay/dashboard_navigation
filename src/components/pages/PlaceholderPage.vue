<template>
  <div class="h-full w-full overflow-y-auto bg-white flex flex-col items-center justify-center gap-[12px] px-[24px] text-center">
    <div class="flex items-center justify-center size-[56px] rounded-full bg-[#eef3fc]">
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 3l2.1 4.9 5.3.5-4 3.5 1.2 5.2L12 14.9 7.4 17.6l1.2-5.2-4-3.5 5.3-.5L12 3z" stroke="#2364dd" stroke-width="1.5" stroke-linejoin="round" />
      </svg>
    </div>
    <h1 class="text-[20px] font-medium text-[#03102f] leading-[1.35]">{{ title }} page here</h1>
    <p class="text-[14px] text-[#61667c] leading-[1.5] max-w-[360px]">This page is coming soon.</p>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const title = computed(() => {
  const seg = route.path.split('/').filter(Boolean).pop() || 'Home'
  return seg
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ')
})
</script>
