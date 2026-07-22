<template>
  <div class="flex flex-col gap-[4px] items-start w-full">
    <p class="text-[12px] font-medium text-[#61667c] leading-[1.5]">{{ label }}</p>

    <div
      v-if="!file"
      class="flex gap-[16px] items-center w-full bg-white border border-[#e5e6ea] rounded-[8px]"
      style="padding: 4px 4px 4px 8px; filter: drop-shadow(0px 1px 1.5px rgba(0,0,0,0.04)) drop-shadow(0px 1.5px 0.75px rgba(0,0,0,0.09));"
    >
      <p class="flex-1 min-w-0 text-[12px] text-[#61667c] leading-[1.5]">Choose file from your computer or drag here</p>
      <button
        class="flex h-[28px] items-center justify-center gap-[6px] rounded-[8px] shrink-0 cursor-pointer border border-[#f2f2f4] active:translate-y-[1px]"
        style="background: linear-gradient(to bottom, #ffffff, #f2f2f2); box-shadow: 0px 1.5px 0px 0px rgba(0,0,0,0.1); padding: 8px;"
        @click="$emit('update:file', { ...mockFile })"
      >
        <img :src="uploadIcon" width="16" height="16" alt="" />
        <span class="text-[12px] font-medium text-[#61667c] leading-[1.5] whitespace-nowrap" style="text-shadow: 0px 1px 1px rgba(0,0,0,0.08);">Upload</span>
      </button>
    </div>

    <div
      v-else
      class="flex gap-[8px] items-center w-full bg-white border border-[#e5e6ea] rounded-[8px]"
      style="padding: 4px 4px 4px 8px; filter: drop-shadow(0px 1px 1.5px rgba(0,0,0,0.04)) drop-shadow(0px 1.5px 0.75px rgba(0,0,0,0.09));"
    >
      <div class="flex flex-1 gap-[8px] items-center min-w-0">
        <img :src="fileIcons[file.kind]" width="24" height="24" alt="" class="shrink-0" />
        <p class="text-[12px] text-[#61667c] leading-[1.5] whitespace-nowrap truncate">{{ file.name }}</p>
      </div>
      <button
        class="flex h-[28px] w-[36px] items-center justify-center rounded-[8px] shrink-0 cursor-pointer hover:bg-[rgba(220,53,69,0.06)] transition-colors"
        @click="$emit('update:file', null)"
      >
        <img :src="binIcon" width="16" height="16" alt="Remove" />
      </button>
    </div>
  </div>
</template>

<script setup>
import uploadIcon from '../../assets/icons/rfi-upload.svg'
import binIcon from '../../assets/icons/rfi-bin.svg'
import filePdfIcon from '../../assets/icons/rfi-file-pdf-24.svg'
import fileCsvIcon from '../../assets/icons/rfi-file-csv-24.svg'

defineProps({
  label: { type: String, required: true },
  file: { type: Object, default: null },
  mockFile: { type: Object, required: true },
})

defineEmits(['update:file'])

const fileIcons = { pdf: filePdfIcon, csv: fileCsvIcon, svg: filePdfIcon }
</script>
