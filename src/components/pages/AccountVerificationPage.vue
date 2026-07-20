<template>
  <div class="bg-white flex flex-col h-full w-full overflow-hidden">

    <!-- Inner -->
    <div class="flex flex-1 flex-col items-start w-full min-h-0 pt-[4px]">

      <!-- Page title: desktop only — mobile carries context via the pill tabs below -->
      <div class="hidden md:flex gap-[32px] items-center px-[24px] py-[12px] w-full shrink-0">
        <p class="font-medium text-[18px] text-[#03102f] leading-[1.35] whitespace-nowrap">Account Verification</p>
      </div>

      <!-- Content -->
      <div class="flex flex-1 w-full min-h-0 px-[16px] py-[16px] md:px-[24px] md:py-[12px]">
        <div class="flex flex-col md:flex-row gap-[8px] md:gap-[40px] items-stretch md:items-start w-full h-full rounded-[8px] min-h-0">

          <!-- Sub-submenu: single horizontally-scrollable pill row on mobile
               (scrollbar hidden, active tab scrolled into view), vertical list on desktop -->
          <div
            ref="tabScroll"
            class="flex md:flex-col gap-[8px] items-center md:items-start w-full md:w-[280px] shrink-0 pb-0 md:pb-[24px] overflow-x-auto md:overflow-x-visible hide-scrollbar"
          >
            <button
              v-for="tab in tabs"
              :key="tab"
              :aria-current="activeTab === tab ? 'page' : undefined"
              class="flex gap-[8px] items-center w-auto md:w-full rounded-[8px] text-left cursor-pointer transition-colors duration-150 shrink-0"
              style="padding: 4px 8px; min-height: 29px;"
              :class="activeTab === tab ? 'bg-[rgba(0,39,113,0.04)]' : 'hover:bg-[rgba(0,39,113,0.04)]'"
              @click="selectTab(tab)"
            >
              <span
                class="text-[14px] leading-[1.5] truncate md:flex-1"
                :style="{ color: activeTab === tab ? '#002771' : '#61667c', fontWeight: activeTab === tab ? 500 : 400 }"
              >{{ tab }}</span>
              <span
                v-if="tab === 'Additional information' && actionNeeded"
                class="inline-flex items-center justify-center shrink-0 text-[12px] font-medium text-[#bd8400] whitespace-nowrap"
                style="background: #fff9ec; min-height: 24px; min-width: 32px; padding: 2px 8px; border-radius: 24px;"
              >Action needed</span>
            </button>
          </div>

          <!-- Panel -->
          <div class="flex flex-col flex-1 md:h-full min-w-0 min-h-0">
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
import { computed, nextTick, onMounted, ref } from 'vue'
import { activeRfiId, closeRfi, hasActionNeeded, openRfi, rfiRequests } from '../../composables/useRfi.js'
import RfiRequestList from '../rfi/RfiRequestList.vue'
import RfiChatView from '../rfi/RfiChatView.vue'
import { settingsOpen } from '../../composables/useSettingsPanel.js'

const tabs = ['Personal', 'Corporate', 'Shareholders', 'Additional information']
const activeTab = ref('Additional information')

const activeRequest = computed(() => rfiRequests.find((r) => r.id === activeRfiId.value) || null)
const actionNeeded = computed(() => hasActionNeeded())

const tabScroll = ref(null)

function selectTab(tab) {
  activeTab.value = tab
  closeRfi()
}

// On mobile the tab row scrolls horizontally — bring the active tab into view
// on load so it's the first thing visible (with the previous tab peeking).
function scrollActiveTabIntoView() {
  const container = tabScroll.value
  if (!container) return
  const active = container.querySelector('[aria-current="page"]')
  if (!active) return
  const cRect = container.getBoundingClientRect()
  const aRect = active.getBoundingClientRect()
  container.scrollLeft += aRect.left - cRect.left - 40
}

// Deep links land here with the settings sidebar closed — open it
onMounted(() => {
  settingsOpen.value = true
  nextTick(scrollActiveTabIntoView)
})
</script>

<style scoped>
.hide-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
.hide-scrollbar::-webkit-scrollbar {
  display: none;
}
</style>

