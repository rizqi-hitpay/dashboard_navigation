<template>
  <TileFrame>
    <!-- Invoice sheet -->
    <div
      class="absolute overflow-hidden"
      style="
        left: calc(20.97% - 0.41px); right: calc(20.97% - 0.41px);
        top: calc(50% - 0.21px); transform: translateY(-50%);
        height: 75.571px; border-radius: 5px;
        background: linear-gradient(123.33deg, #ffffff 66.418%, rgba(255, 255, 255, 0.55) 96.323%);
        box-shadow:
          1.19px 18.446px 10.711px 0px rgba(151, 160, 180, 0.03),
          0.595px 8.331px 8.331px 0px rgba(151, 160, 180, 0.06),
          0px 1.785px 4.76px 0px rgba(151, 160, 180, 0.06);
      "
    >
      <!-- Logo block -->
      <div class="absolute ph" style="left: 4.76px; top: 4.76px; width: 19.041px; height: 16.066px; border-radius: 2.975px;"></div>
      <!-- Detail lines -->
      <div class="absolute ph" style="left: 29.75px; top: 7.74px; width: 37.488px; height: 3.57px; border-radius: 4.76px;"></div>
      <div class="absolute ph" style="left: 29.75px; top: 13.69px; width: 12.746px; height: 3.57px; border-radius: 4.76px;"></div>
      <div class="absolute ph" style="left: 44.28px; top: 13.69px; width: 12.746px; height: 3.57px; border-radius: 4.76px;"></div>
      <!-- Table rows -->
      <div
        v-for="top in [30.35, 38.08, 45.82, 53.55]"
        :key="top"
        class="absolute flex items-center"
        :style="{ left: '4.76px', top: top + 'px', width: '62.48px', gap: '1.785px' }"
      >
        <div class="ph flex-1 min-w-0" style="height: 3.57px; border-radius: 4.76px;"></div>
        <div class="ph shrink-0" style="width: 21.422px; height: 3.57px; border-radius: 4.76px;"></div>
        <div class="ph shrink-0" style="width: 22.612px; height: 3.57px; border-radius: 4.76px;"></div>
      </div>
      <!-- Total (blue) -->
      <div class="absolute flex items-center" style="left: 36.89px; top: 61.88px; gap: 1.785px;">
        <div style="width: 14.281px; height: 3.57px; border-radius: 4.76px; background: #4c8afd;"></div>
        <div style="width: 14.281px; height: 3.57px; border-radius: 4.76px; background: #4c8afd;"></div>
      </div>
    </div>
  </TileFrame>
</template>

<script setup>
import TileFrame from './TileFrame.vue'
</script>

<style scoped>
.ph { background: rgba(26, 63, 124, 0.07); }
</style>
