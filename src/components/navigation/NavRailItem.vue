<template>
  <div
    class="flex flex-col items-center justify-center cursor-pointer transition-colors duration-150"
    style="padding: 12px 8px;"
    :class="active ? '' : 'opacity-70 hover:opacity-100'"
  >
    <img
      :src="active && iconActive ? iconActive : icon"
      :alt="label"
      :style="{
        width: iconSize + 'px',
        height: iconSize + 'px',
        filter: active ? activeFilter : inactiveFilter
      }"
    />
    <span
      class="mt-0.5 text-center leading-tight"
      style="font-size: 12px;"
      :class="active ? 'font-medium text-[#03102f]' : 'font-normal text-[#61667c]'"
    >{{ label }}</span>
  </div>
</template>

<script setup>
defineProps({
  icon: { type: String, required: true },
  iconActive: { type: String, default: null },
  label: { type: String, required: true },
  active: { type: Boolean, default: false },
  iconSize: { type: Number, default: 22 },
})

// Filters tuned to exact design tokens: active = Primary/500 #2465de, inactive = Dark Blue/400 #4c689c
const activeFilter = 'invert(52%) sepia(98%) saturate(5187%) hue-rotate(210deg) brightness(88%) contrast(97%)'
const inactiveFilter = 'invert(37%) sepia(13%) saturate(1864%) hue-rotate(181deg) brightness(99%) contrast(84%)'
</script>
