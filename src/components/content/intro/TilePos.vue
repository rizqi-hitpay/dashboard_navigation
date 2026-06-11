<template>
  <TileFrame>
    <!-- POS panel -->
    <div
      class="absolute overflow-hidden"
      style="
        left: calc(11.29% - 0.54px); right: calc(11.29% - 0.54px);
        top: calc(50% - 0.21px); transform: translateY(-50%);
        height: 65.92px; border-radius: 5.12px;
        background: linear-gradient(135.15deg, #ffffff 66.418%, rgba(255, 255, 255, 0.55) 96.323%);
        box-shadow:
          1.28px 19.84px 11.52px 0px rgba(151, 160, 180, 0.03),
          0.64px 8.96px 8.96px 0px rgba(151, 160, 180, 0.06),
          0px 1.92px 5.12px 0px rgba(151, 160, 180, 0.06);
      "
    >
      <!-- Header: bar + two dots -->
      <div class="absolute flex items-center" style="left: 5.12px; top: 5.12px; width: 85.76px; gap: 1.92px;">
        <div class="ph flex-1 min-w-0" style="height: 3.84px; border-radius: 5.12px;"></div>
        <div class="ph shrink-0" style="width: 3.84px; height: 3.84px; border-radius: 5.12px;"></div>
        <div class="ph shrink-0" style="width: 3.84px; height: 3.84px; border-radius: 5.12px;"></div>
      </div>
      <!-- 3×3 product grid -->
      <template v-for="left in [5.12, 23.04, 40.96]">
        <div
          v-for="top in [16.64, 32, 47.36]"
          :key="left + '-' + top"
          class="absolute ph"
          :style="{ left: left + 'px', top: top + 'px', width: '15.36px', height: '12.8px', borderRadius: '3.2px' }"
        ></div>
      </template>
      <!-- Receipt lines -->
      <div
        v-for="top in [17.28, 23.04, 28.8]"
        :key="'r' + top"
        class="absolute flex items-center"
        :style="{ left: '62.72px', top: top + 'px', width: '28.16px', gap: '1.28px' }"
      >
        <div class="ph shrink-0" style="width: 10.24px; height: 3.2px; border-radius: 5.12px;"></div>
        <div class="ph flex-1 min-w-0" style="height: 3.2px; border-radius: 5.12px;"></div>
      </div>
      <div class="absolute flex items-center" style="left: 62.72px; top: 42.24px; width: 28.16px;">
        <div class="ph flex-1 min-w-0" style="height: 3.2px; border-radius: 5.12px;"></div>
      </div>
      <!-- Pay button (blue) -->
      <div class="absolute" style="left: 62.72px; top: 53.76px; width: 28.16px; height: 5.76px; border-radius: 5.12px; background: #4c8afd;"></div>
    </div>
  </TileFrame>
</template>

<script setup>
import TileFrame from './TileFrame.vue'
</script>

<style scoped>
.ph { background: rgba(26, 63, 124, 0.07); }
</style>
