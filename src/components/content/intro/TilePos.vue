<template>
  <TileFrame>
    <!-- POS catalogue panel -->
    <div
      class="absolute overflow-hidden"
      style="
        left: calc(50% + 0.25px); top: 50%; transform: translate(-50%, -50%);
        width: 116.505px; height: 80px; border-radius: 6.214px;
        background: linear-gradient(135.15deg, #ffffff 66.418%, rgba(255,255,255,0.55) 96.323%);
      "
    >
      <!-- Header: bar + two dots -->
      <div class="absolute flex items-center" style="left: 6.21px; top: 6.21px; width: 104.078px; gap: 2.33px;">
        <div class="flex-1 min-w-0" style="height: 4.66px; border-radius: 6.214px; background: #dde1e9;"></div>
        <div class="shrink-0" style="width: 4.66px; height: 4.66px; border-radius: 6.214px; background: #dde1e9;"></div>
        <div class="shrink-0" style="width: 4.66px; height: 4.66px; border-radius: 6.214px; background: #dde1e9;"></div>
      </div>

      <!-- Product photo grid -->
      <div
        v-for="(cell, i) in cells"
        :key="i"
        class="absolute overflow-hidden"
        :style="{ left: cell.l + 'px', top: cell.t + 'px', width: '18.641px', height: '15.534px', borderRadius: '3.883px', background: '#dde1e9' }"
      >
        <img v-for="(src, k) in cell.img" :key="k" :src="src" class="absolute inset-0 w-full h-full object-cover" alt="" />
      </div>

      <!-- Receipt lines -->
      <div
        v-for="t in [20.97, 27.96, 34.95]"
        :key="t"
        class="absolute flex items-center"
        :style="{ left: '76.12px', top: t + 'px', width: '34.175px', gap: '1.553px' }"
      >
        <div class="shrink-0" style="width: 12.427px; height: 3.883px; border-radius: 6.214px; background: #dde1e9;"></div>
        <div class="flex-1 min-w-0" style="height: 3.883px; border-radius: 6.214px; background: #dde1e9;"></div>
      </div>
      <div class="absolute flex items-center" style="left: 76.12px; top: 51.26px; width: 34.175px;">
        <div class="flex-1 min-w-0" style="height: 3.883px; border-radius: 6.214px; background: #dde1e9;"></div>
      </div>

      <!-- Pay button -->
      <div class="absolute" style="left: 76.12px; top: 65.24px; width: 34.175px; height: 6.99px; border-radius: 6.214px; background: #5469f5;"></div>
    </div>
  </TileFrame>
</template>

<script setup>
import TileFrame from './TileFrame.vue'
import p580 from '../../../assets/images/intro/pos-580.png'
import p581 from '../../../assets/images/intro/pos-581.png'
import p582 from '../../../assets/images/intro/pos-582.png'
import p583 from '../../../assets/images/intro/pos-583.png'
import p584 from '../../../assets/images/intro/pos-584.png'
import p585 from '../../../assets/images/intro/pos-585.png'
import p586 from '../../../assets/images/intro/pos-586.png'
import p587 from '../../../assets/images/intro/pos-587.png'
import p588 from '../../../assets/images/intro/pos-588.png'

const cells = [
  { l: 6.21,  t: 20.19, img: [p580] },
  { l: 6.21,  t: 38.83, img: [p583] },
  { l: 6.21,  t: 57.48, img: [p586] },
  { l: 27.96, t: 20.19, img: [p581] },
  { l: 27.96, t: 38.83, img: [p584] },
  { l: 27.96, t: 57.48, img: [p587] },
  { l: 49.71, t: 20.19, img: [p582] },
  { l: 49.71, t: 38.83, img: [p586, p585] },
  { l: 49.71, t: 57.48, img: [p588] },
]
</script>
