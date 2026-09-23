<template>
  <!-- "Ask about this chart/table" chip (Figma 4803:58589). Revealed while the
       nearest `.ai-chart-scope` ancestor is hovered or has focus — but only
       once every dashboard data source has loaded; hands the prompt to the AI
       Assistant on click. -->
  <button
    type="button"
    class="ai-chip"
    :class="{ 'ai-chip--ready': allLoaded }"
    :tabindex="allLoaded ? 0 : -1"
    @click="ask"
  >
    <img :src="sparkleIcon" width="16" height="16" alt="" class="shrink-0" />
    <span class="truncate">{{ label }}</span>
  </button>
</template>

<script setup>
import sparkleIcon from '../../assets/icons/icon-sparkle-ai.svg'
import { agentPanelOpen, pendingAgentMessage } from '../../composables/useAgentPanel.js'
import { useDashboardData } from '../../composables/useDashboardData.js'

// Only offer to explain data once it has all landed
const { allLoaded } = useDashboardData()

const props = defineProps({
  label:  { type: String, default: 'Ask about this chart' },
  prompt: { type: String, required: true },
})

function ask() {
  pendingAgentMessage.value = props.prompt
  agentPanelOpen.value = true
}
</script>

<style scoped>
.ai-chip {
  /* Gives up space long before the chart title does, so a tight header
     truncates the chip, never the title */
  flex: 0 1000 auto;
  min-width: 0;
  overflow: hidden;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 4px 8px;
  border-radius: 4px;
  background: #f7edfd;
  font-size: 12px;
  font-weight: 500;
  line-height: 1.5;
  color: #7d1ab7;
  white-space: nowrap;
  /* Hidden: quick exit (hint pattern — 100ms, fade only) */
  opacity: 0;
  pointer-events: none;
  transform: translateX(-4px);
  transition: opacity 100ms ease-in, transform 0ms linear 100ms, background-color 150ms ease;
}
/* Shown (once the page data has fully loaded): slides 4px out of the title
   as it fades in (140ms ease-out) */
.ai-chart-scope:hover .ai-chip--ready,
.ai-chart-scope:focus-within .ai-chip--ready {
  opacity: 1;
  pointer-events: auto;
  transform: none;
  transition: opacity 140ms ease-out, transform 140ms ease-out, background-color 150ms ease;
}
.ai-chip:hover { background: #f0dcfb; }
.ai-chip:focus-visible { outline: 2px solid #b14aed; outline-offset: 1px; }

@media (prefers-reduced-motion: reduce) {
  .ai-chip { transition: none !important; transform: none; }
}
</style>
