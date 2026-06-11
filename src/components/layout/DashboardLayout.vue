<template>
  <div class="flex h-screen bg-[#f8f9fc] overflow-hidden">
    <!-- Left nav rail: 81px -->
    <NavRail />

    <!-- Content area: 8px padding top/right/bottom -->
    <div class="flex flex-1 overflow-hidden min-w-0" style="padding: 8px 8px 8px 0;">

      <!-- Main card: sidebar + content -->
      <div class="flex flex-1 rounded-[8px] overflow-hidden min-w-0 border border-[#E5E6EA] relative" style="box-shadow: 0px 3px 22px 0px rgba(37,41,49,0.08);">

        <!-- Persistent sidebar shell -->
        <div
          class="bg-[#fcfcfd] flex flex-col h-full shrink-0 overflow-hidden"
          :style="{
            width: sidebarCollapsed ? '56px' : '220px',
            transition: 'width 250ms cubic-bezier(0.4, 0, 0.2, 1)',
          }"
          @mouseenter="onSidebarEnter"
          @mouseleave="onSidebarLeave"
        >
          <Transition :name="sidebarTransition" mode="out-in">
            <component :is="sidebarComponent" :key="sidebarKey" />
          </Transition>
          <SidebarAccountWidget />
        </div>

        <!-- Hover-expanded overlay (absolute, floats over content when collapsed) -->
        <Transition name="sidebar-hover">
          <div
            v-if="sidebarCollapsed && (sidebarHovered || sidebarPinned)"
            class="absolute top-0 left-0 h-full w-[220px] bg-white z-30 flex flex-col"
            style="box-shadow: 4px 0 16px 0 rgba(37,41,49,0.12); border-right: 1px solid #e5e6ea;"
            @mouseenter="onSidebarEnter"
            @mouseleave="onSidebarLeave"
          >
            <Transition :name="sidebarTransition" mode="out-in">
              <component :is="sidebarComponent" :key="'hover-' + sidebarKey" />
            </Transition>
            <SidebarAccountWidget />
          </div>
        </Transition>

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

  <!-- Intro modal -->
  <VideoIntroModal v-model="introModalOpen" />

  <!-- New-user setup overlay + docked setup guide -->
  <NewUserOverlay v-if="isNewUser" />

  <!-- Account Verification full page -->
  <Teleport to="body">
    <Transition name="full-page">
      <AccountVerificationPage v-if="verificationPageOpen" @close="verificationPageOpen = false" />
    </Transition>
  </Teleport>

  <!-- Add Bank Account full page -->
  <Teleport to="body">
    <Transition name="full-page">
      <AddBankAccountPage v-if="bankAccountPageOpen" @close="bankAccountPageOpen = false" />
    </Transition>
  </Teleport>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import NavRail from '../navigation/NavRail.vue'
import VideoIntroModal from '../modals/VideoIntroModal.vue'
import { introModalOpen } from '../../composables/useIntroModal.js'
import Sidebar from '../navigation/Sidebar.vue'
import CommerceSidebar from '../navigation/CommerceSidebar.vue'
import FinanceSidebar from '../navigation/FinanceSidebar.vue'
import SettingsSidebar from '../navigation/SettingsSidebar.vue'
import SidebarAccountWidget from '../navigation/SidebarAccountWidget.vue'
import { activeProduct } from '../../composables/useNav.js'
import { agentPanelOpen } from '../../composables/useAgentPanel.js'
import { sidebarCollapsed, sidebarHovered, sidebarPinned } from '../../composables/useSidebarCollapsed.js'
import { settingsOpen } from '../../composables/useSettingsPanel.js'
import OverviewContent from '../content/OverviewContent.vue'
import AskAgentPanel from '../content/AskAgentPanel.vue'
import NewUserOverlay from '../onboarding/NewUserOverlay.vue'
import AccountVerificationPage from '../onboarding/AccountVerificationPage.vue'
import AddBankAccountPage from '../onboarding/AddBankAccountPage.vue'
import { useNewUser } from '../../composables/useNewUser.js'

const { isNewUser, verificationPageOpen, bankAccountPageOpen } = useNewUser()

// Debounced hover to prevent flicker when mouse moves between collapsed strip and overlay
let hoverTimer = null
function onSidebarEnter() {
  if (!sidebarCollapsed.value) return
  clearTimeout(hoverTimer)
  sidebarHovered.value = true
}
function onSidebarLeave() {
  hoverTimer = setTimeout(() => {
    if (!sidebarPinned.value) sidebarHovered.value = false
  }, 80)
}

// Direction-aware sidebar transition
const sidebarTransition = ref('sidebar')
watch(settingsOpen, (open) => {
  sidebarTransition.value = open ? 'settings' : 'sidebar'
})

// Reset settings when switching products
watch(activeProduct, () => {
  settingsOpen.value = false
})

// Hide overlay when sidebar is expanded (clicked to expand)
watch(sidebarCollapsed, (collapsed) => {
  if (!collapsed) sidebarHovered.value = false
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

/* Hover overlay: fade only — avoids competing with content render */
.sidebar-hover-enter-active { transition: opacity 160ms ease-out; }
.sidebar-hover-leave-active { transition: opacity 120ms ease; }
.sidebar-hover-enter-from,
.sidebar-hover-leave-to { opacity: 0; }

/* Full-page takeovers (Account Verification, Add Bank Account): rise in as
   one surface (ease-out), drop away faster on exit — transform + opacity only */
.full-page-enter-active {
  transition: opacity 400ms cubic-bezier(0.32, 0.72, 0, 1), transform 400ms cubic-bezier(0.32, 0.72, 0, 1);
  will-change: opacity, transform;
}
.full-page-leave-active {
  transition: opacity 220ms ease, transform 220ms ease;
  will-change: opacity, transform;
}
.full-page-enter-from { opacity: 0; transform: translateY(24px); }
.full-page-leave-to   { opacity: 0; transform: translateY(12px); }

@media (prefers-reduced-motion: reduce) {
  .full-page-enter-active,
  .full-page-leave-active { transition: none; }
}
</style>
