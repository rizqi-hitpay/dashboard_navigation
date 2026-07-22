<template>
  <div
    class="flex gap-[8px] items-center w-full bg-white border border-[#e5e6ea] rounded-[8px]"
    style="padding: 4px 4px 4px 8px; filter: drop-shadow(0px 1px 1.5px rgba(0,0,0,0.04)) drop-shadow(0px 1.5px 0.75px rgba(0,0,0,0.09));"
  >
    <div class="flex flex-1 gap-[8px] items-center min-w-0">
      <img :src="fileIcons[file.kind]" width="24" height="24" alt="" class="shrink-0" />
      <p class="text-[12px] text-[#61667c] leading-[1.5] whitespace-nowrap truncate">{{ file.name }}</p>
    </div>
    <button class="flex h-[28px] w-[36px] items-center justify-center rounded-[8px] shrink-0 cursor-pointer hover:bg-[rgba(0,39,113,0.04)] transition-colors">
      <img :src="downloadIcon" width="16" height="16" alt="Download" />
    </button>
  </div>
</template>

<script setup>
import downloadIcon from '../../assets/icons/rfi-download.svg'
import filePdfIcon from '../../assets/icons/rfi-file-pdf-24.svg'
import fileCsvIcon from '../../assets/icons/rfi-file-csv-24.svg'

defineProps({
  file: { type: Object, required: true },
})

const fileIcons = { pdf: filePdfIcon, csv: fileCsvIcon, svg: filePdfIcon }
</script>
