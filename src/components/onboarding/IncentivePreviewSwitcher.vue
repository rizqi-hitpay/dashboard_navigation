<template>
  <Teleport to="body">
    <div
      class="fixed z-50 flex items-center rounded-full bg-white"
      style="bottom: 20px; left: 50%; transform: translateX(-50%); padding: 5px 6px 5px 14px; gap: 10px; border: 1px solid #e5e6ea; box-shadow: 0px 8px 28px -4px rgba(3,16,47,0.16);"
    >
      <span class="text-[11px] font-medium shrink-0" style="letter-spacing: 0.06em; color: #8093b8;">PREVIEW</span>
      <div class="flex items-center" style="gap: 3px;">
        <button
          v-for="option in options"
          :key="option.value"
          class="rounded-full text-[12px] font-medium transition-colors duration-150"
          style="padding: 5px 12px;"
          :style="incentiveState === option.value
            ? { background: '#03102f', color: '#ffffff' }
            : { color: '#61667c' }"
          @click="select(option.value)"
        >
          {{ option.label }}
        </button>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { useIncentive } from '../../composables/useIncentive'

const { incentiveState, incentiveMinimized, incentiveDismissed } = useIncentive()

const options = [
  { value: 'zero',      label: '0 transactions' },
  { value: 'progress',  label: '4/10 transactions' },
  { value: 'completed', label: 'Reached 10' },
  { value: 'missed',    label: 'Missed' },
]

function select(value) {
  incentiveState.value = value
  incentiveMinimized.value = false
  incentiveDismissed.value = false
}
</script>
