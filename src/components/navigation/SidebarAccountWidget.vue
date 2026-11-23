<template>
  <div class="relative shrink-0 flex items-center h-[48px] pl-2 bg-[#fcfcfd] border-t border-[#f2f2f4]">
    <!-- Sidebar v4 "Location + Account" footer (Figma 6416:22581) -->
    <!-- Business switcher -->
    <div
      ref="triggerRef"
      class="flex flex-1 min-w-0 items-center pr-2 h-full cursor-pointer"
      @click="open = !open"
    >
      <div class="flex flex-1 min-w-0 flex-col justify-center whitespace-nowrap">
        <span class="text-[12px] leading-[1.5] text-[#03102f] truncate">My Cat Shop</span>
        <span class="text-[10px] font-medium leading-[18px] tracking-[0.3px] uppercase text-[#61667c] truncate">Cherry Test QA</span>
      </div>
      <img
        :src="arrowUpDownIcon"
        alt="Switch business"
        width="16"
        height="16"
        class="shrink-0 size-4 transition-transform duration-200"
        :style="{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)' }"
      />
    </div>

    <!-- Utility buttons: Settings / Refer -->
    <button
      v-for="btn in buttons"
      :key="btn.label"
      type="button"
      class="footer-btn relative flex items-center justify-center w-10 h-full shrink-0 border-l border-[#f2f2f4] transition-colors duration-150"
      :aria-label="btn.label"
      @click="btn.onClick"
      @mouseenter="hovered = btn.label"
      @mouseleave="hovered = null"
    >
      <img :src="btn.icon" alt="" width="16" height="16" class="size-4" />

      <!-- Tooltip/Dark (Figma 6421:38687) -->
      <Transition name="footer-tip">
        <div
          v-if="hovered === btn.label"
          class="footer-tip absolute bottom-[calc(100%+6px)] flex items-center justify-center px-2 py-1 rounded-[4px] pointer-events-none z-10"
          :class="btn.alignEnd ? 'footer-tip--end right-1' : 'footer-tip--center left-1/2 -translate-x-1/2'"
        >
          <span class="text-[12px] font-medium leading-[1.5] text-[#cbcdd4] whitespace-nowrap">{{ btn.label }}</span>
          <!-- Arrow points at the button centre (button is 40px wide) -->
          <span
            class="absolute bottom-[-6px] flex items-center justify-center w-[12px] h-[8px]"
            :class="btn.alignEnd ? 'right-[10px]' : 'left-1/2 -translate-x-1/2'"
          >
            <span class="relative block w-[12px] h-[8px] rotate-180">
              <img :src="tooltipArrowIcon" alt="" class="absolute top-[8.33%] left-0 right-0 bottom-0 block max-w-none w-full h-[91.67%]" />
            </span>
          </span>
        </div>
      </Transition>
    </button>

    <!-- Popup menu -->
    <AccountMenu v-model="open" :anchor="triggerRef" />
  </div>
</template>

<script setup>
import { ref, useTemplateRef } from 'vue'
import { useRouter } from 'vue-router'
import AccountMenu from './AccountMenu.vue'
import { settingsOpen } from '../../composables/useSettingsPanel.js'
import arrowUpDownIcon from '../../assets/icons/sidebar-v4/arrow-up-down.svg'
import settingIcon from '../../assets/icons/sidebar-v4/setting.svg'
import giftIcon from '../../assets/icons/sidebar-v4/gift-footer.svg'
import tooltipArrowIcon from '../../assets/icons/sidebar-v4/tooltip-arrow.svg'

const router = useRouter()
const open = ref(false)
const hovered = ref(null)
const triggerRef = useTemplateRef('triggerRef')

const buttons = [
  {
    label: 'Settings',
    icon: settingIcon,
    onClick: () => { settingsOpen.value = !settingsOpen.value },
  },
  {
    label: 'Refer and earn',
    icon: giftIcon,
    alignEnd: true, // last button sits at the sidebar edge — keep the tooltip inside
    onClick: () => router.push('/refer-and-earn'),
  },
]
</script>

<style scoped>
/* Default → Hover: dark-blue/50tr fill */
.footer-btn:hover {
  background: rgba(0, 39, 113, 0.04);
}
/* Tooltip/Dark: grey/800 fill + Shadow/Tooltip */
.footer-tip {
  background: #343848;
  box-shadow: 0px 1px 3px 0px rgba(0, 0, 0, 0.1), 0px 3px 22px 0px rgba(38, 42, 50, 0.09);
}
.footer-tip-enter-active { transition: opacity 140ms ease-out, transform 140ms ease-out; }
.footer-tip-leave-active { transition: opacity 100ms ease-in; }
.footer-tip--center.footer-tip-enter-from { opacity: 0; transform: translate(-50%, 4px); }
.footer-tip--end.footer-tip-enter-from { opacity: 0; transform: translateY(4px); }
.footer-tip-leave-to { opacity: 0; }
</style>
