<template>
  <div class="w-[81px] hidden md:flex flex-col h-full bg-[#f8f9fc] shrink-0 py-2">
    <!-- Logo -->
    <div class="relative flex justify-center items-center h-[56px] px-2">
      <img :src="logoIcon" alt="HitPay" class="w-8 h-8" />
    </div>

    <!-- Product nav items -->
    <div class="flex flex-col flex-1">
      <NavRailItem
        v-for="(item, i) in productItems"
        :key="item.label"
        :icon="item.icon"
        :icon-active="item.iconActive"
        :label="item.label"
        :active="activeProduct === i"
        :icon-size="22"
        @click="activeProduct = i"
      />
    </div>

    <!-- Bottom utility items -->
    <div class="flex flex-col">
      <!-- AI Assistant — hidden until the Overview chat dock is closed and
           streams in as particles. Kept in layout (the group is bottom-anchored,
           so nothing shifts) so the stream has a target to fly to. -->
      <div
        ref="aiItemEl"
        class="rail-ai"
        :class="{ 'rail-ai--shown': aiAssistantRevealed, 'rail-ai--landing': landing }"
        :aria-hidden="!aiAssistantRevealed"
      >
        <NavRailItem
          :icon="aiChatIcon"
          :icon-active="aiChatBulkIcon"
          label="AI Assistant"
          :active="agentPanelOpen || landing"
          :icon-size="18"
          @click="agentPanelOpen = !agentPanelOpen"
        />
      </div>
      <NavRailItem
        v-for="(item, i) in bottomItems"
        :key="item.label"
        :icon="item.icon"
        :icon-active="item.iconActive"
        :label="item.label"
        :active="activeBottom === i"
        :icon-size="18"
        @click="activeBottom = activeBottom === i ? null : i"
      />
    </div>
  </div>
</template>

<script setup>
import NavRailItem from './NavRailItem.vue'
import { activeProduct } from '../../composables/useNav.js'

import logoIcon from '../../assets/icons/logo-hitpay.svg'
import moneyLineIcon from '../../assets/icons/icon-money-line.svg'
import moneyBulkIcon from '../../assets/icons/icon-money.svg'
import bag2LineIcon from '../../assets/icons/icon-bag-2.svg'
import bag2BulkIcon from '../../assets/icons/icon-bag-2-bulk.svg'
import note2LineIcon from '../../assets/icons/icon-note-2.svg'
import note2BulkIcon from '../../assets/icons/icon-note-2-bulk.svg'
import cube3dLineIcon from '../../assets/icons/icon-3dcube.svg'
import cube3dBulkIcon from '../../assets/icons/icon-3dcube-bulk.svg'
import aiChatIcon from '../../assets/icons/icon-ai-chat.svg'
import aiChatBulkIcon from '../../assets/icons/icon-ai-chat-bulk.svg'
import giftIcon from '../../assets/icons/icon-gift.svg'

import { ref, watch, onMounted, onBeforeUnmount } from 'vue'
import { agentPanelOpen, aiAssistantRevealed, aiAssistantRailEl } from '../../composables/useAgentPanel.js'

const activeBottom = ref(null)

// Register the AI item as the particle stream's landing target
const aiItemEl = ref(null)
onMounted(() => { aiAssistantRailEl.value = aiItemEl.value })
onBeforeUnmount(() => { if (aiAssistantRailEl.value === aiItemEl.value) aiAssistantRailEl.value = null })

// Landing: pops in lit (active blue) with a glow, then settles to idle
const landing = ref(false)
let landingTimer = null
watch(aiAssistantRevealed, (shown) => {
  if (!shown) return
  landing.value = true
  clearTimeout(landingTimer)
  landingTimer = setTimeout(() => { landing.value = false }, 1400)
})
onBeforeUnmount(() => clearTimeout(landingTimer))

const productItems = [
  { icon: moneyLineIcon, iconActive: moneyBulkIcon, label: 'Payments' },
  { icon: bag2LineIcon, iconActive: bag2BulkIcon, label: 'Commerce' },
  { icon: note2LineIcon, iconActive: note2BulkIcon, label: 'Finance' },
  { icon: cube3dLineIcon, iconActive: cube3dBulkIcon, label: 'Studio' },
]

const bottomItems = [
  { icon: giftIcon, label: 'Refer' },
]
</script>

<style scoped>
.rail-ai {
  position: relative;
  opacity: 0;
  visibility: hidden;
  pointer-events: none;
}
.rail-ai--shown { opacity: 1; visibility: visible; pointer-events: auto; }

/* Particles converge → item condenses out of a blur with a small overshoot
   (back-out, motion guide "important moments") */
.rail-ai--landing { animation: rail-ai-land 560ms cubic-bezier(0.34, 1.3, 0.64, 1) both; }
@keyframes rail-ai-land {
  from { opacity: 0; transform: scale(0.6); filter: blur(6px); }
  to   { opacity: 1; transform: scale(1);   filter: blur(0); }
}

/* Soft brand-gradient halo that blooms once behind the icon */
.rail-ai--landing::before {
  content: '';
  position: absolute;
  left: 50%;
  top: 21px;
  width: 44px;
  height: 44px;
  margin: -22px 0 0 -22px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(152, 170, 249, 0.7), rgba(144, 242, 250, 0.35) 45%, transparent 70%);
  filter: blur(4px);
  pointer-events: none;
  animation: rail-ai-halo 1100ms ease-out both;
}
@keyframes rail-ai-halo {
  0%   { opacity: 0; transform: scale(0.4); }
  30%  { opacity: 1; transform: scale(1.1); }
  100% { opacity: 0; transform: scale(1.6); }
}

@media (prefers-reduced-motion: reduce) {
  .rail-ai--landing, .rail-ai--landing::before { animation: none; }
}
</style>
