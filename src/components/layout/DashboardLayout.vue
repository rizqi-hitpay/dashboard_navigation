<template>
  <div class="flex h-screen bg-[#f8f9fc] overflow-hidden">
    <!-- Left nav rail: 81px -->
    <NavRail />

    <!-- Content area: full-bleed on mobile; 8px padding top/right/bottom + 4px card gap on desktop -->
    <div class="flex flex-1 overflow-hidden min-w-0 gap-0 md:gap-[4px] p-0 md:py-[8px] md:pr-[8px]">

      <!-- Main card: full-screen on mobile (no rounding/border/shadow), floating card on desktop -->
      <div class="flex flex-col md:flex-row flex-1 overflow-hidden min-w-0 relative md:rounded-[8px] border-0 md:border md:border-[#E5E6EA] md:shadow-[0px_3px_22px_0px_rgba(37,41,49,0.08)]">

        <!-- Mobile-only top bar: hamburger opens the nav drawer below -->
        <MobileTopBar class="flex md:hidden" @menu="mobileNavOpen = true" />

        <!-- Finance requires the shared passcode -->
        <FinanceGate v-if="financeLocked" />

        <template v-else>
          <!-- Persistent sidebar shell: desktop only, mobile uses the drawer -->
          <div
            class="bg-[#fcfcfd] hidden md:flex flex-col h-full shrink-0 overflow-hidden"
            :style="{
              width: sidebarCollapsed ? '56px' : '220px',
              transition: 'width 250ms cubic-bezier(0.4, 0, 0.2, 1)',
            }"
          >
            <Transition :name="sidebarTransition" mode="out-in">
              <component :is="sidebarComponent" :key="sidebarKey" />
            </Transition>
            <SidebarAccountWidget />
          </div>

          <!-- Main content -->
          <main class="flex-1 bg-white overflow-hidden min-w-0 min-h-0" style="box-shadow: 0px 3px 22px 0px rgba(38,42,50,0.08), 0px 1px 1px 0px rgba(0,0,0,0.08);">
            <router-view />
          </main>
        </template>
      </div>

      <!-- Mobile nav drawer: reuses the current sidebar (product nav / settings) -->
      <Teleport to="body">
        <Transition name="mobile-drawer-backdrop">
          <div
            v-if="mobileNavOpen"
            class="fixed inset-0 bg-black/30 z-40 md:hidden"
            @click="mobileNavOpen = false"
          />
        </Transition>
        <Transition name="mobile-drawer-panel">
          <div
            v-if="mobileNavOpen"
            class="fixed left-0 top-0 h-full w-[240px] z-50 bg-[#fcfcfd] flex flex-col md:hidden"
            style="box-shadow: 4px 0px 24px 0px rgba(3,16,47,0.12);"
          >
            <component :is="sidebarComponent" :key="sidebarKey" />
            <SidebarAccountWidget />
          </div>
        </Transition>
      </Teleport>

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

  <!-- Intro modal -->
  <VideoIntroModal v-model="introModalOpen" />
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import NavRail from '../navigation/NavRail.vue'
import MobileTopBar from '../navigation/MobileTopBar.vue'
import VideoIntroModal from '../modals/VideoIntroModal.vue'
import { introModalOpen } from '../../composables/useIntroModal.js'
import Sidebar from '../navigation/Sidebar.vue'
import CommerceSidebar from '../navigation/CommerceSidebar.vue'
import FinanceSidebar from '../navigation/FinanceSidebar.vue'
import SettingsSidebar from '../navigation/SettingsSidebar.vue'
import SidebarAccountWidget from '../navigation/SidebarAccountWidget.vue'
import { activeProduct } from '../../composables/useNav.js'
import { agentPanelOpen } from '../../composables/useAgentPanel.js'
import { sidebarCollapsed } from '../../composables/useSidebarCollapsed.js'
import { settingsOpen } from '../../composables/useSettingsPanel.js'
import AskAgentPanel from '../content/AskAgentPanel.vue'
import FinanceGate from './FinanceGate.vue'
import { financeUnlocked } from '../../composables/useFinanceAuth.js'

// Finance (product 2) is gated behind the shared passcode
const financeLocked = computed(() => activeProduct.value === 2 && !financeUnlocked.value)

// Mobile nav drawer (hamburger in MobileTopBar) — auto-closes on navigation
const mobileNavOpen = ref(false)
const route = useRoute()
watch(() => route.fullPath, () => { mobileNavOpen.value = false })

// Direction-aware sidebar transition
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
.sidebar-leave-active {
  transition: opacity 130ms ease, transform 130ms ease;
  will-change: opacity, transform;
}
.sidebar-enter-from { opacity: 0; transform: translateX(-14px); }
.sidebar-leave-to   { opacity: 0; transform: translateX(14px); }

/* Settings drill-down: enter from right, leave to left */
.settings-enter-active {
  transition: opacity 180ms ease-out, transform 180ms ease-out;
  will-change: opacity, transform;
}
.settings-leave-active {
  transition: opacity 130ms ease, transform 130ms ease;
  will-change: opacity, transform;
}
.settings-enter-from { opacity: 0; transform: translateX(14px); }
.settings-leave-to   { opacity: 0; transform: translateX(-14px); }

/* Mobile nav drawer */
.mobile-drawer-backdrop-enter-active,
.mobile-drawer-backdrop-leave-active {
  transition: opacity 200ms ease;
}
.mobile-drawer-backdrop-enter-from,
.mobile-drawer-backdrop-leave-to {
  opacity: 0;
}
.mobile-drawer-panel-enter-active {
  transition: transform 220ms cubic-bezier(0.4, 0, 0.2, 1);
}
.mobile-drawer-panel-leave-active {
  transition: transform 180ms ease-in;
}
.mobile-drawer-panel-enter-from,
.mobile-drawer-panel-leave-to {
  transform: translateX(-100%);
}
</style>
