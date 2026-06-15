<template>
  <span v-if="variant === 'new'" class="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium text-white bg-[#b14aed] leading-[18px] shrink-0">
    New
  </span>
  <span v-else-if="variant === 'count'" class="inline-flex items-center justify-center w-5 h-5 rounded-full text-[10px] font-medium text-white bg-[#dc3545] leading-none shrink-0">
    {{ text }}
  </span>
  <span v-else-if="variant === 'beta'" class="inline-flex items-center px-1 rounded text-[10px] font-medium uppercase tracking-[0.3px] text-white bg-[#eaa00c] leading-[18px] shrink-0">
    BETA
  </span>
  <span v-else-if="variant === 'warning'" class="inline-flex items-center justify-center w-5 h-5 rounded bg-white shrink-0">
    <img :src="alertIcon" alt="warning" class="w-3.5 h-3.5" style="filter: invert(72%) sepia(51%) saturate(826%) hue-rotate(353deg) brightness(102%) contrast(96%);" />
  </span>
</template>

<script setup>
import alertIcon from '../../assets/icons/icon-alert.svg'

defineProps({
  variant: { type: String, required: true },
  text: { type: String, default: '9+' },
})
</script>
