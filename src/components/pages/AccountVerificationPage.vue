<template>
  <div class="bg-white flex flex-col h-full w-full overflow-hidden">

    <!-- Inner -->
    <div class="flex flex-1 flex-col items-start w-full min-h-0 pt-[4px]">

      <!-- Page title -->
      <div class="flex gap-[32px] items-center px-[24px] py-[12px] w-full shrink-0">
        <p class="font-medium text-[18px] text-[#03102f] leading-[1.35] whitespace-nowrap">Account Verification</p>
      </div>

      <!-- Content -->
      <div class="flex flex-1 w-full min-h-0 px-[24px] py-[12px]">
        <div class="flex gap-[40px] items-start w-full h-full rounded-[8px]">

          <!-- Sub-submenu -->
          <div class="flex flex-col gap-[8px] items-start w-[280px] shrink-0 pb-[24px]">
            <button
              v-for="tab in tabs"
              :key="tab"
              class="flex gap-[8px] items-center w-full rounded-[8px] text-left cursor-pointer transition-colors duration-150"
              style="padding: 4px 8px; min-height: 29px;"
              :class="activeTab === tab ? 'bg-[rgba(0,39,113,0.04)]' : 'hover:bg-[rgba(0,39,113,0.04)]'"
              @click="selectTab(tab)"
            >
              <span
                class="flex-1 text-[14px] leading-[1.5] truncate"
                :style="{ color: activeTab === tab ? '#002771' : '#61667c', fontWeight: activeTab === tab ? 500 : 400 }"
              >{{ tab }}</span>
              <span
                v-if="tab === 'Additional information' && actionNeeded"
                class="inline-flex items-center justify-center shrink-0 text-[12px] font-medium text-[#bd8400]"
                style="background: #fff9ec; min-height: 24px; min-width: 32px; padding: 2px 8px; border-radius: 24px;"
              >Action needed</span>
            </button>
          </div>

          <!-- Panel -->
          <div class="flex flex-col flex-1 h-full min-w-0 min-h-0">
<!-- Additional information: list ↔ chat -->
            <RfiChatView
              v-if="activeTab === 'Additional information' && activeRequest"
              :key="'chat-' + activeRequest.id"
              :request="activeRequest"
              @back="closeRfi"
            />
            <RfiRequestList v-else-if="activeTab === 'Additional information'" @open="openRfi" />

            <!-- Other tabs: placeholder -->
            <div v-else class="flex flex-1 flex-col items-center justify-center gap-[8px]">
              <p class="text-[16px] font-medium text-[#03102f] leading-[1.4]">{{ activeTab }}</p>
              <p class="text-[14px] text-[#61667c] leading-[1.5]">This section is coming soon.</p>
            </div>
          </div>

        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { activeRfiId, closeRfi, hasActionNeeded, openRfi, rfiRequests } from '../../composables/useRfi.js'
import RfiRequestList from '../rfi/RfiRequestList.vue'
import RfiChatView from '../rfi/RfiChatView.vue'
import { settingsOpen } from '../../composables/useSettingsPanel.js'

const tabs = ['Personal', 'Corporate', 'Shareholders', 'Additional information']
const activeTab = ref('Additional information')

const activeRequest = computed(() => rfiRequests.find((r) => r.id === activeRfiId.value) || null)
const actionNeeded = computed(() => hasActionNeeded())

function selectTab(tab) {
  activeTab.value = tab
  closeRfi()
}

// Deep links land here with the settings sidebar closed — open it
onMounted(() => {
  settingsOpen.value = true
})
</script>

