<template>
  <Teleport to="body">
    <!-- Backdrop -->
    <div v-if="modelValue" class="fixed inset-0 z-40" @click="$emit('update:modelValue', false)" />

    <Transition name="plus-menu">
      <div
        v-if="modelValue"
        class="fixed w-[207px] bg-white rounded-[8px] z-50 py-1 px-1"
        :style="menuStyle"
        style="box-shadow: 0px 4px 6px -2px rgba(16,24,40,0.03), 0px 12px 16px -4px rgba(16,24,40,0.08), 0px 0px 0px 1px rgba(0,0,0,0.06);"
      >
        <button
          v-for="item in items"
          :key="item.label"
          class="w-full flex items-center justify-between rounded-[4px] cursor-pointer transition-colors duration-150 group"
          :class="'hover:bg-[#f5f6f9]'"
          style="height: 36px; padding: 0 10px;"
        >
          <span class="text-[12px] text-[#03102f]">{{ item.label }}</span>
          <div class="flex items-center gap-0.5">
            <span
              v-for="key in item.shortcut"
              :key="key"
              class="inline-flex items-center justify-center w-5 h-5 text-[12px] text-[#61667c] rounded-[4px] transition-colors duration-150 bg-[#f5f6f9] group-hover:bg-white"
            >{{ key }}</span>
          </div>
        </button>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  modelValue: { type: Boolean, default: false },
  items: { type: Array, default: () => [] },
  anchor: { type: Object, default: null },
})
defineEmits(['update:modelValue'])

const menuStyle = ref({})

watch(() => props.modelValue, (open) => {
  if (open && props.anchor) {
    const rect = props.anchor.getBoundingClientRect()
    const menuWidth = 207
    const gap = 8

    // Prefer right-aligned (menu extends left from button), fall back to left-aligned
    let left = rect.right + gap - menuWidth
    if (left < gap) left = rect.left

    menuStyle.value = {
      top: rect.bottom + 4 + 'px',
      left: Math.min(left, window.innerWidth - menuWidth - gap) + 'px',
    }
  }
})
</script>

<style scoped>
.plus-menu-enter-active {
  transition: opacity 170ms ease-out, transform 170ms ease-out;
  transform-origin: top right;
  will-change: opacity, transform;
}
.plus-menu-leave-active {
  transition: opacity 120ms ease-in, transform 120ms ease-in;
  transform-origin: top right;
  will-change: opacity, transform;
}

.plus-menu-enter-from,
.plus-menu-leave-to {
  opacity: 0;
  transform: scale(0.95) translateY(-6px);
}
</style>
