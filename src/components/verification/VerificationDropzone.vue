<template>
  <div class="flex flex-col gap-[8px] items-start w-full">
    <p class="text-[12px] font-medium text-[#61667c] leading-[1.5]">{{ label }}</p>

    <button
      v-if="files.length < mockFiles.length"
      class="flex flex-col gap-[4px] items-center justify-center w-full h-[140px] bg-white border border-[#e5e6ea] rounded-[8px] cursor-pointer hover:border-[#2465de] transition-colors"
      style="box-shadow: 0px 1px 3px 0px rgba(0,0,0,0.04), 0px 1.5px 1.5px 0px rgba(0,0,0,0.09);"
      @click="addNext"
    >
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" class="text-[#9295a5]">
        <path fill-rule="evenodd" clip-rule="evenodd" d="M11.5 4C8.85134 4 6.73903 6.38087 7.02729 8.99923C7.08294 9.50471 6.75509 9.9678 6.26851 10.0896C4.96468 10.4159 4 11.5965 4 13C4 14.6569 5.34315 16 7 16H8C8.55228 16 9 16.4477 9 17C9 17.5523 8.55228 18 8 18H7C4.23858 18 2 15.7614 2 13C2 10.9486 3.23468 9.18749 5.00053 8.41614C5.04543 4.86494 7.93814 2 11.5 2C14.2856 2 16.66 3.75154 17.5856 6.21198C20.13 6.90766 22 9.23462 22 12C22 15.3137 19.3137 18 16 18C15.4477 18 15 17.5523 15 17C15 16.4477 15.4477 16 16 16C18.2091 16 20 14.2091 20 12C20 10.0145 18.5524 8.36524 16.6552 8.05324C16.2653 7.98913 15.9477 7.70323 15.8441 7.32051C15.326 5.40663 13.576 4 11.5 4ZM13 12.4162L14.2934 13.7077C14.6843 14.0979 15.3174 14.0974 15.7077 13.7066C16.0979 13.3157 16.0974 12.6826 15.7066 12.2923L12.8832 9.47341C12.3952 8.98618 11.6048 8.98618 11.1168 9.47341L8.29345 12.2923C7.90262 12.6826 7.90212 13.3157 8.29234 13.7066C8.68256 14.0974 9.31572 14.0979 9.70655 13.7077L11 12.4162V21C11 21.5523 11.4477 22 12 22C12.5523 22 13 21.5523 13 21V12.4162Z" fill="currentColor"/>
      </svg>
      <p class="text-[12px] text-[#9295a5] leading-[1.5] text-center">Select documents or drag here</p>
      <p class="text-[12px] text-[#9295a5] leading-[1.5] text-center">File max 5MB</p>
    </button>

    <div v-if="files.length" class="flex flex-col gap-[8px] items-start w-full">
      <div
        v-for="(file, i) in files"
        :key="file.name"
        class="flex gap-[8px] items-center w-full bg-white border border-[#e5e6ea] rounded-[8px]"
        style="padding: 4px 4px 4px 8px; filter: drop-shadow(0px 1px 1.5px rgba(0,0,0,0.04)) drop-shadow(0px 1.5px 0.75px rgba(0,0,0,0.09));"
      >
        <div class="flex flex-1 gap-[8px] items-center min-w-0">
          <img :src="fileIcons[file.kind]" width="24" height="24" alt="" class="shrink-0" />
          <p class="text-[12px] text-[#61667c] leading-[1.5] whitespace-nowrap truncate">{{ file.name }}</p>
        </div>
        <button
          class="flex h-[28px] w-[36px] items-center justify-center rounded-[8px] shrink-0 cursor-pointer hover:bg-[rgba(220,53,69,0.06)] transition-colors"
          @click="removeAt(i)"
        >
          <img :src="binIcon" width="16" height="16" alt="Remove" />
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import binIcon from '../../assets/icons/rfi-bin.svg'
import filePdfIcon from '../../assets/icons/rfi-file-pdf-24.svg'
import fileCsvIcon from '../../assets/icons/rfi-file-csv-24.svg'

const props = defineProps({
  label: { type: String, required: true },
  files: { type: Array, required: true }, // v-model:files
  mockFiles: { type: Array, required: true },
})

const emit = defineEmits(['update:files'])

const fileIcons = { pdf: filePdfIcon, csv: fileCsvIcon, svg: filePdfIcon }

function addNext() {
  const next = props.mockFiles[props.files.length]
  if (!next) return
  emit('update:files', [...props.files, { ...next }])
}

function removeAt(i) {
  const next = [...props.files]
  next.splice(i, 1)
  emit('update:files', next)
}
</script>
