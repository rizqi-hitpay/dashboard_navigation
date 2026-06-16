<template>
  <TileFrame>
    <!-- Banner photo (cropped zoom) -->
    <div
      class="absolute overflow-hidden"
      style="left: calc(50% + 0.42px); top: 7px; width: 57.368px; height: 20px; transform: translateX(-50%);"
    >
      <img :src="banner" class="absolute max-w-none" style="height: 331.18%; width: 244.44%; left: -69.75%; top: -114.65%;" alt="" />
    </div>

    <!-- QR plate -->
    <div
      class="absolute overflow-hidden flex items-center justify-center"
      style="left: calc(50% + 0.5px); top: calc(50% + 8.5px); width: 189px; height: 63px; transform: translate(-50%, -50%); border-radius: 7.5px; background: #f6f7f9;"
    >
      <img :src="qr" style="width: 37.5px; height: 37.5px;" alt="" />
    </div>
  </TileFrame>
</template>

<script setup>
import TileFrame from './TileFrame.vue'
import banner from '../../../assets/images/intro/qr-banner.png'
import qr from '../../../assets/images/intro/qr.svg'
</script>
