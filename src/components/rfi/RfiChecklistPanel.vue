<template>
  <div class="flex flex-col w-[320px] shrink-0 h-full bg-[#fcfcfd] border-l border-[#e5e6ea]">

    <!-- Header: title + progress -->
    <div class="relative flex flex-col gap-[4px] w-full shrink-0 bg-white border-b border-[#e5e6ea]" style="padding: 8px 12px 12px;">
      <p class="text-[13px] font-medium text-[#03102f] leading-[1.5]">Required checklist ({{ completed }}/{{ checklist.items.length }})</p>
      <div class="w-full rounded-[16px] bg-[#f2f2f4] overflow-hidden" style="height: 5px;">
        <div
          class="h-full rounded-[16px] bg-[#2465de]"
          :style="{ width: (completed / checklist.items.length) * 100 + '%', transition: 'width 200ms ease' }"
        ></div>
      </div>
      <button
        class="absolute flex items-center justify-center cursor-pointer hover:opacity-70 transition-opacity"
        style="right: 8px; top: 8px; width: 16px; height: 16px;"
        @click="$emit('close')"
      >
        <img :src="closeIcon" width="16" height="16" alt="Close" />
      </button>
    </div>

    <!-- Items -->
    <div class="flex flex-col gap-[12px] w-full flex-1 min-h-0 overflow-y-auto" style="padding: 8px;">
      <div v-for="(item, i) in checklist.items" :key="i" class="flex flex-col gap-[4px] w-full shrink-0">
        <div class="flex items-center w-full" style="height: 20px;">
          <p class="text-[12px] font-medium text-[#61667c] leading-[1.5] truncate">{{ item.label }}</p>
        </div>

        <!-- Free-text answer -->
        <template v-if="item.type === 'textarea'">
          <div
            v-if="checklist.submitted"
            class="w-full bg-white border border-[#e5e6ea] rounded-[8px] text-[13px] text-[#03102f] leading-[1.5]"
            style="padding: 8px;"
          >{{ item.value }}</div>
          <textarea
            v-else
            v-model="item.value"
            :placeholder="item.placeholder"
            class="rfi-checklist-textarea w-full bg-white border border-[#e5e6ea] rounded-[8px] resize-none outline-none text-[13px] text-[#03102f] leading-[1.5] placeholder-[#9295a5]"
            style="min-height: 100px; padding: 8px; filter: drop-shadow(0px 1px 1.5px rgba(0,0,0,0.04)) drop-shadow(0px 1.5px 0.75px rgba(0,0,0,0.09));"
          ></textarea>
        </template>

        <!-- File upload -->
        <template v-else>
          <!-- Empty: choose file + upload -->
          <div
            v-if="!item.file"
            class="flex gap-[16px] items-center w-full bg-white border border-[#e5e6ea] rounded-[8px]"
            style="padding: 4px 4px 4px 8px; filter: drop-shadow(0px 1px 1.5px rgba(0,0,0,0.04)) drop-shadow(0px 1.5px 0.75px rgba(0,0,0,0.09));"
          >
            <p class="flex-1 min-w-0 text-[12px] text-[#61667c] leading-[1.5]">Choose file</p>
            <button
              class="flex h-[28px] items-center justify-center gap-[6px] rounded-[8px] shrink-0 cursor-pointer border border-[#f2f2f4] active:translate-y-[1px]"
              style="background: linear-gradient(to bottom, #ffffff, #f2f2f2); box-shadow: 0px 1.5px 0px 0px rgba(0,0,0,0.1); padding: 8px;"
              @click="item.file = { ...item.mockFile }"
            >
              <img :src="uploadIcon" width="16" height="16" alt="" />
              <span class="text-[12px] font-medium text-[#61667c] leading-[1.5] whitespace-nowrap" style="text-shadow: 0px 1px 1px rgba(0,0,0,0.08);">Upload</span>
            </button>
          </div>

          <!-- Uploaded: file row with delete / download -->
          <div
            v-else
            class="flex gap-[8px] items-center w-full bg-white border border-[#e5e6ea] rounded-[8px]"
            style="padding: 4px 4px 4px 8px; filter: drop-shadow(0px 1px 1.5px rgba(0,0,0,0.04)) drop-shadow(0px 1.5px 0.75px rgba(0,0,0,0.09));"
          >
            <div class="flex flex-1 gap-[8px] items-center min-w-0">
              <img :src="fileIcons[item.file.kind]" width="24" height="24" alt="" class="shrink-0" />
              <p class="text-[12px] text-[#61667c] leading-[1.5] whitespace-nowrap truncate">{{ item.file.name }}</p>
            </div>
            <button
              v-if="!checklist.submitted"
              class="flex h-[28px] w-[36px] items-center justify-center rounded-[8px] shrink-0 cursor-pointer hover:bg-[rgba(220,53,69,0.06)] transition-colors"
              @click="item.file = null"
            >
              <img :src="binIcon" width="16" height="16" alt="Remove" />
            </button>
            <button
              v-else
              class="flex h-[28px] w-[36px] items-center justify-center rounded-[8px] shrink-0 cursor-pointer hover:bg-[rgba(0,39,113,0.04)] transition-colors"
            >
              <img :src="downloadIcon" width="16" height="16" alt="Download" />
            </button>
          </div>
        </template>
      </div>
    </div>

    <!-- Footer -->
    <div v-if="!checklist.submitted" class="flex items-center justify-between w-full shrink-0 bg-white border-t border-[#e5e6ea]" style="padding: 12px;">
      <button
        class="flex h-[28px] items-center justify-center rounded-[8px] cursor-pointer hover:bg-[rgba(0,39,113,0.04)] transition-colors"
        style="padding: 8px;"
        @click="$emit('close')"
      >
        <span class="text-[12px] font-medium text-[#61667c] leading-[1.5] whitespace-nowrap">Close</span>
      </button>
      <button
        class="flex h-[28px] items-center justify-center rounded-[8px] shrink-0 cursor-pointer border border-[#2465de] active:translate-y-[1px]"
        style="background: linear-gradient(to bottom, #4179e2, #1f5bcc); box-shadow: 0px 1.5px 0px 0px #1d5fd9; padding: 8px; min-width: 36px;"
        @click="$emit('submit')"
      >
        <span class="text-[12px] font-medium text-white leading-[1.5] whitespace-nowrap" style="text-shadow: 0px 1px 1px rgba(0,0,0,0.12);">Submit for review</span>
      </button>
    </div>
    <div v-else class="flex flex-col gap-[2px] items-center w-full shrink-0 bg-white border-t border-[#e5e6ea] text-center" style="padding: 12px;">
      <p class="text-[12px] font-medium text-[#7d1ab7] leading-[1.5]">Submitted for review</p>
      <p class="text-[12px] text-[#61667c] leading-[1.5]">Compliance team will respond shortly</p>
    </div>

  </div>
</template>

<script setup>
import { computed } from 'vue'
import { checklistCompletedCount } from '../../composables/useRfi.js'
import closeIcon from '../../assets/icons/rfi-close-x.svg'
import uploadIcon from '../../assets/icons/rfi-upload.svg'
import binIcon from '../../assets/icons/rfi-bin.svg'
import downloadIcon from '../../assets/icons/rfi-download.svg'
import fileCsvIcon from '../../assets/icons/rfi-file-csv-24.svg'
import filePdfIcon from '../../assets/icons/rfi-file-pdf-24.svg'

const props = defineProps({
  checklist: { type: Object, required: true },
})

defineEmits(['close', 'submit'])

const fileIcons = { csv: fileCsvIcon, pdf: filePdfIcon }

const completed = computed(() => checklistCompletedCount(props.checklist))
</script>

<style scoped>
.rfi-checklist-textarea:focus {
  border-color: #2465de;
  box-shadow: 0 0 0 3px #b3cdfe;
}
</style>
