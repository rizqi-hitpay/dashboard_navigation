<template>
  <div class="flex flex-col h-screen bg-[#f8f9fc] overflow-hidden">
  <!-- Claims prototype: Employee ↔ Admin switcher spans the top of the window -->
  <ClaimsRoleBar v-if="showClaimsRoleBar" />

  <div class="flex flex-1 min-h-0 overflow-hidden">
    <!-- Sidebar v4: one 220px sidebar for every product (Figma 6416:16678).
         Desktop only, mobile uses the drawer. Studio has no sidebar (Figma: 20:8569) -->
    <div
      v-if="activeProduct !== 3"
      class="hidden md:flex w-[220px] h-full shrink-0"
    >
      <AppSidebar />
    </div>

    <!-- Content area: sits flush against the sidebar, full height -->
    <div class="relative z-[1] flex flex-1 overflow-hidden min-w-0">

      <!-- Content container (Figma 6416:17038): white, square, 1px grey/150 stroke,
           shadow cast left over the sidebar. Full-screen with no chrome on mobile -->
      <div class="content-container flex flex-col md:flex-row flex-1 overflow-hidden min-w-0 relative bg-white">

        <!-- Mobile-only top bar: hamburger opens the nav drawer below -->
        <MobileTopBar class="flex md:hidden" @menu="mobileNavOpen = true" />

        <!-- Finance requires the shared passcode -->
        <FinanceGate v-if="financeLocked" />

        <!-- Main content -->
        <main v-else class="flex-1 bg-white overflow-hidden min-w-0 min-h-0">
          <router-view />
        </main>
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
            <AppSidebar />
          </div>
        </Transition>
      </Teleport>

      <!-- Sidekick: docks flush to the right of the content container, slides in by width -->
      <div
        class="shrink-0 overflow-hidden bg-white"
        :class="agentPanelOpen ? 'border-l border-[#e5e6ea]' : ''"
        :style="{
          width: agentPanelOpen ? '360px' : '0px',
          transition: 'width 280ms cubic-bezier(0.4, 0, 0.2, 1)',
        }"
      >
        <AskAgentPanel @close="agentPanelOpen = false" />
      </div>

    </div>
  </div>
  </div>

  <!-- Intro modal -->
  <VideoIntroModal v-model="introModalOpen" />
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import AppSidebar from '../navigation/AppSidebar.vue'
import MobileTopBar from '../navigation/MobileTopBar.vue'
import VideoIntroModal from '../modals/VideoIntroModal.vue'
import { introModalOpen } from '../../composables/useIntroModal.js'
import { activeProduct } from '../../composables/useNav.js'
import { agentPanelOpen } from '../../composables/useAgentPanel.js'
import { settingsOpen } from '../../composables/useSettingsPanel.js'
import AskAgentPanel from '../content/AskAgentPanel.vue'
import FinanceGate from './FinanceGate.vue'
import { financeUnlocked } from '../../composables/useFinanceAuth.js'
import { financePreview } from '../../composables/useFinancePreview.js'
import ClaimsRoleBar from './ClaimsRoleBar.vue'

// Finance (product 2) is gated behind the shared passcode — skipped for now in
// the /finance preview so finance users land straight in
const financeLocked = computed(
  () => activeProduct.value === 2 && !financeUnlocked.value && !financePreview.value,
)

// Mobile nav drawer (hamburger in MobileTopBar) — auto-closes on navigation
const mobileNavOpen = ref(false)
const route = useRoute()
const router = useRouter()
watch(() => route.fullPath, () => { mobileNavOpen.value = false })

// Employee/Admin switcher only matters on the Claims pages
const showClaimsRoleBar = computed(() => route.path.startsWith('/claims') && !financeLocked.value)

// Reset settings when switching products. Studio has no sidebar, so entering
// it routes to its page and leaving it returns to Overview.
watch(activeProduct, (product, prev) => {
  settingsOpen.value = false
  if (product === 3 && !route.path.startsWith('/studio')) router.push('/studio')
  if (prev === 3 && product !== 3 && route.path.startsWith('/studio')) router.push('/')
})
</script>

<style scoped>
/* Content container — desktop chrome only */
@media (min-width: 768px) {
  .content-container {
    border: 1px solid #e5e6ea;
    box-shadow: 0px 3px 22px 0px rgba(38, 42, 50, 0.08), 0px 1px 1px 0px rgba(0, 0, 0, 0.08);
  }
}

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
