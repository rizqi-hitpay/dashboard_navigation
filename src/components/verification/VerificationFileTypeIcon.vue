<template>
  <div class="relative h-[35px] w-[28px] shrink-0">
    <div class="absolute inset-0 bg-white border border-[#e5e6ea] rounded-[5px]" style="box-shadow: 0px 1px 2px rgba(0,0,0,0.05), 0px 3px 9px rgba(38,42,50,0.08);">
      <span class="absolute rounded-full bg-[#e4e9f1]" style="left: 11%; top: 14%; width: 46%; height: 7%;"></span>
      <span class="absolute rounded-full bg-[#585a5d]" style="left: 11%; top: 57%; width: 29%; height: 7%;"></span>
      <span class="absolute rounded-full bg-[#e4e9f1]" style="left: 11%; top: 29%; width: 68%; height: 7%;"></span>
      <span class="absolute rounded-full bg-[#e4e9f1]" style="left: 11%; top: 43%; width: 57%; height: 7%;"></span>
    </div>
    <div
      class="absolute flex items-center justify-center rounded-[4px]"
      style="bottom: -6px; right: -8px; padding: 2px 4px; box-shadow: 0px 2px 3px rgba(0,0,0,0.2);"
      :style="{ background: badge.gradient, border: `1px solid ${badge.border}` }"
    >
      <span class="text-[7px] font-semibold text-white leading-none" style="letter-spacing: -0.2px;">{{ badge.label }}</span>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  kind: { type: String, required: true },
})

const BADGES = {
  pdf: { label: 'PDF', gradient: 'linear-gradient(to bottom, #fc4848, #ea2f2f)', border: '#bc1818' },
  csv: { label: 'CSV', gradient: 'linear-gradient(to bottom, #12c41e, #0c8f15)', border: '#0f9637' },
  doc: { label: 'DOC', gradient: 'linear-gradient(to bottom, #1a85e9, #1b72eb)', border: '#1758b2' },
  svg: { label: 'SVG', gradient: 'linear-gradient(to bottom, #9b6bf2, #7d3fe0)', border: '#5f2bb8' },
}

const badge = computed(() => BADGES[props.kind] || BADGES.doc)
</script>
