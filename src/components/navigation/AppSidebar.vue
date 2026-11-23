<template>
  <div class="flex flex-col h-full w-full bg-[#fcfcfd] overflow-hidden">
    <!-- Sidebar v4 — one sidebar for every product (Figma 6416:16678) -->

    <!-- Settings title (Figma 6421:57278): replaces the logo + product switcher -->
    <div
      v-if="settingsOpen"
      class="shrink-0 flex items-center gap-2 p-2 border-b border-[#f2f2f4]"
    >
      <button
        type="button"
        class="flex items-center justify-center shrink-0 size-4 rounded-[4px] hover:bg-[rgba(0,39,113,0.04)] transition-colors duration-150"
        aria-label="Back"
        @click="settingsOpen = false"
      >
        <img :src="chevronLeft" alt="" width="16" height="16" class="block size-4" />
      </button>
      <span class="flex-1 min-w-0 flex items-center h-8 text-[13px] font-medium leading-[1.5] text-[#03102f]">Settings</span>
    </div>

    <!-- Title: logo + product switcher -->
    <div v-else class="shrink-0 flex flex-col gap-4 pt-4 pb-2 px-2 border-b border-[#f2f2f4]">
      <div class="flex flex-col items-start px-2">
        <div class="flex items-end gap-[5.907px]">
          <img :src="logogram" alt="" width="18.023" height="18" class="block w-[18.023px] h-[18px]" />
          <img :src="logotext" alt="HitPay" width="49.957" height="15.299" class="block w-[49.957px] h-[15.299px]" />
        </div>
      </div>

      <div class="flex flex-col gap-0.5">
        <div
          v-for="item in productItems"
          :key="item.label"
          class="product-row flex items-center gap-2 px-2 py-1 rounded-lg cursor-pointer transition-colors duration-150"
          :class="item.active ? (item.aiIcon ? 'product-row--toggled' : 'product-row--active') : ''"
          @click="item.onClick"
        >
          <!-- AI Assistant: two-layer icon (chat-bubble + ai-sparkle) -->
          <span v-if="item.aiIcon" class="relative shrink-0 size-[14px] overflow-hidden">
            <span class="absolute" style="inset: 14.09% 14.09% 13.18% 14.09%">
              <span class="absolute" style="inset: -4.3% -4.35%"><img :src="item.active ? chatBubbleActive : chatBubble" alt="" class="block max-w-none size-full" /></span>
            </span>
            <span class="absolute" style="inset: 28.64% 31.82% 35% 31.82%">
              <span class="absolute" style="inset: -8.59%"><img :src="item.active ? aiSparkleActive : aiSparkle" alt="" class="block max-w-none size-full" /></span>
            </span>
          </span>
          <!-- Figma-supplied assets (exact) -->
          <img
            v-else-if="item.active ? item.iconActive : item.icon"
            :src="item.active ? item.iconActive : item.icon"
            alt=""
            width="14"
            height="14"
            class="shrink-0 size-[14px]"
          />
          <!-- Missing state variant: existing currentColor icon, coloured inline -->
          <span
            v-else
            class="product-row__svg shrink-0 size-[14px]"
            :style="{ color: item.active ? '#2465de' : '#61667c' }"
            v-html="item.active ? item.svgActive : item.svg"
          />
          <span
            class="flex-1 min-w-0 truncate text-[12px] leading-[1.5] transition-colors duration-150"
            :class="item.active ? 'text-[#03102f]' : 'text-[#61667c] product-row__label'"
          >{{ item.label }}</span>
        </div>
      </div>
    </div>

    <!-- Main Menu: product menu (grey/75 fill), or the Settings drill-down (no fill) -->
    <div
      class="flex-1 min-h-0 overflow-y-auto overflow-x-hidden p-2 transition-colors duration-150"
      :class="settingsOpen ? 'bg-[#fcfcfd]' : 'bg-[#f6f6f9]'"
    >
      <Transition :name="transitionName" mode="out-in">
        <component :is="menuComponent" :key="menuKey" />
      </Transition>
    </div>

    <SidebarAccountWidget />
  </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import Sidebar from './Sidebar.vue'
import CommerceSidebar from './CommerceSidebar.vue'
import FinanceSidebar from './FinanceSidebar.vue'
import SettingsSidebar from './SettingsSidebar.vue'
import LabsSidebar from './LabsSidebar.vue'
import SidebarAccountWidget from './SidebarAccountWidget.vue'
import { activeProduct } from '../../composables/useNav.js'
import { agentPanelOpen } from '../../composables/useAgentPanel.js'
import { settingsOpen } from '../../composables/useSettingsPanel.js'
import { labsFewApps } from '../../composables/useLabsPreview.js'

