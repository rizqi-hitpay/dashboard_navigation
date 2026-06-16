<template>
  <TileFrame>
    <!-- "Fast" wordmark (skewed) -->
    <div class="absolute flex items-center justify-center" style="left: 12px; top: 14px; width: 36.478px; height: 9.486px;">
      <div style="transform: skewX(-14deg) scaleY(0.97);">
        <img :src="fast" style="display: block; width: 34.113px; height: 9.776px;" alt="" />
      </div>
    </div>

    <!-- Brand dots (4 faded + 1 solid tomato) -->
    <div
      v-for="l in [50, 52.25, 54.5, 56.75]"
      :key="l"
      class="absolute rounded-full"
      :style="{ left: l + 'px', top: '14px', width: '6px', height: '6px', background: '#ff6347', opacity: 0.4 }"
    ></div>
    <div class="absolute rounded-full" style="left: 59px; top: 14px; width: 6px; height: 6px; background: #ff6347;"></div>

    <!-- Title lines -->
    <div class="absolute" style="left: 11px; top: 35px; width: 31px; height: 6px; border-radius: 6px; background: #edf0f2;"></div>
    <div class="absolute" style="left: 11px; top: 43px; width: 44px; height: 6px; border-radius: 6px; background: #f2f4f6;"></div>

    <!-- Line-item rows -->
    <div class="absolute flex flex-col" style="left: 11px; top: 58px; width: 108px; gap: 3px;">
      <div v-for="(row, i) in rows" :key="i" class="flex items-center" style="width: 100%; gap: 4px;">
        <div
          v-for="(cell, j) in row"
          :key="j"
          class="flex-1 min-w-0"
          style="height: 6px; border-radius: 6px;"
          :style="{ background: cell.bg, opacity: cell.o ?? 1 }"
        ></div>
      </div>
    </div>
  </TileFrame>
</template>

<script setup>
import TileFrame from './TileFrame.vue'
import fast from '../../../assets/images/intro/invoice-fast.svg'

const D = '#dee4e7', E = '#edf0f2', B = '#5469f5'
const rows = [
  [{ bg: D }, { bg: D }, { bg: D }],
  [{ bg: E }, { bg: E }, { bg: E }],
  [{ bg: E }, { bg: E }, { bg: E }],
  [{ bg: E, o: 0 }, { bg: E, o: 0 }, { bg: E }],
  [{ bg: B }, { bg: B }, { bg: B }],
]
</script>
