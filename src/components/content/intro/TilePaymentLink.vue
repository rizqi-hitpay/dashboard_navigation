<template>
  <TileFrame>
    <!-- Reply bubble (top, mirrored like Figma) -->
    <div class="absolute flex items-center justify-center" style="left: 7.11px; top: 11px; width: 92.892px;">
      <div style="transform: scaleY(-1) rotate(180deg);">
        <div
          class="flex items-center justify-end overflow-hidden"
          style="width: 92.892px; gap: 4px; padding: 8px 6px; border-radius: 17.149px; background: #f2f4f6;"
        >
          <div style="transform: scaleY(-1) rotate(180deg);"><div style="width: 7px; height: 7px; border-radius: 4.287px; background: #e7edf2;"></div></div>
          <div style="transform: scaleY(-1) rotate(180deg);"><div style="width: 7px; height: 7px; border-radius: 4.287px; background: #e7edf2;"></div></div>
          <div style="transform: scaleY(-1) rotate(180deg);"><div style="width: 35px; height: 7px; border-radius: 4.287px; background: #e7edf2;"></div></div>
        </div>
      </div>
    </div>

    <!-- Outgoing bubble (blue) -->
    <div
      class="absolute overflow-hidden"
      style="right: 7px; bottom: 7.21px; width: 100px; height: 68.792px; border-radius: 16.755px; background: #5469f5;"
    >
      <!-- Message block -->
      <div class="absolute" style="top: 13.33%; right: 9.34%; bottom: 33.33%; left: 10.45%; border-radius: 5.585px; background: rgba(255,255,255,0.1);"></div>
      <!-- Bank note -->
      <div class="absolute flex items-center justify-center" style="top: 26.17%; right: 40%; bottom: 44.76%; left: 40%;">
        <img :src="note" class="block" style="width: 80%; height: 50%;" alt="" />
      </div>
      <!-- Link row -->
      <div class="absolute flex items-center" style="top: 71.11%; right: 9.34%; bottom: 14.07%; left: 9.41%; gap: 3.491px;">
        <div class="shrink-0 flex items-center justify-center" style="width: 13.962px; height: 13.962px;">
          <img :src="linkIcon" style="width: 12.333px; height: 6.454px; transform: rotate(135deg) scaleX(-1);" alt="" />
        </div>
        <div class="flex-1 min-w-0" style="height: 8.377px; border-radius: 5.585px; background: rgba(255,255,255,0.1);"></div>
      </div>
    </div>
  </TileFrame>
</template>

<script setup>
import TileFrame from './TileFrame.vue'
import note from '../../../assets/images/intro/paylink-note.svg'
import linkIcon from '../../../assets/images/intro/paylink-link.svg'
</script>