import logogram from '../../assets/icons/sidebar-v4/logogram.svg'
import logotext from '../../assets/icons/sidebar-v4/logotext.svg'
import chevronLeft from '../../assets/icons/sidebar-v4/chevron-left.svg'
import moneyBulk from '../../assets/icons/sidebar-v4/money-bulk.svg'
import bag2 from '../../assets/icons/sidebar-v4/bag-2.svg'
import note2 from '../../assets/icons/sidebar-v4/note-2.svg'
import chatBubble from '../../assets/icons/sidebar-v4/chat-bubble.svg'
import aiSparkle from '../../assets/icons/sidebar-v4/ai-sparkle.svg'
import chatBubbleActive from '../../assets/icons/sidebar-v4/chat-bubble-active.svg'
import aiSparkleActive from '../../assets/icons/sidebar-v4/ai-sparkle-active.svg'
// Figma only shows Payments active and Commerce/Finance inactive; the other
// states reuse the project's vuesax icons (same glyphs, currentColor)
import moneyLineSvg from '../../assets/icons/icon-money-line.svg?raw'
import bag2BulkSvg from '../../assets/icons/icon-bag-2-bulk.svg?raw'
import note2BulkSvg from '../../assets/icons/icon-note-2-bulk.svg?raw'

function selectProduct(i) {
  settingsOpen.value = false
  activeProduct.value = i
}

const productItems = computed(() => [
  { label: 'Payments', active: activeProduct.value === 0, iconActive: moneyBulk, svg: moneyLineSvg, onClick: () => selectProduct(0) },
  { label: 'Commerce', active: activeProduct.value === 1, icon: bag2, svgActive: bag2BulkSvg, onClick: () => selectProduct(1) },
  { label: 'Finance', active: activeProduct.value === 2, icon: note2, svgActive: note2BulkSvg, onClick: () => selectProduct(2) },
  { label: 'AI Assistant', active: agentPanelOpen.value, aiIcon: true, onClick: () => { agentPanelOpen.value = !agentPanelOpen.value } },
])

// Labs lives under Payments and swaps the menu by route (like a drill-down).
// With only 2 apps in the catalog the Payments menu stays put (Figma: 1:17127)
const route = useRoute()
const onLabsRoute = computed(
  () => route.path.startsWith('/labs') && activeProduct.value === 0 && !labsFewApps.value,
)

const menuComponent = computed(() => {
  if (settingsOpen.value) return SettingsSidebar
  if (activeProduct.value === 1) return CommerceSidebar
  if (activeProduct.value === 2) return FinanceSidebar
  if (onLabsRoute.value) return LabsSidebar
  return Sidebar
})

const menuKey = computed(() => {
  if (settingsOpen.value) return 'settings'
  if (onLabsRoute.value) return 'labs'
  return activeProduct.value
})

// Direction-aware: Settings drills in from the right, products slide from the left
const transitionName = ref('sidebar')
watch(settingsOpen, (open) => { transitionName.value = open ? 'settings' : 'sidebar' })
</script>

<style scoped>
/* Product rows — Default / Hover (dark-blue/50tr) / Active (white card) */
.product-row:hover {
  background: rgba(0, 39, 113, 0.04);
}
.product-row:hover .product-row__label {
  color: #03102f;
}
.product-row--active,
.product-row--active:hover {
  background: #ffffff;
  box-shadow: inset 0 0 0 1px #f2f2f4, 0px 1px 5px 0px rgba(0, 0, 0, 0.06), 0px 1.5px 0.75px 0px rgba(0, 0, 0, 0.04);
}
/* AI Assistant open (Figma 6421:44754): no card — duotone blue icon + text/500 only.
   It's a panel toggle, not a product, so it keeps the plain row (hover fill still applies) */
.product-row--toggled {
  background: transparent;
}
.product-row--toggled:hover {
  background: rgba(0, 39, 113, 0.04);
}
.product-row__svg :deep(svg) {
  display: block;
  width: 14px;
  height: 14px;
}

/* Product switch: slide in from left + fade */
.sidebar-enter-active { transition: opacity 180ms ease-out, transform 180ms ease-out; }
.sidebar-leave-active { transition: opacity 130ms ease, transform 130ms ease; }
.sidebar-enter-from { opacity: 0; transform: translateX(-14px); }
.sidebar-leave-to   { opacity: 0; transform: translateX(14px); }

/* Settings drill-down: enter from right, leave to left */
.settings-enter-active { transition: opacity 180ms ease-out, transform 180ms ease-out; }
.settings-leave-active { transition: opacity 130ms ease, transform 130ms ease; }
.settings-enter-from { opacity: 0; transform: translateX(14px); }
.settings-leave-to   { opacity: 0; transform: translateX(-14px); }
</style>
