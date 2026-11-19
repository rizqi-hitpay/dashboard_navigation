<template>
  <!-- Add tile: idle (Figma: 1:3514) → hover turns blue (Figma: 1:6345) -->
  <button
    type="button"
    class="group flex flex-col items-center justify-center gap-[8px] min-h-[326px] p-[16px] rounded-[8px] border border-dashed border-[#cbcdd4] bg-white hover:border-[#2465de] focus-visible:border-[#2465de] focus-visible:outline-none transition-colors duration-200"
    @click="$emit('add')"
  >
    <span class="relative flex items-center p-[8px] rounded-[32px] bg-[#f2f2f4] group-hover:bg-[#e5eeff] group-focus-visible:bg-[#e5eeff] transition-colors duration-200">
      <img :src="plusGreyIcon" width="18" height="18" alt="" class="block group-hover:opacity-0 group-focus-visible:opacity-0 transition-opacity duration-200" />
      <img :src="plusBlueIcon" width="18" height="18" alt="" class="absolute left-[8px] top-[8px] block opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 transition-opacity duration-200" />
    </span>
    <span class="text-[13px] text-[#61667c] group-hover:text-[#03102f] group-focus-visible:text-[#03102f] leading-[1.5] whitespace-nowrap transition-colors duration-200">Add chart or table</span>
  </button>
</template>

<script setup>
import plusGreyIcon from '../../assets/icons/icon-plus-circle-grey.svg'
import plusBlueIcon from '../../assets/icons/chart-plus-blue-18.svg'

defineEmits(['add'])
</script>
