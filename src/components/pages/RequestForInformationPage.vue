<template>
  <div class="bg-white flex flex-col h-full w-full overflow-hidden">
    <div class="flex flex-1 flex-col items-start w-full min-h-0 pt-[4px]">

      <div class="hidden md:flex gap-[32px] items-center px-[24px] py-[12px] w-full shrink-0">
        <div class="flex flex-col gap-[8px] items-start justify-center">
          <p class="font-medium text-[18px] text-[#03102f] leading-[1.35] whitespace-nowrap">Request for information</p>
          <p class="text-[12px] text-[#61667c] leading-[1.5]">Submit any extra documents needed for verifications</p>
        </div>
      </div>

      <div class="flex flex-1 w-full min-h-0 justify-center pt-[16px] md:p-[24px] overflow-y-auto">
        <div class="flex flex-col w-full max-w-[800px] h-fit bg-[#f8f9fc] rounded-none md:rounded-[12px] p-[4px]">

          <!-- White card with request rows — height hugs its content instead of
               stretching to fill the panel, so the grey background shows through below -->
          <div
            class="bg-white flex flex-col shrink-0 items-start rounded-[8px] w-full"
            style="filter: drop-shadow(0px 1px 2px rgba(0,0,0,0.06)) drop-shadow(0px 1px 0.5px rgba(0,0,0,0.06));"
          >
            <button
              v-for="req in rfiRequests"
              :key="req.id"
              class="flex flex-col gap-[4px] items-start p-[12px] w-full text-left border-b border-[#e5e6ea] last:border-b-0 transition-colors duration-150 cursor-pointer hover:bg-[#fcfcfd]"
              @click="openRequest(req.id)"
            >
              <div class="flex items-center justify-between gap-[16px] w-full">
                <p class="text-[14px] font-medium text-[#03102f] leading-[1.5]">{{ req.title }}</p>
                <RfiStatusChip :status="req.status" />
              </div>
              <div class="flex gap-[2px] items-center text-[10px] font-medium uppercase whitespace-nowrap" style="letter-spacing: 0.3px; line-height: 18px;">
                <span :style="{ color: req.overdue ? '#eaa00c' : '#9295a5' }">{{ dateLabelFor(req) }}</span>
                <template v-if="req.itemsNote">
                  <span style="color: #9295a5;">・</span>
                  <span :style="{ color: req.itemsAttention ? '#eaa00c' : '#61667c' }">{{ req.itemsNote }}</span>
                </template>
              </div>
            </button>
          </div>

        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import RfiStatusChip from '../rfi/RfiStatusChip.vue'
import { rfiRequests } from '../../composables/useRfi.js'
import { settingsOpen } from '../../composables/useSettingsPanel.js'

const router = useRouter()

// Closed statuses have nothing left due — show when the request was closed instead
const CLOSED_STATUSES = ['rejected', 'completed', 'expired']

function dateLabelFor(req) {
  if (CLOSED_STATUSES.includes(req.status)) return `Closed: ${req.due}`
  return req.overdue ? `Overdue: ${req.due}` : `Due date: ${req.due}`
}

function openRequest(id) {
  router.push({ name: 'account-verification-full-screen', query: { rfi: id } })
}

// Deep links land here with the settings sidebar closed — open it
settingsOpen.value = true
</script>
