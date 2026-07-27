<template>
  <div class="flex flex-col gap-[8px] items-start w-full">
    <p v-if="label" class="text-[12px] font-medium text-[#61667c] leading-[1.5]">{{ label }}</p>

    <!-- Empty state -->
    <button
      v-if="!files.length"
      class="dropzone-surface flex flex-col gap-[8px] items-center justify-center w-full h-[112px] bg-white border border-[#e5e6ea] rounded-[8px] cursor-pointer outline-none transition-colors"
      @click="addFiles"
    >
      <div class="relative h-[42px] w-[51px] shrink-0">
        <img :src="paperIcon" width="28" height="35" class="absolute" style="left: 4px; top: 3px; transform: rotate(-11deg);" alt="" />
        <img :src="paperIcon" width="28" height="35" class="absolute" style="left: 12px; top: 3px; transform: rotate(1deg);" alt="" />
        <img :src="paperIcon" width="28" height="35" class="absolute" style="left: 19px; top: 4px; transform: rotate(13deg);" alt="" />
      </div>
      <p class="text-[12px] text-[#2465de] leading-[1.5] text-center underline">Choose files from your computer or drag here</p>
    </button>

    <!-- Filled state: uploaded file list + a slim row to add more -->
    <div
      v-else
      class="dropzone-surface flex flex-col gap-[8px] items-center w-full bg-white border border-[#e5e6ea] rounded-[8px]"
      style="padding: 8px 8px 16px;"
    >
      <div class="flex flex-col gap-[4px] items-start w-full">
        <div
          v-for="(file, i) in files"
          :key="file.name"
          class="flex gap-[8px] items-center w-full bg-white border rounded-[8px] p-[8px]"
          :class="stateOf(file) === 'error' ? 'border-[#dc3545]' : 'border-[#e5e6ea]'"
        >
          <VerificationFileTypeIcon :kind="file.kind" />

          <div class="flex flex-1 flex-col items-start min-w-0">
            <p class="text-[12px] text-[#03102f] leading-[1.5] w-full truncate">{{ file.name }}</p>

            <!-- Uploading -->
            <div v-if="stateOf(file) === 'uploading'" class="flex gap-[4px] items-center w-full">
              <div class="flex-1 h-[5px] min-w-0 bg-[#f2f2f4] rounded-[16px] relative overflow-hidden">
                <div class="absolute inset-y-0 left-0 bg-[#2465de] rounded-[16px] transition-all duration-150" :style="{ width: progressOf(file) + '%' }"></div>
              </div>
              <p class="text-[10px] text-[#03102f] leading-[1.5] whitespace-nowrap">{{ progressOf(file) }}%</p>
            </div>

            <!-- Error -->
            <p v-else-if="stateOf(file) === 'error'" class="text-[10px] font-medium text-[#dc3545] uppercase w-full" style="letter-spacing: 0.3px; line-height: 18px;">Can't upload this file</p>

            <!-- Done -->
            <p v-else class="text-[10px] font-medium text-[#61667c] uppercase w-full" style="letter-spacing: 0.3px; line-height: 18px;">{{ file.size || '—' }}</p>
          </div>

          <button
            class="flex items-center justify-center shrink-0 cursor-pointer hover:opacity-70 transition-opacity"
            style="width: 14px; height: 14px;"
            @click="removeAt(i)"
          >
            <img :src="stateOf(file) === 'done' ? binIcon : removeXIcon" width="14" height="14" alt="Remove" />
          </button>
        </div>
      </div>

      <button class="dropzone-trigger text-[12px] text-[#2465de] leading-[1.5] text-center underline cursor-pointer outline-none" @click="addFiles">
        Choose files from your computer or drag here
      </button>
    </div>
  </div>
</template>

<script setup>
import { reactive } from 'vue'
import VerificationFileTypeIcon from './VerificationFileTypeIcon.vue'
import paperIcon from '../../assets/icons/rfi-paper-generic.svg'
import binIcon from '../../assets/icons/rfi-bin.svg'
import removeXIcon from '../../assets/icons/rfi-file-remove-x.svg'

const props = defineProps({
  label: { type: String, default: '' },
  files: { type: Array, required: true }, // v-model:files
  mockFiles: { type: Array, required: true }, // [{ name, kind, size, forceError? }]
})

const emit = defineEmits(['update:files'])

// Transient upload-progress UI state, keyed by file name — not part of the v-model
const uploadStates = reactive({})

function stateOf(file) {
  return uploadStates[file.name]?.status || 'done'
}

function progressOf(file) {
  return uploadStates[file.name]?.progress ?? 0
}

function simulateUpload(file) {
  if (file.forceError) {
    uploadStates[file.name] = { progress: 0, status: 'uploading' }
    setTimeout(() => {
      uploadStates[file.name].status = 'error'
    }, 500)
    return
  }

  uploadStates[file.name] = { progress: 0, status: 'uploading' }
  const start = Date.now()
  const duration = 600 + Math.random() * 500
  const timer = setInterval(() => {
    const pct = Math.min(100, Math.round(((Date.now() - start) / duration) * 100))
    uploadStates[file.name].progress = pct
    if (pct >= 100) {
      clearInterval(timer)
      uploadStates[file.name].status = 'done'
    }
  }, 80)
}

// Adds every remaining mock file at once — simulates a multi-file picker selection
function addFiles() {
  const remaining = props.mockFiles.filter((m) => !props.files.some((f) => f.name === m.name))
  if (!remaining.length) return
  const added = remaining.map((m) => ({ ...m }))
  emit('update:files', [...props.files, ...added])
  added.forEach(simulateUpload)
}

function removeAt(i) {
  const [removed] = props.files.slice(i, i + 1)
  const next = [...props.files]
  next.splice(i, 1)
  emit('update:files', next)
  if (removed) delete uploadStates[removed.name]
}
</script>

<style scoped>
.dropzone-surface {
  box-shadow: 0px 1px 3px 0px rgba(0, 0, 0, 0.04), 0px 1.5px 1.5px 0px rgba(0, 0, 0, 0.09);
  transition: box-shadow 150ms ease, border-color 150ms ease;
}

button.dropzone-surface:hover,
button.dropzone-surface:focus-visible,
.dropzone-surface:has(.dropzone-trigger:hover),
.dropzone-surface:has(.dropzone-trigger:focus-visible) {
  border-color: #2465de;
  box-shadow: 0 0 0 3px #b3cdfe, inset 0px 2px 4px 0px rgba(0, 0, 0, 0.24);
}
</style>
