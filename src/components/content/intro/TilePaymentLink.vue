<template>
  <TileFrame>
    <!-- Main chat bubble (bottom) -->
    <div
      class="absolute"
      style="
        top: calc(15.76% - 0.48px); right: calc(6.84% - 0.6px);
        bottom: calc(7.07% - 0.6px); left: calc(6.84% - 0.6px);
        filter:
          drop-shadow(1.396px 21.642px 6.283px rgba(151, 160, 180, 0.03))
          drop-shadow(0.698px 9.774px 4.887px rgba(151, 160, 180, 0.06))
          drop-shadow(0px 2.094px 2.792px rgba(151, 160, 180, 0.06));
      "
    >
      <!-- Tail -->
      <div class="absolute flex items-center justify-center" style="bottom: 1.81px; left: 0; width: 25.583px; height: 18px;">
        <img :src="polygon1" style="width: 11.58px; height: 23.176px; transform: rotate(-107.46deg); flex: none;" alt="" />
      </div>
      <!-- Bubble body -->
      <div
        class="absolute overflow-hidden"
        style="
          top: 0; right: 0.11px; bottom: 5.29px; left: 6.93px;
          border-radius: 16.755px;
          background: linear-gradient(135.1deg, #ffffff 66.418%, rgba(255, 255, 255, 0.55) 96.323%);
        "
      >
        <!-- Message block -->
        <div class="absolute ph" style="top: 13.33%; right: 9.34%; bottom: 33.33%; left: 10.45%; border-radius: 5.585px;"></div>
        <!-- Link row -->
        <div class="absolute flex items-center" style="top: 71.11%; right: 9.34%; bottom: 14.07%; left: 9.41%; gap: 3.491px;">
          <div class="shrink-0 flex items-center justify-center" style="width: 13.962px; height: 13.962px;">
            <img :src="linkIcon" style="width: 12.333px; height: 6.454px; transform: scaleX(-1) rotate(135deg); flex: none;" alt="" />
          </div>
          <div class="ph flex-1 min-w-0" style="height: 8.377px; border-radius: 5.585px;"></div>
        </div>
      </div>
    </div>

    <!-- Reply bubble (top, flipped, partially clipped above the card) -->
    <div
      class="absolute"
      style="
        top: calc(-36.33% - 1.21px); right: calc(10.44% - 0.55px);
        bottom: calc(91.39% + 0.58px); left: calc(10.44% - 0.55px);
        transform: scaleX(-1);
        filter:
          drop-shadow(0.536px 7.503px 3.751px rgba(151, 160, 180, 0.06))
          drop-shadow(0px 1.608px 2.144px rgba(151, 160, 180, 0.06));
      "
    >
      <!-- Tail -->
      <div class="absolute flex items-center justify-center" style="bottom: 2.6px; right: 85.78px; width: 19.638px; height: 13.818px;">
        <img :src="polygon2" style="width: 8.889px; height: 17.791px; transform: rotate(-107.46deg); flex: none;" alt="" />
      </div>
      <!-- Bubble body -->
      <div
        class="absolute overflow-hidden"
        style="
          top: 0; right: -0.12px; bottom: 4.21px; left: 5.32px;
          border-radius: 17.149px;
          background: linear-gradient(141.82deg, #ffffff 49.926%, rgba(255, 255, 255, 0) 116.9%);
        "
      >
        <div class="absolute ph2" style="left: 11.83px; top: 8.57px; width: 79.849px; height: 6.431px; border-radius: 4.287px;"></div>
        <div class="absolute ph2" style="left: 28.97px; top: 18.76px; width: 62.7px; height: 6.431px; border-radius: 4.287px;"></div>
        <div class="absolute ph2" style="left: 46.66px; top: 28.94px; width: 45.015px; height: 6.431px; border-radius: 4.287px;"></div>
      </div>
    </div>
  </TileFrame>
</template>

<script setup>
import TileFrame from './TileFrame.vue'
import polygon1 from '../../../assets/images/intro/polygon1.svg'
import polygon2 from '../../../assets/images/intro/polygon2.svg'
import linkIcon from '../../../assets/images/intro/link-icon.svg'
</script>

<style scoped>
.ph  { background: rgba(26, 63, 124, 0.07); }
.ph2 { background: rgba(101, 136, 168, 0.09); }
</style>
