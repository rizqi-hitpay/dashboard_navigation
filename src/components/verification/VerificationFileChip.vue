<template>
  <div class="flex gap-[8px] items-center w-full bg-[#f8f9fc] border border-[#e5e6ea] rounded-[8px] p-[8px]">
    <VerificationFileTypeIcon :kind="file.kind" />
    <div class="flex flex-1 flex-col items-start min-w-0">
      <p class="text-[12px] text-[#03102f] leading-[1.5] w-full truncate">{{ file.name }}</p>
      <p class="text-[10px] font-medium text-[#61667c] uppercase w-full" style="letter-spacing: 0.3px; line-height: 18px;">{{ file.size || '—' }}</p>
    </div>
  </div>
</template>

<script setup>
import VerificationFileTypeIcon from './VerificationFileTypeIcon.vue'

defineProps({
  file: { type: Object, required: true },
})
</script>
