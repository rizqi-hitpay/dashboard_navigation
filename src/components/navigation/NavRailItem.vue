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

const activeFilter = 'invert(27%) sepia(90%) saturate(1285%) hue-rotate(200deg) brightness(95%) contrast(97%)'
const inactiveFilter = 'invert(39%) sepia(21%) saturate(657%) hue-rotate(185deg) brightness(88%) contrast(84%)'
</script>
