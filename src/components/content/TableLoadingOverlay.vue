<template>
  <!-- White sheet covering the table body (below the header) with a centered
       segmented spinner — table loading state per Figma 3973:3773 -->
  <div class="absolute inset-x-0 bottom-0 z-10 flex items-center justify-center bg-white" :style="{ top: headerOffset }" role="status" aria-label="Loading data">
    <svg class="tbl-spinner" width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <g stroke="#61667c" stroke-width="2" stroke-linecap="round">
        <line x1="12" y1="3" x2="12" y2="7" opacity="1" />
        <line x1="12" y1="3" x2="12" y2="7" opacity="0.85" transform="rotate(45 12 12)" />
        <line x1="12" y1="3" x2="12" y2="7" opacity="0.7" transform="rotate(90 12 12)" />
        <line x1="12" y1="3" x2="12" y2="7" opacity="0.55" transform="rotate(135 12 12)" />
        <line x1="12" y1="3" x2="12" y2="7" opacity="0.4" transform="rotate(180 12 12)" />
        <line x1="12" y1="3" x2="12" y2="7" opacity="0.3" transform="rotate(225 12 12)" />
        <line x1="12" y1="3" x2="12" y2="7" opacity="0.2" transform="rotate(270 12 12)" />
        <line x1="12" y1="3" x2="12" y2="7" opacity="0.12" transform="rotate(315 12 12)" />
      </g>
    </svg>
  </div>
</template>

<script setup>
defineProps({
  // Height of the table header row the overlay should not cover
  headerOffset: { type: String, default: '35px' },
})
</script>

<style scoped>
/* Discrete 8-step rotation — classic segmented-spinner motion */
.tbl-spinner { animation: tbl-spin 800ms steps(8, end) infinite; }
@keyframes tbl-spin { to { transform: rotate(360deg); } }
@media (prefers-reduced-motion: reduce) {
  .tbl-spinner { animation-duration: 2400ms; }
}
</style>
