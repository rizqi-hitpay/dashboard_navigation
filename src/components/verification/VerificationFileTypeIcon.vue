<template>
  <!-- 36px-wide wrapper reserves room for the badge that overhangs the paper's
       right edge, so the row keeps a clean 8px gap to the filename (spec: 4632:28519) -->
  <div class="relative h-[35px] w-[36px] shrink-0">
    <!-- Paper (28x35, left-aligned) -->
    <div
      class="absolute left-0 top-0 h-[35px] w-[28px] bg-white rounded-[4.6px] overflow-hidden"
      style="border: 0.75px solid #e5e6ea; box-shadow: 0px 0.77px 1.53px 0px rgba(0,0,0,0.05), 0px 3.07px 9.2px 0px rgba(38,42,50,0.08);"
    >
      <span class="absolute rounded-[9.39px] bg-[#e4e9f1]" style="top: 14.29%; right: 42.86%; bottom: 80%; left: 10.71%;"></span>
      <span class="absolute rounded-[9.39px] bg-[#e4e9f1]" style="top: 28.57%; right: 21.43%; bottom: 65.71%; left: 10.71%;"></span>
      <span class="absolute rounded-[9.39px] bg-[#e4e9f1]" style="top: 42.86%; right: 32.14%; bottom: 51.43%; left: 10.71%;"></span>
      <span class="absolute rounded-[9.39px] bg-[#585a5d]" style="top: 57.14%; right: 60.71%; bottom: 37.14%; left: 10.71%;"></span>
    </div>

    <!-- Type badge — overhangs the paper's right edge, sits above its bottom -->
    <div
      class="absolute flex items-center justify-center rounded-[4px]"
      style="right: 0px; bottom: 4px; padding: 3px 4px;"
      :style="{ background: badge.gradient, border: `0.75px solid ${badge.border}`, boxShadow: `0px 4px 4px 0px ${badge.shadow}` }"
    >
      <span class="text-[7px] font-semibold text-white leading-none" style="letter-spacing: -0.14px; text-shadow: 0px 0.77px 0.77px rgba(0,0,0,0.2);">{{ badge.label }}</span>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  kind: { type: String, required: true },
})

const BADGES = {
  pdf: { label: 'PDF', gradient: 'linear-gradient(to bottom, #fc4848, #ea2f2f)', border: '#bc1818', shadow: 'rgba(82,14,14,0.2)' },
  csv: { label: 'CSV', gradient: 'linear-gradient(to bottom, #12c41e, #0c8f15)', border: '#0f9637', shadow: 'rgba(14,38,82,0.2)' },
  doc: { label: 'DOC', gradient: 'linear-gradient(to bottom, #1a85e9, #1b72eb)', border: '#1758b2', shadow: 'rgba(14,38,82,0.2)' },
  svg: { label: 'SVG', gradient: 'linear-gradient(to bottom, #9b6bf2, #7d3fe0)', border: '#5f2bb8', shadow: 'rgba(40,14,82,0.2)' },
}

const badge = computed(() => BADGES[props.kind] || BADGES.doc)
</script>
