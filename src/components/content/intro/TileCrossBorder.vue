<template>
  <TileFrame>
    <!-- XB group: SGD card + PHP card + arrow -->
    <div
      class="absolute"
      style="left: calc(50% - 0.4px); top: calc(50% - 0.19px); transform: translate(-50%, -50%); width: 87.208px; height: 77.63px;"
    >
      <!-- SGD card -->
      <div
        class="absolute overflow-hidden"
        style="
          left: 0; top: -0.76px; width: 87.208px; border-radius: 6.813px;
          filter:
            drop-shadow(0.681px 9.538px 4.769px rgba(151, 160, 180, 0.06))
            drop-shadow(0px 2.044px 2.725px rgba(151, 160, 180, 0.06));
        "
      >
        <div
          class="flex items-start"
          style="height: 38.368px; padding: 6.067px; border-radius: 6.813px; background: linear-gradient(147.49deg, #ffffff 66.418%, rgba(255, 255, 255, 0.25) 96.323%);"
        >
          <div class="flex items-center" style="gap: 6.067px;">
            <div class="flex items-center justify-center rounded-full shrink-0" style="width: 19.155px; height: 19.155px; background: rgba(26, 63, 124, 0.07);">
              <img :src="flagSg" class="overflow-hidden" style="width: 12.098px; height: 8.065px; border-radius: 1px;" alt="" />
            </div>
            <div class="flex flex-col items-start" style="gap: 1.517px;">
              <div class="ph" style="width: 31.091px; height: 3.792px; border-radius: 6.067px;"></div>
              <div class="ph" style="width: 47.775px; height: 6.067px; border-radius: 6.067px;"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- PHP card -->
      <div
        class="absolute overflow-hidden"
        style="
          left: 0; top: 40.88px; width: 87.208px; border-radius: 6.813px;
          filter:
            drop-shadow(0.681px 9.538px 4.769px rgba(151, 160, 180, 0.06))
            drop-shadow(0px 2.044px 2.725px rgba(151, 160, 180, 0.06));
        "
      >
        <div
          class="flex items-center"
          style="height: 37.303px; padding: 6.067px; gap: 6.067px; border-radius: 6.813px; background: linear-gradient(148.21deg, #ffffff 66.418%, rgba(255, 255, 255, 0.25) 96.323%);"
        >
          <div class="flex items-center justify-center rounded-full shrink-0" style="width: 19.155px; height: 19.155px; background: rgba(26, 63, 124, 0.07);">
            <img :src="flagPh" class="overflow-hidden" style="width: 12.098px; height: 8.065px; border-radius: 1px;" alt="" />
          </div>
          <div class="flex flex-col items-start" style="gap: 1.517px;">
            <div class="ph" style="width: 31.091px; height: 3.792px; border-radius: 6.067px;"></div>
            <div class="ph" style="width: 47.775px; height: 6.067px; border-radius: 6.067px;"></div>
          </div>
        </div>
      </div>

      <!-- Transfer arrow -->
      <div
        class="absolute flex items-center justify-center"
        style="left: 33.77px; top: 30.24px; padding: 4.033px; border-radius: 16.131px; background: #4c8afd;"
      >
        <img :src="transaction" style="width: 12.098px; height: 12.098px; transform: rotate(90deg);" alt="" />
      </div>
    </div>
  </TileFrame>
</template>

<script setup>
import TileFrame from './TileFrame.vue'
import flagSg from '../../../assets/images/intro/flag-sg.svg'
import flagPh from '../../../assets/images/intro/flag-ph.svg'
import transaction from '../../../assets/images/intro/transaction.svg'
</script>

<style scoped>
.ph { background: rgba(26, 63, 124, 0.07); }
</style>
