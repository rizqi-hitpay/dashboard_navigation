<template>
  <div class="relative" style="min-width: 0;">
  <div class="relative bg-white rounded-[8px] flex flex-col" style="border: 1px solid #e5e6ea; z-index: 2;">
    <!-- Top: label + info icon + trend badge -->
    <div class="flex items-center gap-2 shrink-0" style="padding: 8px 12px; min-height: 42px; border-bottom: 1px solid #e5e6ea;">
      <span class="flex-1 text-[14px] font-normal text-[#03102f] leading-none truncate">{{ label }}</span>

      <!-- Info icon (optional) -->
      <button v-if="showInfo" class="shrink-0 w-4 h-4 flex items-center justify-center opacity-60 hover:opacity-100 transition-opacity">
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="7" cy="7" r="6" stroke="#61667c" stroke-width="1.2"/>
          <path d="M7 6v4M7 4.5v.5" stroke="#61667c" stroke-width="1.2" stroke-linecap="round"/>
        </svg>
      </button>

      <!-- UpDown trend badge -->
      <div
        class="shrink-0 flex items-center gap-0.5 rounded-[4px]"
        style="padding: 4px 8px; border: 1px solid #e5e6ea; height: 26px;"
      >
        <!-- Triangle icon: up=green, down=red -->
        <svg width="10" height="9" viewBox="0 0 10 9" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            v-if="direction === 'up'"
            d="M5 0.5L9.5 8.5H0.5L5 0.5Z"
            :fill="upColor"
          />
          <path
            v-else
            d="M5 8.5L0.5 0.5H9.5L5 8.5Z"
            :fill="downColor"
          />
        </svg>
        <span class="text-[13px] text-[#03102f] leading-none" style="font-family: 'Reddit Mono', monospace; font-weight: 400;"><TickerNumber :value="trend" :loaded="loaded" /></span>
      </div>
    </div>

    <!-- Bottom: value -->
    <div class="flex items-center" style="padding: 12px; min-height: 57px;">
      <span
        class="text-[24px] text-[#03102f] truncate leading-none"
        style="font-family: 'Reddit Mono', monospace; font-weight: 500;"
      ><TickerNumber :value="value" :loaded="loaded" /></span>
    </div>
  </div>

  <!-- AI nudge strip (Figma 4803:58562) — tucked 8px under the card, slides
       down out of it when `nudgeShown` flips; asks the AI Assistant on click -->
  <div v-if="nudge" class="nudge-clip" :class="{ 'nudge-clip--shown': nudgeShown }">
    <button type="button" class="nudge" :tabindex="nudgeShown ? 0 : -1" @click="askNudge">
      <img :src="sparkleIcon" width="16" height="16" alt="" class="nudge-sparkle" />
      <span class="flex-1 min-w-0 truncate text-left">{{ nudge }}</span>
      <img :src="arrowIcon" width="16" height="16" alt="" class="nudge-arrow" />
    </button>
  </div>
  </div>
</template>

<script setup>
import TickerNumber from './TickerNumber.vue'
import sparkleIcon from '../../assets/icons/icon-sparkle-ai.svg'
import arrowIcon from '../../assets/icons/icon-arrow-right-purple.svg'
import { agentPanelOpen, pendingAgentMessage } from '../../composables/useAgentPanel.js'

const props = defineProps({
  label:     { type: String, required: true },
  value:     { type: String, required: true },
  trend:     { type: String, default: '' },
  direction: { type: String, default: 'up' },
  showInfo:  { type: Boolean, default: false },
  loaded:    { type: Boolean, default: false },
  // Optional AI nudge under the card
  nudge:       { type: String,  default: '' },
  nudgePrompt: { type: String,  default: '' },
  nudgeShown:  { type: Boolean, default: false },
})

const upColor   = '#2BC37D'
const downColor = '#DC3545'

function askNudge() {
  pendingAgentMessage.value = props.nudgePrompt || props.nudge
  agentPanelOpen.value = true
}
</script>

<style scoped>
/* Clip starts at the card's bottom edge minus the 8px tuck, so the strip
   emerges from under the card rather than fading in on top of the page */
.nudge-clip {
  position: absolute;
  left: 0;
  right: 0;
  top: calc(100% - 8px);
  overflow: hidden;
  pointer-events: none;
}
.nudge-clip--shown { pointer-events: auto; }

.nudge {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  padding: 12px 12px 4px;
  border-radius: 0 0 8px 8px;
  background: #f7edfd;
  font-size: 12px;
  font-weight: 500;
  line-height: 1.5;
  color: #7d1ab7;
  transform: translateY(-100%);
  transition: background-color 150ms ease;
}
/* Content reveal (motion guide): long decelerate settle */
.nudge-clip--shown .nudge {
  transform: none;
  transition: transform 600ms cubic-bezier(0.32, 0.72, 0, 1), background-color 150ms ease;
}
.nudge:hover { background: #f0dcfb; }
.nudge:focus-visible { outline: 2px solid #b14aed; outline-offset: -2px; }

/* Sparkle twinkles once as the strip lands */
.nudge-clip--shown .nudge-sparkle {
  animation: nudge-twinkle 560ms cubic-bezier(0.34, 1.3, 0.64, 1) 450ms both;
}
@keyframes nudge-twinkle {
  0%   { transform: scale(1)    rotate(0deg); }
  45%  { transform: scale(1.25) rotate(18deg); }
  100% { transform: scale(1)    rotate(0deg); }
}

/* Arrow leans toward the action on hover */
.nudge-arrow { transition: transform 150ms ease; }
.nudge:hover .nudge-arrow { transform: translateX(2px); }

@media (prefers-reduced-motion: reduce) {
  .nudge, .nudge-clip--shown .nudge, .nudge-arrow { transition: none; }
  .nudge-clip--shown .nudge-sparkle { animation: none; }
}
</style>
