<template>
  <Teleport to="body">
    <Transition name="nav-tooltip">
      <div
        v-if="visible && label"
        class="fixed z-50 flex items-center pointer-events-none"
        :style="{ left: pos.left + 'px', top: pos.top + 'px' }"
      >
        <span class="nav-tooltip__arrow" />
        <div
          class="px-2 py-1 rounded-[4px] whitespace-nowrap text-[12px] font-medium text-[#61667c] leading-[1.5]"
          style="background: #fcfcfd; box-shadow: 0px 1px 3px 0px rgba(0,0,0,0.1), 0px 3px 22px 0px rgba(38,42,50,0.09);"
        >{{ label }}</div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  label: { type: String, default: '' },
  anchor: { type: Object, default: null },   // DOM element to anchor to
  visible: { type: Boolean, default: false },
})

const TOOLTIP_HEIGHT = 26   // 4px·padding×2 + 12px text × 1.5 line-height
const pos = ref({ left: 0, top: 0 })

watch(() => props.visible, (open) => {
  if (open && props.anchor) {
    const rect = props.anchor.getBoundingClientRect()
    pos.value = {
      left: rect.right + 6,
      top: rect.top + rect.height / 2 - TOOLTIP_HEIGHT / 2,
    }
  }
})
</script>

<style scoped>
/* Left-pointing arrow tucked against the tooltip body */
.nav-tooltip__arrow {
  width: 0;
  height: 0;
  border-top: 5px solid transparent;
  border-bottom: 5px solid transparent;
  border-right: 6px solid #fcfcfd;
  filter: drop-shadow(-1px 0 1px rgba(0, 0, 0, 0.06));
}

/* Fade + slide, matching the project's snappy enter / quick leave feel */
.nav-tooltip-enter-active {
  transition: opacity 140ms ease-out, transform 140ms ease-out;
}
.nav-tooltip-leave-active {
  transition: opacity 100ms ease-in;
}
.nav-tooltip-enter-from {
  opacity: 0;
  transform: translateX(-4px);
}
.nav-tooltip-leave-to {
  opacity: 0;
}
</style>
