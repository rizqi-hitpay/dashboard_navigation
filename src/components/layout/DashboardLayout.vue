<template>
  <div class="flex h-screen bg-[#f8f9fc] overflow-hidden">
    <!-- Left nav rail: 81px -->
    <NavRail />

    <!-- Content area: 8px padding top/right/bottom, 4px gap between cards -->
    <div class="flex flex-1 overflow-hidden min-w-0" style="padding: 8px 8px 8px 0; gap: 4px;">

      <!-- Main card: sidebar + content -->
      <div class="flex flex-1 rounded-[8px] overflow-hidden min-w-0" style="box-shadow: 0px 3px 22px 0px rgba(37,41,49,0.08);">
        <!-- Persistent sidebar shell -->
        <div class="w-[220px] bg-[#fcfcfd] flex flex-col h-full shrink-0">
          <Transition :name="sidebarTransition" mode="out-in">
            <component :is="sidebarComponent" :key="sidebarKey" />
          </Transition>
          <SidebarAccountWidget />
        </div>

        <!-- Main content -->
        <main class="flex-1 bg-white overflow-hidden min-w-0" style="box-shadow: 0px 3px 22px 0px rgba(38,42,50,0.08), 0px 1px 1px 0px rgba(0,0,0,0.08);">
          <slot>
            <OverviewContent />
          </slot>
        </main>
      </div>

      <!-- Sidekick: own card, 4px gap handled by parent, slides in by width -->
      <div
        class="shrink-0 overflow-hidden rounded-[8px]"
        :class="agentPanelOpen ? 'border border-[#e5e6ea]' : ''"
        :style="{
          width: agentPanelOpen ? '360px' : '0px',
          transition: 'width 280ms cubic-bezier(0.4, 0, 0.2, 1)',
          boxShadow: agentPanelOpen ? '0px 3px 22px 0px rgba(37,41,49,0.08)' : 'none',
        }"
      >
        <AskAgentPanel @close="agentPanelOpen = false" />
      </div>

    </div>
  </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import NavRail from '../navigation/NavRail.vue'
import Sidebar from '../navigation/Sidebar.vue'
import CommerceSidebar from '../navigation/CommerceSidebar.vue'
import FinanceSidebar from '../navigation/FinanceSidebar.vue'
import SettingsSidebar from '../navigation/SettingsSidebar.vue'
import SidebarAccountWidget from '../navigation/SidebarAccountWidget.vue'
import { activeProduct } from '../../composables/useNav.js'
import { agentPanelOpen } from '../../composables/useAgentPanel.js'
import { settingsOpen } from '../../composables/useSettingsPanel.js'
import OverviewContent from '../content/OverviewContent.vue'
import AskAgentPanel from '../content/AskAgentPanel.vue'

// Direction-aware sidebar transition
// Forward (drill into settings): enter from right, leave to left
// Backward (back from settings): enter from left, leave to right  (uses existing 'sidebar')
const sidebarTransition = ref('sidebar')

watch(settingsOpen, (open) => {
  sidebarTransition.value = open ? 'settings' : 'sidebar'
})

// Reset settings when switching products
watch(activeProduct, () => {
  settingsOpen.value = false
})

const sidebarComponent = computed(() => {
  if (settingsOpen.value) return SettingsSidebar
  if (activeProduct.value === 1) return CommerceSidebar
  if (activeProduct.value === 2) return FinanceSidebar
  return Sidebar
})

const sidebarKey = computed(() => {
  if (settingsOpen.value) return 'settings'
  return activeProduct.value
})
</script>

<style scoped>
/* Enter: slide in from left + fade — ease-out for instant responsiveness feel */
.sidebar-enter-active {
  transition: opacity 180ms ease-out, transform 180ms ease-out;
  will-change: opacity, transform;
}
/* Leave: slide right + fade out — ease for subtle, natural exit */
.sidebar-leave-active {
  transition: opacity 130ms ease, transform 130ms ease;
  will-change: opacity, transform;
}

.sidebar-enter-from {
  opacity: 0;
  transform: translateX(-14px);
}
.sidebar-leave-to {
  opacity: 0;
  transform: translateX(14px);
}

/* Settings drill-down: enter from right, leave to left */
.settings-enter-active {
  transition: opacity 180ms ease-out, transform 180ms ease-out;
  will-change: opacity, transform;
}
.settings-leave-active {
  transition: opacity 130ms ease, transform 130ms ease;
  will-change: opacity, transform;
}
.settings-enter-from {
  opacity: 0;
  transform: translateX(14px);
}
.settings-leave-to {
  opacity: 0;
  transform: translateX(-14px);
}
</style>
