<template>
  <TileFrame>
    <!-- ID card -->
    <div
      class="absolute overflow-hidden"
      style="
        left: 50%; top: 50%; transform: translate(-50%, -50%);
        width: 75px; height: 75px; border-radius: 6px;
        border: 0.536px solid white;
        background: linear-gradient(113.59deg, #ffffff 46.712%, rgba(255, 255, 255, 0.45) 95.674%);
        box-shadow:
          1.071px 16.607px 9.643px 0px rgba(151, 160, 180, 0.03),
          0.536px 7.5px 7.5px 0px rgba(151, 160, 180, 0.06),
          0px 1.607px 4.286px 0px rgba(151, 160, 180, 0.06);
      "
    >
      <!-- QR plate -->
      <div
        class="absolute flex items-center justify-center overflow-hidden"
        style="
          left: 50%; top: 50%; transform: translate(-50%, -50%);
          width: 51.25px; height: 51.25px; border-radius: 7.5px;
          background: rgba(29, 91, 190, 0.07);
        "
      >
        <img :src="qrSvg" style="width: 37.5px; height: 37.5px;" alt="" />
      </div>
    </div>
  </TileFrame>
</template>

<script setup>
import TileFrame from './TileFrame.vue'
import qrSvg from '../../../assets/images/intro/qr.svg'
</script>
