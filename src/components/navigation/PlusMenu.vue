<template>
  <Teleport to="body">
    <!-- Backdrop -->
    <div v-if="modelValue" class="fixed inset-0 z-40" @click="$emit('update:modelValue', false)" />

    <Transition name="plus-menu">
      <div
        v-if="modelValue"
        class="fixed bg-white rounded-[8px] z-50 py-1 px-1"
        :style="{ ...menuStyle, width: width + 'px' }"
        style="box-shadow: 0px 4px 6px -2px rgba(16,24,40,0.03), 0px 12px 16px -4px rgba(16,24,40,0.08), 0px 0px 0px 1px rgba(0,0,0,0.06);"
      >
        <button
          v-for="item in items"
          :key="item.label"
          type="button"
          class="w-full flex items-center rounded-[4px] cursor-pointer transition-colors duration-150 group"
          :class="[item.icon ? 'gap-[8px]' : 'justify-between', 'hover:bg-[#f5f6f9]']"
          style="height: 36px; padding: 0 10px;"
          @click="select(item)"
        >
          <img v-if="item.icon" :src="item.icon" width="16" height="16" alt="" class="block shrink-0" />
          <span class="text-[12px] text-[#03102f]" :class="item.icon ? 'flex-1 text-left' : ''">{{ item.label }}</span>
          <div v-if="item.shortcut" class="flex items-center gap-0.5">
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
  items: { type: Array, default: () => [] }, // [{ label, shortcut?: [key, key], icon?: url }]
  anchor: { type: Object, default: null },
  width: { type: Number, default: 207 },
  offsetX: { type: Number, default: 8 },  // how far the menu's right edge overhangs the anchor's
  offsetY: { type: Number, default: 4 },  // gap below the anchor
  closeOnSelect: { type: Boolean, default: false },
})
const emit = defineEmits(['update:modelValue', 'select'])

function select(item) {
  emit('select', item)
  if (props.closeOnSelect) emit('update:modelValue', false)
}

const menuStyle = ref({})

watch(() => props.modelValue, (open) => {
  if (open && props.anchor) {
    const rect = props.anchor.getBoundingClientRect()
    const menuWidth = props.width
    const gap = 8

    // Prefer right-aligned (menu extends left from button), fall back to left-aligned
    let left = rect.right + props.offsetX - menuWidth
    if (left < gap) left = rect.left

    menuStyle.value = {
      top: rect.bottom + props.offsetY + 'px',
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
